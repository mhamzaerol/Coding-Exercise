$('#stock-symbol-text').keyup((e) => {
    if(e.which == 13) { // Enter button
        $('#search-button').click();
    }
});