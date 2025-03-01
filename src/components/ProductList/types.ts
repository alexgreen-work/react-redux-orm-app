import { ProductImage } from "../../types";

export interface ProductListItem {
  id: number;
  name: string;
  category_id: number;
  minPrice: number | null;
  image?: ProductImage;
}
