<script setup>
import { defineProps, ref, computed } from "vue";
const props = defineProps({
  page: { type: Object },
});
</script>
<template>
  <horizontal style="grid-template-columns: auto 1fr; gap: 16px">
    <disc
      :style="{
        width: '192px',
        height: '192px',
        color: 'var(--fg)',
        backgroundColor: 'var(--bglight)',
        backgroundSize: 'cover',
        textAlign: 'center',
      }"
    >
      <h3>
        {{ page.title }}
      </h3>
    </disc>
  </horizontal>
</template>
