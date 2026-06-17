# Flaky Test Diagnosis: packages/aria-voyager

## Executive Summary

**10 tests fail across 9 files** (out of 70 files, 296 tests). All failures trace back to **three interconnected root causes** centered on insufficient test isolation in vitest browser mode. The core issue is that **DOM setup at `describe` scope creates elements and attaches event listeners before `beforeEach` can reset pointer state**, causing stray `pointerover` events to corrupt the initial state that tests expect.

---

## Test Run Results

| Metric | Value |
|--------|-------|
| Test files | 9 failed / 61 passed (70 total) |
| Tests | 10 failed / 284 passed / 2 skipped (296 total) |
| Duration | 26.94s |
| Retry | 1 (all failures persist after retry) |

### Failing Tests Categorized

| Category | Tests | Files |
|----------|-------|-------|
| **A. `activeItem` not `undefined` at start** | `focus.test.ts` "start", `hover-open.test.ts` "start" | 2 |
| **B. Submenu popover already open / tabindex wrong** | `escape.test.ts`, `enter.test.ts`, `arrow-right.test.ts`, `arrow-left.test.ts` | 4 |
| **C. `aria-disabled` state corrupted** | `dom-observer.test.ts` (2 tests) | 1 |
| **D. Click selects wrong item / no event emitted** | `listbox/index-emitter.test.ts`, `tablist/index-emitter.test.ts` | 2 |

---

## Detailed Root Cause Analysis

### Root Cause 1: Describe-Scope DOM Creation Races Against Pointer State

**Severity: Critical** — explains 8 of 10 failures (Categories A, B, C)

Every failing test file follows this pattern:

```ts
describe('When Focus', () => {
  const { codeMenu } = createCodeMenu();  // ① DOM appended to document.body
  const menu = new Menu(codeMenu);        // ② Event listeners attached (pointerover, etc.)
  const { firstItem } = getItems(menu);

  test('start', async () => {             // ④ Test runs, finds corrupted state
    expect(menu.activeItem).toBeUndefined(); // FAILS
  });
});
```

The `setup.ts` `beforeEach` attempts to reset pointer state:

```ts
beforeEach(async () => {
  await userEvent.unhover(document.body);  // ③ Runs AFTER describe-scope code
});
```

**The execution order is the problem:**

1. **Module evaluation** — `describe` callback runs synchronously:
   - `createCodeMenu()` appends ~15 menu items to `document.body`
   - `new Menu(codeMenu)` registers `pointerover`, `pointerout`, `pointerup`, `focusin`, `keydown`, `toggle` listeners
2. **If the browser's pointer is already positioned over where a new menu item appears**, the browser fires a `pointerover` event on that element
3. `PointerNavigation` + `MenuNavigation` handle the event:
   - `RovingTabindexStrategy.activateItem()` sets `activeItem` and `tabindex="0"` on the hovered item
   - If the hovered item has `popovertarget`, `showSubmenu()` opens the submenu
4. **`beforeEach` runs** — `userEvent.unhover(document.body)` moves the pointer away, but the state corruption already happened
5. **Test runs** — finds `activeItem` set, popover open, or tabindex wrong

**Why the pointer is in the wrong place:** In vitest browser mode, tests run inside an iframe. The pointer position from a previous test file's interactions (e.g., `userEvent.hover(fourthItem)`) persists in the browser viewport. When the next test file's describe-scope code creates new DOM elements, those elements may appear under the lingering pointer. Even with `isolate: true`, the pointer position within the iframe is browser-level state that isn't reset between test files.

**Evidence:** The `hover-trough.test.ts` and `invoke-menu.test.ts` files already work around this exact issue (referencing [issue #264](https://github.com/hokulea/aria-voyager/issues/264)):

```ts
// does not work under playwright
// https://github.com/hokulea/aria-voyager/issues/264
// await userEvent.hover(fourthItem);
fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
```

These files bypass `userEvent.hover()` and dispatch events directly, which avoids moving the real pointer and thus avoids the flakiness. But the failing tests still use `userEvent.hover()` and `userEvent.click()`.

### Root Cause 2: Order-Dependent Test Chains

**Severity: High** — amplifies Root Cause 1, explains cascading failures

Several test files use a **stateful test chain** pattern where the first test sets up state and subsequent tests depend on it:

```ts
// escape.test.ts
test('start', async () => {
  // Sets up: focus → navigate → open submenu
  firstItem.focus();
  await userEvent.keyboard('{ArrowDown}');
  // ... more navigation ...
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
});

test('use `Escape` to close submenu', async () => {
  // Depends entirely on 'start' having succeeded
  await userEvent.keyboard('{Escape}');
  // ...
});
```

This pattern means:
- If the "start" test fails (due to Root Cause 1), **all subsequent tests in the file also fail** because their prerequisite state was never established
- `retry: 1` retries the individual failing test, but the prerequisite state from the "start" test is not re-established
- Tests cannot be run in isolation — you can't run just the second test

**Affected files:** `escape.test.ts`, `enter.test.ts`, `arrow-right.test.ts`, `arrow-left.test.ts`

### Root Cause 3: Pointer Movement During `userEvent.click()` Activates Wrong Item

**Severity: Medium** — explains 2 of 10 failures (Category D)

The index-emitter tests fail because `userEvent.click()` produces unexpected results:

| Test | Expected | Actual |
|------|----------|--------|
| `listbox/index-emitter.test.ts` | `select` called with `[1]` | Called with `[0]` |
| `tablist/index-emitter.test.ts` | `select` called with `[1]` | Never called (0 calls) |

In vitest browser mode with Playwright, `userEvent.click(element)` moves the real pointer to the element's center and clicks. As the pointer traverses from its current position to the target element, it fires `pointerover` events on every element it passes over. For the listbox:

1. Pointer is at some position from a previous test
2. `userEvent.click(secondItem)` moves pointer toward `secondItem` (Apple, index 1)
3. Pointer passes over `firstItem` (Banana, index 0), firing `pointerover`
4. `PointerNavigation` activates `firstItem`
5. The click lands, but due to timing or layout, `SelectionStrategy.handlePointer()` selects the item at index 0

For the tablist, the `Tablist.ensureSelection()` method auto-selects the first tab on initialization. If the pointer movement activates a different tab, the selection state becomes inconsistent, and the click event may not trigger the expected `select` emission.

---

## Contributing Factors

### 1. No `dispose()` calls on controls
The `Menu`, `Listbox`, and `Tablist` classes all have `dispose()` methods that clean up event listeners and state. **No test file calls `dispose()`**. This means:
- Event listeners persist on DOM elements after tests complete
- `MutationObserver` instances from `DomObserverUpdateStrategy` keep running
- `FocusStrategy` state persists in memory

### 2. `afterAll` cleanup is too late and too coarse
The `setup.ts` `afterAll` hook:
```ts
afterAll(() => {
  for (const el of document.querySelectorAll('[popover]')) {
    try { (el as HTMLElement).hidePopover(); } catch {}
  }
  document.body.innerHTML = '';
  document.activeElement?.blur();
});
```
- Runs after ALL tests in a file, not between tests
- Wiping `document.body.innerHTML` doesn't clean up JavaScript-side state (activeItem, selection, event listeners, MutationObservers)
- `hidePopover()` on elements being removed from DOM may throw or behave unexpectedly

### 3. `fileParallelism: true` with shared viewport
With `isolate: true`, each test file should get its own isolated environment. However, in vitest browser mode, tests run inside an iframe within a shared browser page. The pointer position is a browser-level state that may not be fully isolated between iframe contexts, especially when files run in parallel.

### 4. `retry: 1` is ineffective for stateful tests
The retry mechanism retries individual failing tests. For order-dependent test chains, retrying the second test without re-running the first test's setup won't help because the prerequisite state is missing.

---

## Remediation Strategy

### Strategy A: Move DOM setup to `beforeAll` (Primary Fix)

Move all DOM creation and control instantiation from `describe` scope into `beforeAll`, ensuring the pointer is reset BEFORE any DOM elements exist to receive stray events.

**Before:**
```ts
describe('When Focus', () => {
  const { codeMenu } = createCodeMenu();  // describe scope
  const menu = new Menu(codeMenu);        // describe scope
  // ...
});
```

**After:**
```ts
describe('When Focus', () => {
  let menu: Menu;
  let codeMenu: HTMLElement;
  let firstItem: HTMLElement;

  beforeAll(async () => {
    await userEvent.unhover(document.body);  // Reset pointer FIRST
    const setup = createCodeMenu();          // THEN create DOM
    codeMenu = setup.codeMenu;
    menu = new Menu(codeMenu);
    firstItem = getItems(menu).firstItem;
  });

  afterAll(() => {
    menu.dispose();
  });
});
```

**Trade-off:** Requires refactoring all ~70 test files. But the change is mechanical.

### Strategy B: Make tests independent (Secondary Fix)

Replace order-dependent test chains with independent tests that each set up their own state.

**Before:**
```ts
test('start', async () => { /* opens submenu */ });
test('use Escape to close submenu', async () => { /* depends on start */ });
```

**After:**
```ts
test('start', async () => { /* opens submenu */ });

test('use Escape to close submenu', async () => {
  // Set up state independently
  const setup = createCodeMenu();
  const menu = new Menu(setup.codeMenu);
  // ... open submenu ...
  
  // Now test Escape
  await userEvent.keyboard('{Escape}');
  // ...
});
```

**Trade-off:** More code duplication, but tests are robust and can run in any order.

### Strategy C: Call `dispose()` in `afterEach` (Tertiary Fix)

Ensure controls are properly cleaned up after each test:

```ts
afterEach(() => {
  menu?.dispose();
  share?.dispose();
  // Close popovers
  for (const el of document.querySelectorAll('[popover]')) {
    try { (el as HTMLElement).hidePopover(); } catch {}
  }
  document.body.innerHTML = '';
  document.activeElement?.blur();
});
```

### Strategy D: Disable `fileParallelism` as a quick mitigation

```ts
// vite.config.ts
test: {
  fileParallelism: false,  // Run files sequentially
  // ...
}
```

This reduces the chance of pointer state leaking between files. However, it doesn't fix the root cause and will slow down the test suite.

### Strategy E: Use `dispatchEvent` instead of `userEvent.hover` for pointer tests

Following the pattern already used in `hover-trough.test.ts` and `invoke-menu.test.ts` (issue #264 workaround):

```ts
// Instead of:
await userEvent.hover(fourthItem);

// Use:
fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
```

**Trade-off:** Tests the event handling logic but not the real browser pointer behavior.

---

## Priority Matrix

| Fix | Impact | Effort | Risk |
|-----|--------|--------|------|
| **Strategy A: Move DOM to `beforeAll`** | Eliminates 8/10 failures | High (refactor ~70 files) | Low |
| **Strategy B: Independent tests** | Eliminates cascading failures | Medium | Low |
| **Strategy C: Call `dispose()`** | Prevents ghost state | Low | Low |
| **Strategy D: Disable parallelism** | Reduces flakiness | Trivial | Medium (slower tests) |
| **Strategy E: `dispatchEvent` workaround** | Avoids pointer issues in specific tests | Low | Medium (less realistic) |

**Recommended approach:** Combine Strategy A + Strategy C as the primary solution, with Strategy D as an immediate stopgap. Strategy B should be applied to the submenu keyboard tests to eliminate the fragile test chains.

---

## Sources & References

- Vitest Browser Mode Documentation: https://vitest.dev/guide/browser/
- Vitest Context API: https://vitest.dev/api/browser/context
- Vitest version: `5.0.0-beta.5` (pre-release, may have isolation bugs)
- Referenced issue: https://github.com/hokulea/aria-voyager/issues/264 (Playwright hover workaround)
- Playwright pointer event behavior: https://playwright.dev/docs/input

---

## Resources Consulted

Vitest. (2026). *Browser Mode | Guide | Vitest*. Retrieved from https://vitest.dev/guide/browser/

Vitest. (2026). *Context API | Browser Mode | Vitest*. Retrieved from https://vitest.dev/api/browser/context

Vitest. (2026). *Multiple Setups | Browser Mode | Vitest*. Retrieved from https://vitest.dev/guide/browser/multiple-setups
