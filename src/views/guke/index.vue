<script lang="ts" setup>
import customerList from "@/jsonData/customerList.json";
import recipes from "@/jsonData/recipes.json";
import ingredients from "@/jsonData/ingredients.json";
import { onMounted } from "vue";
import { ref } from "vue";
import { Sort } from "@element-plus/icons-vue";

type TRecipe = (typeof recipes)[number];
type TCustomer = Omit<(typeof customerList)[number], "recipes"> & {
  recipes: TRecipe[];
};
type TIngredient = (typeof ingredients)[number];

const isMulti = ref(false);
const chooseCustomers = ref<TCustomer[]>([]);
const cacheAddIngredients: { [key: string]: TIngredient[] } = {};

onMounted(() => {
  if (isMulti.value) {
    chooseCustomers.value = [...customerList].map(item => {
      return {
        ...item,
        recipes: filterRecipes(item),
      };
    });
  } else {
    chooseCustomers.value = [customerList[0]];
  }
});

// 根据顾客喜好的 tag 排序
const toSortedTags = (tags: string[], customer: TCustomer): string[] => {
  return tags.toSorted((a, b) => {
    if (customer.favorites.includes(a)) return -1;
    return 1;
  });
};

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
        const aa = a.tags.filter(tag => customer.favorites.includes(tag));
        const bb = b.tags.filter(tag => customer.favorites.includes(tag));
        if (aa.length === bb.length) {
          return -(a.price - b.price);
        }
        return bb.length - aa.length;
      })
  );
};

// 顾客食谱可添加的食材
const cantAddIngredient = (
  recipe: TRecipe,
  customer: TCustomer
): TIngredient[] => {
  const k = `${customer.name}-${recipe.name}`;
  if (cacheAddIngredients[k]) {
    return cacheAddIngredients[k];
  }
  const res = ingredients
    .filter(
      ingredient =>
        !ingredient.tags.some(item => customer.hates.includes(item)) &&
        !recipe.excludeTags.some(item => ingredient.tags.includes(item)) &&
        ingredient.tags.some(item => customer.favorites.includes(item)) &&
        ingredient.tags.every(
          item =>
            !recipe.tags
              .filter(re => customer.favorites.includes(re))
              .includes(item)
        )
    )
    .toSorted((a, b) => a.price - b.price);
  if (!cacheAddIngredients[k]) {
    cacheAddIngredients[k] = res;
  }
  return res;
};

// 推荐添加的食材
const recommendAddIngredient = (
  recipe: TRecipe,
  customer: TCustomer
): TIngredient[] => {
  const res = cantAddIngredient(recipe, customer);
  return res;
};

const handleChooseCustomer = (customer: TCustomer) => {
  if (isMulti.value) {
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
  } else {
    chooseCustomers.value.splice(0, 1, customer);
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
        <el-space direction="vertical">
          <el-avatar shape="square" :src="customer.avatar" />
          <div class="name">{{ customer.name }}</div>
        </el-space>
      </div>
    </el-space>
  </div>

  <div class="sort">
    <el-space>
      <span>价格</span>
      <el-icon><Sort /></el-icon>
    </el-space>
  </div>

  <template v-if="chooseCustomers.length">
    <div
      class="customer-info"
      v-for="customer in chooseCustomers"
      :key="customer.name"
    >
      <el-space wrap>
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
      </el-space>
      <div class="item" style="margin-top: 8px">
        <div class="label" style="margin-bottom: 8px">食谱</div>
        <div class="value">
          <div
            v-for="recipe in filterRecipes(customer)"
            :key="recipe.name"
            class="recipe"
          >
            <el-space wrap>
              <el-space>
                <el-avatar shape="square" :src="recipe.image"></el-avatar>
                <span>{{ recipe.name }}</span>
                <span>￥{{ recipe.price }}</span>
              </el-space>
              <div style="height: 8px"></div>
              <!-- 食谱标签 -->
              <el-space wrap>
                <span>食谱 Tag:</span>
                <el-tag
                  :type="customer.favorites.includes(t) ? '' : 'info'"
                  v-for="t in toSortedTags(recipe.tags, customer)"
                  :key="t"
                >
                  {{ t }}
                </el-tag>
              </el-space>
              <div style="height: 8px"></div>
              <!-- 食谱不能包含的标签 -->
              <el-space>
                <span>不能搭配的食材 Tag:</span>
                <el-tag type="danger" v-for="t in recipe.excludeTags" :key="t">
                  {{ t }}
                </el-tag>
                <span v-if="!recipe.excludeTags.length">无</span>
              </el-space>
            </el-space>
            <div style="height: 8px"></div>
            <el-space>
              <span>食材:</span>
              <el-space>
                <div
                  v-for="i in recipe.needIngredients"
                  :key="i"
                  class="need-ingredient"
                >
                  <el-avatar
                    :src="ingredients.find(item => item.name === i)?.image"
                    shape="square"
                    size="small"
                  ></el-avatar>
                  <span>{{ i }}</span>
                </div>
              </el-space>
              <span>厨具:</span>
              <el-space>
                <!-- <el-avatar
                      :src="ingredients.find(item => item.name === i)?.image"
                      shape="square"
                      size="small"
                    ></el-avatar> -->
                <span>{{ recipe.needCook }}</span>
              </el-space>
            </el-space>
            <div style="height: 8px"></div>
            <el-space direction="vertical" alignment="start">
              <span>可添加的食材</span>
              <el-space wrap>
                <div
                  v-for="i in cantAddIngredient(recipe, customer)"
                  :key="i.name"
                  class="need-ingredient"
                >
                  <el-space>
                    <el-avatar
                      :src="i.image"
                      shape="square"
                      size="small"
                    ></el-avatar>
                    <span>{{ i.name }}</span>
                    <span>￥{{ i.price }}</span>
                    <el-tag
                      :type="customer.favorites.includes(t) ? '' : 'info'"
                      v-for="t in toSortedTags(i.tags, customer)"
                      :key="t"
                    >
                      {{ t }}
                    </el-tag>
                  </el-space>
                </div>
              </el-space>
            </el-space>
            <div style="height: 8px"></div>
            <el-space direction="vertical" alignment="start">
              <span>推荐添加食材</span>
              <!-- <el-space wrap>
                  <div
                    v-for="i in recommendAddIngredient(recipe, customer)"
                    :key="i.name"
                    class="recommend-ingredient"
                  >
                    <el-space>
                      <el-avatar
                        :src="i.image"
                        shape="square"
                        size="small"
                      ></el-avatar>
                      <span>{{ i.name }}</span>
                      <el-tag v-for="t in i.tags" :key="t">
                        {{ t }}
                      </el-tag>
                    </el-space>
                  </div>
                </el-space> -->
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
    width: 108px;
    height: 108px;
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
.sort {
  margin-bottom: 8px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: var(--primary-color);
  }
}
.customer-info {
  padding: 16px;
  margin-bottom: 16px;
  // width: fit-content;
  box-shadow: 0 0 3px 1px #a19a9a;
  border-radius: 8px;
  .item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .recipe {
      padding: 16px;
      margin-bottom: 8px;
      width: fit-content;
      border-radius: 8px;
      box-shadow: 0 0 0px 2px #ebe7e7;
      &:last-child {
        margin-bottom: 0;
      }
      .need-ingredient {
        display: flex;
        align-items: center;
        .el-avatar {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
