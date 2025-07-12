import ColumnChart from "@/components/templates/AdminPanel/ColumnChart/ColumnChart";
import { InfoCards } from "@/components/templates/AdminPanel/InfoCard/InfoCard";
import LineChart from "@/components/templates/AdminPanel/LineChart/LineChart";
import Content from "@/components/module/UserPanel/Content/Content";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { getTypeText } from "@/helper/helper";
import { getCookie } from "cookies-next";
import React, { useMemo } from "react";
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  }).then((res) => res.json());

const Dashboard = () => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/api/properties/admin-panel",
    fetcher
  );

  // Process chart data safely
  const chartData = useMemo(() => {
    if (isLoading || error || !data?.data?.charts) {
      return {
        categories: [],
        columnSeries: [],
        lineSeries: [],
        charts: [],
      };
    }

    try {
      const processedCharts = data.data.charts.map((chart) => {
        const labels = Array.isArray(chart?.data?.labels)
          ? chart.data.labels
          : [];
        const datasets = Array.isArray(chart?.data?.datasets)
          ? chart.data.datasets
          : [];

        // Format labels
        const formattedLabels = labels.map((label) => {
       
          return label;
        });

        // Process datasets safely
        const processedDatasets = datasets.map((dataset) => ({
          name: dataset.label || "Data Series",
          data: Array.isArray(dataset.data) ? dataset.data : [],
          color: dataset.borderColor || dataset.backgroundColor || "#4bc0c0",
        }));

        return {
          id: chart.id || Math.random().toString(36).substr(2, 9),
          title: chart.title || "Chart",
          type: chart.chartType || "line",
          categories: formattedLabels,
          datasets: processedDatasets,
        };
      });

      // Separate charts by type
      const lineCharts = processedCharts.filter(
        (chart) => chart.type === "line"
      );
      const columnCharts = processedCharts.filter(
        (chart) => chart.type === "column" || chart.type === "bar"
      );

      return {
        categories:
          columnCharts[0]?.categories || lineCharts[0]?.categories || [],
        columnSeries: columnCharts[0]?.datasets || [],
        lineSeries: lineCharts[0]?.datasets || [],
        charts: processedCharts,
        lineCharts,
        columnCharts,
      };
    } catch (error) {
      console.error("Error processing chart data:", error);
      return {
        categories: [],
        columnSeries: [],
        lineSeries: [],
        charts: [],
      };
    }
  }, [data, isLoading, error]);

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard data</div>;
  return (
    <DashboardLayout title="" role="admin">
      <Content isDashboard={true}>
        <InfoCards data={data.data && data.data.infoBoxes} />
        <div className="panel-main">
          <div className="panel-charts">
            {chartData.columnCharts.length > 0 && (
              <ColumnChart
                series={chartData.columnCharts[0].datasets}
                categories={chartData.columnCharts[0].categories.map((cat) =>
                  getTypeText(cat)
                )}
                colors={chartData.columnCharts[0].datasets.map(
                  (ds) => ds.color
                )}
                title="توزیع املاک بر اساس نوع"
              />
            )}
            {chartData.lineCharts.length > 0 && (
              <LineChart
                series={chartData.lineCharts[0].datasets}
                categories={chartData.lineCharts[0].categories}
                title="اگهی های ایجاد شده در ماه های اخیر"
              />
            )}
          </div>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default Dashboard;
