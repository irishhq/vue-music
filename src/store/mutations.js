import * as types from './mutation-types'

const mutations = {
  /* mutationstypes便于书写方便&lint检测是否正确 */
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default mutations
