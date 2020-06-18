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
const MESSAGE_OUTGOING = 'wechaty-ducks-contrib/counter/MESSAGE_OUTGOING' // Bot send message
const MESSAGE_INCOMING = 'wechaty-ducks-contrib/counter/MESSAGE_INCOMING' // Bot recv message

// Workaround for https://github.com/huan/ducks/issues/2
const NOOP = 'wechaty-ducks-contrib/counter/NOOP'

export {
  MESSAGE_OUTGOING,
  MESSAGE_INCOMING,
  NOOP,
}
