import { TIngredient, TOrder } from '@utils-types';

const BURGER_API_URL = 'https://norma.nomoreparties.space/api';

export const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const request = <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> =>
  fetch(`${BURGER_API_URL}${endpoint}`, options).then((res) =>
    checkResponse<T>(res)
  );

export const getIngredientsApi = () =>
  request<{ success: boolean; data: TIngredient[] }>('/ingredients');

export const createOrderApi = (ingredients: string[]) =>
  request<{ success: boolean; order: TOrder }>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ingredients })
  });

export const getOrderApi = (number: string) =>
  request<{ success: boolean; orders: TOrder[] }>(`/orders/${number}`);
