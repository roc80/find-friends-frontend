<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "@/utils/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import {defaultUserState, useUserStore} from "@/stores/UserLoginState";
import {UserAPI} from "@/api/user";
import {User} from "@/typing";
import {ResponseCode} from "@/enums/ResponseCode";

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
const currentUser: User = useUserStore().currentUser ?? defaultUserState;

const onSubmit = async () => {
  if (editUser.value.fieldKey === 'tags') {
    editUser.value.fieldValue = stringToJsonArray(editUser.value.fieldValue);
  }

  try {
    const response = await myAxios.post(UserAPI.update, {
      "userId": currentUser.userId,
      [editUser.value.fieldKey]: editUser.value.fieldValue,
    })
    if (response.code !== ResponseCode.SUCCESS) {
      showFailToast('修改失败');
      return;
    } else {
      showSuccessToast('修改成功');
      await router.push('/user');
    }
  } catch (e) {
    showFailToast('修改失败');
    console.log(`${UserAPI.update} 请求失败`, e);
  }
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