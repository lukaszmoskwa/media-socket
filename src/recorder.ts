import { RecordRTCPromisesHandler } from "recordrtc";
type RecordingOptions = {
  timeSlice?: number;
  media: {
    audio: boolean;
    video: boolean;
  };
};
type RecorderConfiguration = {
  recording: RecordingOptions;
  ws?: WebSocket; // Use existing WebSocket
  wsUrl?: string; // Use this url to create a new WebSocket
};
export class Recorder {
  private _ws: WebSocket;
  private _recorder: RecordRTCPromisesHandler;
  private _recording: RecordingOptions;
  constructor(configuration: RecorderConfiguration) {
    this.validateConfiguration(configuration);
    this._ws = configuration.ws || new WebSocket(configuration.wsUrl);
    this._recording = configuration.recording;
  }

  async setupRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia(
      this._recording.media
    );
    this._recorder = new RecordRTCPromisesHandler(stream, {
      type: "video",
      mimeType: "video/webm;codecs=vp9",
      timeSlice: this._recording.timeSlice || 1000,
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
  }
}
