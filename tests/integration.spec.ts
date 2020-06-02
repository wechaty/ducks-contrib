#!/usr/bin/env ts-node

import {
  test,
}             from 'tstest'

import {
  Counter,
}                 from '../src/'

test('integration testing', async t => {
  t.ok(Counter, 'should available')
})
