import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import {
  selectOrderByNumber,
  fetchOrderByNumber
} from '../../services/slices/orderSlice';
import {
  selectIngredients,
  fetchIngredients
} from '../../services/slices/ingredientsSlice';
import { TOrder, TIngredient } from '@utils-types';
import { AppDispatch } from '../../services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector(selectOrderByNumber(number || ''));
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (number && !order) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [number, order, dispatch]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
