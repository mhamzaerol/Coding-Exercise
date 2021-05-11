analyze = (data) => {
    Object.keys(data).forEach(year => {
        Object.keys(data[year]).forEach(month => {
            Analyzer.findMinMaxTemps(data[year][month]); // find the min-max for given year and month
        });
    });
    Analyzer.findMinMaxTemps(data); // find the min-max for all data 
    // (not needed for the current visualization, but may be useful for some extensions)
};