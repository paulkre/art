const pattern = /\s*[a-zA-Z\/\/:\.]*youtu(?:be.com\/watch\?v=|.be\/)([a-zA-Z0-9\-_]+)(?:[a-zA-Z0-9\/\*\-\_\?\&\;\%\=\.]*)/gim;
const text = `adashhda https://www.youtube.com/watch?v=oyJSV9nnt10 ddasdhjshd djsadjsa jdh https://www.youtube.com/watch?v=U1_Knnpo_Ds  dasdjasjdashd adjjjj daada`;
export const result = text.replace(
  pattern,
  `<lite-youtube
videoid="$1" />`
);
