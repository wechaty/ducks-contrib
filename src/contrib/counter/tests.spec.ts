#!/usr/bin/env ts-node

import { test } from 'tstest'
import { validateDucksApi } from 'ducks'

import * as api from '.'

test('validateDucksApi(counter)', async t => {
  t.doesNotThrow(() => validateDucksApi(api), 'should pass the ducks api validating')
})
