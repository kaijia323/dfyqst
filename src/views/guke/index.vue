<script lang="ts" setup>
import customerList from "@/jsonData/customerList.json";
import recipes from "@/jsonData/recipes.json";
import ingredients from "@/jsonData/ingredients.json";
import { onMounted } from "vue";
import { ref } from "vue";
import { importImage } from "@/tools/importImage";
import { useRectStore } from "@/pinia";

type TRecipe = (typeof recipes)[number];
type TCustomer = Omit<(typeof customerList)[number], "recipes"> & {
  recipes: TRecipe[];
};
type TIngredient = (typeof ingredients)[number];

const rectStore = useRectStore();
const isMulti = ref(false);
const chooseCustomers = ref<TCustomer[]>([]);
const cacheAddIngredients: { [key: string]: TIngredient[] } = {};
const personAvatar = computed(
  () => `url("${importImage(chooseCustomers.value[0]?.avatar)}")`
);

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

// 从食谱 tags 中找到顾客喜好的 tag
const filterRecipes = (customer: TCustomer): TRecipe[] => {
  return (
    recipes
      .filter(recipe =>
        // 顾客讨厌的 tag
        // !recipe.tags.some(tag => customer.hates.includes(tag)) &&
        recipe.tags.some(tag => customer.favorites.includes(tag))
      )
      // 根据价格排序
      .toSorted((a, b) => {
        return b.price - a.price;
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
  <div class="customer">
    <div class="customer-list">
      <el-scrollbar :height="rectStore.height">
        <div
          :class="{
            item: true,
            active: chooseCustomers.find(item => item.name === customer.name),
          }"
          v-for="customer in customerList"
          :key="customer.name"
          @click="handleChooseCustomer(customer)"
        >
          <el-space direction="vertical">
            <el-avatar shape="square" :src="importImage(customer.avatar)" />
            <div class="name">{{ customer.name }}</div>
          </el-space>
        </div>
      </el-scrollbar>
    </div>

    <template v-if="chooseCustomers.length">
      <el-scrollbar :height="rectStore.height">
        <div
          class="customer-info"
          v-for="customer in chooseCustomers"
          :key="customer.name"
        >
          <div class="person">
            <el-space alignment="start" direction="vertical">
              <df-label title="姓名">
                {{ customer.name }}
              </df-label>
              <df-label title="地址">
                {{ customer.address.join(", ") }}
              </df-label>
              <df-label title="喜好">
                <df-tags :tags="customer.favorites"></df-tags>
              </df-label>
              <df-label title="讨厌">
                <df-tags :tags="customer.hates" color="danger"></df-tags>
              </df-label>
              <df-label title="饮料/酒水">
                <df-tags :tags="customer.drinks"></df-tags>
              </df-label>
              <df-label title="钱">
                {{ customer.money.join("-") }}
              </df-label>
            </el-space>
          </div>
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
                    <el-avatar
                      shape="square"
                      :src="importImage(recipe.image)"
                    ></el-avatar>
                    <span>{{ recipe.name }}</span>
                    <span>￥{{ recipe.price }}</span>
                  </el-space>
                  <div style="height: 8px"></div>
                  <!-- 食谱标签 -->
                  <el-space wrap>
                    <span>食谱 Tag:</span>
                    <el-tag
                      :type="
                        customer.favorites.includes(t)
                          ? ''
                          : customer.hates.includes(t)
                          ? 'danger'
                          : 'info'
                      "
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
                    <el-tag
                      type="danger"
                      v-for="t in recipe.excludeTags"
                      :key="t"
                    >
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
                        :src="
                          importImage(
                            ingredients.find(item => item.name === i)?.image
                          )
                        "
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
                          :src="importImage(i.image)"
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
      </el-scrollbar>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.customer {
  display: flex;
  flex-direction: row-reverse;
  .customer-list {
    margin-left: 16px;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      width: 108px;
      height: 108px;
      text-align: center;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s;
      &:hover {
        // transform: scale(1.05);
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
    border-radius: 8px;
    .person {
      position: relative;
      padding: 16px;
      &::before {
        display: block;
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-image: v-bind(personAvatar);
        z-index: -1;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        border-radius: 16px;
        filter: blur(3px);
      }
    }
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
}
</style>
