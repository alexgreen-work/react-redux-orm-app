import { Product, ProductVariation, ProductVariationPropertyValues } from "./types";

const API_BASE = 'https://test2.sionic.ru/api/';

interface NewField {
  name: string;
  url: (model: any) => string;
  getBody?: (model: any) => any;
  extra?: NewField;
}

interface ExtraItem {
  [model: string]: {
    newfield: NewField
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
    },
    key: 'product_id',
  },
  'ProductVariations': {
    newfield: {
      name: 'properties',
      url: (variations: ProductVariation[]) => `/ProductVariationPropertyValues`,
      getBody: (variations: ProductVariation[])=> ({
        product_variation_id: variations.map((variation)=> variation.id)
      }),
      extra: {
        name: 'test',
        url: (variations: ProductVariationPropertyValues[]) => `/ProductVariationProperties`,
        getBody: (variationPropertiesValues: ProductVariationPropertyValues[])=> ({
          id: variationPropertiesValues.map((variationPropertiesValue)=> variationPropertiesValue.product_variation_property_id)
        })
      }
    },
    key: 'product_variation_id',
  }
  // Пример для другой модели (раскомментируйте, если нужно)
  // 'ProductVariations': {
  //   newfield: {
  //     name: 'properties',
  //     url: 'ProductVariationPropertyValues',
  //     getBody: (variations: ProductVariation[]) => ({
  //       product_variation_id: variations.map((variation) => variation.id),
  //     }),
  //   },
  //   key: 'product_variation_id',
  // },
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
  const range: [number, number] = params?.range ? params?.range : [offset * limit, (offset + 1) * limit - 1];

  const url = buildUrl(model, { ...params, range });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка при получении данных для ${model}: ${response.statusText}`
    );
  }

  const data = await response.json();
  if (data.length === limit && !params?.range) {
    // Если данных больше, чем limit, рекурсивно получаем следующую страницу
    const nextPageData = await getAllDataFromRequest(model, params, offset + 1);
    return [...data, ...nextPageData];
  }

  return data;
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
    const subRequest = extra[model];
    const objData = getObjectFromArray(data, 'id');

    const subModel = subRequest.newfield.url(data);
    const subParams = subRequest.newfield.getBody
      ? { filter: subRequest.newfield.getBody(data) }
      : {};

    const subData = await getAllDataFromRequest(subModel, subParams);

    for (const subItem of subData) {
      const key = subItem[subRequest.key];
      if (objData[key]) {
        if (!objData[key][subRequest.newfield.name]) {
          objData[key][subRequest.newfield.name] = [];
        }
        objData[key][subRequest.newfield.name].push(subItem);
      }
    }

    data = Object.values(objData);
  }

  console.log({data});

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