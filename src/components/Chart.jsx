import { format } from "date-fns";
import React from "react";
import ReactApexChart from "react-apexcharts";

function Chart({ id, data, title, y_title }) {
  return (
    <ReactApexChart
      className="text-white"
      options={{
        theme: {
          mode: "dark",
          palette: "palette1",
        },
        chart: {
          id: id,
          height: 350,
          type: "line",
          foreColor: "#fff",
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
          size: 1,
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          width: 1,
          curve: "smooth",
        },
        xaxis: {
          type: "datetime",
          tickAmount: 30,
          style: {
            fontFamily: "Lato",
            color: "#fff",
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
              color: "#fff",
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
            color: "#fff",
          },
        },

        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            gradientToColors: ["#FDD835"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
          },
        },
      }}
      series={data}
      type="line"
      height={350}
    />
  );
}

export default Chart;
