if (Clipboard.isSupported()) {
  var exBtn = document.getElementById("example");
  var clipboard = new Clipboard(exBtn);

  exBtn.addEventListener("mouseleave", function(){
    setTimeout(function(){
      exBtn.setAttribute("tooltip", "");
    }, 350);
  });

  clipboard.on("success", function(e) {
    exBtn.setAttribute("tooltip", "Copiado para área de transferência!")
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
