var input = document.querySelector("textarea"),
    button = document.querySelector("#create"),
    dashboard = document.querySelector("#dashboard"),
    db = document.querySelector("#db");

var CHORDS = ["E", "B", "G", "D", "A", "E"];

button.addEventListener("click", function(){
  var string = input.value;
  stringToTables(string);
  input.value = "";
  db.textContent = string;
});

window.addEventListener("resize", function(){
  var string = db.textContent;
  stringToTables(string);
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
    var tabs = readInputString(string);
    var k = 0;
    do {
      // create table
      var cells = createTableIn(dashboard);
      // checks for the maximum string length for one line
      var strLength = maxStringLength(cells[0]);

      cells.forEach(function(cell, i){
        // writes each tab on each row
        var intro = CHORDS[i] + ") ";
        cell.textContent =  intro + tabs[i].slice(0, strLength - 1 - intro.length);
        // removes from tabs the written part
        tabs[i] = tabs[i].slice(strLength - 1 - intro.length, tabs[i].length);
      });

      k += 1;
    } while(tabs[0].length > 0 && k < 25);
    // var tables = document.querySelectorAll("table");
    // tables.forEach(function(table, i){
    //   console.dir(table)
    //   tables[i].className = "table";
    // });
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

function cellsFromTable(table){
  var cells = [];
  for (var i = 0; i < table.children.length; i++) {
    if (table.children[i].tagName === "TBODY") {
      var tbody = table.children[i];
      break
    }
  }

  for (var row = 0; row < tbody.children.length; row++){
    if (tbody.children[row].tagName === "TR") {
      var tr = tbody.children[row];
      cells.push([]);
      for (var col = 0; col < tr.children.length; col++){
        if (tr.children[col].tagName === "TD"){
          var td = tr.children[col];
          cells[cells.length - 1].push(td);
        }
      }
    }
  }
  return cells;
}

function maxStringLength(element){
  var initialText, text;
  initialText = element.textContent;
  text = "a";
  element.textContent = text;

  var heights = getHeights(element),
      lineHeight = heights[0],
      height = heights[1];

  while (height === lineHeight && text.length < 200){
    text += "a";
    element.textContent = text;

    var heights = getHeights(element)
    lineHeight = heights[0],
    height = heights[1];
  }
  element.textContent = initialText;
  return (text.length - 1);
}

function getHeights(element){
  var style = window.getComputedStyle(element),
      lineHeight = style.lineHeight,
      paddingTop = style.paddingTop,
      paddingBottom = style.paddingBottom,
      borderTop = style.borderTop,
      borderBottom = style.borderBottom,
      height = style.height;

  paddingTop = Number(paddingTop.slice(0, paddingTop.indexOf("px")));
  paddingBottom = Number(paddingBottom.slice(0, paddingBottom.indexOf("px")));
  borderTop = Number(borderTop.slice(0, borderTop.indexOf("px")));
  borderBottom = Number(borderBottom.slice(0, borderBottom.indexOf("px")));

  lineHeight = Number(lineHeight.slice(0, lineHeight.length - 2));
  height = Number(height.slice(0, height.length - 2));
  height -= paddingTop + paddingBottom + borderTop + borderBottom;
  return [lineHeight, height];
}

function readInputString(string){
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
