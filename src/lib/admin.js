//@ts-check
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  createMessage,
  safeJsonParse,
  ws,
  emitter,
  useLocalstorage,
} from "../lib";

export const superuser = ref(false);
export const admin = ref(false);
export const beforeUpdate = ref(false);

const updated = useLocalstorage("elektron_updated", false);

export const useAdmin = () => {
  const route = useRoute();
  watch(
    () => route.query,
    () => {
      superuser.value = route.query.hasOwnProperty("superuser"); // @TODO use superuser key
      admin.value = route.query.hasOwnProperty("admin"); // @TODO use admin key
    },
    { immediate: true }
  );

  ws.addEventListener("message", ({ data }) => {
    const message = safeJsonParse(data);
    if (message.type === "UPDATE") {
      beforeUpdate.value = true;
    }
  });

  const sendUpdate = () => {
    const outgoingMessage = createMessage({
      type: "UPDATE",
    });
    ws.send(outgoingMessage);
  };

  const runUpdate = () => {
    updated.value = true;
    location.reload();
  };

  const runPostUpdate = () => {
    updated.value = false;
    emitter.emit("unmute");
  };

  return { sendUpdate, runUpdate };
};
