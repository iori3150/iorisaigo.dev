"""IV-1 の図に使う数値を作り直す。python -I gen-data.py で data.json を書く（numpy のみ）。

拡散：格子点 16 個（x_i = i/17）、r = Δt/Δx² = 0.4 の陽解法の行列 A。
学習データ：中心 U(0.15, 0.85)、幅 U(0.05, 0.15)、高さ U(0.5, 1) の山を初期値にした軌跡 6 本 × 6 ステップ
（numpy.random.default_rng(1)、軌跡ごとに c, w, a の順に引く）。組 (x^n, x^{n+1}) が 36 組。
Burgers：u_t + u u_x = ν u_xx、ν = 0.01、同じ 16 点、中心差分と前進 Euler、Δt = 0.0005 を 10 回で 1 スナップショット。
学習データは拡散と同じ作り（default_rng(7)）で、高さに振幅 0.1 を掛ける。
"""
import json, os
import numpy as np

N = 16; DX = 1 / 17; R = 0.4
x = np.arange(1, N + 1) / 17

A = np.zeros((N, N))
for i in range(N):
    A[i, i] = 1 - 2 * R
    if i > 0: A[i, i - 1] = R
    if i < N - 1: A[i, i + 1] = R

def hot(c, w, a): return a * np.exp(-((x - c) / w) ** 2)

def diffuse(u0, n):
    U = [u0]
    for _ in range(n): U.append(A @ U[-1])
    return np.array(U).T

def pairs(rng, amp=1.0, step=lambda u0, n: diffuse(u0, n), nt=6, ns=6):
    Xs, Ys, ics = [], [], []
    for _ in range(nt):
        c = rng.uniform(.15, .85); w = rng.uniform(.05, .15); a = amp * rng.uniform(.5, 1)
        ics.append([c, w, a])
        T = step(hot(c, w, a), ns); Xs.append(T[:, :-1]); Ys.append(T[:, 1:])
    return np.hstack(Xs), np.hstack(Ys), ics

def dmd(X, Y, r):
    """exact DMD（Tu ら 2014, Algorithm 2）。(固有値, モード, W) を返す。W はランク r の射影を通した行列"""
    U, S, Vt = np.linalg.svd(X, full_matrices=False)
    Ur, Sr, Vr = U[:, :r], S[:r], Vt[:r].T
    At = Ur.T @ Y @ Vr @ np.diag(1 / Sr)
    lam, Wv = np.linalg.eig(At)
    modes = (Y @ Vr @ np.diag(1 / Sr) @ Wv) / lam
    W = Ur @ At @ Ur.T
    return lam, modes, W

def mode_out(v):
    v = np.real_if_close(v, tol=1e6)
    v = np.real(v)
    v = v / v[np.argmax(np.abs(v))]  # 絶対値が最大の成分を +1 にそろえる
    return [round(float(t), 5) for t in v]

R6 = lambda a: [round(float(t), 6) for t in a]

X, Y, ics = pairs(np.random.default_rng(1))

# 固有値の比較（A、連続の解析解の減衰率）
k = np.arange(1, N + 1)
lam_A = 1 - 4 * R * np.sin(k * np.pi / 34) ** 2
lam_cont = np.exp(-(k * np.pi) ** 2 * R * DX ** 2)

# スライダー：使う組の数 m と打ち切りランク r
grid = []
for m in range(2, 37, 2):
    Xm, Ym = X[:, :m], Y[:, :m]
    sv = np.linalg.svd(Xm, compute_uv=False)
    for r in range(1, min(m, N) + 1):
        lam, modes, _ = dmd(Xm, Ym, r)
        order = np.argsort(-np.abs(lam))
        lam = lam[order]; modes = modes[:, order]
        grid.append({
            'm': m, 'r': r,
            'lam': [[round(float(l.real), 6), round(float(l.imag), 6)] for l in lam],
            'modes': [mode_out(modes[:, j]) for j in range(min(3, r))],
        })
sv_full = np.linalg.svd(X, compute_uv=False)
sv_by_m = {str(m): [float(s) for s in np.linalg.svd(X[:, :m], compute_uv=False)] for m in range(2, 37, 2)}

# W の推定（m = 36, r = 16）
_, _, W16 = dmd(X, Y, 16)

# 予測：訓練に使っていない初期分布
u0 = hot(0.65, 0.1, 1.0)
ref = diffuse(u0, 60)
def roll(W, n=60):
    u = u0.copy(); P = [u]
    for _ in range(n): u = W @ u; P.append(u)
    return np.array(P).T
_, _, W6 = dmd(X, Y, 6)
rms = lambda v: float(np.sqrt(np.mean(v ** 2)))
roll_out = {'u0': R6(u0), 'ref': [R6(ref[:, n]) for n in range(61)], 'ranks': {}}
for r, Wr in [(16, W16), (6, W6)]:
    P = roll(Wr)
    roll_out['ranks'][str(r)] = {
        'pred': [R6(P[:, n]) for n in range(61)],
        'err': [float(rms(P[:, n] - ref[:, n])) for n in range(61)],
    }
roll_out['refRms'] = [float(rms(ref[:, n])) for n in range(61)]

# Burgers
NU = 0.01; DTB = 0.0005; SUB = 10
def bstep(u):
    up = np.concatenate([[0], u, [0]])
    ux = (up[2:] - up[:-2]) / (2 * DX); uxx = (up[2:] - 2 * u + up[:-2]) / DX ** 2
    return u + DTB * (-u * ux + NU * uxx)
def burgers(u0, n):
    U = [u0]; u = u0
    for _ in range(n):
        for _ in range(SUB): u = bstep(u)
        U.append(u)
    return np.array(U).T
Xb, Yb, icsb = pairs(np.random.default_rng(7), amp=0.1, step=burgers)
Wb = Yb @ np.linalg.pinv(Xb)
bur = {'train_resid': float(np.linalg.norm(Wb @ Xb - Yb) / np.linalg.norm(Yb)), 'cases': {}}
for name, amp in [('large', 1.0), ('small', 0.1)]:
    ub0 = hot(0.35, 0.1, amp); T = burgers(ub0, 40)
    u = ub0.copy(); P = [u]
    for _ in range(40): u = Wb @ u; P.append(u)
    P = np.array(P).T
    bur['cases'][name] = {
        'amp': amp,
        'ref': {str(n): R6(T[:, n] / amp) for n in (0, 10, 20, 40)},
        'pred': {str(n): R6(P[:, n] / amp) for n in (0, 10, 20, 40)},
        'relerr': {str(n): float(np.linalg.norm(P[:, n] - T[:, n]) / np.linalg.norm(T[:, n])) for n in (1, 10, 20, 40)},
    }

# 1 ステップの図と空間・時間の図用
traj1 = diffuse(hot(0.3, 0.12, 1.0), 20)

out = {
    'x': R6(x), 'A_lam': R6(lam_A), 'cont_lam': R6(lam_cont),
    'ics': [[round(float(t), 5) for t in ic] for ic in ics],
    'sv': [float(s) for s in sv_full], 'svByM': sv_by_m,
    'W16': [R6(row) for row in W16], 'W16_maxdiff_A': float(np.abs(W16 - A).max()),
    'grid': grid, 'roll': roll_out, 'burgers': bur,
    'traj1': [R6(traj1[:, n]) for n in range(21)],
    'X': [R6(row) for row in X],
}
here = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(here, 'data.json'), 'w') as f:
    json.dump(out, f, separators=(',', ':'))
print('ok', len(grid), 'grid entries; W16-A max', out['W16_maxdiff_A'], 'burgers', {k: v['relerr'] for k, v in bur['cases'].items()}, 'train resid', bur['train_resid'])
print('sv', np.round(sv_full, 5))
for r in (16, 6): print(r, [round(roll_out['ranks'][str(r)]['err'][n], 5) for n in (1, 10, 30, 60)])
