<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import myAxios from "@/utils/myAxios";
import qs from "qs";
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
          serialize: (params) => qs.stringify(params, {
            arrayFormat: 'repeat'
          })
        }
      })
      .then(function (response) {
        console.log(response.data);
        return response.data?.data;
      })
      .catch(function (error) {
        // 处理错误情况
        console.log(error);
      })
  if (userList.value) {
    userList.value.forEach(user => {
      user.tags = JSON.parse(user.tags)
    })
  }

})
</script>

<template>
  <van-empty v-if="!userList || userList.length == 0" description="未找到用户"/>
  <van-card class="custom-card" v-for="user in userList"
            :thumb=user.avatarUrl
            :title=user.userName
            :desc=user.email
  >
    <template #tags>
      <van-tag v-for="tag in user.tags" plain type="primary" style="margin-top: 5px; margin-right: 5px">
        {{ tag }}
      </van-tag>
    </template>
    <template #footer>
      <van-button size="small">更多信息</van-button>
    </template>
  </van-card>

</template>

<style scoped>
.custom-card {
  --van-card-thumb-radius: 60px;
  --van-card-thumb-size: 70px;
}
</style>