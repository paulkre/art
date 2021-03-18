<script setup>
import { computed } from "vue";
import { pages, events, activeTheme } from "../lib";

const params = { pageid: "hope" };

const page = computed(() => {
  let p = { content: "", events: [] };
  if (params.pageid && pages.value) {
    const currentPage = pages.value.find(
      (page) => page.pageid === params.pageid
    );
    if (currentPage) {
      p = currentPage;
    }
    if (events.value) {
      p.events = events.value.filter((event) => event.pageid == params.pageid);
    }
  }
  return p;
});
</script>

<template>
  <div>
    <div class="Page">
      <div v-html="page.content" class="PageContent" />
      <div class="EventCards">
        <EventCard v-for="(event, i) in page.events" :key="i" :event="event" />
      </div>
    </div>
  </div>
</template>
