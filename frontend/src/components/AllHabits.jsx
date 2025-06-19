import { Header } from "./Header"

export const AllHabits = ({user, setUser}) => {
    console.log(...user.entries)
    return (
        <div>
            <Header user={user} setUser={setUser}/>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl mb-10 mt-10 text-center pb-10 text-black'>Your Habits</h2>
                    <div className="flex justify-center">
                    <div
                        className="w-11/12 md:w-10/12 lg:w-8/12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                        style={{ maxHeight: "30rem", overflowY: "auto" }}
                    >
                        {user.entries.map((habit, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-between rounded-2xl shadow-lg p-4 bg-stone-100 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                        >
                            <div className="text-4xl mb-2 drop-shadow">{habit.emoji}</div>
                            <h2 className="text-center text-base font-semibold mb-2 text-black">{habit.title}</h2>

                            {habit.weekdays && habit.weekdays.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                {habit.weekdays.map((day, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-[#9d78bb] rounded-full"
                                >
                                    {day}
                                </span>
                                ))}
                            </div>
                            )}
                        </div>
                        ))}
                    </div>
                    </div>
        </div>
    )
}