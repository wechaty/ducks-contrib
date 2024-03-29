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
import {
  createReducer,
  ActionType,
}                     from 'typesafe-actions'
import type { DeepReadonly }  from 'utility-types'

import * as actions from './actions.js'

const initialState: DeepReadonly<{
  incoming:{ [wechatyId: string]: undefined | number },
  outgoing: {[wechatyId: string]: undefined | number },
}> = {
  incoming: {},
  outgoing: {},
}

const reducer = createReducer<typeof initialState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.outgoingMessage, (state, action) => ({
    ...state,
    outgoing: {
      ...state.outgoing,
      [action.payload.wechatyId]: (state.outgoing[action.payload.wechatyId] || 0) + 1,
    },
  }))
  .handleAction(actions.incomingMessage, (state, action) => ({
    ...state,
    incoming: {
      ...state.incoming,
      [action.payload.wechatyId]: (state.incoming[action.payload.wechatyId] || 0) + 1,
    },
  }))

export default reducer
export type State = ReturnType<typeof reducer>
