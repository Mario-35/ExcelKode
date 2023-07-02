//Excel barcode functions
const uploadedFile = document.getElementById('uploadedFile');

uploadedFile.addEventListener('change', handleFileSelect, false);

function handleFileSelect(evt) {
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
                buildSticker(JSON.parse(json_object));
                JsBarcode(".barcode").init();
            });
        };

        reader.onerror = (ex) => console.log(ex);
        reader.readAsBinaryString(file);
    }
}

// Builds the HTML Table out of myList.
function buildSticker(myList) {
    const size = getStickerSize();;
    const page = document.getElementById("page");
    while (page.firstChild) {
        page.removeChild(page.firstChild);
    }
    const cards = document.createElement('div');
    cards.classList.add("cards");
    
    for (let i = 0; i < myList.filter(e => e["Année"]).length; i++) {
        const newCard = document.createElement('div');
        newCard.setAttribute("style",`width: ${size.width}cm; height: ${size.height}cm; font-size: ${size.font}px;`);

        // newCard.className = `card${nb}`;
        CreateCard(myList[i], newCard);
        cards.appendChild(newCard);
    }
    page.appendChild(cards);
}

function CreateblankCard(input, to) {
    var content = document.createElement('div');
    content.classList.add("blank");
    content.innerHTML = `<svg class="barcode" jsbarcode-value="${input["Code Barre"]}" jsbarcode-flat="true" jsbarcode-fontSize="12" jsbarcode-height="35" jsbarcode-width="1"</svg>`;

    to.appendChild(content);
}
  
function CreateCard(input, to) {

    var content = document.createElement('div');
    content.classList.add("AnotherFlexWrapper");
    var col1 = document.createElement('div');
    col1.classList.add("FlexItems");
    col1.classList.add("FlexSideOne");
    col1.innerHTML= `
    <table class="tableCard">
    <tr>
      <td class="truncate">${input[item1.value] || "&nmsp;"}</td>
    </tr>
    <tr>
      <td class="truncate">${input[item2.value] || "&nmsp;"}</td>
    </tr>
    <tr>
      <td class="truncate">${input[item3.value] || "&nmsp;"}</td>
    </tr>
  </table>  
    `;
    content.appendChild(col1);
    var col2 = document.createElement('div');
    col2.classList.add("FlexItems");
    col2.classList.add("FlexContent");
    col2.innerHTML = `<svg class="barcode" jsbarcode-value="${input[item4.value]}" jsbarcode-flat="true" jsbarcode-fontSize="12" jsbarcode-height="35" jsbarcode-width="1"</svg>`;

    content.appendChild(col2);
    var col3 = document.createElement('div');
    col3.classList.add("FlexItems");
    col3.classList.add("FlexSideTwo");
    col3.innerHTML= `
    <table class="tableCard">
    <tr colZspan= "3">
      <td class="truncate">${input[item5.value] || "&nmsp;"}</td>
    </tr>
    <tr>
      <td class="truncate">${input[item6.value] || "&nmsp;"}</td>
    </tr>
  </table>  
    `;
    content.appendChild(col3);
    var col4 = document.createElement('div');
    col4.classList.add("FlexItems");
    col4.classList.add("FlexFooter");
    col4.innerHTML= `
    <table class="tableCard">
    <tr>
      <td class="truncate">${input["Libellé libre"] || "&nmsp;"}</td>
    </tr>
  </table>  
    `;
    content.appendChild(col4);



    to.appendChild(content);
}

function getStickerNb() {
    if (document.getElementById("radio-1").checked) return 1;
    if (document.getElementById("radio-16").checked) return 16;
    if (document.getElementById("radio-33").checked) return 33;
}

function SetBarcodeHeight(height) {
    const elements = document.querySelectorAll(".barcode");
    for (let i = 0; i < elements.length; i++) {
        const currentElements = elements[i];
        currentElements.setAttribute('jsbarcode-height', height);
    }
    JsBarcode(".barcode").init();
}


function getStickerSize() {
    let nb = 33;
    if (document.getElementById("radio-1").checked) nb = 1;
    if (document.getElementById("radio-16").checked) nb = 16;
    if (document.getElementById("radio-33").checked) nb = 33;

    switch (nb) {
        case 33:
            return {
                width: 7,
                height: 2.5,
                font: 12,
                nbColumn: 3
            };
            case 16:
                return {
                    width: 10.5,
                    height: 3.7,
                    font: 12,
                    nbColumn: 2
                };
                default:
                    return {
                        width: 7,
                        height: 2.5,
                        font: 12,
                        nbColumn: 1
            };
    }
}