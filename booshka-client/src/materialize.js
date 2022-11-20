(function () {
    window.addEventListener('selectInitialization', () => {
        $('select').formSelect();
    })

    window.addEventListener('textareaInitialization', () => {
        $('input#input_text, textarea#textarea2').characterCounter();
    })
}())