import dynamic from "next/dynamic";
import React from "react";
import styles from "./LineChart.module.css";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const LineChart = ({ series, categories, title }) => {
  const options = {
    chart: {
      type: "area",
      height: 120,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      show: false,
    },
    colors: ["#9CA3AF"],
    tooltip: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.1,
        gradientToColors: ["#F2F2F2"],
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Property Sales Over Time</h3>
        <div className={styles.metrics}>
          <span className={styles.mainMetric}>+15%</span>
          <span className={styles.subMetric}>
            Last 6 Months <span className={styles.positive}>+15%</span>
          </span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ApexCharts options={options} series={series} type="area" height={"100%"} />
      </div>
    </div>
  );
};

export default LineChart;
