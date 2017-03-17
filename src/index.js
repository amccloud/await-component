import Async from './Async';
import Await from './Await';

export {Async, Await};
export function preload(component) {
  if (component.load) {
    component.load();
  }

  return component;
}
