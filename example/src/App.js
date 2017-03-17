/* @jsx Async.createElement */
import React from 'react';
import Spinner from 'react-svg-spinner';
import {Async, Await} from 'await-component';
import {delay} from './utils';

// Delays added to mimic network latency
const Container = import('./Container').then(delay(1000));
const Sum = import('./Sum').then(delay(2000));

export default () => (
  <Await
    loading={<Spinner size="50" thickness={1} />}
    error={<div>ERROR!</div>}>
    <Container>
      <div>Sums:</div>
      <Sum a={1} b={2} />
      <Sum a={2} b={2} />
      <Sum a={5} b={5} />
    </Container>
  </Await>
);
