clearHtml = () => {
    $('#grid').empty(); // clear stuff in grid
    $('#mapping').empty(); // clear stuff for the mapping info
    $('.popover').remove(); // remove the currently active popover
};

drawInfoPanel = () => {
    colorArr.concat(['#FFFFFF']).forEach((color, index) => { // trick: add an empty panel for visualization of temperature value
        let infoBox = $('<div>').addClass(
            'info-box'
        ); // info-box for the mapping
        let mapBox = $('<canvas>').addClass(
            'map-box'
        ); // shows the color
        CanvasDrawer.drawInfoPanel(mapBox[0].getContext('2d'), color, index); // draw the color and the line (if needed)
        infoBox.append(
            mapBox
        ); // add to the info-box
        if(index == 0 || index == colorArr.length) { // if need to show value
            infoBox.append(
                $('<div>').addClass(
                    'info'
                ).text(
                    `${(index == 0 ? MIN_TEMP : MAX_TEMP)} °C`
                )
            ); // add this into info-box as well
        }
        $('#mapping').append(
            infoBox
        ); // add info-box to the mapping section in #generic div
    });
};

getYearColumn = (year) => {
    let result = $('<div>').addClass(
        'year-row'
    ); // year value column
    if(year) { // if year is not null (the very first column has its value null)
        result.addClass(
            'year-desc'
        ); 
        result.text(year); // add text info (year value)
    }
    return result;
}

makeYearsRow = (years) => {
    let yearsRow = $('<div>').addClass(
        'row chart-row'
    ); // row for year values
    years.forEach(year => {
        yearsRow.append(
            getYearColumn(year)
        ); // get the column for the year
    });
    $('#grid').append(
        yearsRow
    ); // append this row to the grid
};

getThisDateChart = (month, year, data) => {
    if(!year) { // description column
        return $('<div>').addClass(
            'chart-general month-desc'
        ).text(
            monthNumToName[month]
        );
    }
    let thisDateChart = $('<canvas>').addClass(
        'chart-general'
    ); // chart of current date (year/month)
    if(data[year][month]) { // if data exists
        thisDateChart.attr({
            'data-toggle': 'popover',
            'data-content': `Date: ${year}-${stringifyNumber(month)}, min: ${data[year][month]['min']} max: ${data[year][month]['max']}`,
            'data-trigger': 'hover',
        }) // popover setup
        CanvasDrawer.drawChart(thisDateChart[0].getContext('2d'), data[year][month]); // draw the graph
    }
    return thisDateChart;
};

makeMonthlyChartsRow = (month, years, data) => {
    let monthlyChartsRow = $('<div>').addClass(
        'row chart-row'
    ); // monthly graphs row
    years.forEach(year => {
        monthlyChartsRow.append(
            getThisDateChart(month, year, data) 
        ); // for each year, append the corresponding graph
    });
    $('#grid').append(
        monthlyChartsRow
    ); // append the row to the grid
};

visualize = (data) => {
    clearHtml(); // clear everything 

    drawInfoPanel(); // draw the mapping panel

    let years = getYears(data); // get the years from the keys
    makeYearsRow(years); // draw the year values in the topmost row

    for(let month = 1; month <= 12; month++) {
        makeMonthlyChartsRow(month, years, data); // draw the graph for each month
    }

    $('[data-toggle="popover"]').popover(); // enable popovers for the graphs
};
