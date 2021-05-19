<template>
  <h1 class="desktop">eˉl<br />ek<br />tr<br />on</h1>
  <h1 class="mobile">eˉle<br />ktron</h1>
</template>

<style scoped>
.desktop {
  display: block;
  font-size: 150px;
  line-height: 0.75em;
}
.mobile {
  display: none;
  font-size: 125px;
  line-height: 0.8em;
}

@media (max-width: 800px) {
  .desktop {
    display: none;
  }
  .mobile {
    display: block;
  }
}
</style>
