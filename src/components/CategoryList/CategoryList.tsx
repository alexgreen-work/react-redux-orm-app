// src/components/CategoryList.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { orm } from '../models';
import { RootState } from '../store';

interface Category {
  id: number;
  name: string;
}

const CategoryList: React.FC = () => {
  const categories: Category[] = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    return session.Category.all()
      .toModelArray()
      .map(categoryModel => ({
        id: categoryModel.id,
        name: categoryModel.name,
      }));
  });

  return (
    <div>
      <h2>Категории</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
