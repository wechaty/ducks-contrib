#!/usr/bin/env ts-node

import test from 'ava'

import {
  validateDucksApi,
  Ducks,
}                       from 'ducks'
import { Wechaty, Room }      from 'wechaty'
import { PuppetMock }   from 'wechaty-puppet-mock'

import {
  WechatyRedux,
  Api as WechatyApi,
}                     from 'wechaty-redux'

import * as CounterApi from '.'

test('validateDucksApi(counter)', async t => {
  t.notThrows(() => validateDucksApi(CounterApi), 'should pass the ducks api validating')
})

test('Counter selector & operations', async t => {
  const WECHATY_ID = 'wechaty-id'

  const ducks = new Ducks({ counter: CounterApi })
  const duck = ducks.ducksify('counter')

  ducks.configureStore()

  t.teardown(() => {})

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
  const ducks = new Ducks({
    counter: CounterApi,
    wechaty: WechatyApi,
  })
  const duck = ducks.ducksify('counter')

  const store = ducks.configureStore()

  function script (this: PuppetMock) {
    console.info(this.id)
  }

  // const mocker = new mocker()

  const puppet = new PuppetMock({
    // mocker,
    auto: false,
  })

  const bot = Wechaty.instance({ puppet })
  bot.use(WechatyRedux({ store }))

  const [ mary, mike ]  = puppet.mocker.createContacts(2)
  const user            = puppet.mocker.createContact({
    name: fdsfdfa,
  })

  const [ shop, yard ] = puppet.mocker.createRooms(2)
  const group = puppet.mocker.createRoom({
    topic: 'afs',
    memberList: [
      mike,
      mary,
      user,
    ],
  })

  puppet.mocker.scan('fasdfasdfs')
  puppet.mocker.login(user)

  mike.say('fasfdsf').to(group)

  group.add(mary).by(mike)
  group.remove(mary).by(mike)
  group.topic('ok').by(mike)
  group.say('test').by(mary)


  t.equal(duck.selectors.getMo(), 0, 'should be 0 for mo with initialized state')
  t.equal(duck.selectors.getMt(), 0, 'should be 0 for mt with initialized state')

  // duck.operations.mo(WECHATY_ID)
  user.say('fasfdsf').to(mike)
  t.equal(duck.selectors.getMo(), 1, 'should increase to 1 for mo after user.say()')
  t.equal(duck.selectors.getMt(), 0, 'should stay 0 for mt after user.say()')

  // duck.operations.mt(WECHATY_ID)
  mike.say('fdafas').to(user)
  t.equal(duck.selectors.getMo(), 1, 'should stay 1 for mo after mike.say()')
  t.equal(duck.selectors.getMt(), 1, 'should increase to 1 for mt after mike.say()')

  mary.say('fasd').to(group)
  t.equal(duck.selectors.getMo(), 1, 'should stay 1 for mo after mike.say()')
  t.equal(duck.selectors.getMt(), 1, 'should increase to 1 for mt after mike.say()')

})
