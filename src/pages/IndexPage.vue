<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import myAxios from "@/utils/myAxios";
import UserCardList from "@/components/UserCardList.vue";
import {UserAPI} from "@/api/user";
import {CommonResponse, PageResponse, User} from "@/typing";
import {ResponseCode} from "@/enums/ResponseCode";
import {showFailToast} from "vant";

let allUserList = ref<User[]>([])
let recommendUserList = ref<User[]>([])

const pageSize = 20
const allUserPageNum = ref<number>(1)
const recommendPageNum = ref<number>(1)
const recommendHasMore = ref(false)
const allHasMore = ref(false)

const RECOMMEND_USERS_TAB_INDEX = 0
const ALL_USERS_TAB_INDEX = 1
const activeTabIndex = ref<number>(RECOMMEND_USERS_TAB_INDEX)
const hasLoadAll = ref<boolean>(false)
const hasLoadRecommend = ref<boolean>(false)
const isRecommendUserLoading = ref<boolean>(false)
const isAllUserLoading = ref<boolean>(false)

const fetchAllUsers = async () => {
  if (hasLoadAll.value) return
  try {
    isAllUserLoading.value = true
    const response = await myAxios.get<CommonResponse<PageResponse<User>>>(UserAPI.getAllUsers, {
      params: {
        pageNum: allUserPageNum.value,
        pageSize: pageSize
      }
    })
    if (response.code === ResponseCode.SUCCESS) {
      allUserList.value = response.data?.records ?? []
      allHasMore.value = response.data?.hasMore ?? false
    } else {
      console.error(`message = ${response.message}, description = ${response.description}`)
      showFailToast('拉取用户失败')
    }

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
    const response = await myAxios.get<CommonResponse<PageResponse<User>>>(UserAPI.recommendUsers, {
      params: {
        pageNum: recommendPageNum.value,
        pageSize: pageSize
      }
    })
    if (response.code === ResponseCode.SUCCESS) {
      recommendUserList.value = response.data?.records ?? []
      recommendHasMore.value = response.data?.hasMore ?? false
    } else {
      console.error(`message = ${response.message}, description = ${response.description}`)
      showFailToast('推荐用户失败')
    }

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
  if (newIndex === RECOMMEND_USERS_TAB_INDEX) {
    await fetchRecommendUsers()
  } else if (newIndex === ALL_USERS_TAB_INDEX) {
    await fetchAllUsers()
  }
})

const currentTabHasMore = computed(() => {
  if (activeTabIndex.value === ALL_USERS_TAB_INDEX) return allHasMore.value
  if (activeTabIndex.value === RECOMMEND_USERS_TAB_INDEX) return recommendHasMore.value
  return false
})

const currentTabHasPrev = computed(() => {
  if (activeTabIndex.value === ALL_USERS_TAB_INDEX) return allUserPageNum.value > 1
  if (activeTabIndex.value === RECOMMEND_USERS_TAB_INDEX) return recommendPageNum.value > 1
  return false
})

const currentTabPrevPage = () => {
  if (!currentTabHasPrev.value) return
  if (activeTabIndex.value === ALL_USERS_TAB_INDEX) {
    allUserPageNum.value -= 1
    onRefreshAll()
  } else if (activeTabIndex.value === RECOMMEND_USERS_TAB_INDEX) {
    recommendPageNum.value -= 1
    onRefreshRecommend()
  }
}

const currentTabNextPage = () => {
  if (!currentTabHasMore.value) return
  if (activeTabIndex.value === ALL_USERS_TAB_INDEX) {
    allUserPageNum.value += 1
    onRefreshAll()
  } else if (activeTabIndex.value === RECOMMEND_USERS_TAB_INDEX) {
    recommendPageNum.value += 1
    onRefreshRecommend()
  }
}

const pageNum = computed(() => {
      if (activeTabIndex.value === ALL_USERS_TAB_INDEX) {
        return allUserPageNum.value
      } else if (activeTabIndex.value === RECOMMEND_USERS_TAB_INDEX) {
        return recommendPageNum.value
      } else {
        return 1
      }
    }
)
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
  <div class="switch-page">
    <van-button
        type="primary"
        size="small"
        @click="currentTabPrevPage"
        :disabled="!currentTabHasPrev"
    >
      上一页
    </van-button>

    <span style="margin: 0 12px;">第 {{ pageNum }} 页</span>

    <van-button
        type="primary"
        size="small"
        @click="currentTabNextPage"
        :disabled="!currentTabHasMore"
    >
      下一页
    </van-button>
  </div>
</template>

<style scoped>
.switch-page {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;
}
</style>