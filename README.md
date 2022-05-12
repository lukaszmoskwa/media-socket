# Media-Socket

![](https://img.shields.io/github/license/Lykos94/media-socket)
![](https://img.shields.io/npm/v/media-socket)

`media-socket` is a library for sending user media in real time via websocket. The advantage of this library is that it integrates the recording, sending and client-side display of audio and video.

The library makes use of RecordRTC (https://recordrtc.org/) and WebSocket.

## Installation

The library is available for browser as compiled bundle or Node applications as es6 package

### Browser (Static Files, CDN, ...)

Import the `media-socket` bundle as follows:

```html
<script src="https://raw.githubusercontent.com/Lykos94/media-socket/master/examples/client/html/bundle.js">
```

### Node (Vue, React, ...)

To install the library you can use npm or yarn

```bash
  npm install media-socket
  # or
  yarn add media-socket
```

## Usage

The library contain two main functions: the Player and the Recorder. The recorder takes the UserMedia as stream and through RecordRTC dynamically creates the BLOB chunks to be delivered via WebSocket. The Player, on the other hand, retrieves from a WebSocket object the BLOBs, turns them into ArrayBuffer and displays the result live in a HTMLVideoElement.

### Browser (Static Files, CDN, ...)

Creating a recorder

```js
const recorder = new MediaSocket.Recorder({
  ws,
  recordingOptions: {
    timeSlice: 100,
    media: {
      audio: true,
      video: true,
    },
  },
});
```

Creating a player

```js
const video = document.getElementById("video");
const player = new MediaSocket.Player({
  playingOptions: {
    element: video,
    media: {
      video: true,
      audio: true,
    },
  },
  ws,
});
```

In both, `ws` is the WebSocket object initialized previously. If you want to initialize them on the fly with different parameters, you can also pass the `wsUrl` instead of the `ws` parameter.

```js
// Example with wsUrl
const player = new MediaSocket.Player({
  playingOptions: {
    // ...
  },
  wsUrl: "ws://localhost:3000",
});
```

### Node (Vue, React, ...)

The only difference with respect to the browser example is that you need to import the package as follows

```js
import * as MediaSocket from "media-socket";
```

## Configuration Types

### Recorder

```ts
type RecorderConfiguration = {
  recordingOptions: {
    timeSlice?: number;
    media: {
      audio: boolean;
      video: boolean;
    };
  };
  ws?: WebSocket; // Use existing WebSocket
  wsUrl?: string; // Use this url to create a new WebSocket
};
```

### Player

```ts
type PlayerConfiguration = {
  playingOptions: {
    element: HTMLVideoElement | HTMLAudioElement;
    media: {
      audio: boolean;
      video: boolean;
    };
  };
  ws?: WebSocket; // Use existing WebSocket
  wsUrl?: string; // Use this url to create a new WebSocket
};
```

## Running examples

In this repository there are a couple of examples that may be useful during the development. In order to run them:

- Clone the repository

```
git clone https://github.com/Lykos94/media-socket
```

- Go to the server folder

```
cd media-socket/examples/server
```

- Install all the dependencies

```
npm i
```

- To run the basic HTML vanilla example, you can just open the `examples/client/html/index.html` file in your browser

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@Lykos94](https://www.github.com/Lykos94)
