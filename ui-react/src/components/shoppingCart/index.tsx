import { ShoppingCartIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface IProduct {
  id: string;
  title: string;
  price: number;
}
function Product(props: { product: IProduct }) {
  const { addToCart, cartItems, removeFromCart } = useCartContext();
  const isAddedTocart = useMemo(() => {
    return cartItems.some((product) => product.id === props.product.id);
  }, [cartItems, props]);
  return (
    <li className="flex flex-col gap-2 border border-gray-300 rounded p-4 w-full">
      <h4>{props.product.title}</h4>
      <h5>${props.product.price}</h5>
      {isAddedTocart ? (
        <button
          onClick={() => removeFromCart(props.product.id)}
          className="flex items-center justify-center  font-medium px-3 py-2 h-9 text-white bg-indigo-500 rounded hover:bg-indigo-600"
        >
          Remove From Cart
        </button>
      ) : (
        <button
          onClick={() => addToCart(props.product)}
          className="flex items-center justify-center  font-medium px-3 py-2 h-9 text-white bg-indigo-500 rounded hover:bg-indigo-600"
        >
          Add to cart
        </button>
      )}
    </li>
  );
}

function Products() {
  const DUMMY_PRODUCTS: Array<IProduct> = [
    { id: crypto.randomUUID(), title: "I Phone 17", price: 80000 },
    { id: crypto.randomUUID(), title: "I Phone 16", price: 70000 },
    { id: crypto.randomUUID(), title: "I Phone 15", price: 50000 },
  ];
  return (
    <ul className="grid grid-cols-4 gap-4">
      {DUMMY_PRODUCTS.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </ul>
  );
}

function Navbar() {
  const { cartItems } = useCartContext();

  const totalCartCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems.length]);
  return (
    <nav className="flex items-center justify-between border-b border-gray-300 gap-5 w-full bg-gray-50 py-3 px-5">
      <h2>My Shopping cart</h2>
      <button className="flex items-center relative">
        <ShoppingCartIcon />
        <span className="absolute flex items-center justify-center -top-2 -right-4 bg-indigo-500 text-white text-sm font-medium rounded-full p-1 size-5">
          {totalCartCount}
        </span>
      </button>
    </nav>
  );
}
interface IContext {
  cartItems: Array<IProduct>;
  addToCart: (newItem: IProduct) => void;
  removeFromCart: (itemId: string) => void;
}
const CartContext = createContext<IContext>(undefined);

function useCartContext() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCartcontext must be used inside the provider");
  return context;
}

function CartContextProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Array<IProduct>>([]);

  const addToCart = useCallback((newItem: IProduct) => {
    setCartItems((prev) => [...prev, newItem]);
  }, []);
  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((product) => product.id !== itemId));
  }, []);

  const value = useMemo(() => {
    return { cartItems, addToCart, removeFromCart };
  }, [cartItems, addToCart, removeFromCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export default function ShoppingCart() {
  return (
    <CartContextProvider>
      <main className="h-screen w-screen">
        <Navbar />
        <section className="p-4">
          <Products />
        </section>
      </main>
    </CartContextProvider>
  );
}
