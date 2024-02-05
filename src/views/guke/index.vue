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
const cacheAddIngredients: { [key: string]: TIngredient[] } = {};
const personAvatar = computed(
  () => `url("${importImage(customer.value.avatar)}")`
);
const customer = ref<TCustomer>(customerList[0]);

onMounted(() => {
  handleChooseCustomer(customerList[0]);
});

// 根据顾客喜好的 tag 排序
const toSortedTags = (tags: string[], _: TCustomer): string[] => {
  return tags.toSorted((a, b) => {
    if (customer.value.favorites.includes(a)) return -1;
    return 1;
  });
};

// 从食谱 tags 中找到顾客喜好的 tag
const filterRecipes = (
  _customer: TCustomer,
  filterTag: string = ""
): TRecipe[] => {
  return (
    recipes
      .filter(recipe => {
        const tag = filterTag ? recipe.tags.includes(filterTag) : true;
        const favorite = recipe.tags.some(tag =>
          _customer.favorites.includes(tag)
        );
        return tag && favorite;
      })
      // 根据价格排序
      .toSorted((a, b) => {
        return b.price - a.price;
      })
  );
};

// 顾客食谱可添加的食材
const cantAddIngredient = (recipe: TRecipe, _: TCustomer): TIngredient[] => {
  const k = `${customer.value.name}-${recipe.name}`;
  if (cacheAddIngredients[k]) {
    return cacheAddIngredients[k];
  }
  const res = ingredients
    .filter(
      ingredient =>
        !ingredient.tags.some(item => customer.value.hates.includes(item)) &&
        !recipe.excludeTags.some(item => ingredient.tags.includes(item)) &&
        ingredient.tags.some(item => customer.value.favorites.includes(item)) &&
        ingredient.tags.every(
          item =>
            !recipe.tags
              .filter(re => customer.value.favorites.includes(re))
              .includes(item)
        )
    )
    .toSorted((a, b) => a.price - b.price);
  if (!cacheAddIngredients[k]) {
    cacheAddIngredients[k] = res;
  }
  return res;
};

const handleChooseCustomer = (_customer: TCustomer) => {
  customer.value = {
    ..._customer,
    recipes: filterRecipes(_customer),
  };
};

const handleFavorite = (t: string) => {
  customer.value.recipes = filterRecipes(customer.value, t);
};
</script>

<template>
  <div class="customer">
    <div class="customer-list">
      <el-scrollbar :height="rectStore.height">
        <div
          :class="{
            item: true,
            active: c.name === customer.name,
          }"
          v-for="c in customerList"
          :key="c.name"
          @click="handleChooseCustomer(c)"
        >
          <el-space direction="vertical">
            <el-avatar shape="square" :src="importImage(c.avatar)" />
            <div class="name">{{ c.name }}</div>
          </el-space>
        </div>
      </el-scrollbar>
    </div>

    <el-scrollbar style="width: 100%" :height="rectStore.height">
      <div class="customer-info">
        <div class="person">
          <el-space alignment="start" direction="vertical">
            <df-label title="姓名">
              {{ customer.name }}
            </df-label>
            <df-label title="地址">
              {{ customer.address.join(", ") }}
            </df-label>
            <df-label title="喜好">
              <df-tags
                pointer
                :tags="customer.favorites"
                @click="handleFavorite"
              ></df-tags>
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
              v-for="recipe in customer.recipes"
              :key="recipe.name"
              class="recipe"
            >
              <el-space direction="vertical" alignment="start">
                <el-space>
                  <el-avatar
                    shape="square"
                    :src="importImage(recipe.image)"
                  ></el-avatar>
                  <span>{{ recipe.name }}</span>
                  <span>￥{{ recipe.price }}</span>
                  <span> Lv{{ recipe.level }}</span>
                </el-space>
                <!-- 食谱标签 -->
                <df-label title="标签">
                  <df-tags
                    :colorCb="
                        (t: string) => customer.favorites.includes(t)
                          ? ''
                          : customer.hates.includes(t)
                          ? 'danger'
                          : 'info'
                      "
                    :tags="toSortedTags(recipe.tags, customer)"
                  ></df-tags>
                </df-label>
                <!-- 食谱不能包含的标签 -->
                <df-label title="不能搭配的食材 Tag">
                  <df-tags color="danger" :tags="recipe.excludeTags"></df-tags>
                </df-label>
              </el-space>
              <df-label title="食材">
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
              </df-label>
              <div style="height: 8px"></div>
              <df-label title="厨具">
                {{ recipe.needCook }}
              </df-label>
              <div style="height: 8px"></div>
              <div>可添加的食材:</div>
              <div style="height: 8px"></div>
              <el-space direction="vertical" alignment="start">
                <div
                  v-for="i in cantAddIngredient(recipe, customer)"
                  :key="i.name"
                  class="need-ingredient"
                >
                  <el-space wrap>
                    <el-avatar
                      :src="importImage(i.image)"
                      shape="square"
                      size="small"
                    ></el-avatar>
                    <span>{{ i.name }}</span>
                    <span>￥{{ i.price }}</span>
                    <df-tags
                      :colorCb="(t: string) => customer.favorites.includes(t) ? '' : 'info'"
                      :tags="toSortedTags(i.tags, customer)"
                    >
                    </df-tags>
                  </el-space>
                </div>
              </el-space>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.customer {
  width: 100%;
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
      position: sticky;
      top: 0;
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
        // width: fit-content;
        width: 100%;
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
