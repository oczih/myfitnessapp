export const CheckList = ({ selectedWeekdays, setSelectedWeekdays }) => {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleCheckboxChange = (day) => {
    if (selectedWeekdays.includes(day)) {
      setSelectedWeekdays(selectedWeekdays.filter(d => d !== day));
    } else {
      setSelectedWeekdays([...selectedWeekdays, day]);
    }
  };

  return (
    <div>
    <h2 className='text-2xl sm:text-2xl lg:text-2xl mb-10 drop-shadow-xl'>Select dates for this habit</h2>
     <fieldset className="fieldset bg-[#7e1f85] rounded-box w-64 p-4 hover:drop-shadow-xl mx-auto text-center mb-10 ease-in-out">
      {weekdays.map((day) => (
        <label key={day} className="flex items-center gap-2 cursor-pointer text-white">
          <input
            type="checkbox"
            className="checkbox"
            value={day}
            checked={selectedWeekdays.includes(day)}
            onChange={() => handleCheckboxChange(day)}
          />
          {day}
        </label>
      ))}
    </fieldset>
    </div>
  );
};
