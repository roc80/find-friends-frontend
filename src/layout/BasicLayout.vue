<script setup lang="ts">
const onClickLeft = () => history.back();
const onChange = (name: string) => {

}
</script>

<template>
  <van-nav-bar
      title="标题"
      left-arrow
      @click-left="onClickLeft">
  </van-nav-bar>

  <div class="basic-layout">
    <div class="content">
      <router-view/>
    </div>

    <van-tabbar route @change="onChange" style="position: fixed; bottom: 0; width: 100%; height: 50px; z-index: 100;">
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item replace to="/user" icon="contact-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.content {
  padding-bottom: 50px;
}
</style>