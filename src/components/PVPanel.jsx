import React from "react";
import panel from "../assets/images/panel.png";

function PVPanel({ id, status, data }) {
  return (
    <div className="w-full h-[350px] bg-[#f8f9fa] rounded-[15px] flex flex-col p-8 gap-4">
      <div className="flex flex-row h-[60%] w-full gap-4">
        <div className="w-full h-full gap-4 flex flex-col">
          <h1 className="text-2xl font-lato-bold w-[90px] text-gray-800">
            PV Panel {id}
          </h1>
          <div className="w-full h-full px-4 py-3 flex items-center flex-row bg-[#e9ecef] rounded-[7.5px] justify-between">
            <div className="w-full flex flex-col">
              <p className="font-lato-light text-sm text-gray-600">Status</p>
              <p className="font-lato-bold text-lg text-gray-800">
                {status ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="w-full flex flex-col ">
              <p className="font-lato-light text-sm text-gray-600">
                Temperature
              </p>
              <p className="font-lato-bold text-lg text-gray-800">
                {data["temperature"].toFixed(1)} &deg;C
              </p>
            </div>
          </div>
        </div>

        <div className="ease-in-out duration-500 w-[80%] bg-[#e9ecef] rounded-[7.5px] flex items-center justify-center">
          <img
            className={`${status ? "opacity-100" : "opacity-50"}`}
            src={panel}
          />
        </div>
      </div>
      <div className="w-full h-[40%] bg-[#e9ecef] justify-between rounded-[7.5px] grid grid-cols-3 py-6 px-4">
        <div className="w-full flex flex-col gap-1">
          <p className="font-lato-light text-sm text-gray-600">Voltage</p>
          <p className="font-lato-bold text-xl text-gray-800">
            {data["voltage"].toFixed(1)} volts
          </p>
        </div>
        <div className="w-full flex flex-col gap-1">
          <p className="font-lato-light text-sm text-gray-600">Current</p>
          <p className="font-lato-bold text-xl text-gray-800">
            {data["current"].toFixed(1)} amps
          </p>
        </div>
        <div className="w-full flex flex-col gap-1">
          <p className="font-lato-light text-sm text-gray-600">Power</p>
          <p className="font-lato-bold text-xl text-gray-800">
            {data["power"].toFixed(1)} watts
          </p>
        </div>
      </div>
    </div>
  );
}

export default PVPanel;
