<script setup lang="ts">
import {onMounted, ref} from "vue";
import myAxios from "@/utils/myAxios";
import UserCardList from "@/components/UserCardList.vue";
import {UserAPI} from "@/api/user";
import {CommonResponse, User} from "@/typing";

let userList = ref<User[]>([])
// TODO@lp 切换页码，重新请求
let pageNum = ref<number>(1)
const pageSize = ref<number>(20)
onMounted(async () => {
  try {
    const response = await myAxios.get<CommonResponse<User[]>>(UserAPI.recommend, {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      }
    })
    userList.value = response.data ?? []
  } catch (error) {
    console.error(`首页数据加载失败 ${UserAPI.recommend}`, error);
  }
})
</script>

<template>
  <UserCardList :userList="userList"/>
</template>

<style scoped>
</style>