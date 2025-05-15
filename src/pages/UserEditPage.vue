<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "@/utils/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import fetchUserInfo from "@/user/UserUtil";

const route = useRoute();
const router = useRouter();
const editUser = ref({
  fieldName: route.query.name as string ?? "",
  fieldKey: route.query.key as string ?? "",
  fieldValue: route.query.value as string ?? "",
})
if (editUser.value.fieldKey === 'tags') {
  editUser.value.fieldValue = JSON.parse(editUser.value.fieldValue);
}
let currentUser = ref<API.User>({} as API.User);
onMounted(async () => {
  fetchUserInfo()
      .then((response) => {
        currentUser.value = response?.data
      });
});

const onSubmit = () => {
  if (editUser.value.fieldKey === 'tags') {
    editUser.value.fieldValue = stringToJsonArray(editUser.value.fieldValue);
  }
  myAxios.post('/user/update', {
    "userId": currentUser.value.userId,
    [editUser.value.fieldKey]: editUser.value.fieldValue,
  }).then(res => {
    if (res.data === 0) {
      showSuccessToast('修改成功');
      router.replace('/user')
    } else {
      showFailToast('修改失败');
    }
  })
};

function stringToJsonArray(inputString: string) {
  const array = inputString.split(',');
  return JSON.stringify(array.map(item => item.trim()));
}
</script>

<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model=editUser.fieldValue
          :name=editUser.fieldKey
          :label=editUser.fieldName
          placeholder="请输入新的值"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<style scoped>
</style>