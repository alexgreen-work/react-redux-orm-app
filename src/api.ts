import { Product, ProductVariation, ProductVariationPropertyValues } from "./types";
import _ from 'lodash';

const API_BASE = 'https://test2.sionic.ru/api/';

interface NewField {
  name: string;
  url: (model: any) => string;
  getBody?: (model: any) => any;
  key: string;
  id?: string;
  extra?: NewField;
}

interface ExtraItem {
  [model: string]: {
    newfield: NewField;
    id: string;
    key: string;
  };
}

const extra: ExtraItem = {
  'Products': {
    newfield: {
      name: 'images',
      url: (products: Product[]) => `/ProductImages`,
      getBody: (products: Product[]) => ({
        product_id: products.map((product) => product.id),
      }),
      key: 'product_id',
    },
    id: 'id',
    key: 'product_id',
  },
  'ProductVariations': {
    newfield: {
      name: 'values',
      url: (variations: ProductVariation[]) => `/ProductVariationPropertyValues`,
      getBody: (variations: ProductVariation[]) => ({
        product_variation_id: variations.map((variation) => variation.id)
      }),
      key: 'product_variation_id',
      id: 'id',
      extra: {
        name: 'Properties',
        url: (variationPropertiesValues: ProductVariationPropertyValues[]) => `/ProductVariationProperties`,
        getBody: (variationPropertiesValues: ProductVariationPropertyValues[]) => ({
          id: variationPropertiesValues.map((variationPropertiesValue) => variationPropertiesValue.product_variation_property_id)
        }),
        key: 'product_variation_property_id',
        id: 'product_variation_property_id',
      },
    },
    id: 'id',
    key: 'product_variation_id',
  }
};

/**
 * Формирует URL с параметрами запроса.
 * @param model - название сущности (например, Products, Categories и т.д.)
 * @param params - объект с параметрами: filter, sort, range.
 * @returns Полный URL для запроса.
 */
function buildUrl(
  model: string,
  params?: {
    filter?: object;
    sort?: [string, string];
    range?: [number, number];
  }
): string {
  const query: Record<string, string> = {};

  if (params) {
    if (params.filter) {
      query.filter = JSON.stringify(params.filter);
    }
    if (params.sort) {
      query.sort = JSON.stringify(params.sort);
    }
    if (params.range) {
      query.range = JSON.stringify(params.range);
    }
  }

  const queryString = new URLSearchParams(query).toString();
  return `${API_BASE}${model}${queryString ? '?' + queryString : ''}`;
}

const getObjectFromArray = (array: any[], field: string): Record<string, any> => {
  const res: Record<string, any> = {};
  array.forEach((item) => (res[item[field]] = item));
  return res;
};

/**
 * Рекурсивно получает все данные из API с учётом пагинации.
 * @param model - название сущности.
 * @param params - параметры запроса (filter, sort, range).
 * @param offset - текущее смещение для пагинации.
 * @returns Промис с массивом всех данных.
 */
export async function getAllDataFromRequest(
  model: string,
  params?: {
    filter?: object;
    sort?: [string, string];
    range?: [number, number];
  },
  offset: number = 0
): Promise<any[]> {
  const limit = 50; // Лимит данных на одной странице
  const range: [number, number] = params?.range ? params.range : [offset * limit, (offset + 1) * limit - 1];

  const url = buildUrl(model, { ...params, range });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка при получении данных для ${model}: ${response.statusText}`
    );
  }

  const data = await response.json();
  if (data.length === limit && !params?.range) {
    const nextPageData = await getAllDataFromRequest(model, params, offset + 1);
    return [...data, ...nextPageData];
  }

  return data;
}

/**
 * Рекурсивная обработка extra данных.
 * @param parentData - массив родительских данных.
 * @param extraConf - конфигурация для extra.
 */
async function processExtraForData(
  parentData: any[],
  extraConf: any
): Promise<void> {
  const keyField = 'key' in extraConf && extraConf.key ? extraConf.key : 'id';
  const id = extraConf.id ? extraConf.id : extraConf.newfield.id;
  const parentMap = getObjectFromArray(parentData, id);

  const subModel = extraConf.newfield.url(parentData);
  const subParams = extraConf.newfield.getBody ? { filter: extraConf.newfield.getBody(parentData) } : {};
  const subData = await getAllDataFromRequest(subModel, subParams);
  for (const subItem of subData) {
    const parentKey = _.get(subItem, keyField);
    const value = parentMap[parentKey];
    console.log({value, parentMap, parentKey, parentData, id, extraConf, keyField});
    if(Array.isArray(value)){
      for(let valueItem of value) {
          if (!valueItem[extraConf.newfield.name]) {
            valueItem[extraConf.newfield.name] = [];
          } else{
            console.log({valueItem, name: extraConf.newfield.name })
          }
          valueItem[extraConf.newfield.name].push(subItem);
      }
    }
    if (parentMap[parentKey]) {
      if (!parentMap[parentKey][extraConf.newfield.name]) {
        parentMap[parentKey][extraConf.newfield.name] = [];
      }
      parentMap[parentKey][extraConf.newfield.name].push(subItem);
    }
  }

  // Если есть вложенный extra, рекурсивно обрабатываем его
  if (extraConf.newfield.extra) {
    for (const parent of parentData) {
      const nestedData = parent[extraConf.newfield.name];
      if (nestedData && Array.isArray(nestedData)) {
        await processExtraForData(nestedData, { newfield: extraConf.newfield.extra, key: 'id' });
      }
    }
  }
}

/**
 * Получение списка сущностей с заданными параметрами.
 * @param model - название сущности.
 * @param params - параметры запроса (filter, sort, range).
 * @returns Промис с данными, полученными из API.
 */
export async function fetchEntities(
  model: string,
  params?: {
    filter?: object;
    sort?: [string, string];
    range?: [number, number];
  }
): Promise<any[]> {
  let data = await getAllDataFromRequest(model, params);

  if (extra[model]) {
    await processExtraForData(data, extra[model]);
  }

  console.log({ data });
  return data;
}

/**
 * Получение одной записи сущности по id.
 * @param model - название сущности.
 * @param id - идентификатор записи.
 * @returns Промис с данными записи.
 */
export async function fetchEntityById(model: string, id: number): Promise<any> {
  const url = `${API_BASE}${model}/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка при получении ${model} с id ${id}: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}
