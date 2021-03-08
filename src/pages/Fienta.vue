<script setup>
import { ref } from "vue";
import { fienta, config } from "../lib";

const code = ref("");
const onSubmitCode = async () => {
  const ticket = await fienta.get(`tickets/${config.fientaTestcode}`).json();
  console.log(ticket);
};
// const updatedTicket = await fienta
//   .put(`tickets/${code}`, { json: { status: "USED" } })
//   .json();
</script>

<template>
  <div>
    <Overlay>
      <h1>Check your ticket</h1>
      <input v-model="code" />
      <Button @click="onSubmitCode">Check my ticket</Button>
    </Overlay>
    <ButtonBack />
  </div>
</template>
