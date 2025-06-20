
const levels = [
    { level: 1, experience: 0 },
    { level: 2, experience: 100 },
    { level: 3, experience: 300 },
    { level: 4, experience: 600 },
    { level: 5, experience: 1000 },
    { level: 6, experience: 1500 },
    { level: 7, experience: 2100 },
    { level: 8, experience: 2800 },
    { level: 9, experience: 3600 },
    { level: 10, experience: 4500 },
]


export const ExperienceBar = ({user}) => {
    const currentlevel = levels.find(level => user.experience >= level.experience);
    const nextLevel = levels.find(level => level.level === (currentlevel ? currentlevel.level + 1 : 1));
    return (
        <div>
            <div className="bg-gray-200 rounded-full h-4 min-w-30 mt-5 ml-5">
                <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{
                        width: `${((currentlevel ? currentlevel.experience : 0) / (nextLevel ? nextLevel.experience : 1)) * 100}%`
                    }}
                />
            </div>
            <div className="flex justify-between text-sm mt-1 ml-5">
                <span>{currentlevel ? currentlevel.level : 1}</span>
                <span>{nextLevel ? nextLevel.level : 11}</span>
            </div>
        </div>
    )
}