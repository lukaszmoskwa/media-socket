<template>
  <h2>test</h2>

  <video id="video"></video>

  <button @click="startRecording">Start recording</button>
  <button @click="startPlaying">Start playing</button>
</template>

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
    // TODO: Complete the example
    console.log(MediaSocket.Player);
    this.ws = new WebSocket("ws://localhost:3000");
    // this.ws = new WebSocket("ws://localhost:3000/client2/123");
    // this.ws.onopen = () => {
    //   this.ws.send("hello");
    // };
  },
  methods: {
    async startPlaying() {
      const video = document.getElementById("video");
      this.player = new MediaSocket.Player({
        video,
        ws: this.ws,
        // wsUrl: "ws://localhost:3000/client2/123",
      });
      await this.player.setupPlayer();
    },
    async startRecording() {
      this.recorder = new MediaSocket.Recorder({
        recording: {
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
