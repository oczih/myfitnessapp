import { Header } from "./Header"

export const DailyHabits = ({user, setUser, setMessage}) => {
    return (
        <div>
            <Header user={user} setMessage={setMessage} setUser={setUser}/>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl mb-10 mt-10 text-center pb-10'>Your Habits</h2>
                    {user && user.entries && user.entries.length > 0 && (
                        <ul>
                            {user.entries.map((habit, i) => (
                            <li key={i}>{habit.text}</li>
                            ))}
                        </ul>
        )}
        </div>
    )
}