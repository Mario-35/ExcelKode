let _format = {};

SetStickerSize(33);
//Name the list title 
const typeHandler = function (e) {
    document.getElementById('printTitle').innerHTML = e.target.value;
    localStorage.setItem('Title', e.target.value); //Save Title to localStorage
}

//Add date to bottom
document.getElementById('date').innerHTML = Date();

//Excel barcode functions
const uploadedFile = document.getElementById('uploadedFile');
const excelDataTable = document.getElementById('excelDataTable');

uploadedFile.addEventListener('change', handleFileSelect, false);

function handleFileSelect(evt) {
    excelDataTable.innerHTML = "";
    const files = evt.target.files;
    const xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
}

class ExcelToJSON {
    parseExcel(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            workbook.SheetNames.forEach((sheetName) => {
                const XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                const json_object = JSON.stringify(XL_row_object);
                buildHtmlTable(JSON.parse(json_object), 'excelDataTable');
                JsBarcode(".barcode").init();
            });
        };

        reader.onerror = (ex) => console.log(ex);

        reader.readAsBinaryString(file);
    }
}

// Builds the HTML Table out of myList.
function buildHtmlTable(myList, selector) {
    const table = document.getElementById(selector);
    for (let i = 0; i < myList.filter(e => e["Année"]).length; i += _format.step) {
        const row = table.insertRow(-1);
        for (let j = 0; j < _format.step; j ++) {
            const cell = row.insertCell(-1);
            CreateCard(myList[i+j], cell);
        }
    }
}

function CreateCard(input, to) {
    var table = document.createElement('table');
    table.style.width = `"${_format.width}%"`; 
    table.style.height = `"${_format.height}%"`; 
    var tr1 = table.insertRow(-1);  
    var td1 = document.createElement('td');
    td1.style.width = "25%"; 
    var td2 = document.createElement('td');
    td2.style.width = "50%"; 
    td2.rowSpan = "4";
    var td3 = document.createElement('td');
    td3.style.width = "25%"; 
    
        var text1 = document.createTextNode(input["N°échantillon"] || "");        
        var text3 = document.createTextNode(input["Libellé libre"] || "");
        
        td1.appendChild(text1);
        td2.innerHTML = `<svg class="barcode" jsbarcode-value="${input["Code Barre"]}" jsbarcode-height="35" jsbarcode-width="2"</svg>`;
        td3.appendChild(text3);
        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tr1.appendChild(td3);

        table.appendChild(tr1);



        var tr2 = table.insertRow(-1);
        var td21 = document.createElement('td');
        var td22 = document.createElement('td');
        var text21 = document.createTextNode(input["Année"] || "");
        var text22 = document.createTextNode('');
        td21.appendChild(text21);
        td22.appendChild(text22);
        tr2.appendChild(td21);
        tr2.appendChild(td22);
        table.appendChild(tr2);

        var tr3 = table.insertRow(-1);
        var td31 = document.createElement('td');
        var td32 = document.createElement('td');
        var text31 = document.createTextNode(input["Site"] || "");
        var text32 = document.createTextNode('');
        td31.appendChild(text31);
        td32.appendChild(text32);
        tr3.appendChild(td31);
        tr3.appendChild(td32);
        table.appendChild(tr3);

        var tr4 = table.insertRow(-1);
        var td41 = document.createElement('td');
        var td42 = document.createElement('td');
        var text41 = document.createTextNode(input["Scientifique"] || "");
        var text42 = document.createTextNode(input["Péremption"] || "");
        td41.appendChild(text41);
        td42.appendChild(text42);
        tr4.appendChild(td41);
        tr4.appendChild(td42);
        table.appendChild(tr4);


    to.appendChild(table);
}

function cmToPx(input) {
    return +input / 0.026458;
}

function pxToCm(input) {
    return +input * 0.026458;
}

function SetStickerSize(template) {
    switch (+template) {
        case 33:
            _format = {
                height : 9,
                step : 3,
                width : 33,
            };            
            break;
            case 16:
                _format = {
                    height : 12,
                    step : 2,
                    width : 50,
            };            
            break;
    
        default:
            _format = {
                height : 40,
                step : 1,
                width : 40,
            };
            break;
    }
}

function SetBarcodeHeight(height) {
    const elements = document.querySelectorAll(".barcode");
    for (let i = 0; i < elements.length; i++) {
        const currentElements = elements[i];
        currentElements.setAttribute('jsbarcode-height', height);
    }
    JsBarcode(".barcode").init();
}
