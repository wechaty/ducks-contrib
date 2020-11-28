import assert from 'assert'

import { Wechaty }     from 'wechaty'
import { Ducks }       from 'ducks'
import {
  WechatyRedux,
  Duck as wechatyDuck,
}                     from 'wechaty-redux'

import { Counter as CounterDuck } from '../src/mod'
import {
  PuppetMock,
  Mocker,
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

  const mocker = new Mocker()
  const puppet = new PuppetMock({ mocker })
  const bot    = new Wechaty({ puppet })
  bot.use(WechatyRedux({ store }))
  await bot.start()

  const [user, friend] = mocker.createContacts(2)
  mocker.login(user)

  const counterBundle = ducks.ducksify('counter')

  assert(counterBundle.selectors.getOutgoing() === 0, 'mo counter should be 0')
  assert(counterBundle.selectors.getIncoming() === 0, 'mt counter should be 0')

  user.say('how are you?').to(friend)
  await bulletsFly(3)

  assert(counterBundle.selectors.getOutgoing() === 1, 'mo counter increase 1')
  assert(counterBundle.selectors.getIncoming() === 0, 'mt counter keep to be 0')

  friend.say('fine, thank you.').to(user)
  await bulletsFly(3)

  assert(counterBundle.selectors.getOutgoing() === 1, 'mo counter keep to be 1')
  assert(counterBundle.selectors.getIncoming() === 1, 'mt counter increase 1')

  await bot.stop()
}

main()
  .catch(console.error)
