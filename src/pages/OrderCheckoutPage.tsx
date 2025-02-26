// src/pages/OrderCheckoutPage.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../slices/ordersSlice';
import { clearCart } from '../slices/cartSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

// Material UI компоненты
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Импортируем наш CustomTimePicker
import CustomTimePicker from '../components/CustomTimePicker/CustomTimePicker';

// Функция для получения сегодняшней даты в формате "YYYY-MM-DD"
const getTodayDate = (): string => new Date().toISOString().split('T')[0];

// Функция для дополнения числа нулём
const pad = (num: number) => num.toString().padStart(2, '0');

const OrderCheckoutPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  // Храним выбранное время в формате "HH:mm"
  const [time, setTime] = useState('00:00');
  // Устанавливаем дату по умолчанию — сегодня
  const [date, setDate] = useState(getTodayDate());
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

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

  // При фокусе на поле даты, если значение пустое, устанавливаем сегодняшний день
  const handleDateFocus = () => {
    if (!date) setDate(getTodayDate());
  };

  // Если выбранная дата — сегодня, вычисляем минимальное время как текущее время
  const todayDate = getTodayDate();
  let minTime: string | undefined = undefined;
  if (date === todayDate) {
    const now = new Date();
    minTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  return (
    <div className="page-container">
      <h2>Оформление заказа</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <TextField
          label="Имя"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Адрес"
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <TextField
          label="Телефон"
          variant="outlined"
          value={phone}
          onChange={handlePhoneChange}
          required
          type="tel"
          helperText={phoneError || "Введите номер телефона (10–15 цифр, может начинаться с +)"}
          error={Boolean(phoneError)}
        />
        {/* Поле выбора даты с сегодняшним днём по умолчанию и недоступными прошедшими датами */}
        <TextField
          label="Дата"
          variant="outlined"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onFocus={handleDateFocus}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: getTodayDate() }}
          required
        />
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Время</label>
          <CustomTimePicker value={time} onChange={setTime} required minTime={minTime} />
        </div>
        <Button variant="contained" color="primary" type="submit">
          Оформить заказ
        </Button>
      </form>
    </div>
  );
};

export default OrderCheckoutPage;
