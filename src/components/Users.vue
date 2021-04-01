<script setup>
import { computed, watch, ref } from "vue";
import { differenceInMilliseconds } from "date-fns";
import { Circle, Result } from "collisions";

import {
  ws,
  createMessage,
  debounce,
  config,
  users,
  userId,
  useWindow,
  scale,
  userName,
  userAbout,
  userData,
  onUserNameChange,
  useAboutTextarea,
  emitter,
  showMessages,
} from "../lib";

const props = defineProps({
  about: { type: Boolean, default: true },
});

emitter.on("TOGGLE_USERS", () => {
  showMessages.value = !showMessages.value;
});

const updatedUsers = computed(() =>
  users.value
    .map((user) => {
      user.updatedSince = differenceInMilliseconds(
        new Date(),
        new Date(user.datetime)
      );
      user.opacity = Math.min(
        0.8,
        scale(user.updatedSince, 0, config.userUpdatedSinceLimit, 1, 0.1)
      );
      return user;
    })
    .filter((user) => user.updatedSince < config.userUpdatedSinceLimit)
    .sort((a, b) => a.userId.localeCompare(b.userId))
);

const otherUsers = computed(() =>
  updatedUsers.value
    .filter(
      (user) =>
        user.userId !== userId.value && user.value.userX && user.value.userY
    )
    .sort((a, b) => a.userId > b.userId)
);

const { centerX, centerY } = useWindow();
const onUserDrag2 = ({ x, y }) => {
  userData.value = { userX: x - centerX.value, userY: y - centerY.value };
};
const onUserDrag = debounce(({ x, y }) => {
  //userData.value = { userX: x - centerX.value, userY: y - centerY.value };
  const outgoingMessage = createMessage({
    type: "USER",
    value: {
      userX: x - centerX.value,
      userY: y - centerY.value,
      userName: userName.value,
      userAbout: userAbout.value,
    },
  });
  ws.send(outgoingMessage);
}, config.messageDelay);

const otherUserStyle = (otherUser) =>
  computed(() => ({
    left: `${otherUser.value.userX + centerX.value}px`,
    top: `${otherUser.value.userY + centerY.value}px`,
  }));

const textareaRef = useAboutTextarea(showMessages);

const circle = new Circle(0, 0, 100);
const myCircle = new Circle(userData.value.userX, userData.value.userY, 10);
const result = new Result();

const colliding = computed(() => {
  myCircle.x = userData.value.userX;
  myCircle.y = userData.value.userY;
  return !!myCircle.collides(circle, result);
});

//const colliding = ref(false);
</script>

<template>
  <div>
    <Overlay
      v-if="about"
      style="
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        transition: opacity 600ms;
      "
      :style="{ opacity: showMessages ? 0.9 : 0 }"
    />
    <transition name="fade">
      <Vertical v-show="showMessages && about" class="AboutPanel">
        <h3 class="mobilehide">
          <span
            style="display: inline-block; color: red; transform: scale(0.8)"
          >
            ⬤
          </span>
          Let's get together!
        </h3>
        <Small class="mobilehide" style="opacity: 0.5"
          >Here's the place the audience can hang out and spend time together.
          Move your red dot and write messages to each other.</Small
        >
        <Small>
          <span style="opacity: 0.5">Your name is "{{ userName }}"</span>&ensp;
          <span @click="onUserNameChange" style="cursor: pointer"
            >Change the name</span
          >
        </Small>
        <textarea
          ref="textareaRef"
          v-model="userAbout"
          placeholder="Write here a message"
        />
      </Vertical>
    </transition>
    <transition name="fade">
      <Disc
        v-if="showMessages"
        style="position: fixed; pointer-events: none; border: 2px solid white"
        :style="{
          width: '200px',
          height: '200px',
          top: centerY - 100 + 'px',
          left: centerX - 100 + 'px',
          border: colliding ? '2px solid red' : ' 2px solid white',
          transition: 'all 500ms',
          transform: colliding ? 'scale(1.1)' : '',
          animation: colliding ? 'scale 1s infinite' : '',
        }"
      />
    </transition>
    <div
      v-for="otherUser in otherUsers"
      :key="otherUser.userId"
      :style="{
        ...otherUserStyle(otherUser).value,
        position: 'fixed',
        transition: 'all ' + config.messageDelay * 10 + 'ms linear',
      }"
    >
      <div style="display: grid; grid-template-columns: auto 300px; gap: 8px">
        <Dot
          color="#8800FF"
          style="transition: opacity 1000ms"
          :opacity="showMessages ? 1 : otherUser.opacity / 2"
        />
        <div v-if="showMessages && about">
          <div
            style="
              font-size: 0.8em;
              opacity: 0.5;
              line-height: 1.3em;
              padding-top: 0.5em;
            "
          >
            {{ otherUser.value.userName }}
          </div>
          <div style="font-size: 0.9em; line-height: 1.5em; padding-top: 0.3em">
            {{ otherUser.value.userAbout }}
          </div>
        </div>
      </div>
    </div>
    <draggable
      :x="userData.userX + centerX"
      :y="userData.userY + centerY"
      @drag="
        (drag) => {
          onUserDrag2(drag);
          onUserDrag(drag);
        }
      "
    >
      <div style="display: grid; grid-template-columns: auto 250px; gap: 8px">
        <Dot color="red" opacity="0.8" />
        <div v-if="showMessages && about">
          <div
            style="
              font-size: 0.8em;
              opacity: 0.5;
              line-height: 1.3em;
              padding-top: 0.3em;
            "
          >
            {{ userName }}
          </div>
          <div style="font-size: 0.9em; line-height: 1.5em; padding-top: 0.3em">
            {{ userAbout }}
          </div>
        </div>
      </div>
    </draggable>
    <audio-file
      :muted="!colliding"
      src="//elektron.fra1.digitaloceanspaces.com/backup/assets/generative-backround-hackaton.mp3"
    />
  </div>
</template>

<style>
.AboutPanel {
  position: fixed;
  left: 16px;
  bottom: 40px;
  padding: 16px;
  background: var(--bglight);
  border-radius: 6px;
  display: grid;
  grid-auto-rows: max-height;
  gap: 8px;
  width: 300px;
}
@media (max-width: 800px) {
  .AboutPanel {
    width: calc(100vw - 16px - 16px);
  }
  .mobilehide {
    display: none;
  }
}
</style>
