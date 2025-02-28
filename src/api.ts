const API_BASE = 'https://test2.sionic.ru/api/';

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
  const url = buildUrl(model, params);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Ошибка при получении данных для ${model}: ${response.statusText}`
    );
  }

  const data = await response.json();
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
