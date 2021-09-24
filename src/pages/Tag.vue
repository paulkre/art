<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { strapi, strapiEvents } from "../lib";
import EventCard from "../components/EventCard.vue";
import { strapiFestivals } from "../lib";

const route = useRoute();
const tag = ref(null);

const events = computed(() => {
  const ids = tag.value?.events.map((e) => e.id) || [];
  return strapiEvents.value.filter((e) => {
    return ids.includes(e.id);
  });
});

const festivals = computed(() => {
  const ids = tag.value?.festivals.map((e) => e.id) || [];
  return strapiFestivals.value.filter((e) => {
    return ids.includes(e.id);
  });
});

strapi
  .get("tags/2")
  .json()
  .then((results) => (tag.value = results));
</script>

<template>
  <div style="padding: 48px">
    <vertical>
      <!-- {{ events }} -->
      <h1
        style="font-size: 80px; line-height: 1em"
        v-html="'Tag: ' + tag?.title"
      />
      <h3 class="subtitle">Festivals</h3>
      <FestivalCard
        v-for="(festival, i) in festivals"
        :key="i"
        :festival="festival"
      />
      <h3 class="subtitle">Events</h3>
      <EventCard v-for="(event, i) in events" :key="i" :event="event" />
    </vertical>
    <users />
    <layout>
      <template #top-left>
        <back-button />
      </template>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button />
      </template>
    </layout>
  </div>
</template>
