<script setup lang="ts">
defineProps<{
  tags: string[];
  color?: import("element-plus/es/utils").EpPropMergeType<
    StringConstructor,
    "" | "success" | "warning" | "info" | "danger",
    unknown
  >;
}>();
</script>

<template>
  <div id="df-tags">
    <el-space wrap>
      <el-tag v-for="t in tags" :key="t" :type="color || ''">
        {{ t }}
      </el-tag>
    </el-space>
  </div>
</template>
