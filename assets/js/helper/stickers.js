
function newPage(gabarit) {
    var temp = document.createElement('div');
    temp.setAttribute("style",`width: ${gabarit.pageWidth}cm;
                               background-color: white; 
                               height: ${gabarit.pageHeight}cm; 
                               max-height: ${gabarit.pageHeight}cm;
                               border-width: 
                               ${gabarit.topMargin - gabarit.verticalPitch}cm 
                               ${gabarit.rightMargin - gabarit.horizontalPitch}cm 
                               ${gabarit.bottomMargin - gabarit.verticalPitch}cm 
                               ${gabarit.leftMargin - gabarit.horizontalPitch}cm;
                               border-color: ${border.checked ? 'red' : 'white'};
                               border-style: solid;
                               font-size:${gabarit.fontSize}px;`);
                                
    return temp;    
}

function newCards() {
    var temp = document.createElement('div');
    temp.setAttribute("style", `display: flex;
                                flex-wrap: wrap;
                                align-items: center;`);
    return temp;    
}

function newCard(gabarit) {
    var temp = document.createElement('div');
    temp.setAttribute("style", `width: ${gabarit.width + gabarit.horizontalPitch}cm;
                                max-height: ${gabarit.height + gabarit.verticalPitch}cm; 
                                height: ${gabarit.height + gabarit.verticalPitch}cm; 
                                border-bottom:${gabarit.verticalPitch}cm;
                                border-right:${gabarit.horizontalPitch}cm;
                                border-color: ${border.checked ? 'blue' : 'white'};
                                border-style: solid;
                                font-size: ${gabarit.fontSize}px;
                                overflow: auto;
                                scrollbar-width: none`);
    return temp;    
}

function createElementStyle(nb, init) {
    var element = getElement("fontSize" + nb);
    if (element) return  ` ${init || ""}
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size:${element.value}px;"`; 

}

function CreateCard(input, to, myGabarit) {
    var content = document.createElement('div');
    content.classList.add("AnotherFlexWrapper");
    // content.setAttribute("style", `
    // border-top:${gabarit.horizontalPitch}cm;
    // border-right:${gabarit.verticalPitch}cm;
    // border-style: solid;
    // border-color: yellow;`);
    
    var col1 = document.createElement('div');
    col1.classList.add("FlexItems");
    col1.classList.add("FlexSideOne");
    var cardWidth = myGabarit.width;
    col1.innerHTML= `<table class="tableCard">
    <tr> <td style="${createElementStyle(1, `width: ${cardWidth / 3}cm;`)}">${input[item1.value] || " "}</td> </tr>
    <tr> <td style="${createElementStyle(2, `width: ${cardWidth / 3}cm;`)}">${input[item2.value] || " "}</td> </tr>
    <tr> <td style="${createElementStyle(3, `width: ${cardWidth / 3}cm;`)}">${input[item3.value] || " "}</td> </tr>
    </table>`;
    content.appendChild(col1);
    var col2 = document.createElement('div');
    col2.classList.add("FlexItems");
    col2.classList.add("FlexCodeBarre");
    col2.innerHTML = `<table class="tableCard">
    <tr> <td><svg class="barcode" jsbarcode-value="${input[item4.value]}" jsbarcode-flat="true" jsbarcode-fontSize="12" jsbarcode-height="${rangeSlider.value}" jsbarcode-width="1"</svg> </td> </tr>
    </table>`;
    content.appendChild(col2);
    var col3 = document.createElement('div');
    col3.classList.add("FlexItems");
    col3.classList.add("FlexSideTwo");
    col3.innerHTML= `<table class="tableCard">
    <tr> <td style="${createElementStyle(5,`width: ${cardWidth / 3}cm;`)}">${input[item5.value] || " "}</td> </tr>
    <tr> <td style="${createElementStyle(6,`width: ${cardWidth / 3}cm;`)}">${input[item6.value] || " "}</td> </tr>
    <tr> <td style="${createElementStyle(7,`width: ${cardWidth / 3}cm;`)}">${input[item7.value] || " "}</td> </tr>
    </table>`;
    content.appendChild(col3);
    var col4 = document.createElement('div');
    col4.classList.add("FlexItems");
    col4.classList.add("FlexFullWidth");
    col4.innerHTML= `<table class="tableCard">
    <tr> <td class="stickerCenter truncate" style="${createElementStyle(8, `width: ${cardWidth}cm; text-align: center;`)}">${input[item8.value] || " "}</td> </tr>
    </table>`;
    content.appendChild(col4);
    to.appendChild(content);
}

function buildSticker(myList) {
    var size = +gabarit.options[gabarit.selectedIndex].text.split(" ").reverse()[0];
    var myGabarit = gabarits[size];
    var pages = getElement("pages");
    let step = 0;
    let page = newPage(myGabarit);
    let cards = newCards();
    myList.filter(e => e[item4.value] && !filters.includes(+e[item1.value])).forEach(function(elem) {
        let canAdd = true;
        // test not null values
        for (let i = 1; i < 8; i++) {
            var elementId = getElement("itemCheck" + i);
            if (elementId && elementId.checked && notNull(elem[document.getElementById("item" + i).value])) canAdd = false;
        }
        if (canAdd === true) {
            var card = newCard(myGabarit);
            CreateCard(elem, card, myGabarit);
            cards.appendChild(card);
            page.appendChild(cards);
            step += 1;
        }
        if (step === (myGabarit.nbRow * myGabarit.nbCol)) {
            step = 0;
            pages.appendChild(page);
            page = newPage(myGabarit);
            cards = newCards();
        }
    });
    pages.appendChild(page);
}