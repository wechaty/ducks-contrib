#!/usr/bin/env ts-node
import {
  VERSION,
  Counter,
}                 from 'wechaty-ducks-contrib'
import { Ducks }  from 'ducks'

async function main () {
  if (VERSION === '0.0.0') {
    throw new Error('version should be set before publishing')
  }

  const ducks = new Ducks({ counter: Counter })
  ducks.configureStore()

  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
