ajaxError = (errMsg) => {
    console.log(errMsg); // TODO Change it to write on the div
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
        $('#visualizer').empty();
        CanvasDrawer.draw($('#visualizer'), data[`Time Series (${interval}min)`], interval);
    }).fail((data) => {
        ajaxError(data['statusText']);
    });
});