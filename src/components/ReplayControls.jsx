/* eslint-disable react/prop-types */
import { format } from "date-fns";
import drive from "../assets/images/google-drive.png";

const SPEEDS = [1, 2, 5, 10];

function ReplayControls({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  speed,
  onSpeedChange,
  currentTimestamp,
  totalRows,
  currentIndex,
  onPickFile,
  fileName,
}) {
  const fileLoaded = totalRows > 0;

  return (
    <div className="w-full bg-[#f8f9fa] rounded-[15px] flex flex-row flex-wrap items-center gap-4 p-6">
      <button
        onClick={onPickFile}
        className="flex flex-row items-center gap-2 bg-[#e9ecef] rounded-md py-2 px-4 text-gray-800 font-semibold text-sm"
      >
        <img src={drive} className="w-4 h-4" />
        Load from Drive
      </button>

      {fileName && (
        <span className="text-sm text-gray-600 truncate max-w-[240px]">
          {fileName}
        </span>
      )}

      <div className="flex flex-row gap-2">
        {!isPlaying ? (
          <button
            disabled={!fileLoaded}
            onClick={onPlay}
            className="bg-[#28a745] disabled:opacity-40 text-white rounded-md py-2 px-4 text-sm font-semibold"
          >
            Play
          </button>
        ) : (
          <button
            onClick={onPause}
            className="bg-[#ffc107] text-gray-800 rounded-md py-2 px-4 text-sm font-semibold"
          >
            Pause
          </button>
        )}
        <button
          disabled={!fileLoaded}
          onClick={onStop}
          className="bg-[#dc3545] disabled:opacity-40 text-white rounded-md py-2 px-4 text-sm font-semibold"
        >
          Stop
        </button>
      </div>

      <div className="flex flex-row items-center gap-2">
        <span className="text-sm text-gray-600">Speed:</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`rounded-md py-1 px-3 text-sm font-semibold ${
              speed === s
                ? "bg-[#343a40] text-white"
                : "bg-[#e9ecef] text-gray-800"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {fileLoaded && (
        <div className="flex flex-row items-center gap-4 ml-auto">
          <span className="text-sm text-gray-600">
            {currentIndex} / {totalRows}
          </span>
          {currentTimestamp && (
            <span className="text-sm font-semibold text-gray-800">
              {format(currentTimestamp, "yyyy-MM-dd HH:mm:ss")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ReplayControls;
