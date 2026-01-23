import { format } from "date-fns";
import React from "react";
import ReactApexChart from "react-apexcharts";

function Chart({ id, data, title, y_title }) {
  return (
    <ReactApexChart
      className="text-white"
      options={{
        theme: {
          mode: "light",
        },
        chart: {
          id: id,
          height: 350,
          type: "line",
          foreColor: "#343a40",
          background: "transparent",
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 1000,
            },
          },
        },
        markers: {
          size: 0,
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          width: 1,
          // curve: "smooth",
        },
        xaxis: {
          type: "datetime",
          tickAmount: 30,
          style: {
            fontFamily: "Lato",
            color: "#343a40",
          },

          labels: {
            formatter: (val) => {
              return format(val, "E hh:mm:ss");
            },
          },
        },
        yaxis: {
          title: {
            text: y_title,
            style: {
              fontFamily: "Lato-bold",
              fontSize: "12px",
              color: "#343a40",
            },
          },
          min: 0,
          max: 300,
        },
        title: {
          text: title,
          align: "left",
          style: {
            fontFamily: "Lato",
            fontSize: "18px",
            color: "#343a40",
          },
        },

        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            gradientToColors: ["#007bff"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
          },
        },
        tooltip: {
          enabled: false,
        },
      }}
      series={data}
      type="line"
      height={350}
    />
  );
}

export default Chart;
