import { CheckIcon,  XMarkIcon } from '@heroicons/react/24/solid';

const HabitComparison = () => {
  const oldWay = [
    'Forget to track habits',
    'Lose motivation after a few days',
    'No visual progress',
    'No fun or rewards',
    'Hard to stay consistent',
  ];

  const bloomWay = [
    'Track daily habits easily',
    'Earn diamonds & grow flowers',
    'Visualize your progress',
    'Celebrate streaks & milestones',
    'Stay motivated long-term',
  ];

  const ListItem = ({ icon: Icon, text }) => (
    <li className="flex items-center gap-2">
      <Icon className="w-5 h-5 shrink-0 opacity-80" />
      {text}
    </li>
  );

  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12 px-4 mt-10">
      {/* Old Way */}
      <div className="bg-rose-100/70 text-rose-700 p-8 md:p-12 rounded-2xl w-full max-w-md shadow-md">
        <h3 className="font-bold text-xl mb-4">The Old Way</h3>
        <ul className="space-y-2 list-disc list-inside">
          {oldWay.map((item, index) => (
            <ListItem key={index} icon={XMarkIcon} text={item} />
          ))}
        </ul>
      </div>

      {/* Bloom Habits */}
      <div className="bg-green-100/70 text-green-700 p-8 md:p-12 rounded-2xl w-full max-w-md shadow-md">
        <h3 className="font-bold text-xl mb-4">With Bloom Habits</h3>
        <ul className="space-y-2 list-disc list-inside">
          {bloomWay.map((item, index) => (
            <ListItem key={index} icon={CheckIcon} text={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HabitComparison;
