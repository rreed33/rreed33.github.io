        var margin = {top: 100, right: 200, bottom: 30, left: 100}
        var w = 800 - margin.left - margin.right
        var h = 500 - margin.top - margin.bottom;

        var parseMonth = d3.time.format("%m").parse
        var formatMonth = d3.time.format("%b")
        var parseYear = d3.time.format("%Y").parse
        var formatYear = d3.time.format("%Y");

        var xScale = d3.time.scale()
                    .range([0,w]);
        var yScale = d3.scale.linear()
                    .range([h,0]);
                    //.format("04d")

        var yAxisScale = d3.time.scale()
                    .range([h,0]);

        var powerScale = d3.scale.linear()
                    .range(["white","red"])

        var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .ticks(d3.time.months)
                            .tickFormat(formatMonth)
                            .orient("bottom")
                            //.format("04d")


        var yAxis = d3.svg.axis()
                            .scale(yScale)
                            //.ticks(d3.time.years)
                            //.tickFormat(formatYear)
                            .orient("left")
                            .tickFormat(d3.format("d"));


        var svg = d3.select("#heatmap")
                        .append("svg")
                        .attr("width", w + margin.left + margin.right)
                        .attr("height", h + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("heatmap.csv", function(error, powers) {
            if (error) throw error;

            powers.forEach(function(d) {
                    d.ZipCode = +d['Zip Code'];
                    d.Month = parseMonth(d.Month);
                    d.Year = parseYear(d.Year);
                    d.NewYear = +formatYear(d.Year);
                    d.Power = +d.Power;
                    //if (d.ZipCode==90077) {return console.log(d.NewYear,d.Month,d.NewYear)};
                    
            });
            console.log(powers);


        var allZipCodes = powers.map(function(d) {return d.ZipCode })
        var ZipCodes = [...new Set(allZipCodes)].sort()
        //console.log(ZipCodes);


        var select = d3.select("#heatmap")
            .append("select")
            .attr("class","select")
            .on("change",function() {
                var selectZipCodes= powers.filter(function(d){return d.ZipCode == d3.select("select").property("value");});
                console.log(selectZipCodes)
                updateData(selectZipCodes)
                //selectZipCodes.forEach(function(d) {
                     //{return console.log(d.NewYear,d.ZipCode,d.Power)};;
                //});

            });

        var options = select
            .selectAll("option")
            .data(ZipCodes).enter()
            .append("option")
                .text(function (d) {return d;});

        function updateData(selectZipCodes) {
            d3.select("body")
            //.append("p")          
                // appending.transition()
                // .duration(0)
          //    .attr("font-family", "sans-serif")
          //    .attr("font-size","25px")
          //    .attr("x",350)
          //    .attr("y", 250)
          //    .text(selectValue);

          //    appending.exit().remove();

             xScale.domain(d3.extent(selectZipCodes, function(d) {return d.Month; }));
             yScale.domain([2005,2013]);
            // //yScale.domain(d3.extent(powers, function(d) {return (d.NewYear); }));
             powerScale.domain(d3.extent(selectZipCodes, function(d) {return d.Power; }));
             console.log(d3.extent(selectZipCodes, function(d) {return d.Power; }));

             yAxisScale.domain(d3.extent(selectZipCodes,function(d) {return d.NewYear;}));

             var yearRange = d3.extent(selectZipCodes,function(d) {return d.NewYear});

             var yearBase = (yearRange[0]);

             var heatMap = svg.selectAll("rect")
                .data(selectZipCodes);
                 
                heatMap.enter()
                    .append("rect");
                    
                heatMap.transition()
                    .duration(0)
                    .attr("x", function(d) {return xScale(d.Month);})
                    .attr("y", function(d) {return yScale((d.NewYear+1));})
                    .attr("width",50)
                    .attr("height",40)
            //      //.translate("transform","translate(0,50)")
                    .style("fill", function(d) {return powerScale(d.Power);})
                    
                heatMap.exit().remove();

            svg.append("text")
                .attr("class","text")
                .attr("x",w/2 + 120)
                .attr("y",-40)
                .style("font-size","25px")
                .style("stroke","bold")
                .text("Water Usage Heatmap");

            //d3.select("#theLegend").remove();
            d3.selectAll(".legend")
                .remove();

            var legend = svg.selectAll(".legend")
              .data(powerScale.ticks(6).reverse())
            .enter().append("g")
            .attr("id","#theLegend")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(" + (w + 100) + "," + (20 + i * 20) + ")"; });
              //.attr("transform","translate(1000,200)");

            legend.append("rect")
              .attr("width", 20)
              .attr("height", 20)
              .style("fill", powerScale);

            legend.append("text")
              .attr("x", 26)
              .attr("y", 10)
              .attr("dy", ".35em")
              .text(String);

            svg.append("text")
              .attr("class", "label")
              .attr("x", w + 100)
              .attr("y", 10)
              .attr("dy", ".35em")
              .text("Power (kWh)");
            //console.log(selectZipCodes.Power)
            //      //.style("fill","red")

           //  var appending = svg.append("text");
                
                // appending.append("text");
                
        //      appending.transition()
        //      .duration(0)
        //      .attr("font-family", "sans-serif")
        //      .attr("font-size","25px")
        //      .attr("x",350)
        //      .attr("y", 250)
        //      .text(selectZipCodes);
   

            // var appending = svg.selectAll("text")
            //     .data(powers.filter(function(d){return d.ZipCode == selectValue;}))
            //     .enter()
            //      .append("text")
            //      .transition()
            //      .duration(0)
            //      .attr("x", function(d) {return xScale(d.Month);})
            //      .attr("y", function(d) {return yScale((d.NewYear));})
            //      .text(function(d) {return ((d.Power));});
            //      //.style("fill","red"


        };


        updateData(powers.filter(function(d){return d.ZipCode == 90077;}));

        svg.append("g")
            .attr("class","axis")
            .attr("transform", "translate(25," + h + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "text")
            .attr("x", w+50)
            .attr("y", -10)
            .style("text-anchor","middle")
            .text("Month");

        svg.append("g")
            .attr("class","axis")
            .attr("transform", "translate(-10,-25)")
            .call(yAxis)
            .append("text")
            .attr("class", "text")
            .attr("x", -10)
            .attr("y", -20)
            .style("text-anchor","middle")
            .text("Year");



//////////////////////////////////////////////////////////////


         });