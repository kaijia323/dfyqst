<script lang="ts" setup>
import customerList from "@/jsonData/customerList.json";
import recipes from "@/jsonData/recipes.json";
import { onMounted } from "vue";
import { ref } from "vue";

type TRecipe = (typeof recipes)[number];
type TCustomer = Omit<(typeof customerList)[number], "recipes"> & {
  recipes: TRecipe[];
};

const chooseCustomers = ref<TCustomer[]>([]);

onMounted(() => {
  chooseCustomers.value = [...customerList].map(item => {
    return {
      ...item,
      recipes: filterRecipes(item),
    };
  });
});

// 从食谱 tags 中过滤顾客讨厌的 tag 且包含顾客喜好的 tag
const filterRecipes = (customer: TCustomer): TRecipe[] => {
  return (
    recipes
      .filter(
        recipe =>
          !recipe.tags.some(tag => customer.hates.includes(tag)) &&
          recipe.tags.some(tag => customer.favorites.includes(tag))
      )
      // 根据顾客喜好的 tag 数量排序
      .toSorted((a, b) => {
        const length = a.tags.filter(tag =>
          customer.favorites.includes(tag)
        ).length;
        const length2 = b.tags.filter(tag =>
          customer.favorites.includes(tag)
        ).length;
        return length2 - length;
      })
  );
};

const handleChooseCustomer = (customer: TCustomer) => {
  const index = chooseCustomers.value.findIndex(
    item => item.name === customer.name
  );
  if (index > -1) {
    chooseCustomers.value.splice(index, 1);
  } else {
    chooseCustomers.value.push({
      ...customer,
      recipes: filterRecipes(customer),
    });
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
      <div class="item">
        <div class="label" style="margin-bottom: 8px">食谱</div>
        <div class="value">
          <div
            v-for="recipe in customer.recipes"
            :key="recipe.name"
            class="recipe"
          >
            <el-space>
              <span>{{ recipe.name }}</span>
              <el-tag
                :type="customer.favorites.includes(t) ? 'primary' : 'info'"
                v-for="t in recipe.tags"
                :key="t"
              >
                {{ t }}
              </el-tag>
            </el-space>
          </div>
        </div>
      </div>
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

    .recipe {
      margin-bottom: 16px;
    }
  }
}
</style>
