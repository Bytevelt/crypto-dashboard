import "./App.css";
import { useState, useEffect, use } from "react";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
import coinService from "./services/coinsService";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [topCoins, setTopCoins] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any | null>(null);
  const [coinHistory, setCoinHistory] = useState<any>(null);
  const [topGainers, setTopGainers] = useState<any[]>([]);

  useEffect(() => {
    getTop10Coins();
    getTopGainers();
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      getCoinHistory(selectedCoin.id);
    }
  }, [selectedCoin]);

  const getTop10Coins = async () => {
    try {
      const topCoins = await coinService.getTop10Coins();
      setTopCoins(topCoins);
    } catch (error) {}
  };

  const getCoinHistory = async (coinId: string) => {
    try {
      const history = await coinService.getCoinHistory(coinId);
      setCoinHistory(history);
    } catch (error) {
      console.error("Error fetching coin history:", error);
    }
  };

  const getTopGainers = async () => {
    try {
      const gainers = await coinService.getTop5Gainers();
      setTopGainers(gainers);
    } catch (error) {
      console.error("Error fetching top gainers:", error);
    }
  };

  const chartData = {
    labels:
      coinHistory?.prices?.map(([timestamp]: number[]) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
        });
      }) ?? [],
    datasets: [
      {
        label: "Precio USD",
        data:
          coinHistory?.prices?.map(([_, price]: [number, number]) => price) ??
          [],
        fill: true,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `$${value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: "#fff" } },
      y: {
        ticks: {
          color: "#fff",
          callback: (value: number) =>
            `$${value.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col gap-4">
      <header className="flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        <div className="flex gap-2 items-center">
          <InputText
            placeholder="Buscar criptomoneda..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="p-inputtext-sm bg-gray-800 border-gray-700 text-white"
          />
          <Button
            icon="pi pi-sun"
            className="p-button-rounded p-button-secondary"
            label="Cambiar tema"
          />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-none shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            Seleccionar criptomoneda
          </h2>
          <Dropdown
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.value)}
            options={topCoins}
            optionLabel="name"
            placeholder="Elige una cripto"
            className="w-full"
            itemTemplate={(option) => (
              <div className="flex items-center gap-2">
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.name}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span>{option.name}</span>
              </div>
            )}
            valueTemplate={(option) =>
              option ? (
                <div className="flex items-center gap-2">
                  <img
                    src={option.image}
                    alt={option.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span>{option.name}</span>
                </div>
              ) : (
                <span>Elige una cripto</span>
              )
            }
          />
        </Card>

        <Card className="bg-gray-800 border-none shadow-md lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Datos generales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400">Nombre</p>
              <div className="flex justify-center items-center gap-2">
                {selectedCoin?.image && (
                  <img
                    src={selectedCoin.image}
                    alt={selectedCoin.name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-xl font-bold">
                  {selectedCoin?.name || "-"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Símbolo</p>
              <p className="text-xl font-bold">{selectedCoin?.symbol || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Precio Actual</p>
              <p className="text-xl font-bold">
                {selectedCoin?.current_price
                  ? `$${selectedCoin.current_price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Variación 24h</p>
              {selectedCoin?.price_change_percentage_24h !== undefined ? (
                <p
                  className={`text-xl font-bold ${
                    selectedCoin.price_change_percentage_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedCoin.price_change_percentage_24h >= 0 ? "+" : ""}
                  {selectedCoin.price_change_percentage_24h.toFixed(2)}%
                </p>
              ) : (
                <p className="text-gray-400">-</p>
              )}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 shadow-md h-80 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Precio últimos 7 días</h2>
          <div className="h-full">
            <Chart type="line" data={chartData} options={chartOptions} />
          </div>
        </div>

        <Card className="bg-gray-800 border-none shadow-md flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-4">Más información</h2>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Ranking global</span>
              <span className="font-semibold">
                {selectedCoin?.market_cap_rank || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap</span>
              <span className="font-semibold">
                {selectedCoin?.market_cap
                  ? `$${selectedCoin.market_cap.toLocaleString("en-US")}`
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Volumen 24h</span>
              <span className="font-semibold">
                {selectedCoin?.total_volume
                  ? `$${selectedCoin.total_volume.toLocaleString("en-US")}`
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Oferta circulante</span>
              <span className="font-semibold">
                {selectedCoin?.circulating_supply
                  ? `${selectedCoin.circulating_supply.toLocaleString("en-US")}`
                  : "-"}
              </span>
            </div>
          </div>
        </Card>
      </section>

      <section className="bg-gray-800 rounded-lg p-4 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Top 5 Ganadores</h2>
        </div>
        <DataTable
          value={topGainers}
          paginator={false}
          responsiveLayout="scroll"
          className="p-datatable-sm"
        >
          <Column
            header="Nombre"
            body={(rowData) => (
              <div className="flex items-center gap-2">
                {rowData.image && (
                  <img
                    src={rowData.image}
                    alt={rowData.name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span>{rowData.name}</span>
              </div>
            )}
          />

          <Column field="symbol" header="Símbolo" />
          <Column
            field="current_price"
            header="Precio"
            body={(rowData) => (
              <span className="font-semibold">
                $
                {rowData.current_price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USD
              </span>
            )}
          />
          <Column
            field="price_change_percentage_24h"
            header="Cambio 24h"
            body={(rowData) => (
              <span
                className={`font-semibold ${
                  rowData.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {rowData.price_change_percentage_24h >= 0 ? "+" : ""}
                {rowData.price_change_percentage_24h.toFixed(2)}%
              </span>
            )}
          />
        </DataTable>
      </section>
    </div>
  );
}

export default App;
