const connectionsObject = {};

module.exports = function (ws, req) {
  const { who, id } = req.params;
  if (!["client1", "client2"].includes(who)) return;
  ws.on("message", function (msg) {
    if (!connectionsObject[id]) {
      connectionsObject[id] = {
        client1: null,
        client2: null,
      };
    }
    connectionsObject[id][who] = ws;
    if (connectionsObject[id].client1 && connectionsObject[id].client2) {
      who === "client1"
        ? connectionsObject[id].client2.send(msg)
        : connectionsObject[id].client1.send(msg);
    }
  });
};
