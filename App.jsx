import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import './App.css';

function App() {
  const [chartData, setChartData] = useState([]);
  const [chartHumidData, setChartHumidData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.76.112:5000/api/data");
        const json = await res.json();

        const now = new Date().toLocaleTimeString();
        setChartData(prev => {
          const updated = [...prev, { time: now, temp: json.temperature}];
          return updated.slice(-20);
        });
        setChartHumidData(prev => {
          const updated = [...prev, {time:now, humid: json.humidity}];
          return updated.slice(-20);
        })
      } catch (err) {
        console.error(err);
      }
    };

    fetchData(); 
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Temperature and Humidity Over Time</h2>
      <LineChart width={600} height={300} data={chartData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis domain={['auto', 'auto']} label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="temp" stroke="#ff7300" dot={true} />
      </LineChart>
      <LineChart width={600} height={300} data={chartHumidData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis domain={['auto', 'auto']} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="humid" stroke="#ff7300" dot={true} />
      </LineChart>
    </div>
  );
}

export default App;
