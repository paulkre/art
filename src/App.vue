<script setup>
import { loadMessages, refreshUser, refreshUsers, plausible } from "./lib";

loadMessages();
refreshUser();
refreshUsers();
plausible.enableAutoPageviews();
</script>

<template>
  <div :class="$style.app">
    <users />
    <layout>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button />
      </template>
    </layout>
  </div>
</template>

<style module lang="postcss">
.app {
  font-family: "Nunito Sans", sans-serif;
  font-size: 18px;
  line-height: 1.65em;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    font-family: "font-medium", sans-serif;
    line-height: 1.3em;
    font-weight: normal;
  }

  a {
    text-decoration: none;
    color: inherit;
    /* word-break: break-all; */
  }
  input,
  textarea {
    background: none;
    border: 2px solid var(--fg);
    border-radius: 3px;
    outline: none;
    padding: 8px;
    font-family: "Nunito Sans", sans-serif;
    font-size: 16px;
    line-height: 1.5em;
    color: var(--fg);
    background: var(--bg);
    width: 100%;
  }
  p {
    margin: 0;
  }
  p a {
    text-decoration: underline;
  }
  strong,
  b {
    font-weight: 900;
  }
  img {
    display: block;
    width: 100%;
  }
  code {
    background: var(--fg-lighter);
  }
  blockquote {
    margin: 0;
    font-size: 1.3em;
    line-height: 1.6em;
  }

  .icon {
    cursor: pointer;
  }
  .icon:hover {
    filter: brightness(80%);
  }
}
</style>
