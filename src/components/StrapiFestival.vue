<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
});

const festivalRoute = computed(() => `/strapi/${props.festival.slug}`);

const bgImageStyle = computed(() => {
  return props.festival?.images[0]
    ? {
        backgroundImage: `url(${props.festival.images[0].formats.small.url})`,
      }
    : null;
});
</script>

<template>
  <router-link
    :to="festivalRoute"
    class="strapi-festival"
    style="background-size: cover; width: 100%"
    :style="bgImageStyle"
  >
    <h2 :style="{ opacity: bgImageStyle ? 0 : 1 }" v-html="festival.title" />
  </router-link>
</template>

<style scoped>
.strapi-festival {
  display: grid;
  aspect-ratio: 1;
  background: var(--bglight);
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 32px;
  border-radius: 0px;
}
.strapi-festival > * {
  width: 100%;
}
</style>

<!--
<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
});

const festivalRoute = computed(() => `/strapi/${props.festival.slug}`);
</script>

<template>
  <router-link :to="festivalRoute">
    <vertical>
      <h2>{{ festival.title }}</h2>
    </vertical>
  </router-link>
</template>
-->
