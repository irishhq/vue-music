/* 对state进行映射 */
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

/* getters可用来返回计算属性 */
export const currentSong = state => state.playList[state.currentIndex] || {}
