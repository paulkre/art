<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLocalstorage, fienta, uniqueCollection } from "../lib";

const router = useRouter();
const { query } = useRoute();

const code = ref(query.code);
const status = ref("");

const codes = useLocalstorage("elektron_codes", []);

const isLocalCode = computed(() =>
  codes.value.map(({ code }) => code).includes(code.value)
);

const onCheck = async () => {
  if (code.value) {
    fienta
      .get(`tickets/${code.value}`)
      .json()
      .then((res) => {
        status.value = res?.ticket?.status;
        console.log(res);

        codes.value = uniqueCollection(
          [...codes.value, { code: code.value, fientaid: res.ticket.event_id }],
          "code"
        );
      })
      .catch((e) => (status.value = "DOES NOT EXIST"));
  }
  router.push({ path: "/fienta" });
};

const onUnuse = async () => {
  fienta
    .put(`tickets/${code.value}`, { json: { status: "UNUSED" } })
    .json()
    .then(onCheck)
    .catch((e) => console.log(e));
};

const onUse = async () => {
  await fienta
    .put(`tickets/${code.value}`, { json: { status: "USED" } })
    .json()
    .then(onCheck)
    .catch((e) => console.log(e));
};

// const updatedTicket = await fienta
//   .put(`tickets/${code}`, { json: { status: "USED" } })
//   .json();

const statusString = computed(() => {
  let statuses = [];
  if (code.value) {
    statuses.push(
      `Local status: ${isLocalCode.value ? "HAS TICKET" : "NO TICKET"}`
    );
  }
  if (code.value && status.value) {
    statuses.push(`Fienta server status: ${status.value} TICKET`);
  } else {
    statuses.push(" ");
  }
  return statuses.join("\n");
});
</script>

<template>
  <div>
    <Overlay>
      <h1>Check your ticket</h1>
      <input v-model="code" placeholder="Enter ticket code" />
      <Button @click="onCheck">Check my ticket</Button>
      <pre>{{ statusString }}</pre>
      <Button v-if="status && status === 'USED'" @click="onUnuse">
        Unuse ticket
      </Button>
      <Button v-if="status && status === 'UNUSED'" @click="onUse">
        Use ticket
      </Button>
    </Overlay>
    <ButtonBack />
  </div>
</template>
