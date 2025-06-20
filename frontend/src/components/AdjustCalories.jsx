import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import { useState, useEffect } from 'react';

export const AdjustCalories = ({ user, setUser }) => {
  const [value, setValue] = useState(user.calories);

  // If user.calories changes from parent, update local value
  useEffect(() => {
    setValue(user.calories);
  }, [user.calories]);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSliderCommitted = (event, newValue) => {
    setUser(prev => ({ ...prev, calories: newValue }));
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value === '' ? '' : Number(event.target.value);
    if (inputValue === '') {
      setValue('');
    } else if (!isNaN(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleInputBlur = () => {
    let newValue = value;
    if (value === '' || value < 1000) newValue = 1000;
    else if (value > 7000) newValue = 7000;

    setValue(newValue);
    setUser(prev => ({ ...prev, calories: newValue }));
  };

  return (
    <div className="card w-96 bg-[#7E1F86] shadow-xl mx-auto">
      <div className="card-body text-white rounded-xl">
        <h2 className="card-title">Adjust Daily Calories</h2>
        <Box sx={{ width: 300 }}>
          <Slider
            value={typeof value === 'number' ? value : 1000}
            min={1000}
            max={7000}
            step={1}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderCommitted}  // only update user state on commit (drag release)
            valueLabelDisplay="auto"
            aria-labelledby="input-slider"
            sx={{ color: 'white' }}
          />
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            inputProps={{
              step: 1,
              min: 1000,
              max: 7000,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            sx={{ mt: 2, color: 'white', input: { color: 'white' } }}
          />
        </Box>
      </div>
    </div>
  );
};
