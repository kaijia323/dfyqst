<script setup lang="ts">
//
</script>

<template>
  <div id="df-grid">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
#df-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
</style>
