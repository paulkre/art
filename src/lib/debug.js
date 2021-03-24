import { useRoute } from 'vue-router';

export const useDebug = () => {
  const route = useRoute();
  console.log(route.query);
  return route.query?.debug;
};
