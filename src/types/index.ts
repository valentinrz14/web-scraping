export interface ProductsResponse {
  id: string | number;
  name: string;
  image: string | null;
  oldPrice?: string;
  price: string;
  discountPrice?: string;
  porcentagePrice?: string;
  category: string;
}

export interface DataResponse {
  products: ProductsResponse[];
  carouselImage: string[];
}
