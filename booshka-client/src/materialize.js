document.addEventListener('selectInitialization', () => {
    $('select').formSelect();
})

document.addEventListener('textareaInitialization', () => {
    $('input#input_text, textarea#textarea2').characterCounter();
})