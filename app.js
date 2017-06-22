var express = require("express"),
    app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/about", function(req, res){
  res.sendFile(__dirname + "/views/about.html");
});

app.get("*", function(req, res){
  res.status(404).send("Not found!")
});

app.listen(3000, function(){
  console.log("TabWriter initialized on port 3000");
});
