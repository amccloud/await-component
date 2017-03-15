/* @jsx Async.createElement */

import React from 'react';
import Spinner from 'react-svg-spinner';
import {Async, Await} from 'await-component';
import {delay} from './utils';

const Container = import('./Container').then(delay(2000));
const Sum = import('./Sum');

export default () => (
  <Await
    loading={<Spinner size={50} thickness={1} />}
    error={<div>ERROR!</div>}>
    <Container>
      <Sum a={1} b={2} />
      <Sum a={2} b={2} />
      <Sum a={5} b={5} />
    </Container>
  </Await>
);
