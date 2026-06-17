import { type ARIARoleDefinitionKey, roles } from 'aria-query';

function isRoleSubclass(roleName: ARIARoleDefinitionKey, ancestorName: string): boolean {
  const role = roles.get(roleName);

  return role
    ? role.superClass.some((chain) => chain.includes(ancestorName as ARIARoleDefinitionKey))
    : false;
}

const ALL_ROLE_NAMES = roles.keys();

// Roles that inherit from `composite` or `select` are composite widgets.
const COMPOSITE_SUBCLASSES = new Set<string>(
  ALL_ROLE_NAMES.filter(
    (name) => isRoleSubclass(name, 'composite') || isRoleSubclass(name, 'select')
  )
);

interface GetGroupChildrenOptions {
  /** Roles whose children should be promoted to items of the outer group. */
  flatten?: Set<string>;
  /** Composite widgets that should be treated as one atomic stop. */
  atomic?: Set<string>;
  includeHidden?: boolean;
}

export function getGroupChildren(
  group: HTMLElement,
  options: GetGroupChildrenOptions = {}
): HTMLElement[] {
  const {
    // APG toolbar example flattens a nested radiogroup.
    flatten = new Set<string>(['radiogroup']),
    atomic = new Set<string>(COMPOSITE_SUBCLASSES),
    includeHidden = false
  } = options;

  const isHidden = (el: Element): boolean =>
    !includeHidden && el.closest('[aria-hidden="true"], [hidden]') !== null;

  const isFocusableCandidate = (el: HTMLElement): boolean => {
    if (isHidden(el)) return false;

    return el.matches('a[href], button, input, select, textarea, [contenteditable], [tabindex]');
  };

  const result: HTMLElement[] = [];

  function walk(node: HTMLElement): void {
    if (node === group) {
      for (const child of node.children) {
        if (child instanceof HTMLElement) walk(child);
      }

      return;
    }

    if (isHidden(node)) return;

    const r = node.getAttribute('role') ?? '';

    // 1. Flattened container: collect focusable descendants inside it,
    //    but do not add the container itself.
    if (flatten.has(r)) {
      for (const child of node.children) {
        if (child instanceof HTMLElement) walk(child);
      }

      return;
    }

    // 2. Atomic composite widget: keep it as one stop if focusable.
    if (atomic.has(r)) {
      if (isFocusableCandidate(node)) result.push(node);

      return;
    }

    // 3. Focusable leaf item.
    if (isFocusableCandidate(node)) {
      result.push(node);

      return;
    }

    // 4. Otherwise recurse through generic wrappers.
    for (const child of node.children) {
      if (child instanceof HTMLElement) walk(child);
    }
  }

  // DOM children
  for (const child of group.children) {
    if (child instanceof HTMLElement) walk(child);
  }

  // aria-owns references are also owned children.
  const owns = group.getAttribute('aria-owns');

  if (owns) {
    for (const id of owns.split(/\s+/)) {
      const el = document.getElementById(id);

      if (el) walk(el);
    }
  }

  return result;
}
