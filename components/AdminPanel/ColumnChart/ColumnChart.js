import dynamic from "next/dynamic";
import React from "react";
import styles from "./ColumnChart.module.css";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const ColumnChart = ({ series, categories, colors, title, loading }) => {
  // Default colors if not provided
  const chartColors = colors || [
    "#4F46E5",
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
  ];

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
      // background: "transparent", // Fixed: Make chart background transparent
      fontFamily: "shabnam, sans-serif", // Set default font family
    },
    
    stroke:{
      colors: chartColors,

    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 4,
        distributed: false,
        horizontal: false,
        dataLabels: {
          position: "top",
        },
        // colors: colors,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "shabnam, sans-serif", // Vazir font for x-axis labels
          fontWeight: 400,
        },
      },
    },
    fill: {
      opacity: 1,
      colors: colors,
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "shabnam, sans-serif", // Vazir font for y-axis labels
          fontWeight: 400,
        },
      },
    },

    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontFamily: "shabnam, sans-serif", // Vazir font for tooltip
      },
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    legend: {
      fontFamily: "shabnam, sans-serif", // Vazir font for legend
      labels: {
        colors: "#6B7280",
      },
    },
    states: {
      hover: {
        filter: {
          type: "lighten", // Changed from darken to lighten for better visibility
          value: 0.1,
        },
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonMetrics}></div>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.skeletonChart}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {title || "Client Acquisition by Month"}
        </h3>
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
          series={series || [{ data: [] }]}
          type="bar"
          height={"100%"}
        
        />
      </div>
    </div>
  );
};

export default ColumnChart;
