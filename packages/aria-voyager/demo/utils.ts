export function watchActiveElement() {
  let lastActiveElement: HTMLElement | undefined;

  const observer = new MutationObserver(() => {
    const currentActiveElement = document.activeElement;

    if (currentActiveElement !== lastActiveElement) {
      console.log(
        'Active element changed:',
        currentActiveElement?.textContent,
        currentActiveElement
      );
      lastActiveElement = currentActiveElement as HTMLElement;
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: false
  });

  // Also check for focus events directly
  document.documentElement.addEventListener(
    'focusin',
    (event) => {
      console.log(
        'Focus moved to:',
        (event.target as HTMLElement | undefined)?.textContent,
        event.target
      );
    },
    { capture: true }
  );
}
