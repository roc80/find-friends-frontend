<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import myAxios from "@/utils/myAxios";
import qs from "qs";
import UserCardList from "@/components/UserCardList.vue";
import User = API.User;

const route = useRoute()
let userList = ref<User[]>([])
onMounted(async () => {
  const tagNameList = route.query.tagNameList ?? []
  console.log(`当前选中的tagName: ${tagNameList}`)
  userList.value = await myAxios
      .get('/user/search/tags', {
        params: {
          tagNameList: tagNameList
        },
        paramsSerializer: {
          serialize: (params: any) => qs.stringify(params, {
            arrayFormat: 'repeat'
          })
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