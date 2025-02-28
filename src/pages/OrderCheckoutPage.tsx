import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../slices/ordersSlice';
import { clearCart } from '../slices/cartSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import CustomTimePicker from '../components/CustomTimePicker/CustomTimePicker';

import styles from './OrderCheckoutPage.module.scss';
import { Box } from '@mui/material';
import { orm } from '../models';
import { ProductVariation } from '../types';
import StyledButton from '../components/StyledButton/StyledButton';

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

const pad = (num: number) => num.toString().padStart(2, '0');

const OrderCheckoutPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('00:00');
  const [date, setDate] = useState(getTodayDate());
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const deliveryPrice = 200;

  const variationsMap = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    const variationsArray: ProductVariation[] = session.ProductVariation.all().toModelArray();
    const map: Record<number, ProductVariation> = {};
    variationsArray.forEach(variation => {
      map[Number(variation.id)] = variation;
    });
    return map;
  });

  // Валидация телефона: 10-15 цифр, может начинаться с +
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    if (newPhone && !validatePhone(newPhone)) {
      setPhoneError('Неверный формат телефона');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!name || !address || !phone || !time || !date) {
      setError('Все поля обязательны');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Неверный формат телефона');
      return;
    }
    if (cartItems.length === 0) {
      setError('Корзина пуста');
      return;
    }

    const newOrder = {
      id: Date.now(),
      name,
      address,
      phone,
      date,
      time,
      items: cartItems,
      createdAt: new Date().toISOString(),
    };

    dispatch(addOrder(newOrder));
    dispatch(clearCart());
    navigate('/orders');
  };

  const todayDate = getTodayDate();
  let minTime: string | undefined = undefined;
  if (date === todayDate) {
    const now = new Date();
    minTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  const calcTotalPrice = () => {
    let res = 0;
    cartItems.forEach((item) => {
      const variation = variationsMap[item.variationId];
      if (variation) {
        res = res + (variation.price * item.quantity)
      }
    })
    return res;
  }

  const calcTotalPriceWithDelivery = () => {
    const res = calcTotalPrice() + deliveryPrice;
    return res;
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      <Box className={styles.checkout}>
        <Box className={styles.checkout__form}>
          <Box className={styles.form__header}>Доставка</Box>
          <Box className={styles.form__field}>
            <Box className={styles['form__field-label']}>Когда доставить?</Box>
            <Box className={styles['form__field-input']}>
              <CustomTimePicker value={time} onChange={setTime} required minTime={minTime} />
            </Box>
          </Box>
          <Box className={styles.form__field}>
            <Box className={styles['form__field-label']}>Куда доставить?</Box>
            <Box className={styles['form__field-input']}>
              <TextField
                variant="standard"
                fullWidth
                size={'small'}
                placeholder='Выберите адрес доставки'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Box>
          </Box>
          <Box className={styles.form__field}>
            <Box className={styles['form__field-label']}>Имя</Box>
            <Box className={styles['form__field-input']}>
              <TextField
                variant="standard"
                fullWidth
                size={'small'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Box>
          </Box>
          <Box className={styles.form__field}>
            <Box className={styles['form__field-label']}>Телефон</Box>
            <Box className={styles['form__field-input']}>
              <TextField
                fullWidth
                variant="standard"
                size={'small'}
                value={phone}
                onChange={handlePhoneChange}
                required
                type="tel"
                helperText={phoneError || "Введите номер телефона (10–15 цифр, может начинаться с +)"}
                error={Boolean(phoneError)}
              />
            </Box>
          </Box>
        </Box>

        <Box className={styles.checkout__check}>
          <Box className={styles['checkout__check-wrapper']}>
            <Box className={styles.check__row}>
              <Box className={styles['check__row-field']}>Стоимость товаров: </Box>
              <Box className={styles['check__row-value']}>{calcTotalPrice()}₽</Box>
            </Box>
            <Box className={styles.check__row}>
              <Box className={styles['check__row-field']}>Стоимость доставки: </Box>
              <Box className={styles['check__row-value']}>{deliveryPrice}₽</Box>
            </Box>
            <Box className={styles.check__total}>
              <Box className={styles['check__total-field']}>Итого: </Box>
              <Box className={styles['check__total-value']}>{calcTotalPriceWithDelivery()}₽</Box>
            </Box>
          </Box>
          <Box className={styles['checkout__check-submit']}>
            <StyledButton type='submit'>Сделать заказ</StyledButton>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default OrderCheckoutPage;
