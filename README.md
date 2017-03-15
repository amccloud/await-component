# await-component

### Example

```js
/* @jsx Async.createElement */

import React from 'react';
import {Await, Async} from 'await-component';

const Container = import('./Container');
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
```
