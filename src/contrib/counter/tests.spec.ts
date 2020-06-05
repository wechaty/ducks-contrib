#!/usr/bin/env ts-node

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
import test from 'tstest'

import {
  validateDucksApi,
  Ducks,
}                       from 'ducks'
import { Wechaty }       from 'wechaty'
import {
  PuppetMock,
  Mocker,
}                       from 'wechaty-puppet-mock'

import {
  WechatyRedux,
  Api as WechatyApi,
}                     from 'wechaty-redux'

import * as CounterApi from '.'

function createFixture () {
  const ducks = new Ducks({
    counter: CounterApi,
    wechaty: WechatyApi,
  })
  const counterDuck = ducks.ducksify('counter')

  const store = ducks.configureStore()
  store.subscribe(() => console.info(store.getState()))

  const mocker = new Mocker()
  const puppet = new PuppetMock({ mocker })

  const bot = Wechaty.instance({ puppet })
  bot.use(WechatyRedux({ store }))

  const [ mary, mike ]  = mocker.createContacts(2)
  const user            = mocker.createContact()

  const [ shop, yard ] = mocker.createRooms(2)
  const group = mocker.createRoom({
    memberIdList: [
      mike.id,
      mary.id,
      user.id,
    ],
  })

  return {
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
}

test('validateDucksApi(counter)', async t => {
  t.doesNotThrow(() => validateDucksApi(CounterApi), 'should pass the ducks api validating')
})

test('Counter selector & operations', async t => {
  const WECHATY_ID = 'wechaty-id'

  const ducks = new Ducks({ counter: CounterApi })
  const duck = ducks.ducksify('counter')

  ducks.configureStore()

  t.is(duck.selectors.getMo(), 0, 'should be 0 for mo with initialized state')
  t.is(duck.selectors.getMt(), 0, 'should be 0 for mt with initialized state')

  duck.operations.mo(WECHATY_ID)
  t.is(duck.selectors.getMo(), 1, 'should be 1 for mo with 1 operations.mo()')
  t.is(duck.selectors.getMt(), 0, 'should be 0 for mt with 1 operations.mo()')

  duck.operations.mt(WECHATY_ID)
  t.is(duck.selectors.getMo(), 1, 'should be 1 for mo with 2 operations.mt()')
  t.is(duck.selectors.getMt(), 1, 'should be 1 for mt with 2 operations.mt()')
})

test('Counter epics', async (t) => {
  const {
    bot,
    mocker,
    user,
    mike,
    counterDuck,
  }               = createFixture()

  await bot.start()

  mocker.scan('fasdfasdfs')
  mocker.login(user)

  t.equal(counterDuck.selectors.getMo(), 0, 'should be 0 for mo with initialized state')
  t.equal(counterDuck.selectors.getMt(), 0, 'should be 0 for mt with initialized state')

  // counterDuck.operations.mo(WECHATY_ID)
  user.say('fasfdsf').to(mike)
  t.equal(counterDuck.selectors.getMo(), 1, 'should increase to 1 for mo after user.say()')
  t.equal(counterDuck.selectors.getMt(), 0, 'should stay 0 for mt after user.say()')

  // counterDuck.operations.mt(WECHATY_ID)
  mike.say('fdafas').to(user)
  t.equal(counterDuck.selectors.getMo(), 1, 'should stay 1 for mo after mike.say()')
  t.equal(counterDuck.selectors.getMt(), 1, 'should increase to 1 for mt after mike.say()')

  await bot.stop()
})
