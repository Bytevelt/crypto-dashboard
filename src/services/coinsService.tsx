import axiosInstance from "./axiosInstance";
import config from "../config/config.json";

const getCoinList = async () => {
  const response = await axiosInstance.get(config.routes.getCoinList);
  return response.data;
};

const getTop10Coins = async () => {
  const response = await axiosInstance.get(config.routes.getCoinMarketData, {
    params: {
      vs_currency: config.preferredCurrency,
      order: "market_cap_desc",
      per_page: 10,
      page: 1,
    },
  });
  return response.data;
};

const getCoinHistory = async (coinId: string) => {
  const response = await axiosInstance.get(
    config.routes.getCoinHistory.replace("{id}", coinId),
    {
      params: {
        vs_currency: config.preferredCurrency,
        days: 7,
        interval: "daily",
      },
    }
  );
  return response.data;
};

const getTop5Gainers = async () => {
  const response = await axiosInstance.get(config.routes.getCoinMarketData, {
    params: {
      vs_currency: config.preferredCurrency,
      order: "market_cap_desc",
      per_page: 100,
      page: 1,
      price_change_percentage: "24h",
    },
  });

  const coins = response.data;
  const sortedCoins = coins
    .filter((coin: any) => coin.price_change_percentage_24h !== null)
    .sort(
      (a: any, b: any) =>
        b.price_change_percentage_24h - a.price_change_percentage_24h
    );

  return sortedCoins.slice(0, 5);
};

export default {
  getCoinList,
  getTop10Coins,
  getCoinHistory,
  getTop5Gainers
};
