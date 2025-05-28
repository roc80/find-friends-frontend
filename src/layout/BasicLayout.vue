<script setup lang="ts">
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {HugeiconsIcon} from '@hugeicons/vue';
import {HomeIcon, User03Icon, UserGroup02Icon} from '@hugeicons/core-free-icons/index';

const route = useRoute();
const router = useRouter();

const onChange = (key: string) => {
  if (key === 'home') router.replace('/home')
  if (key === 'team') router.replace('/team')
  if (key === 'user') router.replace('/user')
}
const tabPathList = ['/home', '/team', '/user']
const onClickLeft = () => {
  if (tabPathList.includes(route.path)) {
    router.replace('/home')
  } else {
    history.back();
  }
}

const onClickRight = () => {
  router.push('/search')
}

const getTabKeyFromPath = (path: string): string => {
  if (path.startsWith('/home')) {
    return 'home';
  } else if (path.startsWith('/team')) {
    return 'team';
  } else if (path.startsWith('/user')) {
    return 'user';
  } else {
    return 'home';
  }
}
const active = ref('home');
active.value = getTabKeyFromPath(route.path);
watch(
    () => route.path
    , (path) => {
      active.value = getTabKeyFromPath(path);
    }
)

</script>

<template>
  <van-nav-bar
      id="nav-bar"
      :title="route.meta.title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight">
    <template #right>
      <van-icon name="search" size="22"/>
    </template>
  </van-nav-bar>

  <div class="basic-layout">
    <div class="content">
      <router-view/>
    </div>
  </div>

  <van-tabbar v-model="active" @change="onChange"
              style="position: fixed; bottom: 0; width: 100%; height: 50px; z-index: 100;">
    <van-tabbar-item name="home">
      <template  #icon>
        <HugeiconsIcon
            :icon="HomeIcon"
            :size="24"
            color="currentColor"
            :stroke-width="1.5"
        />
      </template>
      首页
    </van-tabbar-item>
    <van-tabbar-item name="team">
      <template  #icon>
        <HugeiconsIcon
            :icon="UserGroup02Icon"
            :size="24"
            color="currentColor"
            :stroke-width="1.5"
        />
      </template>
      组队
    </van-tabbar-item>
    <van-tabbar-item name="user">
      <template  #icon>
        <HugeiconsIcon
            :icon="User03Icon"
            :size="24"
            color="currentColor"
            :stroke-width="1.5"
        />
      </template>
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
.content {
  padding-bottom: 50px;
  padding-top: 50px;
}

#nav-bar {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>