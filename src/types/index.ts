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

export interface ProductDetailResponse {
  id: string | number;
  category: string;
  manufacter: string;
  scale: string;
  name: string;
  type: string;
  year: string;
  color: string;
  material: string;
  images: Array<string | null>;
}

export interface DataResponse {
  products: ProductsResponse[];
  carouselImage: string[];
}
