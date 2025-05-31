import dynamic from "next/dynamic";
import React from "react";
import styles from "./ColumnChart.module.css";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const ColumnChart = ({ series, categories, title }) => {
  const options = {
    chart: {
      type: "bar",
      height: 200,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 2,
        distributed: false,
        horizontal: false,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
      stroke: {
        show: true,
        width: 5,
        colors: ["#f65"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
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
    colors: ["#E5E7EB"],
    tooltip: {
      enabled: false,
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Client Acquisition by Month</h3>
        <div className={styles.metrics}>
          <span className={styles.mainMetric}>+8%</span>
          <span className={styles.subMetric}>
            This Year <span className={styles.positive}>+8%</span>
          </span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ApexCharts
          options={options}
          series={series || []}
          type="bar"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default ColumnChart;
