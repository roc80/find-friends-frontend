<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import myAxios from "@/utils/myAxios";
import qs from "qs";
import UserCardList from "@/components/UserCardList.vue";
import {UserAPI} from "@/api/user";
import {CommonResponse, User} from "@/typing";

const route = useRoute()
let userList = ref<User[]>([])
const tagNameList = ref<string[]>()
onMounted(async () => {
  const {tagNameList: queryParam} = route.query;
  if (!queryParam) {
    return
  }
  try {
    const parsed = JSON.parse(queryParam as string);
    tagNameList.value = Array.isArray(parsed) ? parsed : []
    const response = await myAxios
        .get<CommonResponse<User[]>>(UserAPI.searchByTags, {
          params: {
            tagNameList: tagNameList.value
          },
          paramsSerializer: {
            serialize: (params: any) => qs.stringify(params, {
              arrayFormat: 'repeat'
            })
          }
        });
    userList.value = response.data ?? []
  } catch (e) {
    console.log(`${UserAPI.searchByTags} 加载数据失败`, e)
  }
  console.log(`搜索到：${userList.value.length} 个用户`)
})
</script>

<template>
  <UserCardList :userList="userList"/>
</template>

<style scoped>
</style>