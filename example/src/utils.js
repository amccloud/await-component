export function delay(duration) {
  return (...args) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(...args), duration);
    });
  };
}
