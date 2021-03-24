import { watch } from 'vue';

import { useRoute } from 'vue-router';

export const useDebug = () => {
  const route = useRoute();
  watch(
    () => route.query,
    () => console.log(route.query),
    { immediate: true }
  );
  return route.query?.debug;
};
