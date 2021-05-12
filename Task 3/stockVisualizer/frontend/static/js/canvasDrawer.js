/*

    Utilized: https://github.com/wentjun/d3-historical-price-chart-basic/blob/master/docs/chart.js

 */

class CanvasDrawer {

    static responsivefy = (svg) => {
        // get container + svg aspect ratio
        var container = d3.select(svg.node().parentNode),
            width = parseInt(svg.style("width")),
            height = parseInt(svg.style("height")),
            aspect = width / height;
    
        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg.attr("viewBox", "0 0 " + width + " " + height)
            .attr("perserveAspectRatio", "xMinYMid")
            .call(resize);
    
        // to register multiple listeners for same event type, 
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on("resize." + container.attr("id"), resize);
    
        // get width of container and resize svg to fit it
        function resize() {
            var targetWidth = parseInt(container.style("width"));
            svg.attr("width", targetWidth);
            svg.attr("height", Math.round(targetWidth / aspect));
        }
    }

    static movingAverage = (data, numberOfPricePoints) => {
        return data.map((row, index, total) => {
          const start = Math.max(0, index - numberOfPricePoints);
          const end = index;
          const subset = total.slice(start, end + 1);
          const sum = subset.reduce((a, b) => {
            return a + parseFloat(b['close']);
          }, 0);
          return {
            date: row['date'],
            average: sum / subset.length
          };
        });
      };

    static updateLegends = currentData => {
        d3.selectAll('.lineLegend').remove();
        const legendKeys = Object.keys(data[0]);
        const lineLegend = svg
          .selectAll('.lineLegend')
          .data(legendKeys)
          .enter()
          .append('g')
          .attr('class', 'lineLegend')
          .attr('transform', (d, i) => {
            return `translate(0, ${i * 20})`;
          });
        lineLegend
          .append('text')
          .text(d => {
            if (d === 'date') {
              return `${d}: ${currentData[d].toLocaleDateString()}`;
            } else if ( d === 'high' || d === 'low' || d === 'open' || d === 'close') {
              return `${d}: ${currentData[d].toFixed(2)}`;
            } else {
              return `${d}: ${currentData[d]}`;
            }
          })
          .style('fill', 'white')
          .attr('transform', 'translate(15,9)');
    };

    static draw = (div, stockData, interval) => {

        let data = Object.keys(stockData).map((date) => ({
            date: new Date(date),
            high: parseFloat(stockData[date]['2. high']),
            low: parseFloat(stockData[date]['3. low']),
            open: parseFloat(stockData[date]['1. open']),
            close: parseFloat(stockData[date]['4. close']),
            volume: parseFloat(stockData[date]['5. volume']),
        }));

        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const width = window.innerWidth - margin.left - margin.right;
        const height = window.innerHeight - margin.top - margin.bottom; 
        // add SVG to the page
        const svg = d3
            .select('#visualizer')
            .append('svg')
            .attr('width', width + margin['left'] + margin['right'])
            .attr('height', height + margin['top'] + margin['bottom'])
            .call(this.responsivefy)
            .append('g')
            .attr('transform', `translate(${margin['left']},  ${margin['top']})`);

        // find data range
        const xMin = d3.min(data, d => {
            return d['date'];
        });
        const xMax = d3.max(data, d => {
            return d['date'];
        });
        const yMin = d3.min(data, d => {
            return d['close'];
        });
        const yMax = d3.max(data, d => {
            return d['close'];
        });
        // scales for the charts
        const xScale = d3
            .scaleTime()
            .domain([xMin, xMax])
            .range([0, width]);
        const yScale = d3
            .scaleLinear()
            .domain([yMin - 5, yMax])
            .range([height, 0]);
        
        // create the axes component
        svg
        .append('g')
        .attr('id', 'xAxis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
        svg
        .append('g')
        .attr('id', 'yAxis')
        .attr('transform', `translate(${width}, 0)`)
        .call(d3.axisRight(yScale));
        
        // generates close price line chart when called
        const line = d3
        .line()
        .x(d => {
        return xScale(d['date']);
        })
        .y(d => {
        return yScale(d['close']);
        });
        // Append the path and bind data
        svg
        .append('path')
        .data([data])
        .style('fill', 'none')
        .attr('id', 'priceChart')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', '1.5')
        .attr('d', line);

        // calculates simple moving average of 5 mins
        const movingAverageData = this.movingAverage(data, 4);
        // generates moving average curve when called
        const movingAverageLine = d3
        .line()
        .x(d => {
        return xScale(d['date']);
        })
        .y(d => {
        return yScale(d['average']);
        })
        .curve(d3.curveBasis);
        svg
        .append('path')
        .data([movingAverageData])
        .style('fill', 'none')
        .attr('id', 'movingAverageLine')
        .attr('stroke', '#FF8900')
        .attr('d', movingAverageLine);

        /* Volume series bars */
        const volData = data.filter(d => d['volume'] !== null && d['volume']   !== 0);
        const yMinVolume = d3.min(volData, d => {
        return Math.min(d['volume']);
        });
        const yMaxVolume = d3.max(volData, d => {
        return Math.max(d['volume']);
        });
        const yVolumeScale = d3
        .scaleLinear()
        .domain([yMinVolume, yMaxVolume])
        .range([height, 0]);
        console.log(data);
        svg
        .selectAll()
        .data(volData)
        .enter()
        .append('rect')
        .attr('x', d => {
            return xScale(d['date']);
        })
        .attr('y', d => {
            return yVolumeScale(d['volume']);
        })
        .attr('fill', (d, i) => {
            if (i === 0) {
            return '#03a678';
            } else {  
            return volData[i - 1].close > d.close ? '#c0392b' : '#03a678'; 
            }
        })
        .attr('width', 1)
        .attr('height', d => {
            return height - yVolumeScale(d['volume']);
        });
    };

};