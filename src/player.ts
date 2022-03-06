type PlayingOptions = {
  element: HTMLVideoElement | HTMLAudioElement;
  media: {
    audio: boolean;
    video: boolean;
  };
};

type PlayerConfiguration = {
  playingOptions: PlayingOptions;
  ws?: WebSocket; // Use existing WebSocket
  wsUrl?: string; // Use this url to create a new WebSocket
};

export class Player {
  private _playingOptions: PlayingOptions;
  private _sourceBuffer: SourceBuffer;
  private _ws: WebSocket;

  constructor(configuration: PlayerConfiguration) {
    this.validateConfiguration(configuration);
    this._playingOptions = configuration.playingOptions;
    this._ws = configuration.ws || new WebSocket(configuration.wsUrl);
  }

  async setupPlayer() {
    // 1. Create a `MediaSource`
    var mediaSource = new MediaSource();

    // 2. Create an object URL from the `MediaSource`
    var url = URL.createObjectURL(mediaSource);

    // 3. Set the video's `src` to the object URL
    this._playingOptions.element.src = url;
    // 4. On the `sourceopen` event, create a `SourceBuffer`
    this._sourceBuffer = await new Promise((resolve, reject) => {
      const getSourceBuffer = () => {
        try {
          if (this._playingOptions.media.video) {
            const sourceBuffer = mediaSource.addSourceBuffer(
              `video/webm; codecs="vp9,opus"`
            );
            resolve(sourceBuffer);
          } else {
            // Audio only
            const sourceBuffer = mediaSource.addSourceBuffer(
              `audio/webm; codecs="opus`
            );
            resolve(sourceBuffer);
          }
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
      this._sourceBuffer.appendBuffer(buffer);
      this._playingOptions.element.play();
    };
  }

  async stopPlaying() {
    this._playingOptions.element.pause();
  }

  private validateConfiguration(configuration: PlayerConfiguration) {
    if (!configuration.playingOptions.element) {
      throw new Error("The player element must be specified");
    }
    if (
      !configuration.playingOptions.media.audio &&
      !configuration.playingOptions.media.video
    ) {
      throw new Error("Either audio or video media option must be provided");
    }
    if (!configuration.ws && !configuration.wsUrl) {
      throw new Error("Either ws or wsUrl must be provided");
    }
  }
}
