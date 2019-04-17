import { subDays } from "date-fns";

const today = new Date();
const yesterday = subDays(today, 1); // yesterday

const datastreamMetadata = {
  "Water Level": { color: "#007CBF" },
  "Air Pressure": { color: "#FFD700" },
  "Air Temperature": { color: "#BA55D3", unitHtml: "&#8451;" }
};

export { yesterday, today, datastreamMetadata };
