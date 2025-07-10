import dynamic from "next/dynamic";
import React from "react";
import styles from "./LineChart.module.css";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const LineChart = ({ series, categories, title }) => {
  const persianSolarMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const getPersianSolarMonth = (monthNumber) => {
    const monthNum = monthNumber?.split("-")[1];

    return persianSolarMonths[monthNum-1];
  };
  const monthNames = categories.map((category) =>
    getPersianSolarMonth(category)
  );

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
      categories: monthNames || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "14px",
          fontWeight: 400,
          fontFamily: "shabnam, sans-serif", // Use Shabnam font for x-axis labels
        },
      },
    },
    yaxis: {
      show: false,
    },
    colors: ["#9CA3AF"],
    tooltip: {
      enabled: true,
       style: {
        fontSize: "12px",
        fontFamily: "shabnam, sans-serif", // Vazir font for tooltip
      },
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
        <h3 className={styles.title}>{title} </h3>
        <div className={styles.metrics}>
          <span className={styles.mainMetric}>+{series[0].data.reduce((prev, curr) => prev + curr, 0)}</span>
         
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ApexCharts
          options={options}
          series={series}
          type="area"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default LineChart;
