export function getItems(parent: HTMLElement, selector: string): HTMLElement[] {
  const allMenuItemDescendants = [...parent.querySelectorAll(selector)] as HTMLElement[];

  // make sure to filter out descendands that are within a nested menu but not the root menu
  return Array.from(allMenuItemDescendants).filter((item) => {
    const closestMenu = item.closest('menu,[role="menu"]');

    return !closestMenu || closestMenu === parent;
  });
}
