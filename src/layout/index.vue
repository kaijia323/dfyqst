<script lang="ts" setup>
import {
  Menu as IconMenu,
  Fold as IconFold,
  Expand as IconExpand,
} from "@element-plus/icons-vue";
import { useRectStore } from "@/pinia";

const isCollapse = ref(true);
const rectStore = useRectStore();

onMounted(() => {
  const appEl = document.querySelector("#app")!;
  rectStore.$patch({
    rect: {
      width: appEl.clientWidth - 40,
      height: appEl.clientHeight - 40,
    },
  });
});

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
      <el-aside width="60">
        <div class="collapse">
          <el-icon @click="isCollapse = !isCollapse">
            <IconExpand v-if="isCollapse"></IconExpand>
            <IconFold v-else></IconFold>
          </el-icon>
        </div>
        <el-menu
          :collapse="isCollapse"
          default-active="guke"
          router
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="guke">
            <el-icon><icon-menu /></el-icon>
            <template #title>
              <span>稀有顾客</span>
            </template>
          </el-menu-item>
          <el-menu-item index="shicai">
            <el-icon><icon-menu /></el-icon>
            <template #title>
              <span>食材</span>
            </template>
          </el-menu-item>
          <el-menu-item index="jiushui">
            <el-icon><icon-menu /></el-icon>
            <template #title>
              <span>酒水</span>
            </template>
          </el-menu-item>
          <el-menu-item index="shipu">
            <el-icon><icon-menu /></el-icon>
            <template #title>
              <span>食谱</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-scrollbar>
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
  > .el-container {
    width: 100%;
    height: 100%;
  }
  .collapse {
    display: flex;
    justify-content: end;
    padding: 16px;
    > .el-icon {
      cursor: pointer;
    }
  }
}
</style>
