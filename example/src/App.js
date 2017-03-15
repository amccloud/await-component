/* @jsx Async.createElement */

import React from 'react';
import {Async, Await} from 'await-component';
import {delay} from './utils';

const Container = import('./Container').then(delay(2000));
const Sum = import('./Sum');

export default () => (
  <Await loading={<div>Loading...</div>} error={<div>ERROR!</div>}>
    <Container>
      <Sum a={1} b={2} />
      <Sum a={2} b={2} />
      <Sum a={5} b={5} />
    </Container>
  </Await>
);
