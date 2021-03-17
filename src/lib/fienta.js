import {
  ref,
  watch,
} from 'vue';

import ky from 'ky';

import {
  config,
  uniqueCollection,
  useLocalstorage,
} from './';

export const fienta = ky.extend({
  prefixUrl: config.fientaUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set("Authorization", `Bearer ${config.fientaToken}`);
      },
    ],
  },
});

// const useFienta = (event, code = null) => {
//   const code = isRef(code) ? code : ref(code);

//   const tickets = useLocalstorage("elektron_data", []);

//   const hasLocalTicket = computed(() =>
//     tickets.value?.find((ticket) => ticket.code === code.value)
//   );

//   const tickedChecked = ref(false)

//   watch(event, () => {

//   })
// };

const tickets = useLocalstorage("elektron_data", []);

const checkLocalTicket = (code, event) =>
  tickets.value?.find(
    (ticket) => ticket.code === code.value && ticket.fientaid === event.fientaid
  );

const storeLocalTicket = (code, event) => {
  tickets.value = uniqueCollection(
    [
      ...tickets.value,
      {
        code: code.value,
        fientaid: event.value.fientaid,
      },
    ],
    "code"
  );
};

const checkRemoteTicket = (code, event) =>
  fienta
    .get(`tickets/${code.value}`)
    .json()
    .then((res) => {
      if (res?.ticket?.event_id == event.value.fientaid) {
        return res?.ticket?.status;
      } else {
        return "REMOTE_CHECK_ERROR";
      }
    });

export const checkTicket = (code, event) => {
  const status = ref("NOT_CHECKED");
  watch(
    [code, event],
    () => {
      if (code.value && event.value) {
        if (checkLocalTicket(code, event)) {
          status.value = "HAS_TICKET";
        } else {
          checkRemoteTicket(code, event)
            .then((checkStatus) => {
              if (checkStatus === "UNUSED") {
                console.log(checkStatus);
                storeLocalTicket(code, event);
                status.value = "HAS_STORED_TICKET";
              }
            })
            .catch((e) => (status.value = "TICKET_DOES_NOT_EXIST"));
        }
      }
    },
    { immediate: true }
  );
  return status;
};
