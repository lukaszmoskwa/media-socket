<template>
  <div class="page">
    <h1>Vue3 Example</h1>
    <video id="video"></video>
    <button @click="startRecording">Start recording</button>
  </div>
</template>

<style lang="css">
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
video {
  border: 2px solid black;
  height: 200px;
}
button {
  margin-top: 20px;
  border: 2px solid black;
  padding: 4px 10px;
}
</style>

<script>
import * as MediaSocket from "media-socket";

export default {
  name: "App",
  data() {
    return {
      ws: null,
      recorder: null,
      player: null,
    };
  },
  async mounted() {
    this.ws = new WebSocket("ws://localhost:3000");
    this.setupPlayer();
  },
  methods: {
    async setupPlayer() {
      const video = document.getElementById("video");
      this.player = new MediaSocket.Player({
        playingOptions: {
          element: video,
          media: {
            video: true,
            audio: true,
          },
        },
        ws: this.ws,
      });
      await this.player.setupPlayer();
    },
    async startRecording() {
      this.recorder = new MediaSocket.Recorder({
        recordingOptions: {
          timeSlice: 200,
          media: {
            audio: true,
            video: true,
          },
        },
        ws: this.ws,
      });
      await this.recorder.setupRecorder();
      this.recorder.startRecording();
      this.player.startPlaying();
    },
  },
};
</script>
