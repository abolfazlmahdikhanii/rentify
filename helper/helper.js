export const saveStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
export const getStorage = (key) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};

export const timeFormat = (time) => {
  const min=Math.floor(time / 60);
  const sec = time % 60;
  return `${min < 10 ? "0" + min : min}:${
    sec < 10 ? "0" + sec : sec
  }`;
}

export const toastOption={
          className: "custom-toast",
          delay: 300,
          closeButton: false,
          progress: 0,
          position: "top-center",
          hideProgressBar: true,
        }