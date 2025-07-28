// taken from: https://javascript.plainenglish.io/you-dont-need-lodash-how-i-gave-up-lodash-693c8b96a07c
export function isEqual(x: unknown, y: unknown): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;

  return x && y && tx === 'object' && tx === ty
    ? // @ts-expect-error no motivation to fix this
      ok(x).length === ok(y).length && ok(x).every((key) => isEqual(x[key], y[key]))
    : x === y;
}
