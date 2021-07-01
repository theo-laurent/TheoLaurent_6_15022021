const http = require("http");
const app = require("./app");
const normalizePort = function (val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  } else {
    return false;
  }
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = function (error){
    if (error.syscall !== "listen"){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port" + port;
    switch (error.code){
        case "EACCES":
            console.error(bind + "requires elevated privileges.");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + "is already use.");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on("error",errorHandler);
server.on("listenning",function(){
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port" + port;
    console.log("Listenning on"+ bind);
});

server.listen(port);

