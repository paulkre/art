<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
});

const festivalRoute = computed(() => `/strapi/${props.festival.slug}`);
</script>

<template>
  <router-link :to="festivalRoute" class="strapi-festival">
    <vertical>
      <h2>{{ festival.title }}</h2>
    </vertical>
  </router-link>
</template>

<style scoped>
.strapi-festival {
  display: grid;
  aspect-ratio: 1;
  background: red;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
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
