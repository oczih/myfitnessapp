
export const ProgressBarPercentage = ({todaysHabits}) => {
    if (!todaysHabits || todaysHabits.length === 0) {
        return 0;
    }

    const doneCount = todaysHabits.filter(entry => entry.done).length;
    const total = todaysHabits.length;


    if (total === 0) return 0;

    const percentage = ((doneCount / total) * 100).toFixed();
    return Number(percentage);
};