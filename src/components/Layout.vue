<template>
  <div>
    <slot />
    <div class="Top">
      <Flex><slot name="top-left" /></Flex>
      <Flex><slot name="top-center" /></Flex>
      <Flex><slot name="top-right" /></Flex>
    </div>
    <div class="Bottom">
      <Flex><slot name="bottom-left" /></Flex>
      <Flex><slot name="bottom-center" /></Flex>
      <Flex><slot name="bottom-right" /></Flex>
    </div>
  </div>
</template>

<style>
.Top {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.Bottom {
  position: fixed;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.Top > *,
.Bottom > * {
  min-width: 32px;
}
</style>
