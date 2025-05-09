<template>
  <van-nav-bar
      title="标题"
      left-arrow
      @click-left="onClickLeft">
  </van-nav-bar>

  <!-- 路由视图 - 这是重要的部分，用于显示当前路由对应的组件 -->
  <router-view></router-view>

  <van-tabbar route @change="onChange">
    <van-tabbar-item link to= "/" icon="home-o" name="index">首页</van-tabbar-item>
    <van-tabbar-item link to="/search" icon="search" name="search">搜索</van-tabbar-item>
    <van-tabbar-item link to="/user" icon="https://fastly.jsdelivr.net/npm/@vant/assets/icon-demo.png" name="user">我的</van-tabbar-item>
  </van-tabbar>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
const router = useRouter();
const route = useRoute()
const onClickLeft = () => history.back();

const onChange = (name: string) => {

}
</script>

<style scoped>
</style>
