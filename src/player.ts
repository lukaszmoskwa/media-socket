type PlayerConfiguration = {
  video: HTMLVideoElement;
  ws?: WebSocket; // Use existing WebSocket
  wsUrl?: string; // Use this url to create a new WebSocket
};
export class Player {
  private _video: HTMLVideoElement;
  private _ws: WebSocket;
  private _sourceBuffer: SourceBuffer;
  constructor(configuration: PlayerConfiguration) {
    this.validateConfiguration(configuration);
    this._video = configuration.video;
    this._ws = configuration.ws || new WebSocket(configuration.wsUrl);
  }

  async setupPlayer() {
    // 1. Create a `MediaSource`
    var mediaSource = new MediaSource();

    // 2. Create an object URL from the `MediaSource`
    var url = URL.createObjectURL(mediaSource);

    // 3. Set the video's `src` to the object URL
    this._video.src = url;
    // 4. On the `sourceopen` event, create a `SourceBuffer`
    this._sourceBuffer = await new Promise((resolve, reject) => {
      const getSourceBuffer = () => {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer(
            `video/webm; codecs="vp9,opus"`
          );
          resolve(sourceBuffer);
        } catch (e) {
          reject(e);
        }
      };
      if (mediaSource.readyState === "open") {
        getSourceBuffer();
      } else {
        mediaSource.addEventListener("sourceopen", getSourceBuffer);
      }
    });
  }

  async startPlaying() {
    this._ws.onmessage = async (event) => {
      const buffer = await event.data.arrayBuffer();
      console.log(buffer);
      this._sourceBuffer.appendBuffer(buffer);
      this._video.play();
    };
  }

  async stopPlaying() {
    this._video.pause();
  }

  private validateConfiguration(configuration: PlayerConfiguration) {
    if (!configuration.video) {
      throw new Error("Video element must be provided");
    }
    if (!configuration.ws && !configuration.wsUrl) {
      throw new Error("Either ws or wsUrl must be provided");
    }
  }
}
