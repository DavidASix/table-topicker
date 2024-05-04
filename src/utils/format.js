export const dateString = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

export const stringElapsedTime = (seconds) => {
  const { m, s } = secondsToTime(seconds);
  // String format seconds to match the options from dropdowns for compare.
  let sec = s;
  while (String(sec).length < 2) {
    sec = "0" + sec;
  }
  return `${m}:${sec}`;
};

export const secondsToTime = (seconds) => {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  return { m, s };
}

export const timeToSeconds = (m, s) => {
  return (m * 60) + s;
}