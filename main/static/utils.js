var LAST_YEAR = 2017;
var YEAR_COUNT = 10;
var monthNumToName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var CANVAS_WIDTH = 300, CANVAS_HEIGHT = 150;
var MIN_TEMP = 0, MAX_TEMP = 40;
var SHOW_MIN = 0, SHOW_MAX = 1;
var MODE = SHOW_MIN;
var colorArr = ['#5E4FA2', '#3288BC', '#66C2A4', '#AADDA4', '#E6F598', '#FFFFBF', '#FEE08B', '#FCAD61', '#F36D43', '#D53E4F', '#9E0142'];

getYears = (data) => {
    let filteredYears = Object.keys(data).filter((val, index) => {
        return val != 'min' && val != 'max'; 
    }); // return all keys except 'min' and 'max'
    return [null].concat(filteredYears); // give the concatenation with null (used for the empty column)
};

stringifyNumber = (num) => { // used for adding a leading 0 for numbers < 10
    if(num < 10) {
        return '0' + num.toString();
    }
    return num.toString();
};

class Analyzer { // depth first search to find the max-min values of the given data
    static minTemp;
    static maxTemp;

    static checkMin = (val) => {
        if(this.minTemp) {
            this.minTemp = Math.min(this.minTemp, val);
        }
        else {
            this.minTemp = val;
        }
    }

    static checkMax = (val) => {
        if(this.maxTemp) {
            this.maxTemp = Math.max(this.maxTemp, val);
        }
        else {
            this.maxTemp = val;
        }
    };

    static traverse = (data) => {
        if('min' in data && 'max' in data) {
            this.checkMin(data['min']);
            this.checkMax(data['max']);
            return ;
        }
        Object.keys(data).forEach(key => {
            this.traverse(data[key]);
        });
    };

    static findMinMaxTemps = (data) => {
        this.minTemp = null;
        this.maxTemp = null;
        this.traverse(data);
        data['min'] = this.minTemp;
        data['max'] = this.maxTemp;
    };

};

class CanvasDrawer { // general drawing tool for visualizations

    static genericMargin = 5;

    static interpolateColor = (i, l, r) => {
        return colorArr[Math.floor((i - l) / (r - l) * colorArr.length)]; // interpolate the color
    };

    static mapValFromRangeToRange = (val, lVal, rVal, lOth, rOth) => {
        return lOth + (val - lVal) / (rVal - lVal) * (rOth - lOth); // self explanatory (the name itself lol)
    };

    static drawChart = (ctx, data) => { // draw the graph
        if(!data) {
            return ;
        }
        // Background
        this.colorBg(ctx, this.interpolateColor((MODE == SHOW_MIN ? data['min'] : data['max']), MIN_TEMP, MAX_TEMP));

        // Graphic charts
        let days = Object.keys(data).filter((val, index) => val != 'min' && val != 'max');
        [['min', '#9ECAE0'], ['max', '#31A353']].forEach(([type, color]) => {
            ctx.beginPath();
            let margin = this.genericMargin;
            let bx = margin, by = CANVAS_HEIGHT - margin;
            let ex = CANVAS_WIDTH - margin, ey = margin;
            for(let i = 0; i < days.length; i++) {
                let day = days[i];
                let cx = this.mapValFromRangeToRange(i, 0, days.length - 1, bx, ex);
                let cy = this.mapValFromRangeToRange(data[day][type], MIN_TEMP, MAX_TEMP, by, ey);
                if(i == 0) {
                    ctx.moveTo(cx, cy);
                }
                else {
                    ctx.lineTo(cx, cy);           
                }   
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 6;
            ctx.stroke();
        });
    };

    static drawInfoPanel = (ctx, color, index) => { // draw info panel
        this.colorBg(ctx, color, 1, 0.8);
        if(index == 0 || index == colorArr.length - 1) {
            ctx.beginPath();
            let x = (index == 0 ? 0 : CANVAS_WIDTH);
            ctx.moveTo(x, CANVAS_HEIGHT * 0.8);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 15;
            ctx.stroke();    
        }
    };

    static colorBg = (ctx, color, sx = 1, sy = 1)  => { // coloring the background with scale sx, sy
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, CANVAS_WIDTH * sx, CANVAS_HEIGHT * sy);
    };

};