# await-component

[![NPM version](https://img.shields.io/npm/v/await-component.svg)](https://www.npmjs.com/package/await-component)

Code-splitting with import() and loading boundaries

## Install

```sh
yarn add await-component
```

```js
import {Await, Async} from 'await-component';
```

## Examples

### Using Async(() => <Promise>)

```js
import React from 'react';
import {Await, Async} from 'await-component';

const Container = Async(() => import('./Container'));
const Sum = Async(() => import('./Sum'));

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

### Using JSX Pragma

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

## Changelog

See the [Changelog](/CHANGELOG.md)

## Contributing

See the [Contributors Guide](/CONTRIBUTING.md)

## License

[MIT](/LICENSE)
