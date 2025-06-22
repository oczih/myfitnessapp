import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import { useState, useEffect } from 'react';
import userservice from '../services/user';

export const AdjustCalories = ({ user, setUser, toast, caloriegoal, calorieseaten, setCaloriesGoal, setCaloriesEaten }) => {
  const [inputValue, setInputValue] = useState(caloriegoal);
  const [localValue, setLocalValue] = useState(caloriegoal);
  useEffect(() => {
    setInputValue(caloriegoal); // sync input if external value changes
  }, [caloriegoal]);

  useEffect(() => {
  setLocalValue(caloriegoal);
}, [caloriegoal]);

const handleSliderChange = (e) => {
  setLocalValue(Number(e.target.value));
};

  const handleCalorieChange = async () => {
  try {
    const updatedUser = await userservice.update(user.id, { caloriegoal: localValue });
    setUser(updatedUser);
    setCaloriesGoal(updatedUser.caloriegoal);
    toast.success("Calories updated successfully.");
  } catch (error) {
    toast.error("Failed to update calories.");
  }
};
  const sliderValue = (typeof caloriegoal === 'number' && caloriegoal >= 1000 && caloriegoal <= 7000)
  ? caloriegoal
  : 1000;
  
  return (
    <div className="card w-96 bg-[#7E1F86] shadow-xl ml-10">
  <div className="card-body text-white rounded-xl">
    <h2 className="card-title">Adjust Daily Calories</h2>

    <div className="flex-1 mt-4">
      <Box sx={{ width: 300, position: 'relative', zIndex: 1000 }}>
        <Slider
          value={localValue}
          min={1000}
          max={7000}
          step={100}
          onChange={handleSliderChange}
          valueLabelDisplay="on"
          aria-labelledby="input-slider"
          sx={{
            color: 'white',
            '& .MuiSlider-thumb': { width: 24, height: 24 },
            '& .MuiSlider-track': { height: 6 },
            '& .MuiSlider-rail': { height: 6 },
          }}
        />
      </Box>
    </div>

    <button
      className=" transition-transform duration-150 ease-in-out drop-shadow-md mt-4 bg-white text-[#7E1F86] px-4 py-2 rounded"
      onClick={() =>
        window.confirm("Do you want to update your daily calories?") &&
        handleCalorieChange()
      }
    >
      Update Calories
    </button>
  </div>
</div>


  );
};
