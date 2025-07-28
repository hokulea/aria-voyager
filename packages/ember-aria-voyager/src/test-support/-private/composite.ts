export function getCompositeItems(
  parent: HTMLElement,
  selector: string,
  parentSelector?: string
): HTMLElement[] {
  const items = [...parent.querySelectorAll(selector)] as HTMLElement[];

  if (parentSelector) {
    // make sure to filter out descendands that are within a nested menu but not the root menu
    return items.filter((item) => {
      const closestParent = item.closest(parentSelector);

      return !closestParent || closestParent === parent;
    });
  }

  return items;
}
