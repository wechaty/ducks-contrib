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
import { isActionOf }         from 'typesafe-actions'
import { Epic }               from 'redux-observable'
import { Duck as wechatyDuck }  from 'wechaty-redux'

import {
  filter,
  mergeMap,
  map,
}             from 'rxjs/operators'

import * as actions from './actions.js'

const counterEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(wechatyDuck.actions.messageEvent)),
  mergeMap(wechatyDuck.utils.toMessage$),
  map(message => message.self()
    ? actions.outgoingMessage(message.wechaty.id)
    : actions.incomingMessage(message.wechaty.id)
  )
)

export {
  counterEpic,
}
