(function() {
    window.onload = function() {
        mapData = 'no data'
        dotData = 'no data'
        width = 900
        height = 900
        
        svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)


        d3.json('neighborhoods.json', function(data) {
            mapData = data
            d3.json('points.json', function(data) {
                dotData = data
                makeMap(mapData, dotData)
            })
        })

 
  
        

    }

    function makeMap(mData, dData) {
        var g = svg.append('g');

        var albersProjection = d3.geoAlbers()
                                .scale(190000)
                                .rotate([71.057, 0])
                                .center([0, 42.313])
                                .translate([width/2, height/2]);

        var geoPath = d3.geoPath()
                        .projection(albersProjection);

        g.selectAll('path')
        .data(mData['features'])
        .enter()
        .append('path')
        .attr('fill', '#ccc')
        .attr('d', geoPath);

        var rodents = svg.append('g');

        rodents.selectAll('path')
          .data(dData.features)
          .enter()
          .append('path')
          .attr('fill', '#900')
          .attr('stroke', '#999')
          .attr('d', geoPath);

        // const links = [] 
        // for (let i = 0; i <dData.features.length - 1; i++) {
        //     const start = albersProjection(dData.features[i]['geometry']['coordinates'])
        //     const end = albersProjection(dData.features[i + 1]['geometry']['coordinates'])
        //     links.push({
        //         type:'LineString',
        //         coordinates: [
        //             [start[0], start[1]],
        //             [end[0], end[1]]
        //         ]
        //     })
        // }
        
        // const lines = svg.append('g')
        // lines.selectAll('line')
        //      .data(links)
        //      .enter()
        //      .append('line')
        //         .attr('x1', d=>d.coordinates[0][0])
        //         .attr('y1', d=> d.coordinates[0][1])
        //         .attr('x2', d=>d.coordinates[1][0])
        //         .attr('y2', d=> d.coordinates[1][1])
        //         .attr('id', function(d, i) {return 'line' + i})
        //         .attr('stroke', 'blue')

   
        const links = []
        for (let i = 0; i < dData.features.length; i++) {
            const point = albersProjection(dData.features[i]['geometry']['coordinates'])
            thisPoint = {'x': point[0], 'y': point[1]}
            links.push(thisPoint)
        }


        const thisLine = d3.line()
                       .x(d => d['x'])
                       .y(d => d['y'])
        
        var linePath = svg.append('path')
                      .attr('d', thisLine(links))
                      .attr('stroke', 'steelblue')
                      .attr('id', function(d, i) {return 'line' + i})
                      .attr('fill', 'none')




        d3.selectAll('path').style('opacity', 0)

        d3.selectAll('path').style('opacity', 1)
        d3.selectAll('path').each(function(d, i) {
            let totalLength = d3.select('#line' + i).node().getTotalLength();
            d3.select('#line' + i).attr('stroke-dasharray', totalLength + ' ' + totalLength)
                                  .attr('stroke-dashoffset', totalLength)
                                  .transition()
                                  .duration(4000)
                                  .delay(220 * i)
                                  .ease(d3.easeLinear)
                                  .attr('stroke-dashoffset', 0)
                                  .style('stroke-width', 2)
        })

      

          

    }


})();