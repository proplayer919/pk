// make a webserver
var WebServer = require("webserver").WebServer;
var server = new WebServer();
server.listen(8080);

// if it is a POST request, then we need to parse the body
var parseBody = function (request) {
    var body = request.body;
    var params = {};
    if (body) {
        var pairs = body.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }
    return params;
};

// handle the request
var handleRequest = function (request, response) {
    var params = parseBody(request);
    var action = params.action;
    var name = params.name;
    var result = {};
    if (action == "get-package") {
        // return a file
        var file = new File("/packages/" + name + ".zip");
        if (file.exists) {
            result = {
                "status": "ok",
                "file": file.read(),
                "message": "package found"
            };
        } else {
            result = {
                "status": "error",
                "file": null,
                "message": "package not found"
            };
        }
    }
    response.statusCode = 200;
    response.write(JSON.stringify(result));
    response.close();
};

// start listening
server.start(handleRequest);