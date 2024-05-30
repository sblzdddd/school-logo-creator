<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "CollapseTitle"
  }
})
</script>

<template>
<div class="collapse collapse-arrow bg-blue-200 shadow-md">
  <input type="checkbox" checked />
  <div class="collapse-title">{{ props.title }}</div>
  <div class="collapse-content">
    <slot></slot>
  </div>
</div>
</template>

<style scoped>
.collapse-title {
  @apply text-2xl font-bold text-secondary underline py-5 px-2;
  min-height: 0!important;
}
.collapse-content {
  @apply flex flex-col gap-3;
}
.collapse-arrow > .collapse-title:after {
  @apply w-3 h-3 top-10 right-7;
}
</style>