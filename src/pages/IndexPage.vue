<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import myAxios from "@/utils/myAxios";
import UserCardList from "@/components/UserCardList.vue";
import User = API.User;

const route = useRoute()
let userList = ref<User[]>([])
// TODO@lp 切换页码，重新请求
let pageNum = ref<number>(1)
const pageSize = ref<number>(20)
onMounted(async () => {
  const tagNameList = route.query.tagNameList ?? []
  console.log(`当前选中的tagName: ${tagNameList}`)
  userList.value = await myAxios
      .get('/user/search/all', {
        params: {
          pageNum: pageNum.value,
          pageSize: pageSize.value,
        }
      })
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
  console.log(`搜索到：${userList.value.length} 个用户`)
})
</script>

<template>
  <UserCardList :userList="userList"/>
</template>

<style scoped>
</style>