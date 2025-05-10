<script setup lang="ts">
import {LocationQuery, LocationQueryValue, useRoute} from "vue-router";
import {ref} from "vue";

const name = ref('需要修改的属性')
const curVal = ref('')
const oldVal = ref('')

const route = useRoute()
let queryString = route.query as LocationQuery;
name.value = queryString.name as string;
oldVal.value = queryString.value as string;
const text = queryString.text as string;

const onSubmit = (values: object) => {
  console.log(values);
};
</script>

<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model=curVal
          :name=name
          :label=text
          :placeholder=oldVal
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