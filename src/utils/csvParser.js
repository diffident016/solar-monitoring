import { parse as dateParse } from "date-fns";

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length !== headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx];
    });
    rows.push(row);
  }

  return rows;
}

export function classifyRows(rows) {
  const grouped = {};
  for (const row of rows) {
    const node = row["node"];
    if (!node) continue;
    if (!grouped[node]) grouped[node] = [];
    grouped[node].push(row);
  }
  return grouped;
}

function parseTimestamp(ts) {
  if (!ts) return new Date();
  if (/^\d+$/.test(ts)) {
    return new Date(parseInt(ts, 10) * 1000);
  }
  try {
    return dateParse(ts, "yyyy-MM-dd HH:mm:ss", new Date());
  } catch {
    return new Date(ts);
  }
}

export function buildTimeline(groupedRows) {
  const all = [];
  for (const [node, rows] of Object.entries(groupedRows)) {
    for (const row of rows) {
      all.push({ ...row, node, timestamp: parseTimestamp(row["timestamp"]) });
    }
  }
  all.sort((a, b) => a.timestamp - b.timestamp);
  return all;
}
