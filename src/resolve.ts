import type { Item } from "./contract";

export function resolve(
  item: Item,
  facetId: string,
): string | number | boolean | undefined {
  switch (facetId) {
    case "price":
      return item.price;
    case "shipping":
      return item.shipping;
    case "venue":
      return item.venue;
    case "seller":
      return item.seller;
    case "title":
      return item.title;
    default:
      return item.attrs[facetId];
  }
}
