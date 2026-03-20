/* global ApexCharts */
import { useEffect, useReducer, useState } from "react";
import { onValue, ref, set, get } from "firebase/database";
import { db } from "../../firebase";
import { format } from "date-fns";
import Chart from "../components/Chart";
import { useInterval } from "../components/useInterval";
import inverter from "../assets/images/inverter.png";
import solar from "../assets/images/sunny.png";
import RadianceChart from "../components/RadianceChart";
import drive from "../assets/images/google-drive.png";
import ReplayControls from "../components/ReplayControls";
import { parseCSV, classifyRows, buildTimeline } from "../utils/csvParser";
import {
  initTokenClient,
  openPicker,
  downloadFile,
} from "../utils/drivePicker";

function Dashboard() {
  var timer1 = null;
  var timer2 = null;
  var timer4 = null;
  var timer5 = null;

  let [voltage1, setVoltage1] = useState(0);
  let [voltage2, setVoltage2] = useState(0);
  let [voltage4, setVoltage4] = useState(0);
  let [radiance, setRadiance] = useState(0);
  let [data1, setData1] = useState([{ x: new Date(), y: 0 }]);
  let [data2, setData2] = useState([{ x: new Date(), y: 0 }]);
  let [data4, setData4] = useState([{ x: new Date(), y: 0 }]);
  let [data5, setData5] = useState([{ x: new Date(), y: [0, 0, 0, 0, 0] }]);

  // Additional data arrays for current, frequency, and power
  let [current1, setCurrent1] = useState([{ x: new Date(), y: 0 }]);
  let [current2, setCurrent2] = useState([{ x: new Date(), y: 0 }]);
  let [power1, setPower1] = useState([{ x: new Date(), y: 0 }]);
  let [power2, setPower2] = useState([{ x: new Date(), y: 0 }]);
  let [frequency, setFrequency] = useState([{ x: new Date(), y: 0 }]);
  let [powerAC, setPowerAC] = useState([{ x: new Date(), y: 0 }]);
  const [recording, setRecording] = useState(0);

  // Replay state
  const [mode, setMode] = useState("live"); // 'live' | 'replay'
  const [timeline, setTimeline] = useState([]);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [replayFileName, setReplayFileName] = useState("");

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
    },
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
    },
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
    },
  );

  const [R1, updateR1] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      status: false,
      radiance: 0,
    },
  );

  useEffect(() => {
    if (mode === "replay") return;
    const query = ref(db, "/NODE-01");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
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
  }, [mode]);

  useEffect(() => {
    if (mode === "replay") return;
    const query = ref(db, "/NODE-02");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
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
  }, [mode]);

  useEffect(() => {
    if (mode === "replay") return;
    const query = ref(db, "/NODE-04");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
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
  }, [mode]);

  useEffect(() => {
    if (mode === "replay") return;
    const query = ref(db, "/NODE-05");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        setRadiance(data["radiance"]);
        updateR1({
          status: true,
          radiance: data["radiance"],
        });
      }

      if (timer5) {
        clearTimeout(timer5);
        timer5 = null;
      }

      timer5 = setTimeout(() => {
        setRadiance(0);
        updateR1({
          status: false,
          radiance: 0,
        });
      }, 10000);
    });
  }, [mode]);

  useEffect(() => {
    const query = ref(db, "/RECORDING");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        setRecording(data["recording"]);
      }
    });
  }, []);

  // Live PV chart interval
  useInterval(() => {
    var temp = data1;
    if (temp.length >= 30) {
      temp.shift();
    }
    temp.push({ x: new Date(), y: voltage1.toFixed(2) });
    setData1(temp);

    temp = data2;
    if (temp.length >= 30) {
      temp.shift();
    }
    temp.push({ x: new Date(), y: voltage2.toFixed(2) });
    setData2(temp);

    // Update current data for PV Panel 1
    var tempCurrent1 = current1;
    if (tempCurrent1.length >= 30) {
      tempCurrent1.shift();
    }
    tempCurrent1.push({ x: new Date(), y: panel1["current"] });
    setCurrent1(tempCurrent1);

    // Update current data for PV Panel 2
    var tempCurrent2 = current2;
    if (tempCurrent2.length >= 30) {
      tempCurrent2.shift();
    }
    tempCurrent2.push({ x: new Date(), y: panel2["current"] });
    setCurrent2(tempCurrent2);

    // Update power data for PV Panel 1
    var tempPower1 = power1;
    if (tempPower1.length >= 30) {
      tempPower1.shift();
    }
    tempPower1.push({ x: new Date(), y: panel1["power"] });
    setPower1(tempPower1);

    // Update power data for PV Panel 2
    var tempPower2 = power2;
    if (tempPower2.length >= 30) {
      tempPower2.shift();
    }
    tempPower2.push({ x: new Date(), y: panel2["power"] });
    setPower2(tempPower2);

    ApexCharts.exec("pv-chart-1", "updateSeries", [
      {
        name: "PV Panel 1 Voltage",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: data1,
      },
      {
        name: "PV Panel 1 Current",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: current1,
      },
      {
        name: "PV Panel 1 Power",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: power1,
      },
    ]);

    ApexCharts.exec("pv-chart-2", "updateSeries", [
      {
        name: "PV Panel 2 Voltage",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: data2,
      },
      {
        name: "PV Panel 2 Current",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: current2,
      },
      {
        name: "PV Panel 2 Power",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: power2,
      },
    ]);
  }, mode === "live" ? 1000 : null);

  // Live AC/inverter chart interval
  useInterval(() => {
    var temp = data4;
    if (temp.length >= 30) {
      temp.shift();
    }
    temp.push({ x: new Date(), y: voltage4 });
    setData4(temp);

    // Update frequency data for Inverter
    var tempFrequency = frequency;
    if (tempFrequency.length >= 30) {
      tempFrequency.shift();
    }
    tempFrequency.push({ x: new Date(), y: AC1["frequency"] });
    setFrequency(tempFrequency);

    // Update power data for Inverter
    var tempPowerAC = powerAC;
    if (tempPowerAC.length >= 30) {
      tempPowerAC.shift();
    }
    tempPowerAC.push({ x: new Date(), y: AC1["power"] });
    setPowerAC(tempPowerAC);

    ApexCharts.exec("ac-chart", "updateSeries", [
      {
        name: "Inverter Voltage",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: data4,
      },
      {
        name: "Inverter Frequency",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: frequency,
      },
      {
        name: "Inverter Power",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: powerAC,
      },
    ]);
  }, mode === "live" ? 1000 : null);

  // Live radiance chart interval
  useInterval(() => {
    var temp = data5;
    if (temp.length >= 30) {
      temp.shift();
    }
    temp.push({ x: new Date(), y: R1["radiance"] });
    setData5(temp);

    ApexCharts.exec("radiance-chart", "updateSeries", [
      {
        name: "Radiation",
        style: {
          fontFamily: "Lato",
          fontSize: "14px",
          color: "#343a40",
        },
        data: data5,
      },
    ]);
  }, mode === "live" ? 2000 : null);

  // Replay interval — ticks through timeline row by row
  useInterval(() => {
    if (replayIndex >= timeline.length) {
      setIsPlaying(false);
      return;
    }

    const row = timeline[replayIndex];
    const ts = row.timestamp;

    if (row.node === "NODE-01") {
      const v = parseFloat(row["voltage"]);
      const c = parseFloat(row["current"]);
      const p = parseFloat(row["power"]);
      const t = parseFloat(row["temperature"]);

      setVoltage1(v);
      updatePanel1({ status: true, voltage: v, current: c, power: p, temperature: t });

      const newD1 = data1.length >= 30 ? data1.slice(1) : [...data1];
      newD1.push({ x: ts, y: parseFloat(v.toFixed(2)) });
      setData1(newD1);

      const newC1 = current1.length >= 30 ? current1.slice(1) : [...current1];
      newC1.push({ x: ts, y: c });
      setCurrent1(newC1);

      const newP1 = power1.length >= 30 ? power1.slice(1) : [...power1];
      newP1.push({ x: ts, y: p });
      setPower1(newP1);

      ApexCharts.exec("pv-chart-1", "updateSeries", [
        { name: "PV Panel 1 Voltage", data: newD1 },
        { name: "PV Panel 1 Current", data: newC1 },
        { name: "PV Panel 1 Power", data: newP1 },
      ]);
    } else if (row.node === "NODE-02") {
      const v = parseFloat(row["voltage"]);
      const c = parseFloat(row["current"]);
      const p = parseFloat(row["power"]);
      const t = parseFloat(row["temperature"]);

      setVoltage2(v);
      updatePanel2({ status: true, voltage: v, current: c, power: p, temperature: t });

      const newD2 = data2.length >= 30 ? data2.slice(1) : [...data2];
      newD2.push({ x: ts, y: parseFloat(v.toFixed(2)) });
      setData2(newD2);

      const newC2 = current2.length >= 30 ? current2.slice(1) : [...current2];
      newC2.push({ x: ts, y: c });
      setCurrent2(newC2);

      const newP2 = power2.length >= 30 ? power2.slice(1) : [...power2];
      newP2.push({ x: ts, y: p });
      setPower2(newP2);

      ApexCharts.exec("pv-chart-2", "updateSeries", [
        { name: "PV Panel 2 Voltage", data: newD2 },
        { name: "PV Panel 2 Current", data: newC2 },
        { name: "PV Panel 2 Power", data: newP2 },
      ]);
    } else if (row.node === "NODE-04") {
      const v = parseFloat(row["voltage"]);
      const c = parseFloat(row["current"]);
      const p = parseFloat(row["power"]);
      const f = parseFloat(row["frequency"]);

      setVoltage4(v);
      updateAC1({ status: true, voltage: v, current: c, power: p, frequency: f, temperature: 0 });

      const newD4 = data4.length >= 30 ? data4.slice(1) : [...data4];
      newD4.push({ x: ts, y: v });
      setData4(newD4);

      const newFreq = frequency.length >= 30 ? frequency.slice(1) : [...frequency];
      newFreq.push({ x: ts, y: f });
      setFrequency(newFreq);

      const newPac = powerAC.length >= 30 ? powerAC.slice(1) : [...powerAC];
      newPac.push({ x: ts, y: p });
      setPowerAC(newPac);

      ApexCharts.exec("ac-chart", "updateSeries", [
        { name: "Inverter Voltage", data: newD4 },
        { name: "Inverter Frequency", data: newFreq },
        { name: "Inverter Power", data: newPac },
      ]);
    } else if (row.node === "NODE-05") {
      const r = parseFloat(row["radiance"]);

      setRadiance(r);
      updateR1({ status: true, radiance: r });

      const newD5 = data5.length >= 30 ? data5.slice(1) : [...data5];
      newD5.push({ x: ts, y: r });
      setData5(newD5);

      ApexCharts.exec("radiance-chart", "updateSeries", [
        { name: "Radiation", data: newD5 },
      ]);
    }

    setReplayIndex(replayIndex + 1);
  }, mode === "replay" && isPlaying ? Math.round(1000 / replaySpeed) : null);

  const resetChartData = (initTimestamp = null) => {
    const t = initTimestamp ?? new Date();
    const initPoint = [{ x: t, y: 0 }];
    setData1([...initPoint]);
    setCurrent1([...initPoint]);
    setPower1([...initPoint]);
    setData2([...initPoint]);
    setCurrent2([...initPoint]);
    setPower2([...initPoint]);
    setData4([...initPoint]);
    setFrequency([...initPoint]);
    setPowerAC([...initPoint]);
    setData5([{ x: t, y: 0 }]);
    setVoltage1(0);
    setVoltage2(0);
    setVoltage4(0);
    setRadiance(0);
    updatePanel1({ status: false, voltage: 0, current: 0, power: 0, temperature: 0 });
    updatePanel2({ status: false, voltage: 0, current: 0, power: 0, temperature: 0 });
    updateAC1({ status: false, voltage: 0, current: 0, power: 0, frequency: 0, temperature: 0 });
    updateR1({ status: false, radiance: 0 });

    ApexCharts.exec("pv-chart-1", "updateSeries", [
      { name: "PV Panel 1 Voltage", data: initPoint },
      { name: "PV Panel 1 Current", data: initPoint },
      { name: "PV Panel 1 Power", data: initPoint },
    ]);
    ApexCharts.exec("pv-chart-2", "updateSeries", [
      { name: "PV Panel 2 Voltage", data: initPoint },
      { name: "PV Panel 2 Current", data: initPoint },
      { name: "PV Panel 2 Power", data: initPoint },
    ]);
    ApexCharts.exec("ac-chart", "updateSeries", [
      { name: "Inverter Voltage", data: initPoint },
      { name: "Inverter Frequency", data: initPoint },
      { name: "Inverter Power", data: initPoint },
    ]);
    ApexCharts.exec("radiance-chart", "updateSeries", [
      { name: "Radiation", data: [{ x: t, y: 0 }] },
    ]);
  };

  const handlePickFile = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_PICKER_API_KEY;
    try {
      const token = await initTokenClient(clientId);
      await openPicker({
        apiKey,
        token,
        onPicked: async (files) => {
          let allRows = [];
          for (const file of files) {
            const csvText = await downloadFile(file.id, token);
            allRows = allRows.concat(parseCSV(csvText));
          }
          const grouped = classifyRows(allRows);
          const tl = buildTimeline(grouped);
          setTimeline(tl);
          setReplayIndex(0);
          setReplayFileName(files.map((f) => f.name).join(", "));
          setIsPlaying(false);
          resetChartData(tl[0]?.timestamp ?? null);
        },
      });
    } catch (err) {
      console.error("Drive picker error:", err);
    }
  };

  const handlePlay = () => {
    setMode("replay");
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setReplayIndex(0);
    resetChartData();
  };

  const handleModeToggle = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    if (newMode === "live") {
      setIsPlaying(false);
      setReplayIndex(0);
      resetChartData();
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      const startedAt = await get(ref(db, "RECORDING/startedAt"));

      set(ref(db, "RECORDING"), {
        recording: 2,
        startedAt: format(startedAt.val() || new Date(), "yyyy-MM-dd HH:mm:ss"),
        endedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });
      setRecording(2);
    } else {
      set(ref(db, "RECORDING"), {
        recording: 1,
        startedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        endedAt: null,
      });
      setRecording(1);
    }
  };

  const currentTimestamp =
    timeline.length > 0 && replayIndex > 0
      ? timeline[Math.min(replayIndex - 1, timeline.length - 1)].timestamp
      : null;

  return (
    <div className="w-full h-full font-lato">
      <div className="w-full flex flex-col p-8 gap-6">
        <div className="w-full bg-[#f8f9fa] rounded-[15px] flex flex-row justify-between p-8 gap-4">
          <h1 className="font-lato-bold text-3xl text-gray-800">
            Solar PV Dashboard
          </h1>
          <div className="flex flex-row gap-4">
            {/* Live / Replay mode toggle */}
            <div className="flex flex-row bg-[#e9ecef] rounded-md overflow-hidden">
              <button
                onClick={() => handleModeToggle("live")}
                className={`py-3 px-5 text-lg font-semibold ${
                  mode === "live"
                    ? "bg-[#343a40] text-white"
                    : "text-gray-800"
                }`}
              >
                Live
              </button>
              <button
                onClick={() => handleModeToggle("replay")}
                className={`py-3 px-5 text-lg font-semibold ${
                  mode === "replay"
                    ? "bg-[#343a40] text-white"
                    : "text-gray-800"
                }`}
              >
                Replay
              </button>
            </div>

            {mode === "live" && (
              <>
                <a
                  href="https://drive.google.com/drive/u/3/folders/17launolGC7baacIu_yyBsh5EVdWbeD_7"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-row text-lg font-semibold items-center gap-3 bg-[#e9ecef] rounded-md py-3 px-4 text-gray-800"
                >
                  <img src={drive} className="w-5 h-5" />
                  Recordings Drive
                </a>
                <button
                  onClick={() => {
                    toggleRecording();
                  }}
                  className="flex flex-row text-lg font-semibold items-center gap-3 bg-[#e9ecef] rounded-md py-3 px-4 text-gray-800"
                >
                  <div
                    className={`rounded-full w-3 h-3 ${
                      recording ? "bg-[#dc3545] animate-ping" : "bg-[#6c757d]"
                    } `}
                  ></div>
                  {recording === 1
                    ? "Stop Recording"
                    : recording === 2
                      ? "Saving..."
                      : "Start Recording"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Replay controls panel */}
        {mode === "replay" && (
          <ReplayControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            speed={replaySpeed}
            onSpeedChange={setReplaySpeed}
            currentTimestamp={currentTimestamp}
            totalRows={timeline.length}
            currentIndex={replayIndex}
            onPickFile={handlePickFile}
            fileName={replayFileName}
          />
        )}

        <div className="w-full h-full flex flex-col gap-4">
          <div className="w-full flex flex-row gap-4">
            <div className="w-[450px] bg-[#f8f9fa] rounded-[15px] p-8 flex flex-col gap-4">
              <div className="w-full h-[40%] flex flex-row justify-between gap-4">
                <div className="w-full h-full flex flex-col gap-2">
                  <h1 className="text-xl font-lato-bold w-[80px] text-gray-800">
                    PV Panel 1
                  </h1>
                  <div className="w-full h-full bg-[#e9ecef] rounded-[7.5px] px-4 py-2 flex items-center flex-row">
                    <div className="w-full flex flex-col">
                      <p className="font-lato-light text-sm text-gray-600">
                        Status
                      </p>
                      <p className="font-lato-bold text-base text-gray-800">
                        {panel1["status"] ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ease-in-out duration-500 w-full bg-[#e9ecef] rounded-[7.5px] flex items-center justify-center">
                  <img
                    className={`${
                      panel1["status"] ? "opacity-100" : "opacity-50"
                    } w-16`}
                    src={inverter}
                  />
                </div>
              </div>
              <div className="w-full h-[60%] flex flex-col gap-4">
                <div className="w-full h-full pt-4 px-4 bg-[#e9ecef] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Voltage
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {panel1["voltage"].toFixed(1)} volts
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Current
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {panel1["current"]} amps
                    </p>
                  </div>
                </div>
                <div className="w-full h-full pt-4 px-4 bg-[#e9ecef] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Power
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {panel1["power"]} watts
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Temperature
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {panel1["temperature"]} &deg;C
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-4 bg-[#f8f9fa] rounded-[15px]">
              <Chart
                id="pv-chart-1"
                title={"PV Panel 1 Metrics"}
                y_title={"Values"}
                data={[
                  {
                    name: "PV Panel 1 Voltage",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: data1,
                  },
                  {
                    name: "PV Panel 1 Current",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: current1,
                  },
                  {
                    name: "PV Panel 1 Power",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: power1,
                  },
                ]}
              />
            </div>
          </div>
          <div className="w-full flex flex-row gap-4">
            <div className="w-[450px] bg-[#f8f9fa] rounded-[15px] p-8 flex flex-col gap-4">
              <div className="w-full h-[40%] flex flex-row justify-between gap-4">
                <div className="w-full h-full flex flex-col gap-2">
                  <h1 className="text-xl font-lato-bold w-[80px] text-gray-800">
                    PV Panel 2
                  </h1>
                  <div className="w-full h-full bg-[#e9ecef] rounded-[7.5px] px-4 py-2 flex items-center flex-row">
                    <div className="w-full flex flex-col">
                      <p className="font-lato-light text-sm text-gray-600">
                        Status
                      </p>
                      <p className="font-lato-bold text-base text-gray-800">
                        {panel2["status"] ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ease-in-out duration-500 w-full bg-[#e9ecef] rounded-[7.5px] flex items-center justify-center">
                  <img
                    className={`${
                      panel2["status"] ? "opacity-100" : "opacity-50"
                    } w-16`}
                    src={inverter}
                  />
                </div>
              </div>
              <div className="w-full h-[60%] flex flex-col gap-4">
                <div className="w-full h-full pt-4 px-4 bg-[#e9ecef] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Voltage
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {panel2["voltage"].toFixed(1)} volts
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Current
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {panel2["current"]} amps
                    </p>
                  </div>
                </div>
                <div className="w-full h-full pt-4 px-4 bg-[#e9ecef] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Power
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {panel2["power"]} watts
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Temperature
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {panel2["temperature"]} &deg;C
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-4 bg-[#f8f9fa] rounded-[15px]">
              <Chart
                id="pv-chart-2"
                title={"PV Panel 2 Metrics"}
                y_title={"Values"}
                data={[
                  {
                    name: "PV Panel 2 Voltage",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: data2,
                  },
                  {
                    name: "PV Panel 2 Current",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: current2,
                  },
                  {
                    name: "PV Panel 2 Power",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: power2,
                  },
                ]}
              />
            </div>
          </div>
          <div className="w-full flex flex-row gap-4">
            <div className="w-[450px] bg-[#f8f9fa] rounded-[15px] p-8 flex flex-col gap-4">
              <div className="w-full h-[40%] flex flex-row justify-between gap-4">
                <div className="w-full h-full flex flex-col gap-2">
                  <h1 className="text-xl font-lato-bold w-[80px] text-gray-800">
                    Inverter 1
                  </h1>
                  <div className="w-full h-full bg-[#e9ecef] rounded-[7.5px] px-4 py-2 flex items-center flex-row">
                    <div className="w-full flex flex-col">
                      <p className="font-lato-light text-sm text-gray-600">
                        Status
                      </p>
                      <p className="font-lato-bold text-base text-gray-800">
                        {AC1["status"] ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ease-in-out duration-500 w-full bg-[#e9ecef] rounded-[7.5px] flex items-center justify-center">
                  <img
                    className={`${
                      AC1["status"] ? "opacity-100" : "opacity-50"
                    } w-16`}
                    src={inverter}
                  />
                </div>
              </div>
              <div className="w-full h-[60%] flex flex-col gap-4">
                <div className="w-full h-full pt-4 px-4 bg-[#e9ecef] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Voltage
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {AC1["voltage"].toFixed(1)} volts
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Frequency
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {AC1["frequency"]} Hz
                    </p>
                  </div>
                </div>
                <div className="w-full h-full pt-4 px-4 bg-[#e9ecef] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Current
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {AC1["current"]} amps
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Power
                    </p>
                    <p className="font-lato-bold text-lg text-gray-800">
                      {AC1["power"]} watts
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-4 bg-[#f8f9fa] rounded-[15px] ">
              <Chart
                id="ac-chart"
                title={"Inverter Metrics"}
                y_title={"Values"}
                data={[
                  {
                    name: "Inverter Voltage",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: data4,
                  },
                  {
                    name: "Inverter Frequency",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: frequency,
                  },
                  {
                    name: "Inverter Power",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#fff",
                    },
                    data: powerAC,
                  },
                ]}
              />
            </div>
          </div>
          <div className="w-full flex flex-row gap-4">
            <div className="w-[450px] bg-[#f8f9fa] rounded-[15px] p-8 flex flex-col gap-4">
              <div className="w-full h-[40%] flex flex-row justify-between gap-4">
                <div className="w-full h-full flex flex-col gap-2">
                  <h1 className="text-xl font-lato-bold w-[80px] text-gray-800">
                    Pyranometer
                  </h1>
                  <div className="w-full h-full bg-[#e9ecef] rounded-[7.5px] px-4 py-2 flex items-center flex-row">
                    <div className="w-full flex flex-col">
                      <p className="font-lato-light text-sm text-gray-600">
                        Status
                      </p>
                      <p className="font-lato-bold text-base text-gray-800">
                        {R1["status"] ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ease-in-out duration-500 w-full bg-[#e9ecef] rounded-[7.5px] flex items-center justify-center">
                  <img
                    className={`${
                      R1["status"] ? "opacity-100" : "opacity-50"
                    } w-16`}
                    src={solar}
                  />
                </div>
              </div>
              <div className="w-full h-[60%] flex flex-col gap-4">
                <div className="w-full h-full pt-4 px-4 bg-[#e9ecef] rounded-[7.5px] grid grid-cols-2">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-lato-light text-sm text-gray-600">
                      Solar Radiation
                    </p>
                    <p className="font-lato-bold text-xl text-gray-800">
                      {radiance} W/m²
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-4 bg-[#f8f9fa] rounded-[15px] ">
              <RadianceChart
                id="radiance-chart"
                title={"Solar Radiation"}
                y_title={"Radiation"}
                data={[
                  {
                    name: "Radiation",
                    style: {
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#343a40",
                    },
                    data: data5,
                  },
                ]}
              />
            </div>
          </div>
          <div className="w-full bg-[#f8f9fa] rounded-[15px] p-8 flex flex-col gap-4">
            <h1 className="text-xl font-lato-bold text-gray-800">Carbon Emissions</h1>
            <div className="w-full grid grid-cols-3 gap-4">
              <div className="bg-[#e9ecef] rounded-[7.5px] pt-4 px-4 pb-4 flex flex-col gap-1">
                <p className="font-lato-light text-sm text-gray-600">Energy Generated (EG)</p>
                <p className="font-lato-bold text-lg text-gray-800">{(AC1["power"] / 1000).toFixed(4)} kWh</p>
              </div>
              <div className="bg-[#e9ecef] rounded-[7.5px] pt-4 px-4 pb-4 flex flex-col gap-1">
                <p className="font-lato-light text-sm text-gray-600">Emission Factor (EF<sub>grid</sub>)</p>
                <p className="font-lato-bold text-lg text-gray-800">0.551 kgCO₂/kWh</p>
              </div>
              <div className="bg-[#e9ecef] rounded-[7.5px] pt-4 px-4 pb-4 flex flex-col gap-1">
                <p className="font-lato-light text-sm text-gray-600">Baseline Emissions (BE)</p>
                <p className="font-lato-bold text-lg text-gray-800">{((AC1["power"] / 1000) * 0.551).toFixed(4)} kgCO₂</p>
              </div>
            </div>
            <p className="font-lato-light text-xs text-gray-500">
              BE = EG × EF<sub>grid</sub> &nbsp;|&nbsp; EG = Inverter Power / 1000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
