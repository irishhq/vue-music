import { playMode } from 'common/js/config'
/* 状态 */
const state = {
  singer: {},
  playing: false /* 播放状态 */,
  fullScreen: false /* 是否全屏 */,
  playList: [] /* 当前播放列表 */,
  sequenceList: [] /* 顺序播放列表 */,
  mode: playMode.sequence, /* 播放模式 */
  currentIndex: -1 /* 当前播放index */
};

export default state
