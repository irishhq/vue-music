<template>
  <div id="recommed">推薦頁面</div>
</template>
<script>
import { getRecommend } from 'api/recommend'
import { ERROR_OK } from 'api/config'
export default {
  data() {
    return {
      recommends: []
    };
  },
  created() {
    this._getRecommend();
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERROR_OK) {
          this.recommends = res.data.slider
          console.log('result===========', this.recommends)
        }
      });
    }
  }
};
</script>
<style scoped lang="stylus"></style>