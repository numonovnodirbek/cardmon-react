export const getCurrentMonth = () => {
  let date = new Date();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  return date.getFullYear() + "-" + month;
};

export const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const getCurrentTime = () => {
  return new Date().toLocaleTimeString("it-IT").slice(0, -3);
};
