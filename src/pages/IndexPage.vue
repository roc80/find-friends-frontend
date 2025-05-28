<script setup lang="ts">
import {onMounted, ref} from "vue";
import myAxios from "@/utils/myAxios";
import UserCardList from "@/components/UserCardList.vue";
import User = API.User;

let userList = ref<User[]>([])
// TODO@lp 切换页码，重新请求
let pageNum = ref<number>(1)
const pageSize = ref<number>(20)
onMounted(async () => {
  userList.value = await myAxios
      .get('/user/recommend', {
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
})
</script>

<template>
  <UserCardList :userList="userList"/>
</template>

<style scoped>
</style>