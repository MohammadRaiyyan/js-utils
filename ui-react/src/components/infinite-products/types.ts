export interface Product {
  id: number;
  title: string;
  price: number;
}
export interface PaginatedResponse {
  products: Array<Product>;
  total: number;
}
