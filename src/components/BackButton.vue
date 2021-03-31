<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({ to: { type: String, default: "/" } });

const router = useRouter();

const onBack = () => {
  // if (history?.state?.back) {
  //   router.go(-1);
  // } else {
  router.push(props.to);
  //}
};
</script>

<template>
  <button-plain @click="onBack">
    <IconLeft />
  </button-plain>
</template>
