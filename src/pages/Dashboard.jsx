import React, { useEffect, useReducer, useState } from "react";
import PVPanel from "../components/PVPanel";
import ReactApexChart from "react-apexcharts";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import { format } from "date-fns";
import Chart from "../components/Chart";
import { useInterval } from "../components/useInterval";
import inverter from "../assets/images/inverter.png";

function Dashboard() {
  var timer1 = null;
  var timer2 = null;
  var timer3 = null;
  var timer4 = null;

  let [voltage1, setVoltage1] = useState(0);
  let [voltage2, setVoltage2] = useState(0);
  let [voltage3, setVoltage3] = useState(0);
  let [voltage4, setVoltage4] = useState(0);
  let [data1, setData1] = useState([{ x: new Date(), y: 0 }]);
  let [data2, setData2] = useState([{ x: new Date(), y: 0 }]);
  let [data3, setData3] = useState([{ x: new Date(), y: 0 }]);
  let [data4, setData4] = useState([{ x: new Date(), y: 0 }]);

  const [panel1, updatePanel1] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      status: false,
      voltage: 0,
      current: 0,
      power: 0,
      temperature: 0,
    }
  );

  const [panel2, updatePanel2] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      status: false,
      voltage: 0,
      current: 0,
      power: 0,
      temperature: 0,
    }
  );

  const [panel3, updatePanel3] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      status: false,
      voltage: 0,
      current: 0,
      power: 0,
      temperature: 0,
    }
  );

  const [AC1, updateAC1] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      status: false,
      voltage: 0,
      current: 0,
      power: 0,
      frequency: 0,
      temperature: 0,
    }
  );

  useEffect(() => {
    const query = ref(db, "/NODE-01");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        //console.log(new Date(data["timestamp"] * 1000));

        setVoltage1(parseFloat(data["voltage"]));
        updatePanel1({
          status: true,
          voltage: parseFloat(data["voltage"]),
          current: parseFloat(data["current"]),
          power: parseFloat(data["power"]),
          temperature: parseFloat(data["temperature"]),
        });
      }

      if (timer1) {
        clearTimeout(timer1);
        timer1 = null;
      }

      timer1 = setTimeout(() => {
        setVoltage1(0);
        updatePanel1({
          status: false,
          voltage: 0,
          current: 0,
          power: 0,
          temperature: 0,
        });
      }, 5000);
    });
  }, []);

  useEffect(() => {
    const query = ref(db, "/NODE-02");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        //console.log(new Date(data["timestamp"] * 1000));
        setVoltage2(parseFloat(data["voltage"]));
        updatePanel2({
          status: true,
          voltage: parseFloat(data["voltage"]),
          current: parseFloat(data["current"]),
          power: parseFloat(data["power"]),
          temperature: parseFloat(data["temperature"]),
        });
      }

      if (timer2) {
        clearTimeout(timer2);
        timer2 = null;
      }

      timer2 = setTimeout(() => {
        setVoltage2(0);
        updatePanel2({
          status: false,
          voltage: 0,
          current: 0,
          power: 0,
          temperature: 0,
        });
      }, 5000);
    });
  }, []);

  useEffect(() => {
    const query = ref(db, "/NODE-04");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        //console.log(new Date(data["timestamp"] * 1000));
        setVoltage4(parseFloat(data["voltage"]));
        updateAC1({
          status: true,
          voltage: parseFloat(data["voltage"]),
          current: parseFloat(data["current"]),
          power: parseFloat(data["power"]),
          frequency: parseFloat(data["frequency"]),
          temperature: parseFloat(data["temperature"]),
        });
      }

      if (timer4) {
        clearTimeout(timer4);
        timer4 = null;
      }

      timer4 = setTimeout(() => {
        setVoltage4(0);
        updateAC1({
          status: false,
          voltage: 0,
          current: 0,
          power: 0,
          frequency: 0,
          temperature: 0,
        });
      }, 5000);
    });
  }, []);

  useInterval(() => {
    var temp = data1;
    if (temp.length >= 30) {
      temp.shift();
    }

    temp.push({ x: new Date(), y: voltage1 });
    setData1(temp);

    temp = data2;
    if (temp.length >= 30) {
      temp.shift();
    }

    temp.push({ x: new Date(), y: voltage2 });
    setData2(temp);

    ApexCharts.exec("pv-chart", "updateSeries", [
      {
        name: "PV Panel 1",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#fff",
        },
        data: data1,
      },
      {
        name: "PV Panel 2",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#fff",
        },
        data: data2,
      },
    ]);
  }, 1000);

  useInterval(() => {
    var temp = data4;
    if (temp.length >= 30) {
      temp.shift();
    }
    temp.push({ x: new Date(), y: voltage4 });
    setData4(temp);

    ApexCharts.exec("ac-chart", "updateSeries", [
      {
        name: "Inverter 1",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#fff",
        },
        data: data4,
      },
    ]);
  }, 1000);

  return (
    <div className="w-full h-full font-lato">
      <div className="w-full flex flex-col p-8 gap-6">
        <h1 className="font-lato-bold text-3xl">Solar PV Dashboard</h1>
        <div className="w-full h-full flex flex-col gap-4">
          <div className="w-full h-full flex flex-row gap-4 items-center">
            <PVPanel id={1} status={panel1["status"]} data={panel1} />
            <PVPanel id={2} status={panel2["status"]} data={panel2} />
            <PVPanel id={3} status={panel3["status"]} data={panel3} />
          </div>
          <div className="p-4 bg-[#1F1E23] rounded-[15px] ">
            <Chart
              id="pv-chart"
              title={"PV Voltage"}
              y_title={"Voltage DC"}
              data={[
                {
                  name: "PV Panel 1",
                  style: {
                    fontFamily: "Lato",
                    fontSize: "14px",
                    color: "#fff",
                  },
                  data: data1,
                },
                {
                  name: "PV Panel 2",
                  style: {
                    fontFamily: "Lato",
                    fontSize: "14px",
                    color: "#fff",
                  },
                  data: data2,
                },
              ]}
            />
          </div>
          <div className="w-full flex flex-row gap-4">
            <div className="w-[450px] bg-[#1F1E23] rounded-[15px] p-8 flex flex-col gap-4">
              <div className="w-full h-[40%] flex flex-row justify-between gap-4">
                <div className="w-full h-full flex flex-col gap-2">
                  <h1 className="text-xl font-lato-bold w-[80px]">
                    Inverter 1
                  </h1>
                  <div className="w-full h-full bg-[#272A31] rounded-[7.5px] px-4 py-2 flex items-center flex-row">
                    <div className="w-full flex flex-col">
                      <p className="font-lato-light text-sm text-white/70">
                        Status
                      </p>
                      <p className="font-lato-bold text-base">
                        {AC1["status"] ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ease-in-out duration-500 w-full bg-[#272A31] rounded-[7.5px] flex items-center justify-center">
                  <img
                    className={`${
                      AC1["status"] ? "opacity-100" : "opacity-50"
                    } w-16`}
                    src={inverter}
                  />
                </div>
              </div>
              <div className="w-full h-[60%] flex flex-col gap-4">
                <div className="w-full h-full pt-4 px-4 bg-[#272A31] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-white/70">
                      Voltage
                    </p>
                    <p className="font-lato-bold text-lg">
                      {AC1["voltage"]} volts
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-white/70">
                      Frequency
                    </p>
                    <p className="font-lato-bold text-lg">
                      {AC1["frequency"]} Hz
                    </p>
                  </div>
                </div>
                <div className="w-full h-full pt-4 px-4 bg-[#272A31] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-white/70">
                      Current
                    </p>
                    <p className="font-lato-bold text-lg">
                      {AC1["current"]} amps
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-white/70">
                      Power
                    </p>
                    <p className="font-lato-bold text-lg">
                      {AC1["power"]} watts
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-4 bg-[#1F1E23] rounded-[15px] ">
              <Chart
                id="ac-chart"
                title={"Inverter Voltage"}
                y_title={"Voltage AC"}
                data={[
                  {
                    name: "Inverter 1",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: data4,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
