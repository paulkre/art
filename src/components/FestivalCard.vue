<script setup>
import { defineProps, ref, computed } from "vue";
const props = defineProps({
  festival: { type: Object },
});
</script>
<template>
  <Link
    :src="
      festival.link
        ? festival.link
        : festival.event?.eventid
        ? '/' + festival.event?.eventid
        : '/page/' + festival.pageid
    "
  >
    <disc
      :style="{
        width: '192px',
        height: '192px',
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
  </Link>
</template>
