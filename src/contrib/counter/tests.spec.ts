#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import { test } from 'tstest'

import {
  validateDuck,
  Ducks,
  noopReducer,
  Api as DucksDuck,
}                       from 'ducks'
import { Wechaty }      from 'wechaty'
import {
  PuppetMock,
  mock,
}                       from 'wechaty-puppet-mock'

import {
  WechatyRedux,
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

import {
  createStore,
  compose,
}                       from 'redux'
import {
  composeWithDevTools,
}                       from 'remote-redux-devtools'

import * as CounterDuck from './mod.js'

// Let the bullets fly...
const bulletsFly = async (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

async function * wechatyFixtures () {
  const ducks = new Ducks({
    counter: CounterDuck,
    wechaty: WechatyDuck,
  })
  const counterDuck = ducks.ducksify('counter')

  let devCompose = compose

  if (process.env['REDUX_DEVTOOLS']) {
    devCompose = composeWithDevTools({
      hostname : 'localhost',
      port     : 8000,
      realtime : true,
      stopOn   : DucksDuck.types.NOOP,
    }) as any
  }

  const ducksEnhancer = ducks.enhancer()
  const store = createStore(
    noopReducer,
    devCompose(
      ducksEnhancer,
    ) as typeof ducksEnhancer,
  )

  // store.subscribe(() => console.info(store.getState()))

  const mocker = new mock.Mocker()
  const puppet = new PuppetMock({ mocker })

  const bot = Wechaty.instance({ puppet })
  bot.use(WechatyRedux({ store }))

  const [mary, mike]  = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
  const user            = mocker.createContact()

  const [shop, yard] = mocker.createRooms(2) as [mock.RoomMock, mock.RoomMock]
  const group = mocker.createRoom({
    memberIdList: [
      mike.id,
      mary.id,
      user.id,
    ],
  })

  await bot.start()

  yield {
    bot,
    counterDuck,
    group,
    mary,
    mike,
    mocker,
    shop,
    user,
    yard,
  }

  await bot.stop()
  // console.info('bot.stop()')

  await bulletsFly()
  store.dispatch(DucksDuck.actions.noop())
  // console.info('noop')
}

test('validateDuck(counter)', async t => {
  t.doesNotThrow(() => validateDuck(CounterDuck), 'should pass the ducks api validating')
})

test('Counter selectors & operations', async t => {
  const WECHATY_ID = 'wechaty-id'

  const ducks = new Ducks({ counter: CounterDuck })
  const duck = ducks.ducksify('counter')

  ducks.configureStore()

  t.is(duck.selectors.getOutgoing(), 0, 'should be 0 for mo with initialized state')
  t.is(duck.selectors.getIncoming(), 0, 'should be 0 for mt with initialized state')

  duck.operations.outgoing(WECHATY_ID)
  t.is(duck.selectors.getOutgoing(), 1, 'should be 1 for mo with 1 operations.mo()')
  t.is(duck.selectors.getIncoming(), 0, 'should be 0 for mt with 1 operations.mo()')

  duck.operations.incoming(WECHATY_ID)
  t.is(duck.selectors.getOutgoing(), 1, 'should be 1 for mo with 2 operations.mt()')
  t.is(duck.selectors.getIncoming(), 1, 'should be 1 for mt with 2 operations.mt()')
})

test('Counter epics', async (t) => {
  for await (const {
    mocker,
    user,
    mike,
    counterDuck,
  } of wechatyFixtures()) {
    mocker.scan('qrcode')
    mocker.login(user)

    t.equal(counterDuck.selectors.getOutgoing(), 0, 'should be 0 for mo with initialized state')
    t.equal(counterDuck.selectors.getIncoming(), 0, 'should be 0 for mt with initialized state')

    user.say('hello').to(mike)
    await bulletsFly()

    t.equal(counterDuck.selectors.getOutgoing(), 1, 'should increase to 1 for mo after user.say()')
    t.equal(counterDuck.selectors.getIncoming(), 0, 'should stay 0 for mt after user.say()')

    mike.say('world').to(user)
    await bulletsFly()
    t.equal(counterDuck.selectors.getOutgoing(), 1, 'should stay 1 for mo after mike.say()')
    t.equal(counterDuck.selectors.getIncoming(), 1, 'should increase to 1 for mt after mike.say()')

    mike.say('good').to(user)
    user.say('morning').to(mike)
    await bulletsFly()
    t.equal(counterDuck.selectors.getOutgoing(), 2, 'should increase MO after user.say()')
    t.equal(counterDuck.selectors.getIncoming(), 2, 'should increase MT after mike.say()')
  }
})
