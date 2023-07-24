"use client"
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { graphContext, GraphData } from "@/app/layout";
import Chart from "react-google-charts";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardData {
  id: string;
  name: string;
  date: string;
  layout: { lg: Layout[] };
}

const EditDashboard: React.FC = () => {
  const router = useRouter();
  const { dashboardId } = useParams();

  const graphData = useContext<GraphData | null>(graphContext);

  const [dashboardName, setDashboardName] = useState<string>("");
  const [gridLayout, setGridLayout] = useState<{ lg: Layout[] } | null>(null);

  useEffect(() => {
    const savedDashboards: DashboardData[] = JSON.parse(
      localStorage.getItem("dashboards") || "[]"
    );

    const dashboard = savedDashboards.find(
      (dashboard) => dashboard.id === dashboardId
    );

    if (dashboard) {
      const { name, layout } = dashboard;
      setDashboardName(name);
      setGridLayout(layout);
    } else {
      console.log("Dashboard Data not found for id:", dashboardId);
    }
  }, [dashboardId]);

  if (!gridLayout) {
    return <div>Loading...</div>;
  }

  const handleLayoutChange = (layout: Layout[], layouts: { lg: Layout[] }): void => {
    setGridLayout({ ...gridLayout, lg: layout });

    const sizeData: { [key: string]: { w: number; h: number } } = {};
    layout.forEach((item) => {
      sizeData[item.i] = { w: item.w, h: item.h };
    });
    
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const dashboardData: DashboardData = {
      id: dashboardId,
      name: dashboardName,
      date: formattedDate,
      layout: { lg: layout },
    };

    const savedDashboards: DashboardData[] = JSON.parse(
      localStorage.getItem("dashboards") || "[]"
    );
    const existingDashboardIndex = savedDashboards.findIndex(
      (dashboard) => dashboard.id === dashboardId
    );

    if (existingDashboardIndex >= 0) {
      savedDashboards[existingDashboardIndex] = dashboardData;
    } else {
      savedDashboards.push(dashboardData);
    }
    localStorage.setItem("dashboards", JSON.stringify(savedDashboards));
    localStorage.setItem("cell_sizes", JSON.stringify(sizeData));
    alert("Dashboard updated!");
  };

  return (
    <>
      <div className="w-full bg-blue-950 px-5 py-2">
        <form
          onSubmit={() => handleLayoutChange(gridLayout.lg, gridLayout)}
          className="flex p-2 w-full "
        >
          <label htmlFor="name" className="text-white m-2 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border py-2 px-3 focus:outline-none focus:border-blue-500 flex-grow"
            placeholder="Enter name for your dashboard"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 ml-2 text-white font-bold py-2 px-4  hover:bg-blue-800"
          >
            Save My Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              router.push("/");
            }}
            className="bg-red-500 ml-2 text-white font-bold py-2 px-4  hover:bg-red-800 "
          >
            Back
          </button>
        </form>
      </div>

      <div className="flex h-100 justify-center items-center">
        <div className="w-3/4 p-4 mt-4">
          <p>Drag the corners to resize, Click and drag to move</p>
          <div className="w-100 h-80 p-4 ">
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: gridLayout.lg }}
              breakpoints={{ lg: 1200 }}
              cols={{ lg: 2 }}
              rowHeight={220}
              isResizable={true}
              margin={[10, 10]}
              containerPadding={[10, 10]}
              onLayoutChange={(layout) =>
                setGridLayout({ ...gridLayout, lg: layout })
              }
            >
              <div key="1" className="bg-gray-200 p-0">
                <Chart
                  key={`chart-1-${gridLayout.lg[0].x}-${gridLayout.lg[0].y}`}
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
                  rootProps={{ "data-testid": "1" }}
                />
              </div>
              <div key="2" className="bg-gray-300">
                <Chart
                  key={`chart-2-${gridLayout.lg[1].x}-${gridLayout.lg[1].y}`}
                  width={"100%"}
                  height={"100%"}
                  chartType="BarChart"
                  data={graphData?.data || []}
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
                  chartType="ScatterChart"
                  key={`chart-3-${gridLayout.lg[2].x}-${gridLayout.lg[2].y}`}
                  height="100%"
                  data={graphData?.data || []}
                  style={{ border: "1px solid #0077e6" }}
                  options={{
                    title: "Correlation between Region, Relevance and Intensity",
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

export default EditDashboard;
