rangeSlider.addEventListener("input", showSliderValue, false);
fileone.addEventListener('change', handleFileSelect, false);
document.getElementById('print').style.display = "none";
document.getElementById('generate').style.display = "none";

// change sticker size
function isGenerate() {
    var elem = document.getElementById("generate");
    return elem.id.toUpperCase() === elem.innerHTML.toUpperCase();
}

function showSliderValue() {
  stickerSizeLabel.innerHTML = `${stickerSizeLabel.innerText.split(":")[0]} : ${rangeSlider.value}`;
  if (isGenerate() ) SetBarcodeHeight();
}

showSliderValue();


function createFilter() {
    var element = document.getElementById('filter');
    var temp = [];
    element.value.split(",").forEach(function(e) {
        if (e.includes(":")) {
            var f = e.split(":");
            for (let g = +f[0]; g <= +f[1]; g++) {
                temp.push(+g);
              } 
        } else temp.push(+e);
    });
    return temp;
}

function refresh() {
    filters = createFilter();
    clearElementChilds(pages);
    buildSticker(Object.values(_src));
    JsBarcode(".barcode").init();
    document.getElementById("generate").innerHTML = "Refresh";
}

function handleFileSelect(evt) {
    var files = evt.target.files;
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
    document.getElementById('print').style.display = "initial";
    document.getElementById('generate').style.display = "initial";
    
}

class ExcelToJSON {
    parseExcel(file) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            workbook.SheetNames.forEach((sheetName) => {
                if (sheetName.toUpperCase() === "IDENTIFICATION") {
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var json_object = JSON.stringify(XL_row_object);
                    _src = {..._src, ... JSON.parse(json_object)}
                }
            });
        };
        reader.onerror = (ex) => console.log(ex);
        reader.readAsBinaryString(file);
    }
}
// Builds the HTML Table out of myList.
function notNull(input) {
    if (typeof input === "number" && input != 0) return false;
    if (typeof input === "string" && input.trim() === "") return false;
    return true;
}

function getStickerNb() {
    if (document.getElementById("radio-1").checked) return 1;
    if (document.getElementById("radio-16").checked) return 16;
    if (document.getElementById("radio-33").checked) return 33;
}

function SetBarcodeHeight() {
    var elements = document.querySelectorAll(".barcode");
    for (let i = 0; i < elements.length; i++) {
        var currentElements = elements[i];
        currentElements.setAttribute('jsbarcode-height', rangeSlider.value);
    }
    JsBarcode(".barcode").init();
}



