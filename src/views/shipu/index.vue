<script lang="ts" setup>
import recipes from "@/jsonData/recipes.json";
import { sample } from "lodash-es";

type TRecipes = (typeof recipes)[number];
type IMapProp = {
  [key in keyof TRecipes]: string;
};
const mapProps: IMapProp = {
  name: "名称",
  image: "图片",
  describe: "描述",
  level: "等级",
  money: "价格",
  tags: "标签",
  excludeTags: "不能包含的食材标签",
  needIngredients: "需要的食材",
  needCook: "需要的厨具",
  cookerTime: "烹饪时间",
};
const tagTypes = [
  "success",
  // "info",
  "warning",
  "danger",
  "",
];

const columns = Reflect.ownKeys(mapProps).map(key => ({
  prop: key as keyof TRecipes,
  label: mapProps[key as keyof TRecipes],
}));
</script>

<template>
  <div class="shipu">
    <el-table border :data="recipes" style="width: 100%">
      <el-table-column type="index" width="60px" label="序号"></el-table-column>
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
      >
        <template v-if="column.prop === 'image'" #default="{ row }">
          <el-avatar shape="square" :src="row.image" />
        </template>
        <template v-if="column.prop === 'tags'" #default="{ row }">
          <el-space wrap>
            <el-tag
              :type="(sample(tagTypes) as any)"
              v-for="tag in row.tags"
              :key="tag"
              >{{ tag }}</el-tag
            >
          </el-space>
        </template>
        <template v-if="column.prop === 'excludeTags'" #default="{ row }">
          <el-space wrap>
            <el-tag type="danger" v-for="tag in row.excludeTags" :key="tag">{{
              tag
            }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
