import {createElement} from 'react';
import AsyncContainer from './AsyncContainer';

export default function createAsyncElement(type, config, ...children) {
  if (typeof type.then !== 'function') {
    return createElement(type, config, ...children); // NO-OP
  }

  return createElement(AsyncContainer, {
    type,
    config,
    children
  });
}
