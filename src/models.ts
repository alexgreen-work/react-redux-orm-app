// src/models.ts
import { ORM, Model, attr, fk } from 'redux-orm';

export class Category extends Model {
  static modelName = 'Category';
  static fields = {
    id: attr(),
    name: attr(),
  };
}

export class Product extends Model {
  static modelName = 'Product';
  static fields = {
    id: attr(),
    name: attr(),
    description: attr(),
    category_id: attr(),
  };
}

export class ProductVariation extends Model {
  static modelName = 'ProductVariation';
  static fields = {
    id: attr(),
    product_id: attr(), // Можно заменить на fk, если потребуется связь: fk({ to: Product, as: 'product' })
    price: attr(),
    stock: attr(),
  };
}

// Регистрируем все модели в ORM
export const orm = new ORM();
orm.register(Category, Product, ProductVariation);
