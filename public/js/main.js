var textarea = document.querySelector("textarea"),
    createBtn = document.querySelector("#create"),
    dashboard = document.querySelector("#dashboard"),
    downloadBtn = document.querySelector("#download");

const PDF_MAX_STRING_LENGTH = 66;
const PDF_Y_SPACE = 5;
var CHORDS = ["E", "B", "G", "D", "A", "E"];

var tabCreated = false;

createBtn.addEventListener("click", function(){
  var string = textarea.value;
  stringToTables(string);
  tabCreated = true;
  sessionStorage.setItem("tabwriter-tab", string);
  this.blur();
  document.querySelector("body").focus();

});

window.addEventListener("resize", function(){
  if (tabCreated && sessionStorage.getItem("tabwriter-tab")) {
    var string = sessionStorage.getItem("tabwriter-tab");
    stringToTables(string);
  }
});

window.addEventListener("load", function(){
  if (sessionStorage.getItem("tabwriter-tab")) {
    var string = sessionStorage.getItem("tabwriter-tab");
    textarea.value = string;
  }
});

textarea.addEventListener("input", function(){
  var string = textarea.value;
  sessionStorage.setItem("tabwriter-tab", string);
});

downloadBtn.addEventListener("click", function(){
  // convert input string to tablature strings
  var instructions = textarea.value;
  var tabs = readInstructions(instructions);

  // initialize jsPDF document
  var doc = new jsPDF();
  var pdfPages = 1;
  doc.setFont("courier");
  doc.setFontType("normal");
  doc.setFontSize(12);
  let docY = 35;

  do {
    // writes each chord tabs in one line
    for (var i = 0; i < CHORDS.length; i++){

      // get string to be write
      var intro = CHORDS[i] + ") ";
      var border = "--";
      var content = tabs[i].slice(0, PDF_MAX_STRING_LENGTH - 1 - intro.length - border.length);
      var fullContent = intro + border + content;

      // fill the string with dashes if it is the last table
      if (fullContent.length < PDF_MAX_STRING_LENGTH - 1){
        let filler = Array(PDF_MAX_STRING_LENGTH - fullContent.length).join("-");
        fullContent += filler;
      }

      // write string to doc
      doc.text(20, docY, fullContent);
      docY += PDF_Y_SPACE;

      // removes from tabs the written part
      tabs[i] = tabs[i].slice(PDF_MAX_STRING_LENGTH - 1 - intro.length - border.length, tabs[i].length);

      if (i == 5){
        // check if the remaining tabs isn't empty
        let empty = [0, 0, 0, 0, 0, 0];
        tabs.forEach(function(tab, i){
          if (tab === Array(tab.length + 1).join("-")){
            empty[i] = 1;
          }
        });

        let emptySum = 0;
        empty.forEach(function(ept, i){
          emptySum += ept;
        });

        if (emptySum === 6){
          tabs[0] = "";
        }

        // add space between tabs and check if a new page is required
        if (tabs[0] != ""){
          if (docY + PDF_Y_SPACE * 6 < 275){
            docY += PDF_Y_SPACE;
          } else {
            doc.addPage();
            docY = 35;
            pdfPages += 1;
          }
        }
      }
    }
  } while(tabs[0].length > 0);

  var date = new Date();

  doc.setFont("helvetica");
  doc.setFontSize(9);

  for (var i = 0; i < pdfPages; i++){
    doc.setPage(i+1);
    // header
    doc.addImage(logoURL, 'JPEG', 20, 15, 10 * 320/48, 10);
    doc.text(181, 23, (i+1).toString() + "/" + pdfPages.toString())

    // footer
    doc.text(20, 280, "Criado com Tab-Writer (tabwriter.herokuapp.com) em " +
             date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + ".")
  }

  doc.save('tabwriter.pdf');
});

function stringToTables(string){
  if (string) {
    // delete all tables
    for (var i = 0; i < dashboard.children.length; i++) {
      if (dashboard.children[i].tagName === "TABLE") {
        dashboard.removeChild(dashboard.children[i]);
        i -= 1;
      }
    }

    // convert input string to tablature strings
    var tabs = readInstructions(string);
    var k = 0;
    do {
      // create table
      var cells = createTableIn(dashboard);
      // checks for the maximum string length for one line
      var strLength = maxStringLength(cells[0]);

      // writes each tab on each row
      cells.forEach(function(cell, i){

        // get string to be write
        var intro = CHORDS[i] + ") ";
        var border = "--";
        var content = tabs[i].slice(0, strLength - 1 - intro.length - border.length);
        var fullContent = intro + border + content;

        // fill the string with dashes if it is the last table
        if (fullContent.length < strLength - 1){
          let filler = Array(strLength - fullContent.length).join("-");
          fullContent += filler;
        }

        // write string to cell
        cell.textContent = fullContent;

        // removes from tabs the written part
        tabs[i] = tabs[i].slice(strLength - 1 - intro.length - border.length, tabs[i].length);

        // check if the remaining tabs isn't empty
        if (i == 5){

          let empty = [0, 0, 0, 0, 0, 0];
          tabs.forEach(function(tab, i){
            if (tab === Array(tab.length + 1).join("-")){
              empty[i] = 1;
            }
          });

          let emptySum = 0;
          empty.forEach(function(ept, i){
            emptySum += ept;
          });

          if (emptySum === 6){
            tabs[0] = "";
          }
        }
      });

      k += 1;
    } while(tabs[0].length > 0 && k < 25);
  }
}

function createTableIn(element){
  var table = document.createElement("TABLE"),
      tbody = document.createElement("TBODY"),
      cells = [];
  for (var i = 0; i < 6; i++){
    var tr = document.createElement("TR"),
        td = document.createElement("TD"),
        text = document.createTextNode("");
    td.appendChild(text);
    tr.appendChild(td);
    tbody.appendChild(tr);
    cells.push(td);
  }
  table.appendChild(tbody);
  element.appendChild(table);
  return cells;
}

function maxStringLength(row){
  var initialText, text;
  initialText = row.textContent;
  text = "=";

  do{
    row.textContent = text;
    var heights = getHeights(row),
        lineHeight = heights[0],
        rowHeight = heights[1];
    text += "=";
  } while (rowHeight === lineHeight && text.length < 200);

  row.textContent = initialText;
  return (text.length - 1);
}

function getHeights(element){
  var style = window.getComputedStyle(element),
      lineHeight = pixelToNumber(style.lineHeight),
      paddingTop = pixelToNumber(style.paddingTop),
      paddingBottom = pixelToNumber(style.paddingBottom),
      borderTop = pixelToNumber(style.borderTop),
      borderBottom = pixelToNumber(style.borderBottom),
      height = pixelToNumber(style.height);

  height -= paddingTop + paddingBottom + borderTop + borderBottom;
  return [lineHeight, height];
}

function pixelToNumber(pix){
  return Number(pix.slice(0,pix.indexOf("px")));
}

function readInstructions(string){
  // creates the six strings related to each chord
  var strings = ["", "", "", "", "", ""];
  // add spaces so the first and last words are counted
  string = " " + string + " ";
  // get the indexes of spaces
  var spaces = allIndexesOf(string, " ");

  for (var i = 0; i < spaces.length - 1; i++){
    // for each word ...
    var word = string.slice(spaces[i] + 1, spaces[i+1]);
    strings.forEach(function(str, i){
      var oper = word.slice(2, word.length) + "--";
      if (i === (Number(word[0])-1)){
        // write the tab on the selected chord
        strings[i] += oper;
      } else {
        // fill the other tabs with dashes
        strings[i] += Array(oper.length + 1).join("-");
      }
    });
  }
  return strings;
}

function allIndexesOf(string, character){
  var idx = [];
  var k = 0;
  var i = 0;

  while (k !== -1){
    var k = string.indexOf(character, i);
    if (k !== -1) {
      idx.push(k);
      i = k + 1;
    }
  }
  return idx;
}
