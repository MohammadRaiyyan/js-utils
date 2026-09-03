import ProductItem from "./product-item";
import type { Product } from "./types";

interface ProductListProps {
  products: Array<Product>;
}

export default function ProductList(props: ProductListProps) {
  return (
    <ul className="flex flex-col gap-2 p-2">
      {props.products.map((product) => {
        return <ProductItem key={product.id} product={product} />;
      })}
    </ul>
  );
}
