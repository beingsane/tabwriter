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
  instrToTables(string);
  tabCreated = true;
  sessionStorage.setItem("tabwriter-tab", string);
  this.blur();
  document.querySelector("body").focus();

});

window.addEventListener("resize", function(){
  if (tabCreated && sessionStorage.getItem("tabwriter-tab")) {
    var string = sessionStorage.getItem("tabwriter-tab");
    instrToTables(string);
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
  let instr = textarea.value;
  instrToPdf(instr);
});

function instrToTables(instr){
  if (instr) {
    // measure max tab length
    let table = createTableIn(dashboard);
    let maxLength = maxStringLength(table[0]);
    console.log("max len", maxLength)

    // delete all tables
    for (var i = 0; i < dashboard.children.length; i++) {
      if (dashboard.children[i].tagName === 'TABLE') {
        dashboard.removeChild(dashboard.children[i]);
        i -= 1;
      }
    }

    // convert instructions to tab blocks
    let tabs = readInstructions(instr);
    tabs = wrapTabs(tabs, '--', maxLength);

    for (var i = 0; i < tabs.length; i++){
      // create table
      let table = createTableIn(dashboard);

      // write tab lines on table
      for (var j = 0; j < CHORDS.length; j++){
        table[j].textContent = tabs[i][j];
      }
    }
  }
}

function instrToPdf(instr){
  // convert instructions to tab blocks
  let tabs = readInstructions(instr);
  tabs = wrapTabs(tabs, '--', PDF_MAX_STRING_LENGTH);

  // initialize jsPDF document
  let doc = new jsPDF();
  doc.setFont('courier');
  doc.setFontType('normal');
  doc.setFontSize(12);

  // initialize writing parameters
  let pdfPages = 1;
  let docY = 35;

  // write tabs to pdf
  for (var i = 0; i < tabs.length; i++){
    for (var j = 0; j < CHORDS.length; j++){
      doc.text(20, docY, tabs[i][j]);
      docY += PDF_Y_SPACE;
    }

    // check if a new page is required
    if (docY + PDF_Y_SPACE * CHORDS.length < 275){
      docY += PDF_Y_SPACE;
    } else {
      doc.addPage();
      docY = 35;
      pdfPages += 1;
    }
  }

  // set parameters to write header and footer
  let date = new Date();
  doc.setFont("helvetica");
  doc.setFontSize(9);

  // write header and footer on each page
  for (var i = 0; i < pdfPages; i++){
    doc.setPage(i+1);
    // header
    doc.addImage(logoURL, 'JPEG', 20, 15, 10 * 320/48, 10);
    doc.text(181, 23, (i+1).toString() + "/" + pdfPages.toString())

    // footer
    doc.text(20, 280, "Criado com Tab-Writer (tabwriter.herokuapp.com) em " +
             date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + ".")
  }

  // save pdf
  doc.save('tabwriter.pdf');
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
  text = "0";

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
      height = pixelToNumber(style.height),
      borderTor,
      borderBottom;

  if(/Edge\/\d./i.test(navigator.userAgent)){
    // is Edge
    borderTop = pixelToNumber(style.borderTopWidth);
    borderBottom = pixelToNumber(style.borderBottomWidth);
  } else {
    borderTop = pixelToNumber(style.borderTop);
    borderBottom = pixelToNumber(style.borderBottom);
  }

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

function wrapTabs(tab, border, maxLength){
  // create structure to store each block
  let tabs = [];
  let k = 0;
  // break tab into blocks
  do {
    k += 1;
    // create a new block
    let block = [];

    // push each wrapped tab to block
    for (var i = 0; i < CHORDS.length; i++){
      let intro = CHORDS[i] + ") ";
      let content = tab[i].slice(0, maxLength - 1 - intro.length - 2 * border.length);
      let blockLine = intro + border + content + border;

      // fill the blockLine with dashes if necessary
      if (blockLine.length < maxLength - 1){
        let filler = Array(maxLength - blockLine.length).join("-");
        blockLine += filler;
      }

      block.push(blockLine);

      // removes the written part from the tab
      tab[i] = tab[i].slice(maxLength - 1 - intro.length - 2 * border.length, tab[i].length);
    }

    // store block on tabs
    tabs.push(block);

    // check if the remaining lines in tab aren't empty
    let empty = Array(CHORDS.length).fill(0);
    tab.forEach(function(tabLine, i){
      if (tabLine === Array(tabLine.length + 1).join("-")){
        empty[i] = 1;
      }
    });

    let emptySum = empty.reduce(function(a, b){return a + b;});
    if (emptySum === CHORDS.length){
      tab[0] = "";
    }
    console.log(tab[0], tab[0].length)
  } while(tab[0].length > 0 && k < 25);

  return tabs;
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
