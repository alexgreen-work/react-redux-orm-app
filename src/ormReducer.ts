import { createReducer } from 'redux-orm';
import { orm } from './models';

const ormReducer = createReducer(orm, (session, action) => {
  if (action.type === 'data/loaded') {
    const { products, categories, variations } = action.payload;
    if (categories) {
      categories.forEach((category: any) => {
        session.Category.upsert(category);
      });
    }
    if (products) {
      products.forEach((product: any) => {
        session.Product.upsert(product);
      });
    }
    if (variations) {
      variations.forEach((variation: any) => {
        session.ProductVariation.upsert(variation);
      });
    }
  }
});

export default ormReducer;
