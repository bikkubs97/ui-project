// Dashboard.js

import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Chart from "react-google-charts";
import {
  FaRegSmile,
  FaRegSadTear,
  FaRegGrinSquint,
  FaRegDizzy,
} from "react-icons/fa";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayout = [
  { i: "1", x: 0, y: 0, w: 1, h: 1 },
  { i: "2", x: 1, y: 0, w: 1, h: 1 },
  { i: "3", x: 0, y: 1, w: 1, h: 1 },
  { i: "4", x: 1, y: 1, w: 1, h: 1 },
];

const defaultCellSizes = {
  "1": { w: 1, h: 1 },
  "2": { w: 1, h: 1 },
  "3": { w: 1, h: 1 },
  "4": { w: 1, h: 1 },
};

const Dashboard = () => {
  const data = [
    ["Sector", "Intensity"],
    ["Sector 1", 60],
    ["Sector 2", 30],
    ["Sector 3", 70],
    ["Sector 4", 40],
  ];

  const countryData = [
    ["Country", "Intensity"],
    ["USA", 10],
    ["Canada", 20],
    ["Russia", 10],
    ["Brazil", 6],
    ["Australia", 15],
    ["Algeria", 10],
    ["India", 20],
    ["South Africa", 15],
  ];

  const [gridLayout, setGridLayout] = useState({
    lg: defaultLayout,
  });

  const [dashboardName, setDashboardName] = useState("");
  const [dashboardId, setDashboardId] = useState("");
  const icons = [FaRegSmile, FaRegSadTear, FaRegGrinSquint, FaRegDizzy];

  useEffect(() => {
    const newDashboardId = generateId();
    setDashboardId(newDashboardId);
  }, []);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleSaveDashboard = (e) => {
    e.preventDefault();

    // Add the current date to the dashboard data
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const dashboardData = {
      id: dashboardId,
      name: dashboardName,
      date: formattedDate,
      icon: icons[Math.floor(Math.random() * icons.length)].name, // Add the icon here if available
      layout: gridLayout,
    };

    // Get the existing dashboards data from localStorage
    const savedDashboards =
      JSON.parse(localStorage.getItem("dashboards")) || [];

    // Update the existing data with the new dashboard data
    const updatedDashboards = [...savedDashboards, dashboardData];

    // Save the updated dashboards array back to localStorage
    localStorage.setItem("dashboards", JSON.stringify(updatedDashboards));

    alert("Dashboard saved successfully!");
  };

  const handleLayoutChange = (layout, layouts) => {
    // Save the new layout and cell sizes to localStorage
    setGridLayout(layouts);

    const sizeData = {};
    layout.forEach((item) => {
      sizeData[item.i] = { w: item.w, h: item.h };
    });

    const dashboardData = {
      id: dashboardId,
      name: dashboardName,
      layout: layouts,
    };

    localStorage.setItem(dashboardId, JSON.stringify(dashboardData));
    localStorage.setItem("cell_sizes", JSON.stringify(sizeData));
  };

  return (
    <>
      <div className="flex w-full bg-blue-950 px-5 py-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveDashboard(e);
          }}
          className="flex p-2 w-full"
        >
          <label htmlFor="name" className="text-white m-2 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            onChange={(e) => setDashboardName(e.target.value)}
            id="name"
            name="name"
            required
            className="border  px-3 focus:outline-none focus:border-blue-500 flex-grow"
            placeholder="Enter name for your dashboard"
          />
          <button
            type="submit"
            className="bg-blue-500 ml-2 text-white font-bold py-2 px-4 hover:bg-blue-800"
          >
            Save My Dashboard
          </button>
        </form>
      </div>

      <div className="flex h-100 justify-center items-center">
        <div className="w-3/4 p-4 mt-4">
          <p>Click and drag to move, and drag the corners to resize</p>
          <div className="w-100 h-80">
            <ResponsiveGridLayout
              className="layout"
              layouts={gridLayout}
              breakpoints={{ lg: 1200 }}
              cols={{ lg: 2 }}
              rowHeight={220}
              isResizable={true}
              margin={[10, 10]}
              containerPadding={[10, 10]}
              onLayoutChange={handleLayoutChange}
            >
              <div key="1" className="bg-gray-200 p-0">
                <Chart
                  key={`chart-1-${gridLayout.lg[0].x}-${gridLayout.lg[0].y}`}
                  className="intensity"
                  style={{ border: "1px solid #0077e6" }}
                  width={"100%"}
                  height={"100%"}
                  chartType="PieChart"
                  data={data}
                  options={{
                    title: "Sector and Intensity",
                    colors: [
                      "#b3ccff",
                      "#cce0ff",
                      "#99c2ff",
                      "#66a3ff",
                      "#3385ff",
                      "#0066ff",
                      "#0052cc",
                      "#003d99",
                      "#002966",
                    ],
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
              </div>
              <div key="2" className="bg-gray-300">
                <Chart
                  key={`chart-2-${gridLayout.lg[1].x}-${gridLayout.lg[1].y}`}
                  width={"100%"}
                  height={"100%"}
                  chartType="BarChart"
                  data={data}
                  style={{ border: "1px solid #0077e6" }}
                  options={{
                    title: "Sector and Intensity",
                    chartArea: { width: "50%" },
                    hAxis: { title: "Intensity", minValue: 0, maxValue: 100 },
                    vAxis: { title: "Sector" },
                  }}
                />
              </div>
              <div key="3" className="bg-gray-400">
                <Chart
                  key={`chart-3-${gridLayout.lg[2].x}-${gridLayout.lg[2].y}`}
                  chartType="ScatterChart"
                  width="100%"
                  height="100%"
                  data={data}
                  style={{ border: "1px solid #0077e6" }}
                  options={{
                    title:
                      "Correlation between Region, Relevance and Intensity",
                    hAxis: {
                      title: "Region",
                    },
                    vAxis: {
                      title: "Relevance",
                    },
                    legend: {
                      position: "none",
                    },
                  }}
                />
              </div>
              <div key="4" className="bg-gray-500">
                <Chart
                  key={`chart-4-${gridLayout.lg[3].x}-${gridLayout.lg[3].y}`}
                  width={"100%"}
                  height={"100%"}
                  chartType="GeoChart"
                  style={{ border: "1px solid #0077e6" }}
                  data={countryData}
                  options={{
                    title: "Countries-Intensity",
                    colorAxis: {
                      colors: [
                        "#e6f2ff",
                        "#b3d1ff",
                        "#80bfff",
                        "#4da6ff",
                        "#1a8cff",
                        "#0077e6",
                        "#005cb3",
                        "#004080",
                      ],
                      minValue: 0,
                      maxValue: 12,
                    },
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
              </div>
            </ResponsiveGridLayout>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
