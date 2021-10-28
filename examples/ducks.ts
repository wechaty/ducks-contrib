import assert from 'assert'

import { WechatyBuilder }     from 'wechaty'
import { Ducks }       from 'ducks'
import {
  WechatyRedux,
  Duck as wechatyDuck,
}                     from 'wechaty-redux'

import { Counter as CounterDuck } from '../src/mod.js'
import {
  PuppetMock,
  mock,
}                   from 'wechaty-puppet-mock'

// Let the bullets fly...
const bulletsFly = async (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

async function main () {
  const ducks = new Ducks({
    counter: CounterDuck,
    wechaty: wechatyDuck,
  })

  const store = ducks.configureStore()

  let state: any
  store.subscribe(() => {
    const newState = store.getState()
    if (newState !== state) {
      console.info(newState)
      state = newState
    }
  })

  const mocker = new mock.Mocker()
  const puppet = new PuppetMock({ mocker })
  const bot    = WechatyBuilder.build({ puppet })
  bot.use(WechatyRedux({ store }))
  await bot.start()

  const [user, friend] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
  mocker.login(user)

  const counterBundle = ducks.ducksify('counter')

  assert(counterBundle.selectors.getMO() === 0, 'mo counter should be 0')
  assert(counterBundle.selectors.getMT() === 0, 'mt counter should be 0')

  user.say('how are you?').to(friend)
  await bulletsFly(3)

  assert(counterBundle.selectors.getMO() === 1, 'mo counter increase 1')
  assert(counterBundle.selectors.getMT() === 0, 'mt counter keep to be 0')

  friend.say('fine, thank you.').to(user)
  await bulletsFly(3)

  assert(counterBundle.selectors.getMO() === 1, 'mo counter keep to be 1')
  assert(counterBundle.selectors.getMT() === 1, 'mt counter increase 1')

  await bot.stop()
}

main()
  .catch(console.error)
