"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { graphContext, GraphData } from "@/app/layout";
import Chart from "react-google-charts";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import html2canvas from "html2canvas";
import ConfirmationModal from "@/app/widgetModal";
const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardData {
  id: string | string[];
  name: string;
  icon?: string;
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

  const handleLayoutChange = (layout: Layout[], layouts: { lg: Layout[] }): void => {
    setGridLayout({ ...gridLayout, lg: layout });
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [selectedCellId, setSelectedCellId] = useState<string>("");

  const handleCellDelete = (cellId: string): void => {
    setSelectedCellId(cellId);
    setShowConfirmationModal(true);
  };

  const handleCancelDelete = (): void => {
    setShowConfirmationModal(false);
  };

  const handleConfirmDelete = (): void => {
    const updatedLayout = gridLayout?.lg.filter((item) => item.i !== selectedCellId) || [];
    setGridLayout({ lg: updatedLayout });

    setShowConfirmationModal(false);
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    const snapshot = await captureSnapshot();
    saveDashboardData(snapshot);
    alert("Dashboard Updated");
  };
  const gridLayoutRef = useRef<HTMLDivElement>(null);
  const captureSnapshot = async (): Promise<string| undefined> => {
    if (!gridLayoutRef.current) return undefined;

    try {
      const canvas = await html2canvas(gridLayoutRef.current, {
        scale: 1,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error capturing snapshot:", error);
      return "";
    }
  };

  const saveDashboardData = (snapshot: string | undefined): void => {
    const sizeData: { [key: string]: { w: number; h: number } } = {};
    gridLayout?.lg.forEach((item) => {
      sizeData[item.i] = { w: item.w, h: item.h };
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const dashboardData: DashboardData = {
      id: dashboardId,
      icon: snapshot ,
      name: dashboardName,
      date: formattedDate,
      layout: { lg: gridLayout?.lg || [] },
    };

    const savedDashboards: DashboardData[] = JSON.parse(
      localStorage.getItem("dashboards") || "[]"
    );
    const existingDashboardIndex = savedDashboards.findIndex(
      (dashboard) => dashboard.id === dashboardId
    );

    if (existingDashboardIndex >= 0) {
      savedDashboards[existingDashboardIndex] = dashboardData;
    }
    localStorage.setItem("dashboards", JSON.stringify(savedDashboards));
    localStorage.setItem("cell_sizes", JSON.stringify(sizeData));
  };

  if (!gridLayout) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-full bg-purple-800 md:px-5 md:py-2">
        <form onSubmit={(e) => e.preventDefault()} className="flex p-2 w-full">
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
            type="button"
            onClick={handleSave}
            className="bg-blue-500 ml-2 text-white font-bold py-2 px-4 hover:bg-blue-800"
          >
            Save My Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              router.push("/");
            }}
            className="bg-red-500 ml-2 text-white font-bold py-2 px-4 hover:bg-red-800"
          >
            Back
          </button>
        </form>
      </div>

      <div className="flex h-100 w-full justify-center items-center" ref={gridLayoutRef}>
        <div className="md:w-3/4 p-4 mt-4">
          <p>click and drag the bottom-right corners to resize, Click and drag to move</p>
          <div className="w-100 h-80 p-4">
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

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}    
      />
    </>
  );
};

export default EditDashboard;
