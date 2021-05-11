extractInfo = (entry) => { // process the line of a csv and convert the data into numbers
    let [date, minTemp, maxTemp] = entry.split(','); 
    let [year, month, day] = date.split('-');
    let resString = [year, month, day, minTemp, maxTemp];
    let resInt = [];
    resString.forEach(val => resInt.push(parseInt(val)));
    return resInt;
};

addTodictData = (dictData, entry) => {
    let [year, month, day, maxTemp, minTemp] = extractInfo(entry); // extract those info
    if(LAST_YEAR - year < YEAR_COUNT) { // if it is within the given year range
        if(!dictData[year]) dictData[year] = {}; // if no key: year, then initialize
        if(!dictData[year][month]) dictData[year][month] = {}; // if no key: year and month, then initialize
        dictData[year][month][day] = {
            'min': minTemp,
            'max': maxTemp,
        }; // assign min,max stuff
    }
};

csvTextToDict = (text) => { // return a dict representation of the csv
    let entries = text.split('\n'); // split the lines
    var dictData = {}; // the final data
    for(let i = 1; i < entries.length; i++) {
        addTodictData(dictData, entries[i]); // add this line to the dict
    }
    return dictData;
};