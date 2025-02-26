export interface Product {
    id: number;
    name: string;
    category_id: number;
    description: string;
}

export interface ProductVariation {
    id: number;
    product_id: number;
    price: number;
    stock: number;
}
