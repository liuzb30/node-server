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
    console.log("method", method);
    if (method !== "GET") {
      response.statusCode = 405;
      response.end();
      return;
    }

    const { pathname } = parse(url as string);
    const path = pathname?.substr(1) || "index.html";

    readFile(resolve(publicDir, path), (error, data) => {
      if (error) {
        console.log(error);
        if (error.errno === -4058) {
          readFile(resolve(publicDir, "404.html"), (error, data) => {
            if (error) throw error;
            response.statusCode = 404;
            response.end(data);
          });
        } else if (error.errno === -4068) {
          response.statusCode = 403;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end("您无权查看");
        }
      } else {
        response.end(data);
      }
    });
  }
);

server.listen(8888, () => {
  console.log("server listen on 8888");
});
