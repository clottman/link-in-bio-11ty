var routeParser = require("route-parser");

var req = {path: '/api/articles?tag=vuejs'};

var thisRoute = '/api/articles?tag=:tag';
var route = new routeParser(thisRoute);
var matchedPathKeys = route.match(req.path);
console.log(matchedPathKeys);