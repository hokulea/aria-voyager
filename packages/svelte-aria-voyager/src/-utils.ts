/* eslint-disable @typescript-eslint/ban-ts-comment */

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
