if (Clipboard.isSupported()) {
  var exBtn = document.getElementById("example");
  var clipboard = new Clipboard(exBtn);

  clipboard.on("success", function(e) {
      console.log("success");
  });
  clipboard.on("error", function(e) {
      console.log("error");
  });
}
