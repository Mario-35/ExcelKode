function clearElementChilds(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}