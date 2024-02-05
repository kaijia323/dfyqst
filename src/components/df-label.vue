<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div id="df-label">
    <el-space>
      <div class="label">{{ title }}:</div>
      <div class="value">
        <slot></slot>
      </div>
    </el-space>
  </div>
</template>
