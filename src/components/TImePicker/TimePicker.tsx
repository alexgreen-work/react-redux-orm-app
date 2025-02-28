import React, { useState } from 'react';

interface TimePickerProps {
    onChange?: (time: string)=>void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onChange}) => {
  const [time, setTime] = useState('');

  const handleTimeChange = (event: any) => {
    const newTime = event.target.value;
    setTime(newTime);
    if (onChange) {
      onChange(newTime);
    }
  };

  return (
    <div>
      <label htmlFor="time">Выберите время: </label>
      <input
        type="time"
        id="time"
        value={time}
        onChange={handleTimeChange}
      />
    </div>
  );
};

export default TimePicker;