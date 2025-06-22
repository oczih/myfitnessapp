import React, { useState } from 'react';

export default function SliderTest() {
  const [value, setValue] = useState(2000);

  const handleChange = (e) => {
    const newVal = Number(e.target.value);
    setValue(newVal);
  };

  return (
    <div>
      <input
        type="range"
        min="1000"
        max="7000"
        value={value}
        onChange={handleChange}
      />
      <p>Value: {value}</p>
    </div>
  );
}
