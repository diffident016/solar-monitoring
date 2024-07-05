import { db } from "../firebase";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { onValue, ref } from "firebase/database";
import { Timestamp } from "firebase/firestore";
import Dashboard from "./pages/Dashboard";

function App() {
  return <Dashboard />;
}

export default App;
