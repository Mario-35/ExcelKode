function getElement(name) {
    const element = document.getElementById(name);
    if (element)  return element;
    console.log(`Not Found ==========> ${name}`);
}