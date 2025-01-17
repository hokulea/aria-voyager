// From https://gist.github.com/selfish/fef2c0ba6cdfe07af76e64cecd74888b
//
// This code should be reasonably fast, and provide a unique value every time
// it's called, which is what we need here. It produces a string formatted as a
// standard UUID, which avoids accidentally turning Ember-specific
// implementation details into an intimate API. It also ensures that the UUID
// always starts with a letter, to avoid creating invalid IDs with a numeric
// digit at the start.
export function uniqueId(): string {
  // @ts-expect-error this one-liner abuses weird JavaScript semantics that
  // TypeScript (legitimately) doesn't like, but they're nonetheless valid and
  // specced.
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return ([3e7] + -1e3 + -4e3 + -2e3 + -1e11).replace(/[0-3]/g, (a) =>
    ((a * 4) ^ ((Math.random() * 16) >> (a & 2))).toString(16)
  );
}
