import React from 'react';

interface CustomTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minTime?: string;
}

const pad = (num: number) => num.toString().padStart(2, '0');

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  required = false,
  minTime,
}) => {
  let [hours, minutes] = value ? value.split(':').map(Number) : [0, 0];

  let minHour = 0,
    minMinute = 0;
  if (minTime) {
    const parts = minTime.split(':').map(Number);
    minHour = parts[0];
    minMinute = parts[1];
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHours = parseInt(e.target.value);
    let newMinutes = minutes;
    if (minTime && newHours === minHour && newMinutes < minMinute) {
      newMinutes = minMinute;
    }
    onChange(`${pad(newHours)}:${pad(newMinutes)}`);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = parseInt(e.target.value);
    onChange(`${pad(hours)}:${pad(newMinutes)}`);
  };

  const startHour = minTime ? minHour : 0;
  const hourOptions = [];
  for (let i = startHour; i < 24; i++) {
    hourOptions.push(
      <option key={i} value={pad(i)}>
        {pad(i)}
      </option>
    );
  }

  const startMinute = minTime && hours === minHour ? minMinute : 0;
  const minuteOptions = [];
  for (let i = startMinute; i < 60; i++) {
    minuteOptions.push(
      <option key={i} value={pad(i)}>
        {pad(i)}
      </option>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <select
        value={pad(hours)}
        onChange={handleHoursChange}
        required={required}
      >
        {hourOptions}
      </select>
      <span>:</span>
      <select
        value={pad(minutes)}
        onChange={handleMinutesChange}
        required={required}
      >
        {minuteOptions}
      </select>
    </div>
  );
};

export default CustomTimePicker;
