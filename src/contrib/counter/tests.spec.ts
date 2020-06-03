#!/usr/bin/env ts-node

import { test } from 'tstest'
import { validateDucksApi } from 'ducks'

import * as CounterApi from '.'

import { Wechaty }      from 'wechaty'
import { PuppetMock }   from 'wechaty-puppet-mock'
import { Ducks }        from 'ducks'

import {
  WechatyRedux,
  Api as WechatyApi,
}                     from 'wechaty-redux'

test('validateDucksApi(counter)', async t => {
  t.doesNotThrow(() => validateDucksApi(api), 'should pass the ducks api validating')
})

test('Counter selector & operations', async (t) => {
  const WECHATY_ID = 'wechaty-id'

  const ducks = new Ducks({ counter: CounterApi })
  const duck = ducks.ducksify('counter')

  ducks.configureStore()

  t.equal(duck.selectors.getMo(), 0, 'should be 0 for mo with initialized state')
  t.equal(duck.selectors.getMt(), 0, 'should be 0 for mt with initialized state')

  duck.operations.mo(WECHATY_ID)
  t.equal(duck.selectors.getMo(), 1, 'should be 1 for mo with 1 operations.mo()')
  t.equal(duck.selectors.getMt(), 0, 'should be 0 for mt with 1 operations.mo()')

  duck.operations.mt(WECHATY_ID)
  t.equal(duck.selectors.getMo(), 1, 'should be 1 for mo with 2 operations.mt()')
  t.equal(duck.selectors.getMt(), 1, 'should be 1 for mt with 2 operations.mt()')
})

test('Counter epics', async (t) => {
  const ducks = new Ducks({
    counter: CounterApi,
    wechaty: WechatyApi,
  })
  const duck = ducks.ducksify('counter')

  const store = ducks.configureStore()

  function script (this: PuppetMock) {
    console.info(this.id)
  }
  const puppet = new PuppetMock({
    script,
  })

  const bot = Wechaty.instance({ puppet })
  bot.use(WechatyRedux({ store }))

  store.dispatch(WechatyApi.actions.messageEvent(bot.id, ))
  t.equal(duck.selectors.getMo(), 0, 'should be 0 for mo with initialized state')
  t.equal(duck.selectors.getMt(), 0, 'should be 0 for mt with initialized state')

  duck.operations.mo(WECHATY_ID)
  t.equal(duck.selectors.getMo(), 1, 'should be 1 for mo with 1 operations.mo()')
  t.equal(duck.selectors.getMt(), 0, 'should be 0 for mt with 1 operations.mo()')

  duck.operations.mt(WECHATY_ID)
  t.equal(duck.selectors.getMo(), 1, 'should be 1 for mo with 2 operations.mt()')
  t.equal(duck.selectors.getMt(), 1, 'should be 1 for mt with 2 operations.mt()')
})
