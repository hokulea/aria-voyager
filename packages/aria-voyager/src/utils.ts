/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  return ([3e7] + -1e3 + -4e3 + -2e3 + -1e11).replaceAll(/[0-3]/g, (a) =>
    ((a * 4) ^ ((Math.random() * 16) >> (a & 2))).toString(16)
  );
}

// References:
// - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore/issues/177
// - https://gist.github.com/jsjain/a2ba5d40f20e19f734a53c0aad937fbb
export function isEqual(first: unknown, second: unknown): boolean {
  if (first === second) {
    return true;
  }

  if (
    (first === undefined || second === undefined || first === null || second === null) &&
    (first || second)
  ) {
    return false;
  }

  const firstType = first?.constructor.name;
  const secondType = second?.constructor.name;

  if (firstType !== secondType) {
    return false;
  }

  if (Array.isArray(first) && Array.isArray(second)) {
    if (first.length !== second.length) {
      return false;
    }

    let equal = true;

    for (const [i, element] of first.entries()) {
      if (!isEqual(element, second[i])) {
        equal = false;

        break;
      }
    }

    return equal;
  }

  if (first && typeof first === 'object' && second && typeof second === 'object') {
    let equal = true;
    const fKeys = Object.keys(first);
    const sKeys = Object.keys(second);

    if (fKeys.length !== sKeys.length) {
      return false;
    }

    for (const fKey of fKeys) {
      // @ts-ignore
      if (first[fKey] && second[fKey]) {
        // @ts-ignore
        if (first[fKey] === second[fKey]) {
          continue;
        }

        if (
          // @ts-ignore
          first[fKey] &&
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (first[fKey].constructor.name === 'Array' || first[fKey].constructor.name === 'Object')
        ) {
          // @ts-ignore
          equal = isEqual(first[fKey], second[fKey]);

          if (!equal) {
            break;
          }
          // @ts-ignore
        } else if (first[fKey] !== second[fKey]) {
          equal = false;

          break;
        }
        // @ts-ignore
      } else if ((first[fKey] && !second[fKey]) || (!first[fKey] && second[fKey])) {
        equal = false;

        break;
      }
    }

    return equal;
  }

  return first === second;
}
