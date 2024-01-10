<script lang="ts" setup>
import customerList from "@/jsonData/customerList.json";
import { ref } from "vue";

type TCustomer = (typeof customerList)[number];
const chooseCustomers = ref<TCustomer[]>([]);

const handleChooseCustomer = (customer: TCustomer) => {
  const index = chooseCustomers.value.findIndex(
    item => item.name === customer.name
  );
  if (index > -1) {
    chooseCustomers.value.splice(index, 1);
  } else {
    chooseCustomers.value.push(customer);
  }
};
</script>

<template>
  <div class="xiyouguke">
    <el-space>
      <div
        :class="{
          customer: true,
          active: chooseCustomers.find(item => item.name === customer.name),
        }"
        v-for="customer in customerList"
        :key="customer.name"
        @click="handleChooseCustomer(customer)"
      >
        <el-avatar shape="square" :src="customer.avatar" />
        <div class="name">{{ customer.name }}</div>
      </div>
    </el-space>
  </div>
</template>

<style lang="scss" scoped>
.xiyouguke {
  display: flex;
  flex-wrap: wrap;
  .customer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 88px;
    height: 88px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.1);
      border-color: var(--primary-color);
    }
    &.active {
      border-color: var(--primary-color);
    }
  }
}
</style>
