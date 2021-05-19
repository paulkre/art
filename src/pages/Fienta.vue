<script setup>
import { ref } from "vue";
import { whenever, useStorage, until } from "@vueuse/core";
import { onBeforeRouteUpdate, useRouter } from "vue-router";
import { useRouteQuery } from "@vueuse/router";
import {
  tickets,
  getStrapi,
  strapi,
  fienta,
  uniqueCollection,
  config,
  strapiFestivals,
  strapiEvents,
} from "../lib";

const router = useRouter();
const code = useRouteQuery("code");

const getLocalTicket = (code) => {
  const ticket = tickets.value?.find((ticket) => ticket.code == code);
  return ticket;
};

const getEventOrFestivalRoute = async (fienta_id) => {
  // @TODO Consider until(strapiEvents) / until(strapiFestivals)
  // @TODO Consider
  // await until(strapiFestivals).toBeTruthy();
  // await until(strapiEvents).toBeTruthy();

  const [festivals, events] = await Promise.all([
    strapi.get("festivals").json(),
    strapi.get("events").json(),
  ]);

  const ticketEvent = events.find(
    (e) => e.fienta_id && e.fienta_id == fienta_id
  );
  const ticketFestival = festivals.find(
    (f) => f.fienta_id && f.fienta_id == fienta_id
  );
  if (ticketEvent) {
    return `/strapi/${ticketEvent.festival.slug}/${ticketEvent.slug}`;
  } else if (ticketFestival) {
    return `/strapi/${ticketFestival.slug}`;
  } else {
    return null;
  }
};

const storeLocalTicket = (code, fienta_id) => {
  tickets.value = uniqueCollection(
    [
      ...tickets.value,
      {
        code: code,
        fientaid: fienta_id,
      },
    ],
    "code"
  );
};

const getRemoteTicket = (code) =>
  fienta
    .get(`tickets/${code}`)
    .json()
    .then((res) => {
      return {
        fienta_status: res?.ticket?.status,
        fienta_id: res?.ticket?.event_id,
      };
    });

whenever(
  code,
  async () => {
    const localTicket = getLocalTicket(code.value);
    if (localTicket) {
      // We use "fientaid" for backward compatibility
      const route = await getEventOrFestivalRoute(localTicket.fientaid);
      if (route) {
        router.push(route);
      }
    } else {
      console.log(code.value);
      const remoteTicket = await getRemoteTicket(code.value);
      if (remoteTicket) {
        const route = await getEventOrFestivalRoute(remoteTicket.fienta_id);
        if (route) {
          storeLocalTicket(code.value, remoteTicket.fienta_id);
          router.push(route);
        }
      }
    }
  },
  { immediate: true }
);

const manualCode = ref("");
const submitCode = () => {
  if (manualCode.value) {
    code.value = manualCode.value;
  }
};
</script>
<template>
  <overlay>
    <img style="height: 96px" src="/favicon.svg" />
    <div />
    <h1>
      Somehow we can not validate your ticket.<br />But lets try to get you in
    </h1>
    <div />
    <p>
      There is a ticket code in your ticket email,<br />just below the "Sisene
      üritusele / Enter event" blue button
    </p>
    <div />
    <input
      v-model="manualCode"
      placeholder="Enter the ticket code"
      style="width: 200px"
    />
    <button-big @click="submitCode">Submit code</button-big>
    <div />
    <a
      v-if="config.fientaPublicUrl"
      :href="config.fientaPublicUrl"
      target="_blank"
      style="text-decoration: underline"
    >
      No tickets yet? Get them here
    </a>
    <div />
    <p v-if="config.phoneUrl">
      <span style="opacity: 0.5">Having problems with getting in? Call</span>
      &nbsp;
      <a :href="config.phoneUrl">{{ config.phoneUrl.replace("tel:", "") }}</a>
    </p>
  </overlay>
</template>
