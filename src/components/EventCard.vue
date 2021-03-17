<script setup>
import { defineProps } from "vue";
defineProps({ event: { type: Object } });
</script>
<template>
  <RouterLink class="EventCard" :to="'/' + event.eventid">
    <component
      :is="event.fientaid ? 'icon-stage' : 'icon-stage'"
      :style="{ color: event.fientaid ? '#f2dc5d' : '' }"
    />
    <div class="EventContent">
      <h3>{{ event.title }}</h3>
      <div class="EventDate" v-if="event.from">
        <span
          v-if="event.fientaid"
          style="
            background: #f2dc5d;
            padding: 0 2px;
            border-radius: 2px;
            color: rgba(0, 0, 0, 0.7);
            font-size: 0.8em;
            text-transform: uppercase;
            font-weight: bold;
            transform: translateY(-10px);
          "
          >Ticket</span
        >
        {{ event.from }} {{ event.to ? "→" : "" }} {{ event.to }}
      </div>
      <div class="EventIntro">{{ event.intro }}</div>
    </div>
  </RouterLink>
</template>

<style scoped>
.EventCard {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
}
.EventCard > .Icon {
  transform: scale(1.4) translateY(0.4ch);
}
.EventContent {
  display: grid;
  gap: 4px;
}
.EventDate {
  font-size: 0.9em;
}
.EventIntro {
  opacity: 0.85;
}
</style>
