<script lang="ts" setup>
import ingredients from "@/jsonData/ingredients.json";
import { sample } from "lodash-es";
import { importImage } from "@/tools/importImage";

type TIngredients = (typeof ingredients)[number];
type IMapProp = {
  [key in keyof TIngredients]: string;
};
const mapProps: IMapProp = {
  name: "名称",
  image: "图片",
  describe: "描述",
  level: "等级",
  price: "价格",
  tags: "标签",
  type: "类型",
};
const tagTypes = [
  "success",
  // "info",
  "warning",
  "danger",
  "",
];

const columns = Reflect.ownKeys(mapProps).map(key => ({
  prop: key as keyof TIngredients,
  label: mapProps[key as keyof TIngredients],
}));
</script>

<template>
  <div class="shicai">
    <el-table border :data="ingredients" style="width: 100%">
      <el-table-column type="index" width="60px" label="序号"></el-table-column>
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
      >
        <template v-if="column.prop === 'image'" #default="{ row }">
          <el-avatar shape="square" :src="importImage(row.image)" />
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
      </el-table-column>
    </el-table>
  </div>
</template>
