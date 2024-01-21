<script lang="ts" setup>
import { Menu as IconMenu } from "@element-plus/icons-vue";
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="xiyouguke"
          class="el-menu-vertical-demo"
          router
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="xiyouguke">
            <el-icon><icon-menu /></el-icon>
            <span>稀有顾客</span>
          </el-menu-item>
          <el-menu-item index="shicai">
            <el-icon><icon-menu /></el-icon>
            <span>食材</span>
          </el-menu-item>
          <el-menu-item index="jiushui">
            <el-icon><icon-menu /></el-icon>
            <span>酒水</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </div>
</template>
