import { readFile } from "fs";
import * as http from "http";
import { resolve } from "path";
import { parse } from "url";
const publicDir = resolve(__dirname, "public");

const server = http.createServer();
server.on(
  "request",
  (request: http.IncomingMessage, response: http.ServerResponse) => {
    const { method, url, headers } = request;
    console.log("url", url);
    const { pathname } = parse(url as string);
    const path = pathname?.substr(1) || "index.html";

    readFile(resolve(publicDir, path), (error, data) => {
      if (error) {
        response.statusCode = 404;
        response.end();
      }
      response.end(data);
    });
  }
);

server.listen(8888, () => {
  console.log("server listen on 8888");
});
