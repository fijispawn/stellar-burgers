import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { selectOrderByNumber } from '../../services/slices/orderSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { TOrder, TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const order = useSelector(selectOrderByNumber(number || ''));
  const ingredients = useSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!order) return null;

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
