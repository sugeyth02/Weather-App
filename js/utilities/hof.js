const debounce = (callback, delay) => {
  let timeoutID;
  return function (...args) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
const throttle = (callback, delay) => {
  let last = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - last < delay) {
      return;
    }
    last = now;
    return callback(...args);
  };
};

export { debounce, throttle };
