<script setup lang="ts">
type IColor = import("element-plus/es/utils").EpPropMergeType<
  StringConstructor,
  "" | "success" | "warning" | "info" | "danger",
  unknown
>;

const emit = defineEmits(["click"]);

const props = defineProps<{
  tags: string[];
  pointer?: boolean;
  color?: IColor;
  colorCb?: (t: string) => IColor;
}>();

const handleType = (t: string): IColor => {
  if (props.color) return props.color;
  else if (typeof props.colorCb === "function") {
    return props.colorCb?.call(undefined, t);
  } else {
    return "";
  }
};

const handleClick = (t: string) => {
  emit("click", t);
};
</script>

<template>
  <div id="df-tags">
    <el-space wrap>
      <el-tag
        :style="{
          cursor: pointer ? 'pointer' : 'unset',
        }"
        @click="handleClick(t)"
        v-for="t in tags"
        :key="t"
        :type="handleType(t)"
      >
        {{ t }}
      </el-tag>
    </el-space>
  </div>
</template>
