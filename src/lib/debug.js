//@ts-check
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { createMessage, safeJsonParse, ws, emitter } from "../lib";

export const debug = ref(false);
export const admin = ref(false);
export const update = ref(false);

export const useAdmin = () => {
  const route = useRoute();
  watch(
    () => route.query,
    () => {
      console.log(route.query.hasOwnProperty("debug"));
      debug.value = route.query.hasOwnProperty("debug");
      admin.value = route.query.hasOwnProperty("admin"); // @TODO use admin key
    },
    { immediate: true }
  );

  ws.addEventListener("message", ({ data }) => {
    const message = safeJsonParse(data);
    if (message.type === "UPDATE") {
      update.value = true;
    }
  });

  const sendUpdate = () => {
    const outgoingMessage = createMessage({
      type: "UPDATE",
    });
    ws.send(outgoingMessage);
  };

  const applyUpdate = () => {
    update.value = false;
    location.reload();
  };
  return { sendUpdate, applyUpdate };
};
