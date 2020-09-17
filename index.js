"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var http = require("http");
var path_1 = require("path");
var url_1 = require("url");
var publicDir = path_1.resolve(__dirname, "public");
var server = http.createServer();
server.on("request", function (request, response) {
    var method = request.method, url = request.url, headers = request.headers;
    console.log("method", method);
    if (method !== "GET") {
        response.statusCode = 405;
        response.end();
        return;
    }
    var pathname = url_1.parse(url).pathname;
    var path = (pathname === null || pathname === void 0 ? void 0 : pathname.substr(1)) || "index.html";
    fs_1.readFile(path_1.resolve(publicDir, path), function (error, data) {
        if (error) {
            console.log(error);
            if (error.errno === -4058) {
                fs_1.readFile(path_1.resolve(publicDir, "404.html"), function (error, data) {
                    if (error)
                        throw error;
                    response.statusCode = 404;
                    response.end(data);
                });
            }
            else if (error.errno === -4068) {
                response.statusCode = 403;
                response.setHeader("Content-Type", "text/html; charset=utf-8");
                response.end("您无权查看");
            }
        }
        else {
            response.setHeader("Cache-Control", "public, max-age=31536000");
            response.end(data);
        }
    });
});
server.listen(8888, function () {
    console.log("server listen on 8888");
});
