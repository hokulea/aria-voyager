---
status: draft
date: 2026-06-17
decision-makers: []
consulted: []
informed: []
---

# Implement RadioNavigation for aria-checked management

## Context and Problem Statement

aria-voyager currently supports `role="listbox"` with `aria-selected` and `role="menu"` navigation, but has no support for `role="radiogroup"` or `role="menuitemradio"`. Both roles require `aria-checked` state management with mutual exclusion within groups.

The challenge is designing a reusable pattern that works for:
1. **Standalone `<div role="radiogroup">`** — a dedicated radio group widget
2. **Future: `role="menu"` with `role="menuitemradio"` items** — radio items grouped within a menu, potentially with multiple independent groups

The pattern must handle `aria-checked` toggling, group detection, and emission of selection changes, while integrating cleanly with the existing `NavigationPattern` and `Control` architecture.

## Decision Drivers

- **Composability**: Pattern must work with both `RadioGroup` control (new) and `Menu` control (future)
- **Single source of truth**: Items must come from `control.items` to avoid divergence with focus strategy
- **Multiple groups**: A single control (especially Menu) may contain multiple independent radio groups
- **ARIA APG compliance**: Must enforce single-checked invariant per group
- **Consistency**: Follow existing patterns (`SelectionStrategy`, `TablistBehavior`)
- **Flexibility**: Support both automatic (radiogroup) and manual (menu) selection behavior

## Considered Options

- **Option A: Full RadioGroup Control class** — New control parallel to Listbox, with built-in RadioNavigation
- **Option B: RadioNavigation as NavigationPattern with explicit items** — Single-group pattern, caller provides items, multiple instances per control
- **Option C: RadioNavigation as NavigationPattern with self-managing groups** — Multi-group pattern, reads `data-group` attribute, single instance per control
- **Option D: RadioNavigation with selector-based item discovery** — Pattern queries DOM independently via selector

## Decision Outcome

Chosen option: **Option C — RadioNavigation as self-managing multi-group NavigationPattern**, because it provides the best balance of composability, simplicity, and correctness.

### Design Overview

```typescript
interface RadioNavigationBehavior {
  singleSelection?: 'automatic' | 'manual';
}

class RadioNavigation implements NavigationPattern {
  constructor(
    private control: Control,
    options?: {
      isRadioItem?: (item: Item) => boolean,  // default: () => true
      behavior?: RadioNavigationBehavior        // default: { singleSelection: 'automatic' }
    }
  )

  updateItems(): void  // called from control.readItems()
    // 1. Filter control.items through isRadioItem
    // 2. Partition by data-group attribute on each item (no data-group = default group)
    // 3. readSelection() per group:
    //    - multiple checked → pick first, uncheck rest
    //    - none checked → check first

  handle(bag): NavigationParameterBag
    // pointerup: if item passes isRadioItem → check(item)
    // keydown Space: if activeItem passes isRadioItem → check(activeItem)
    // (automatic mode: aria-checked follows focus via RovingTabindexStrategy)
    // (manual mode: only Space/pointer change aria-checked)

  private check(item: Item): void
    // Uncheck all items in same data-group
    // Check the item
    // Emit: this.control.emitter?.selected([item])
}
```

### Group Detection

Groups are determined by the `data-group` attribute on each item:

```html
<div role="radiogroup">
  <button role="radio" data-group="alignment">Top</button>
  <button role="radio" data-group="alignment">Bottom</button>
  <button role="radio" data-group="position">Left</button>
  <button role="radio" data-group="position">Right</button>
</div>
```

Items without `data-group` belong to a default group. The pattern reads `item.dataset.group` directly — no ancestor traversal needed.

### RadioGroup Control

```typescript
class RadioGroup extends Control {
  focusStrategy = new RovingTabindexStrategy(this);
  #radioNavigation = new RadioNavigation(this, {
    behavior: { singleSelection: 'automatic' }  // isRadioItem omitted → () => true
  });

  readItems(): void {
    this.items = [...this.element.querySelectorAll(':scope [role="radio"]')];
    this.#radioNavigation.updateItems();
    this.focusStrategy.updateItems();
  }
}
```

### Future Menu Integration

```typescript
// Inside Menu.readItems():
readItems() {
  // ... existing code to find all menuitem, menuitemcheckbox, menuitemradio ...
  
  this.#radioNavigation = new RadioNavigation(this, {
    isRadioItem: (item) => item.getAttribute('role') === 'menuitemradio',
    behavior: { singleSelection: 'manual' }
  });
  
  this.#radioNavigation.updateItems();
}
```

### Consequences

- **Good, because** pattern is self-contained — no external utility or partition function needed
- **Good, because** single instance per control manages all groups — simpler lifecycle than multiple instances
- **Good, because** items always come from `control.items` — guaranteed alignment with focus strategy
- **Good, because** `data-group` is explicit and unambiguous — no cascade complexity
- **Good, because** `isRadioItem` filter allows Menu to reuse pattern without item divergence
- **Bad, because** requires `data-group` attribute on items — additional markup for multi-group scenarios
- **Bad, because** `IndexEmitStrategy` cannot carry group context — consumer must include group in typed model
- **Neutral, because** per-group invariant enforcement on `readSelection()` may surprise users who wrote invalid markup

### Confirmation

Implementation will be verified by:
1. Unit tests for `RadioNavigation` covering single-group and multi-group scenarios
2. Integration tests for `RadioGroup` control
3. Future integration tests for `Menu` with `menuitemradio` (when implemented)
4. Manual testing with ARIA browser extensions to verify `aria-checked` state

## Pros and Cons of the Options

### Option A: Full RadioGroup Control class

New control parallel to Listbox with built-in RadioNavigation.

- **Good, because** encapsulates all radio behavior in one place
- **Bad, because** cannot be reused for Menu integration
- **Bad, because** duplicates focus/navigation patterns already in Group
- **Bad, because** multiple groups in Menu would require multiple controls

### Option B: RadioNavigation with explicit items

Single-group pattern, caller provides items, multiple instances per control.

- **Good, because** simple, single responsibility
- **Good, because** each instance manages exactly one group
- **Bad, because** requires `addNavigationPattern`/`removeNavigationPattern` on Control
- **Bad, because** Menu would need to manage lifecycle of multiple instances
- **Bad, because** items must be passed explicitly — risk of divergence from `control.items`

### Option C: RadioNavigation with self-managing groups (CHOSEN)

Multi-group pattern, reads `data-group` attribute, single instance per control.

- **Good, because** single instance manages all groups — simple lifecycle
- **Good, because** uses `control.items` directly — no divergence risk
- **Good, because** no Control API changes needed
- **Good, because** `data-group` is explicit and composable
- **Bad, because** requires `data-group` attribute on items
- **Bad, because** pattern is more complex (multi-group logic)

### Option D: RadioNavigation with selector-based discovery

Pattern queries DOM independently via selector.

- **Good, because** no Control API changes needed
- **Bad, because** pattern maintains its own item list — risk of divergence from `control.items`
- **Bad, because** Menu's existing item filtering (e.g., excluding nested submenus) would be bypassed
- **Bad, because** needs its own reactivity hook (mutation observer or `readItems` integration)

## More Information

### Emission and Group Context

When `RadioNavigation` emits via `control.emitter?.selected([item])`:

- **ItemEmitStrategy**: Consumer receives the DOM element and can read `element.dataset.group`
- **IndexEmitStrategy**: Consumer receives a number and cannot determine group from emission alone

For consumers using `IndexEmitStrategy` with multiple groups, they must include group information in their typed model (e.g., `{ value: string, group: string }`). This is the consumer's responsibility and aligns with existing patterns.

### Behavior: Automatic vs Manual

- **`singleSelection: 'automatic'`** (default for standalone `radiogroup`): `aria-checked` follows focus on arrow key navigation
- **`singleSelection: 'manual'`** (for future `menuitemradio`): `aria-checked` only changes on Space or pointer click

This mirrors `SelectionStrategy`'s behavior and matches ARIA APG conventions.

### Per-Group Invariant

On `readSelection()` (called from `updateItems()`), each group is independently validated:

1. **Multiple items with `aria-checked="true"`**: Pick the first one, uncheck the rest
2. **No items with `aria-checked="true"`**: Check the first item
3. **Exactly one item with `aria-checked="true"`**: Keep it

This prevents invalid states and matches ARIA APG expectations.

### Related Patterns

- `SelectionStrategy` — manages `aria-selected` for listbox/tablist
- `RovingTabindexStrategy` — manages focus for radio/menu
- `TablistBehavior` — configuration pattern for selection timing

### Future Work

- `menuitemradio` integration into `Menu` control
- `menuitemcheckbox` support (parallel pattern for `aria-checked` with multi-select)
- Hokulea Ember `<RadioGroup>` and `<RadioItem>` components
