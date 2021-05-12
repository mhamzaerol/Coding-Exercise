var errMode = false;

modeToggle = () => {
    errMode = !errMode;
    $('#visualizer-error').toggleClass('collapse');
    $('#visualizer').toggleClass('collapse');
};

ajaxError = (errMsg) => {
    if(!errMode) {
        modeToggle();
    }
    $('#visualizer-error').text(
        errMsg
    );
};

$('#search-button').click(() => {
    let stockSymbolName = $('#stock-symbol-text').val();
    let interval = 1;
    let data = {
        'symbol': stockSymbolName,
        'interval': interval,
    };
    $.ajax({
        'url': '/api/query',
        'type': 'GET',
        'data': data,
    }).done((data) => {
        if('Error Message' in data) {
            ajaxError(data['Error Message']);
        }
        else {
            if(errMode) {
                modeToggle();
            }
            $('#visualizer').empty();
            CanvasDrawer.draw($('#visualizer'), data[`Time Series (${interval}min)`], interval);
        }
    }).fail((data) => {
        ajaxError(data['statusText']);
    });
});