import "./App.css";
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import coinService from "./services/coinsService";

function App() {
  const [topCoins, setTopCoins] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any | null>(null);

  useEffect(() => {
    getTop10Coins();
  }, []);

  useEffect(() => {
    if (selectedCoin?.id) getCoinHistory(selectedCoin.id);
  }, [selectedCoin]);

  const getTop10Coins = async () => {
    try {
      const topCoins = await coinService.getTop10Coins();
      setTopCoins(topCoins);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCoinHistory = async (coinId: string) => {
    try {
      const history = await coinService.getCoinHistory(coinId);
    } catch (error) {
      console.error("Error fetching coin history:", error);
    }
  };

  return (
    <div className="App">
      <div className="flex h-screen border-4 border-solid border-blue-500">
        <Button className="h-10" label="Click Me" />
        <Dropdown
          className="h-10"
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.value)}
          options={topCoins}
          optionLabel="name"
          placeholder="Select a Coin"
        />
      </div>
    </div>
  );
}

export default App;
