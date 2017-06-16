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

var checkBtn = document.getElementById("check-instructions");
var instructions = document.getElementById("instructions");

checkBtn.addEventListener("click", function(){
  instructions.classList.add("highlight");
  var rect = instructions.getBoundingClientRect();
  window.scrollBy(0, rect.top)
});
