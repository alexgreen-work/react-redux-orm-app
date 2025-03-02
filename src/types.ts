export interface ProductImage {
  id: number;
  image_name: string,
  image_url: string,
  product_id: number
}
export interface Product {
  id: number;
  name: string;
  category_id: number;
  description: string;
  images?: ProductImage[];
}

export interface ProductVariation {
  id: number;
  product_id: number;
  price: number;
  values?: ProductVariationPropertyValues[];
  stock: number;
}

export interface ProductVariationProperties {
  id: number;
  name: string;
  type: number;
}

export interface ProductVariationPropertyListValues {
  id: number;
  product_variation_property_id: number;
  value: string;
}

export interface ProductVariationPropertyValues {
  id: number;
  product_variation_id: number;
  product_variation_property_id: number;
  product_variation_property_list_value_id: number | null;
  value_string: string | null;
  value_int: number | null;
  value_float: number | null;
  Properties?: ProductVariationProperties[];
  ValuesList?: ProductVariationPropertyListValues[];
}

export interface Category {
  id: number;
  name: string;
}
