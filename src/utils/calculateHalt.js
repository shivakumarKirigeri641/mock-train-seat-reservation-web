const calculateHalt = (arrival, departure) => {
  if (!arrival || !departure || arrival === "--" || departure === "--")
    return "-";

  const [arrH, arrM] = arrival.split(":").map(Number);
  const [depH, depM] = departure.split(":").map(Number);

  let diff = depH * 60 + depM - (arrH * 60 + arrM);
  if (diff < 0) diff += 24 * 60; // Handle crossing midnight if needed

  return `${diff}m`;
};
export default calculateHalt;
