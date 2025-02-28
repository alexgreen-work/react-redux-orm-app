import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import styles from './OrderHistoryItem.module.scss';
import moment from 'moment';
import Field from './components/Field/Field';
import { chevronUpIcon, copyIcon } from '../../icons';
import miImage from "../../images/mi.png";
import { Order } from '../../slices/ordersSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { orm } from '../../models';
import { ProductVariation } from '../../types';

interface OrderHistoryItemProps {
    label?: string;
}

const OrderHistoryItem: React.FC<OrderHistoryItemProps & Order> = ({label = 'Xiaomi', id, name, address, items, time}) => {
      const variationsMap = useSelector((state: RootState) => {
        const session = orm.session(state.orm);
        const variationsArray:ProductVariation[] = session.ProductVariation.all().toModelArray();
        const map: Record<number, { id: number; price: number }> = {};
        variationsArray.forEach(variation => {
          map[Number(variation.id)] = {
            id: Number(variation.id),
            price: Number(variation.price),
          };
        });
        return map;
      });

    const calculateTotal = (items: any[]): number => {
        return items.reduce((sum, item) => {
          const variation = variationsMap[item.variationId];
          const price = variation ? variation.price : 0;
          return sum + price * item.quantity;
        }, 0);
      };

    return (
        <Box className={styles.order}>
            <Box className={styles.order__header}>
                <Box className={styles['order__header-image']}><img src={miImage}/> </Box>
                <Box className={styles['order__header-info']}>
                    <Box className={styles['header__info-label']}>{label}</Box>
                    <Box className={styles['header__info-date']}>{moment().format('DD.MM.YYYY')}</Box>
                </Box>
                <Box className={styles['order__header-controls']}>
                    <Link to={`${id}`}>Подробнее</Link>
                </Box>
                <Box className={styles['order__header-collapse']}>
                    <img src={chevronUpIcon}/>
                </Box>
            </Box>
            <Box className={styles.order__inforow}>
                <Field label="Статус заказа" value='Оплачен/Завершен'/>
                <Field label="Номер заказа" value={
                    <Box className={styles.order__number}>
                        <Box className={styles['order__number-text']}> #{name} </Box>
                        <Box className={styles['order__number-icon']}> <img src={copyIcon}/> </Box>
                </Box>}/>
            </Box>
            <Box className={styles.order__inforow}>
                <Field label="Кол-во товаров" value={`${items.length} шт.`}/>
                <Field label="Статус заказа" value={`${calculateTotal(items)}₽`}/>
                <Field label="Адрес доставки" value={address}/>
            </Box>
        </Box>
    )
};

export default OrderHistoryItem;
