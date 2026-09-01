export interface Product {
  id: number;
  title: string;
  price: number;
}
export interface PaginatedResponse {
  products: Array<Product>;
  total: number;
}
export interface State {
  page: number;
  limit: number;
  search: string;
}
