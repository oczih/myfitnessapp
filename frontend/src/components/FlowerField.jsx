    import { Header } from "./Header"
    import userservice from '../services/user'
    import { ToastContainer, toast, Zoom } from 'react-toastify';
    import { useState } from 'react';

    const flowers = [
        { name: "Daisy", emoji: "🌼", rarity: "common", cost: 5 },
        { name: "Rose", emoji: "🌹", rarity: "common", cost: 10 },
        { name: "Tulip", emoji: "🌷", rarity: "common", cost: 8 },
        { name: "Sunflower", emoji: "🌻", rarity: "common", cost: 12 },
        { name: "Lily", emoji: "🌸", rarity: "uncommon", cost: 20 },
        { name: "Peony", emoji: "💐", rarity: "uncommon", cost: 25 },
        { name: "Cherry Blossom", emoji: "🌺", rarity: "uncommon", cost: 30 },
        { name: "Orchid", emoji: "💮", rarity: "rare", cost: 85 },
        { name: "Blue Lotus", emoji: "🪷", rarity: "rare", cost: 95 },
        { name: "Ghost Orchid", emoji: "👻🌸", rarity: "very rare", cost: 100 },
    ];


    const handleFlowerPurchase = (flower, setSelectedFlower) => {
        setSelectedFlower(flower);
        toast.info(`Selected ${flower.name}. Now choose a spot to plant it!`);
      };
    const handlePlanting = async (positionIndex, flower, user, setUser, setSelectedFlower)  => {
        if (!flower) {
          toast.error("Please select a flower to plant first!");
          return;
        }
      
        const position = positionIndex.toString();
      
        const alreadyPlanted = user.flowers.some(f => f.position === position);
        if (alreadyPlanted) {
          toast.error("A flower is already planted here!");
          return;
        }
      
        if (user.diamonds < flower.cost) {
          toast.error("You don't have enough diamonds to plant this flower!");
          setSelectedFlower(null)
          return;
        }
      
        const newFlower = { name: flower.name, position };
      
        try {
      
          const updatedUser = await userservice.update(user.id, {
            flowers: [...user.flowers, newFlower],
            diamonds: user.diamonds - flower.cost,
            experience: user.experience + 10
          });
      
          setUser(updatedUser);
    
          toast.success(`Planted ${flower.name} at position ${position}, +10 XP!`);
        } catch (err) {
          console.error(err);
          toast.error("Failed to plant the flower.");
        }
      };

    export const FlowerField = ({user, setUser }) => {
        const [selectedFlower, setSelectedFlower] = useState(null);
        return (
    <div>
      <Header user={user} setUser={setUser} />
      <div className="max-w-screen-lg mx-auto min-h-[180px] mb-10 text-center mt-5 bg-stone-200 rounded-xl pt-10 pb-20 drop-shadow-md px-4">
        <h2 className="text-left text-xl text-[#7E1F86]">💎 Diamonds: {user.diamonds ?? 0}</h2>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#7E1F86] tracking-tight mb-10">
          Flowerfield
        </h1>

        <div className="h-8 text-xl text-[#7E1F86] mb-4">
          {selectedFlower && (
            <>Selected: {selectedFlower.name} {selectedFlower.emoji}</>
          )}
        </div>

        <h2 className="text-left text-2xl font-semibold mt-8 mb-4 text-black">Flowershop 🌹</h2>

        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          {/* Flower Shop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
            {flowers.map((flower, i) => (
              <button key={i} onClick={() => handleFlowerPurchase(flower, setSelectedFlower)}>
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg bg-stone-100 cursor-pointer hover:shadow-xl transition">
                  <div className="text-xl">{flower.emoji}</div>
                  <h2 className="text-center text-lg font-semibold text-black mb-1">{flower.name}</h2>
                  <h2 className="text-center text-md font-medium text-black">{flower.cost} 💎</h2>
                </div>
              </button>
            ))}
          </div>

          {/* Flower Planting Field */}
          <div className="flex-1 bg-[#9c79bc] rounded-xl p-4 drop-shadow-md">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, i) => {
                const flowerAtSpot = user.flowers.find(f => f.position === i.toString());

                return (
                  <button
                    key={i}
                    onClick={() => handlePlanting(i, selectedFlower, user, setUser, setSelectedFlower)}
                    disabled={!selectedFlower}
                    className={!selectedFlower ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] duration-200'}
                  >
                    <h3 className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 border-dashed border-[#402905] bg-green-100 rounded-md flex items-center justify-center text-2xl sm:text-3xl hover:bg-green-200 transition">
                      {flowerAtSpot
                        ? flowers.find(f => f.name === flowerAtSpot.name)?.emoji
                        : "🌱"}
                    </h3>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    }