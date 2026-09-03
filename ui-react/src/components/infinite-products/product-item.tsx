import type { Product } from "./types";

interface ProductItemProps {
  product: Product;
}
export default function ProductItem(props: ProductItemProps) {
  return (
    <li className="flex items-center justify-between gap-4 px-3 py-2 min-h-10 hover:bg-gray-100">
      <span className="text-xl font-medium">{props.product.title}</span>
      <span>{props.product.price}</span>
    </li>
  );
}
