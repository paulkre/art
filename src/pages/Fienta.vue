<script setup>
import { watch } from "vue";
import { until, whenever, useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useRouteQuery } from "@vueuse/router";
import { strapi } from "../lib";

const router = useRouter();
const code = useRouteQuery("code");
const tickets = useStorage("elektron_data", []);

const getLocalTicket = (code) => {
  const ticket = tickets.value?.find((ticket) => ticket.code == code);
  return ticket;
};

const getEventOrFestivalRoute = async (ticket) => {
  const events = await strapi.get("events").json();
  const festivals = await strapi.get("festivals").json();
  const ticketEvent = events.find(
    (e) => e.fienta_id && e.fienta_id == ticket.fientaid
  );
  const ticketFestival = festivals.find(
    (f) => f.fienta_id && f.fienta_id == ticket.fientaid
  );
  if (ticketEvent) {
    return `/strapi/${ticketEvent.festival.slug}/${ticketEvent.fienta_id}`;
  } else if (ticketFestival) {
    return `/strapi/${ticketFestival.slug}`;
  } else {
    return null;
  }
};

whenever(
  code,
  async () => {
    const ticket = getLocalTicket(code.value);
    console.log(ticket);
    if (ticket) {
      const route = await getEventOrFestivalRoute(ticket);
      if (route) {
        router.push(route);
      }
    }
  },
  { immediate: true }
);
</script>
<template>
  <div></div>
</template>
