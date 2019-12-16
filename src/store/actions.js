/* 通常异步操作修改or对mutation封装 */
import * as types from './mutation-types'

export function selectPlay({commit, state}, {list, index}) {
  /* Action 函数接受一个 context 参数，注意，这个参数可不一般，它与 store 实例有着相同的方法和属性 */
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
