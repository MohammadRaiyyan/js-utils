import type { Product } from "./types";

interface ProductItemProps {
  product: Product;
}
export default function ProductItem(props: ProductItemProps) {
  return (
    <tr>
      <td className="border border-gray-400 px-4 py-2">{props.product.id}</td>
      <td className="border border-gray-400 px-4 py-2">
        {props.product.title}
      </td>
      <td className="border border-gray-400 px-4 py-2">
        {props.product.price}
      </td>
    </tr>
  );
}
