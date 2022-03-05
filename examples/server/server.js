const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);

app.ws("/", function (ws, req) {
  ws.on("message", function (msg) {
    console.log(msg);
    ws.send(msg);
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
