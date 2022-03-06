import { RecordRTCPromisesHandler } from "recordrtc";

type RecordingOptions = {
  timeSlice?: number;
  media: {
    audio: boolean;
    video: boolean;
  };
};

type RecorderConfiguration = {
  recordingOptions: RecordingOptions;
  ws?: WebSocket; // Use existing WebSocket
  wsUrl?: string; // Use this url to create a new WebSocket
};

export class Recorder {
  private _ws: WebSocket;
  private _recorder: RecordRTCPromisesHandler;
  private _recordingOptions: RecordingOptions;

  constructor(configuration: RecorderConfiguration) {
    this.validateConfiguration(configuration);
    this._ws = configuration.ws || new WebSocket(configuration.wsUrl);
    this._recordingOptions = configuration.recordingOptions;
  }

  async setupRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia(
      this._recordingOptions.media
    );
    const type = this._recordingOptions.media.video ? "video" : "audio";
    const mimeType = this._recordingOptions.media.video
      ? "video/webm;codecs=vp9"
      : "audio/webm";
    this._recorder = new RecordRTCPromisesHandler(stream, {
      type,
      mimeType,
      timeSlice: this._recordingOptions.timeSlice || 1000,
      ondataavailable: (blob) => {
        this._ws.send(blob);
      },
    });
  }

  async startRecording() {
    if (!this._recorder) {
      throw new Error("Recorder not created");
    }
    this._recorder.startRecording();
  }

  async stopRecording() {
    if (!this._recorder) {
      throw new Error("Recorder not created");
    }
    this._recorder.stopRecording();
  }
  private validateConfiguration(configuration: RecorderConfiguration) {
    if (!configuration.ws && !configuration.wsUrl) {
      throw new Error("Either ws or wsUrl must be provided");
    }
    if (
      !configuration.recordingOptions.media.audio &&
      !configuration.recordingOptions.media.video
    ) {
      throw new Error("Either audio or video media option must be provided");
    }
  }
}
