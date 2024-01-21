<script lang="ts" setup>
import drinks from "@/jsonData/drinks.json";
import { sample } from "lodash-es";

type TDrinks = (typeof drinks)[number];
type IMapProp = {
  [key in keyof TDrinks]: string;
};
const mapProps: IMapProp = {
  name: "名称",
  image: "图片",
  describe: "描述",
  level: "等级",
  money: "价格",
  tag: "标签",
};
const tagTypes = [
  "success",
  // "info",
  "warning",
  "danger",
  "",
];

const columns = Reflect.ownKeys(mapProps).map(key => ({
  prop: key as keyof TDrinks,
  label: mapProps[key as keyof TDrinks],
}));
</script>

<template>
  <div class="shicai">
    <el-table border :data="drinks" style="width: 100%">
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
        <template v-if="column.prop === 'tag'" #default="{ row }">
          <el-space wrap>
            <el-tag
              :type="(sample(tagTypes) as any)"
              v-for="tag in row.tag"
              :key="tag"
              >{{ tag }}</el-tag
            >
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
