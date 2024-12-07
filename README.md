# ARIA Voyager

[![Test Coverage](https://api.codeclimate.com/v1/badges/6bd88c10540e66d94e2a/test_coverage)](https://codeclimate.com/github/hokulea/aria-voyager/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/6bd88c10540e66d94e2a/maintainability)](https://codeclimate.com/github/hokulea/aria-voyager/maintainability)

_Canoe vessel that navigates your aria._

A framework agnostic / universal package that implements navigation patterns for
various aria roles and features.

## BYOM: Bring Your Own Markup

... and this library will make it interactive, according to applicable [ARIA
patterns](https://www.w3.org/WAI/ARIA/apg/patterns/). This library does not
apply styling, it will operate on the accessibility tree.

## Supported Roles and Features

<table>
<thead>
  <tr>
    <td>Role</td>
    <td>Navigation Patterns</td>
    <td>Features</td>
    <td>Behavior</td>
  </tr>
</thead>
<tbody>
  <tr style="vertical-align: top">
    <td>
      <a href="https://www.w3.org/TR/wai-aria-1.2/#listbox" target="_blank"><code>listbox</code></a><br><br>
      Focus Strategy:<br>
      <a href="https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant" target="_blank">
      <code>aria-activedescendant</code>
      </a>
    </td>
    <td>
      ✅ <code>ArrowUp</code> (prev)<br>
      ✅ <code>ArrowDown</code> (next)<br>
      ✅ <code>Home</code> (first)<br>
      ✅ <code>End</code> (last)<br>
      ✅ Pointer Navigation
    </td>
    <td>
      ✅ Disabled<br>
      ✅ Scroll into view<br>
      ✅ Single selection<br>
      ✅ Multi selection<br>
      ❌ Checked<br>
    </td>
    <td>
      -
    </td>
  </tr>
  <tr style="vertical-align: top">
    <td>
      <a href="https://www.w3.org/TR/wai-aria-1.2/#menu" target="_blank"><code>menu</code></a><br><br>
      Focus Strategy:<br>
      <a href="https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex" target="_blank">Roving <code>tabindex</code></a>
    </td>
    <td>
      ✅ <code>ArrowUp</code> (prev)<br>
      ✅ <code>ArrowDown</code> (next)<br>
      ✅ <code>ArrowRight</code> / <code>Enter</code> (expand)<br>
      ✅ <code>ArrowLeft</code> / <code>Esc</code> (collapse)<br>
      ✅ <code>Home</code> (first)<br>
      ✅ <code>End</code> (last)<br>
      ✅ Pointer Navigation
    </td>
    <td>
      ✅ Disabled<br>
      ✅ <a href="https://www.w3.org/TR/wai-aria-1.2/#menuitem" target="_blank"><code>role="menuitem"</code></a><br>
      ❌ <a href="https://www.w3.org/TR/wai-aria-1.2/#menuitemcheckbox" target="_blank"><code>role="menuitemcheckbox"</code></a><br>
      ❌ <a href="https://www.w3.org/TR/wai-aria-1.2/#menuitemradio" target="_blank"><code>role="menuitemradio"</code></a>
    </td>
    <td>
      ❌ Hover Behavior<br>
    </td>
  </tr>
  <tr style="vertical-align: top">
    <td>
      <a href="https://www.w3.org/TR/wai-aria-1.2/#tablist" target="_blank"><code>tablist</code></a><br><br>
      Focus Strategy:<br>
      <a href="https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex" target="_blank">Roving <code>tabindex</code></a>
    </td>
    <td>
      ✅ <code>ArrowRight</code> / <code>ArrowUp</code> (prev)<br>
      ✅ <code>ArrowLeft</code> / <code>ArrowDown</code> (next)<br>
      ✅ <code>Home</code> (first)<br>
      ✅ <code>End</code> (last)<br>
      ✅ Pointer Navigation
    </td>
    <td>
      ✅ Disabled<br>
      ✅ Orientation<br>
      ✅ Single selection<br>
      ❌ Multi selection<br>
    </td>
    <td>
      ✅ <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction">Manual (with spacebar) / Automatic Selection</a><br>
    </td>
  </tr>
</tbody>
</table>

## Packages

See each package for instructions

- [`aria-voyager`](./packages/aria-voyager/README.md) - universal / framework agnostic package
- [`ember-aria-voyager`](./packages/ember-aria-voyager/package/README.md) - bindings for ember.js
