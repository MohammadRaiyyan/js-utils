import "./style.css";

// state
interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  total: number;
}
interface Product {
  id: string;
  title: string;
  price: number;
}
interface State {
  products: Array<Product>;
  cart: Array<CartItem>;
}
const PRODUCTS: Array<Product> = [
  { id: crypto.randomUUID(), price: 100000, title: "Mackbook M1" },
  { id: crypto.randomUUID(), price: 90000, title: "I Phone 17" },
  { id: crypto.randomUUID(), price: 60000, title: "I Pad 10" },
  { id: crypto.randomUUID(), price: 10000, title: "Air Pod" },
];
let state: State = {
  products: PRODUCTS,
  cart: [],
};

// Actions
type Action =
  | { type: "ADD_TO_CART"; productid: string }
  | { type: "REMOVE_CART_ITEM"; id: string }
  | { type: "INCREASE_QUANTITY"; id: string }
  | { type: "DECREASE_QUANTITY"; id: string }
  | { type: "CLEAR_ALL" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TO_CART":
      const product = state.products.find((p) => p.id === action.productid);
      const isAlreadyPresentInTheCart = state.cart.some(
        (cartItem) => cartItem.product.id === product.id,
      );
      let cart = state.cart;
      if (isAlreadyPresentInTheCart) {
        cart = state.cart.map((cartItem) => {
          if (cartItem.product.id === product.id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              total: cartItem.total + product.price,
            };
          }
          return cartItem;
        });
      } else {
        cart = [
          ...state.cart,
          {
            id: crypto.randomUUID(),
            product: product,
            quantity: 1,
            total: product.price,
          },
        ];
      }
      return {
        ...state,
        cart: cart,
      };
    case "REMOVE_CART_ITEM":
      return {
        ...state,
        cart: state.cart.filter((cartItem) => cartItem.id !== action.id),
      };
    case "INCREASE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((cartItem) => {
          if (cartItem.id === action.id) {
            const newQuantity = cartItem.quantity + 1;
            return {
              ...cartItem,
              quantity: newQuantity,
              total: newQuantity * cartItem.product.price,
            };
          }
          return cartItem;
        }),
      };
    case "DECREASE_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((cartItem) => {
            if (cartItem.id === action.id) {
              let newQuantity = cartItem.quantity - 1;
              newQuantity = newQuantity <= 0 ? 0 : newQuantity;
              return {
                ...cartItem,
                quantity: newQuantity,
                total: newQuantity * cartItem.product.price,
              };
            }
            return cartItem;
          })
          .filter((cartItem) => cartItem.quantity > 0),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
};

// dispatch

const dispatch = (action: Action) => {
  state = reducer(state, action);
  renderCart();
};

function calculateSubTotal(cart: State["cart"]) {
  return cart.reduce((acc, curr) => {
    return acc + curr.total;
  }, 0);
}

// render
function renderCart() {
  const conatiner = document.querySelector<HTMLDivElement>("#cart")!;
  if (state.cart.length === 0) {
    conatiner.innerHTML = `<span>No item in the cart</span>`;
    return;
  }
  const subTotal = calculateSubTotal(state.cart);
  conatiner.innerHTML = `
    <ul>
      ${state.cart
        .map((cartItem) => {
          return `
          <li>
            <span>Name: ${cartItem.product.title}</span>
            <span>Price: ${cartItem.product.price}</span>
            <span>Quantity: ${cartItem.quantity}</span>
            <span>Total Price: ${cartItem.total}</span>
            <button data-action="DECREASE_QUANTITY" data-cartid=${cartItem.id}>-</button>
            <button data-action="INCREASE_QUANTITY" data-cartid=${cartItem.id}>+</button>
            <button data-action="REMOVE_CART_ITEM" data-cartid=${cartItem.id}>x</button>
          </li>
        `;
        })
        .join("")}
    </ul>
    <div>
      <h2>Sub Total: ${subTotal}</h2>
    </div>
    `;
}

function renderProducts(products: State["products"]): string {
  if (products.length === 0) {
    return `<span>No Products avaialble</span>`;
  }
  return products
    .map((product) => {
      return `
      <div>
        <h4>${product.title}</h4>
        <h5>${product.price}</h5>
        <button data-action="ADD_TO_CART" data-productid=${product.id}>Add to cart</button>
      </div>
    `;
    })
    .join("");
}
const root = document.querySelector<HTMLDivElement>("#app")!;
// events

root.addEventListener("click", function (event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action as Action["type"];
  if (!action) return;
  switch (action) {
    case "ADD_TO_CART":
      {
        const productid = target.dataset.productid;
        if (!productid) return;
        dispatch({ type: "ADD_TO_CART", productid });
      }

      break;
    case "REMOVE_CART_ITEM":
      {
        const cartItemId = target.dataset.cartid;
        if (!cartItemId) return;
        dispatch({ type: "REMOVE_CART_ITEM", id: cartItemId });
      }
      break;
    case "INCREASE_QUANTITY":
      {
        const cartItemId = target.dataset.cartid;
        if (!cartItemId) return;
        dispatch({ type: "INCREASE_QUANTITY", id: cartItemId });
      }
      break;
    case "DECREASE_QUANTITY":
      {
        const cartItemId = target.dataset.cartid;
        if (!cartItemId) return;
        dispatch({ type: "DECREASE_QUANTITY", id: cartItemId });
      }
      break;
    case "CLEAR_ALL":
      {
        dispatch({ type: "CLEAR_ALL" });
      }
      break;
    default:
      break;
  }
});

root.innerHTML = `
<section id="center">
  <article>
    <h1>My Shpping app</h1>
    <div>
      ${renderProducts(state.products)}
    </div>
  </article>

  <article id="cart">
    <h1>My Cart</h1>
    <span>You have no item in your cart!</span>
  </article>
</section>

`;
