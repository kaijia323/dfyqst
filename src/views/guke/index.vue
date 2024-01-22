<script lang="ts" setup>
import customerList from "@/jsonData/customerList.json";
import { onMounted } from "vue";
import { ref } from "vue";

type TCustomer = (typeof customerList)[number];
const chooseCustomers = ref<TCustomer[]>([]);

onMounted(() => {
  chooseCustomers.value = [...customerList];
});

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
  <div class="guke">
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

  <template v-if="chooseCustomers.length">
    <div
      class="customer-info"
      v-for="customer in chooseCustomers"
      :key="customer.name"
    >
      <el-space class="item">
        <div class="label">姓名:</div>
        <div class="value">{{ customer.name }}</div>
        <el-avatar :src="customer.avatar"></el-avatar>
      </el-space>
      <br />
      <el-space class="item">
        <div class="label">地址:</div>
        <div class="value">{{ customer.address.join(",") }}</div>
      </el-space>
      <br />
      <el-space class="item">
        <div class="label">喜好:</div>
        <el-space wrap>
          <el-tag v-for="favorite in customer.favorites" :key="favorite">{{
            favorite
          }}</el-tag>
        </el-space>
      </el-space>
      <br />
      <el-space class="item">
        <div class="label">讨厌:</div>
        <el-tag type="danger" v-for="hate in customer.hates" :key="hate">{{
          hate
        }}</el-tag>
      </el-space>
      <br />
      <el-space class="item">
        <div class="label">饮料/酒水:</div>
        <el-tag v-for="drink in customer.drinks" :key="drink">{{
          drink
        }}</el-tag>
      </el-space>
      <br />
      <el-space class="item">
        <div class="label">钱:</div>
        <div class="value">{{ customer.money.join(" - ") }}</div>
      </el-space>
      <br />
      <el-space class="item">
        <div class="label">食谱:</div>
        <div class="value">TODO</div>
      </el-space>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.guke {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
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
.customer-info {
  padding: 16px;
  margin-bottom: 16px;
  // width: fit-content;
  box-shadow: 0 0 3px 0px #a19a9a;
  border-radius: 8px;
  .item {
    margin-bottom: 16px;
  }
}
</style>
