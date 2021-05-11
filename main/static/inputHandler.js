var hasFile = false; // keep whether a file had been uploaded
var fileData; // used for flip mode

$('#fileInput').change(() => { // read .csv file if file is provided as an input
    let file = $('#fileInput').prop('files')[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        hasFile = true;
        fileData = csvTextToDict(reader.result);
        analyze(fileData);
        visualize(fileData);
    };
    reader.onerror = () => {
        console.log(reader.error);
    };
});

$('#grid').click(() => { // flipping the visualization mode
    if(hasFile) { // if no file uploaded, then no flip of modes
        if(MODE == SHOW_MIN) {
            MODE = SHOW_MAX;
        }
        else {
            MODE = SHOW_MIN;
        }
        visualize(fileData);
    }
});
