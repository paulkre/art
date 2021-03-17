import { ref } from 'vue';

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

export const checkTicket = (code, event) => {
  const status = ref("NOT CHECKED");
  if (event.value) {
    if (checkLocalTicket(code, event)) {
      status.value = "LOCAL_TICKET";
    } else {
      fienta
        .get(`tickets/${code.value}`)
        .json()
        .then((res) => {
          status.value = res?.ticket?.status;
          tickets.value = uniqueCollection(
            [
              ...tickets.value,
              {
                code: code.value,
                fientaid: res.ticket.event_id,
              },
            ],
            "code"
          );
          console.log(tickets.value);
          console.log(status.value);
        })
        .catch((e) => (status.value = "TICKET_DOES_NOT_EXIST"));
    }
  }
  return status;
};
