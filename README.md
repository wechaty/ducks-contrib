# wechaty-ducks-contrib

[![NPM Version](https://img.shields.io/npm/v/wechaty-ducks-contrib?color=brightgreen)](https://www.npmjs.com/package/wechaty-ducks-contrib)
[![NPM](https://github.com/wechaty/wechaty-ducks-contrib/workflows/NPM/badge.svg)](https://github.com/wechaty/wechaty-ducks-contrib/actions?query=workflow%3ANPM)
[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--api-interface)

Wechaty Ducks Contrib

[![Wechaty Ducks Redux](docs/images/ducks-contrib.png)](https://github.com/wechaty/wechaty-ducks-contrib)

> Image Source: [TikZducks](https://www.ctan.org/pkg/tikzducks)

[![Downloads](https://img.shields.io/npm/dm/wechaty-ducks-contrib.svg?style=flat-square)](https://www.npmjs.com/package/wechaty-ducks-contrib)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

## What is Ducks

[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--api-interface)

See [Ducks](https://github.com/huan/ducks)

## Usage

### Install

```sh
npm install wechaty-ducks-contrib
```

### Using Ducks with Wechaty Redux

```ts
import {
  WechatyRedux,
  Duck as wechatyDuck,
}                     from 'wechaty-redux'
import { Wechaty }     from 'wechaty'
import { Ducks }       from 'ducks'

const bot = Wechaty.instance({ puppet: 'wechaty-puppet-mock' })

const ducks       = new Ducks({ wechaty: wechatyDuck })
const store       = ducks.configureStore()
const wechatyDuck = ducks.ducksify('wechaty')

bot.use(WechatyRedux({ store }))

store.subscribe(() => console.info(store.getState()))
store.dispatch(wechatyDuck.actions.ding('redux!'))
```

## Ducks References

### 1 Counter

```ts
import { Counter } from 'wechaty-ducks-contrib'
import { Ducks }       from 'ducks'

const ducks = new Ducks({ counter: Counter })
const counterDuck = ducks.ducksify('counter')

console.info(counterDuck.selectors.getOutgoing())
```

#### 1.1 `selectors`

1. `getOutgoing()`: Get Outgoing (Mobile Originated, MO) messages counter number
1. `getIncoming()`: Get Incoming (Mobile Terminated, MT) messages counter number

Example:

```ts
Counter.selectors.getOutgoing(store.getState().counter)()
// or using Ducksified API:
counterDuck.selectors.getOutgoing()
```

## Example

There's a full example that demonstrate how to use the Wechaty Redux Ducks at [examples/ducks.ts](examples/ducks.ts).

Use the following commands to run this example, and you can inspect the full source code of it to understand how to use Wechaty Redux and Wechaty Ducks.

```sh
git clone git@github.com:wechaty/wechaty-ducks-contrib.git
cd wechaty-ducks-contrib
npm install
npm start
```

## History

### master v0.3 (Sep 19, 2021)

1. ES Modules support

### v0.2 (Jun 5, 2020)

1. `Counter` Ducks released with example and unit tests.

### v0.0.1 (Jun 2, 2020)

[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--api-interface)

Initial version.

1. Requires [Wechaty](https://github.com/wechaty/wechaty) version `0.40` or above.
1. Requires [WechatyRedux](https://github.com/wechaty/wechaty-redux) Plugin.
1. API follows the [Ducks](https://github.com/huan/ducks#readme) proposal specification.
1. Supports [Ducksify](https://github.com/huan/ducks#3-ducksify-extension-currying--api-interface) for using with convenience.

## Contributors

[![contributor](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/images/0)](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/links/0)
[![contributor](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/images/1)](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/links/1)
[![contributor](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/images/2)](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/links/2)
[![contributor](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/images/3)](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/links/3)
[![contributor](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/images/4)](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/links/4)
[![contributor](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/images/5)](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/links/5)
[![contributor](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/images/6)](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/links/6)
[![contributor](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/images/7)](https://sourcerer.io/fame/huan/wechaty/wechaty-ducks-contrib/links/7)

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

- Code & Docs © 2020 Huan (李卓桓) \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
