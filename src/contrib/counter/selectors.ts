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
import type { State } from './reducers.js'

const getOutgoing = (state: State) => (wechatyId?: string) => {
  if (wechatyId) {
    return state.outgoing[wechatyId] || 0
  }
  const outgoingCounterList = Object.values(state.outgoing).filter(Boolean) as number[]
  return outgoingCounterList.reduce((acc, cur) => acc + cur, 0)
}
const getIncoming = (state: State) => (wechatyId?: string) => {
  if (wechatyId) {
    return state.incoming[wechatyId] || 0
  }
  const incomingCounterList = Object.values(state.incoming).filter(Boolean) as number[]
  return incomingCounterList.reduce((acc, cur) => acc + cur, 0)
}

export {
  getOutgoing,
  getIncoming,
}
