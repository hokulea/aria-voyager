// these are applied fixes from:
// https://github.com/microsoft/TypeScript-DOM-lib-generator
// they are not published yet, but contain fixes to the most recent DOM APIs
// this library is using

interface ToggleEvent {
  source?: Element | null;
}

interface ShowPopoverOptions {
  source?: HTMLElement;
}

interface HTMLElement
  extends Element,
    ElementCSSInlineStyle,
    ElementContentEditable,
    GlobalEventHandlers,
    HTMLOrSVGElement {
  /**
   * The **`showPopover()`** method of the HTMLElement interface shows a popover element (i.e., one that has a valid popover attribute) by adding it to the top layer.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/showPopover)
   */
  showPopover(options?: ShowPopoverOptions): void;
}

interface PopoverTargetAttributes {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetAction) */
  popoverTargetAction: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetElement) */
  popoverTargetElement: Element | null;
}

interface HTMLButtonElement extends HTMLElement, PopoverTargetAttributes {}

interface HTMLInputElement extends HTMLElement, PopoverTargetAttributes {}
