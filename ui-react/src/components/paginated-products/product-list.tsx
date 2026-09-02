import ProductItem from "./product-item";
import type { Product } from "./types";

interface ProductListProp {
  products: Array<Product>;
}

export default function ProductList(props: ProductListProp) {
  return (
    <table className=" border border-gray-400">
      <thead className="border border-gray-400">
        <tr>
          <th className="border border-gray-400">Id</th>
          <th className="border border-gray-400">Title</th>
          <th className="border border-gray-400">Price</th>
        </tr>
      </thead>
      <tbody>
        {props.products.map((product) => {
          return <ProductItem key={product.id} product={product} />;
        })}
      </tbody>
    </table>
  );
}
