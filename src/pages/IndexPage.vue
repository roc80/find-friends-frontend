<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import myAxios from "@/utils/myAxios";
import UserCardList from "@/components/UserCardList.vue";
import {UserAPI} from "@/api/user";
import {CommonResponse, User} from "@/typing";

let allUserList = ref<User[]>([])
let recommendUserList = ref<User[]>([])
// TODO@lp 切换页码，重新请求
let pageNum = ref<number>(1)
const pageSize = ref<number>(20)

const activeTabIndex = ref<number>(0)
const hasLoadAll = ref<boolean>(false)
const hasLoadRecommend = ref<boolean>(false)
const isRecommendUserLoading = ref<boolean>(false)
const isAllUserLoading = ref<boolean>(false)

const fetchAllUsers = async () => {
  if (hasLoadAll.value) return
  try {
    isAllUserLoading.value = true
    const response = await myAxios.get<CommonResponse<User[]>>(UserAPI.getAllUsers, {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      }
    })
    allUserList.value = response.data ?? []
    hasLoadAll.value = true
  } catch (error) {
    console.error(`首页数据加载失败 ${UserAPI.getAllUsers}`, error);
  } finally {
    isAllUserLoading.value = false
  }
}

const fetchRecommendUsers = async () => {
  if (hasLoadRecommend.value) return
  try {
    isRecommendUserLoading.value = true
    const response = await myAxios.get<CommonResponse<User[]>>(UserAPI.recommendUsers, {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      }
    })
    recommendUserList.value = response.data ?? []
    hasLoadRecommend.value = true
  } catch (error) {
    console.error(`首页数据加载失败 ${UserAPI.recommendUsers}`, error);
  } finally {
    isRecommendUserLoading.value = false
  }
}

const onRefreshRecommend = async () => {
  hasLoadRecommend.value = false;
  await fetchRecommendUsers();
}

const onRefreshAll = async () => {
  hasLoadAll.value = false;
  await fetchAllUsers();
}

onMounted(async () => {
  await fetchRecommendUsers()
})

watch(activeTabIndex, async (newIndex, _) => {
  if (newIndex === 0) {
    await fetchRecommendUsers()
  } else if (newIndex === 1) {
    await fetchAllUsers()
  }
})
</script>

<template>
  <van-tabs v-model:active="activeTabIndex">
    <van-tab title="推荐用户">
      <van-pull-refresh :model-value="isRecommendUserLoading" @refresh="onRefreshRecommend">
        <UserCardList :userList="recommendUserList"/>
      </van-pull-refresh>
    </van-tab>
    <van-tab title="所有用户">
      <van-pull-refresh :model-value="isAllUserLoading" @refresh="onRefreshAll">
        <UserCardList :userList="allUserList"/>
      </van-pull-refresh>
    </van-tab>
  </van-tabs>
</template>

<style scoped>
</style>