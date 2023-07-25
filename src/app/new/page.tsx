"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { graphContext, GraphData } from "../layout";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import Chart from "react-google-charts";
import html2canvas from "html2canvas";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useRouter } from "next/navigation";

const ResponsiveGridLayout = WidthProvider(Responsive);

const New: React.FC = () => {
  const graphData = useContext<GraphData | null>(graphContext);
  const defaultLayout: Layout[] = [
    { i: "1", x: 0, y: 0, w: 1, h: 1 },
    { i: "2", x: 1, y: 0, w: 1, h: 1 },
    { i: "3", x: 0, y: 1, w: 1, h: 1 },
    { i: "4", x: 1, y: 1, w: 1, h: 1 },
  ];

  const [gridLayout, setGridLayout] = useState<{ lg: Layout[] }>({
    lg: defaultLayout,
  });
  const router = useRouter();
  const [dashboardName, setDashboardName] = useState<string>("");
  const [dashboardId, setDashboardId] = useState<string>("");

  useEffect(() => {
    const newDashboardId = generateId();
    setDashboardId(newDashboardId);
  }, []);

  const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const gridLayoutRef = useRef<HTMLDivElement>(null);

  const captureSnapshot = async (): Promise<string | undefined> => {
    if (!gridLayoutRef.current) return undefined;

    try {
      const canvas = await html2canvas(gridLayoutRef.current, {
        scale: 1,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error capturing snapshot:", error);
      return undefined;
    }
  };

  const handleSaveDashboard = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const snapshot = await captureSnapshot();

    interface DashboardData {
      id: string;
      name: string;
      date: string;
      icon: string;
      layout: { lg: Layout[] };
    }

    const dashboardData: DashboardData = {
      id: dashboardId,
      name: dashboardName,
      date: formattedDate,
      icon: snapshot || "",
      layout: gridLayout,
    };

    const savedDashboards: DashboardData[] = JSON.parse(
      localStorage.getItem("dashboards") ?? "[]"
    );
    const updatedDashboards = [...savedDashboards, dashboardData];
    localStorage.setItem("dashboards", JSON.stringify(updatedDashboards));
    alert("Dashboard saved successfully!");
  };

  const handleLayoutChange = (
    layout: Layout[],
    layouts: { lg: Layout[] }
  ): void => {
    setGridLayout(layouts);
    const sizeData: { [key: string]: { w: number; h: number } } = {};
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

  const handleCellDelete = (cellId: string): void => {
    const updatedLayout = gridLayout.lg.filter((item) => item.i !== cellId);
    setGridLayout({ lg: updatedLayout });
  };

  return (
    <>
      <div className="flex w-full bg-blue-950 px-5 py-2">
        <form onSubmit={handleSaveDashboard} className="flex p-2 w-full">
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
            className="bg-blue-500 ml-2 text-white font-bold py-2 px-4 hover:bg-blue-800 "
          >
            Save My Dashboard
          </button>
        </form>
        <button
          onClick={() => {
            router.push("/");
          }}
          className="bg-red-500 ml-2 text-white font-bold py-1 my-2 px-4  hover:bg-red-800 "
        >
          Back
        </button>
      </div>

      <div
        className="flex h-100 justify-center items-center"
        ref={gridLayoutRef}
      >
        <div className="w-3/4 p-4 mt-4">
          <p>
            Click and drag to move, click and drag the bottom-right corners to
            resize
          </p>
          <div className="w-100 h-80 ">
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
              {gridLayout.lg.map((item) => (
                <div key={item.i} className="relative">
                  <button
                    className="bg-red-500 absolute top-0 left-0 z-10 m-1 px-2"
                    onClick={() => handleCellDelete(item.i)}
                  >
                    X
                  </button>
                  {item.i === "1" && (
                    <Chart
                      key={`chart-${item.i}-${item.x}-${item.y}`}
                      className="intensity"
                      style={{ border: "1px solid #0077e6" }}
                      width={"100%"}
                      height={"100%"}
                      chartType="PieChart"
                      data={graphData?.data || []}
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
                      rootProps={{ "data-testid": item.i }}
                    />
                  )}
                  {item.i === "2" && (
                    <Chart
                      key={`chart-${item.i}-${item.x}-${item.y}`}
                      width={"100%"}
                      height={"100%"}
                      chartType="BarChart"
                      data={graphData?.data || []}
                      style={{ border: "1px solid #0077e6" }}
                      options={{
                        title: "Sector and Intensity",
                        chartArea: { width: "50%" },
                        hAxis: {
                          title: "Intensity",
                          minValue: 0,
                          maxValue: 100,
                        },
                        vAxis: { title: "Sector" },
                      }}
                    />
                  )}
                  {item.i === "3" && (
                    <Chart
                      key={`chart-${item.i}-${item.x}-${item.y}`}
                      chartType="ScatterChart"
                      width="100%"
                      height="100%"
                      data={graphData?.data || []}
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
                  )}
                  {item.i === "4" && (
                    <Chart
                      key={`chart-${item.i}-${item.x}-${item.y}`}
                      width={"100%"}
                      height={"100%"}
                      chartType="GeoChart"
                      style={{ border: "1px solid #0077e6" }}
                      data={graphData?.countryData || []}
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
                      rootProps={{ "data-testid": item.i }}
                    />
                  )}
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        </div>
      </div>
    </>
  );
};

export default New;
