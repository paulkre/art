<script setup>
import { defineProps, ref, computed } from "vue";
const props = defineProps({
  festival: { type: Object },
});
</script>
<template>
  <horizontal style="grid-template-columns: auto 1fr; gap: 16px">
    <disc
      :style="{
        width: '128px',
        height: '128px',
        color: festival.color !== '' ? festival.color : 'var(--fg)',
        backgroundColor: festival.background || 'var(--bglight)',
        backgroundImage: festival.image
          ? 'url(' + festival.image + ')'
          : festival.event?.image
          ? 'url(' + festival.event.image + ')'
          : '',
        backgroundSize: 'cover',
      }"
    />
    <!-- <vertical style="gap: 4px">
      <h3>
        {{ festival.title }}
      </h3>
    </vertical> -->
  </horizontal>
</template>
