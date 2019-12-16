<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive> <!-- 保留组件状态/避免重新渲染。 -->
      <router-view></router-view>
    </keep-alive>
    <!--  update  -->
    <player></player>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  },
  watch: {
  //   $route(to, from) {
  //     debugger
  //     // console('to', to);
  //     // console('from', from);
  //   }
  }
}
</script>

<style scoped lang="stylus">
  #app
    height 100%
</style>
