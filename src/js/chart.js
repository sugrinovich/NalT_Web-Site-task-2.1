function createArrGraph(data, key) {
    // Группируем массив по выбранному полю и считаем минимум и максимум рейтинга.
    const groupObj = d3.group(data, d => d[key]);
    let arrGraph = [];

    for (let entry of groupObj) {
        const ratings = entry[1].map(d => d["Рейтинг MAL"]);
        const minMax = d3.extent(ratings);

        arrGraph.push({
            labelX: entry[0],
            min: minMax[0],
            max: minMax[1]
        });
    }

    if (key === "Год выхода") {
        arrGraph.sort((a, b) => a.labelX - b.labelX);
    } else {
        arrGraph.sort((a, b) => String(a.labelX).localeCompare(String(b.labelX), "ru"));
    }

    return arrGraph;
}

function drawGraph(data, dataForm) {
    const keyX = dataForm.keyX;
    let arrGraph = createArrGraph(data, keyX);
    const svg = d3.select("svg");
    svg.selectAll("*").remove();

    if (arrGraph.length === 0 || (!dataForm.showMin && !dataForm.showMax)) {
        return;
    }

    if (keyX === "Год выхода") {
        arrGraph.sort((a, b) => a.labelX - b.labelX);
    }

    const svgNode = svg.node();
    const svgRect = svgNode.getBoundingClientRect();

    const attrArea = {
        width: svgRect.width || parseFloat(svg.style("width")) || 1100,
        height: svgRect.height || parseFloat(svg.style("height")) || 560,
        marginX: 50,
        marginY: 50
    };

    svg
        .attr("width", attrArea.width)
        .attr("height", attrArea.height)
        .attr("viewBox", `0 0 ${attrArea.width} ${attrArea.height}`);

    const [scaleX, scaleY] = createAxis(
        svg,
        arrGraph,
        attrArea,
        dataForm.showMin,
        dataForm.showMax
    );

    if (dataForm.showMax) {
        createChart(svg, arrGraph, scaleX, scaleY, attrArea, "crimson", {
            chartType: dataForm.chartType,
            valueKey: "max",
            shift: dataForm.showMin ? 1 : 0,
            barCount: dataForm.barCount
        });
    }

    if (dataForm.showMin) {
        createChart(svg, arrGraph, scaleX, scaleY, attrArea, "steelblue", {
            chartType: dataForm.chartType,
            valueKey: "min",
            shift: 0,
            barCount: dataForm.barCount
        });
    }

    createLegend(svg, attrArea, dataForm.showMin, dataForm.showMax);
}

function createAxis(svg, data, attrArea, showMin, showMax) {
    let values = [];

    if (showMin) {
        values = values.concat(data.map(d => d.min));
    }

    if (showMax) {
        values = values.concat(data.map(d => d.max));
    }

    let [min, max] = d3.extent(values);

    if (min === max) {
        min = min - 0.5;
        max = max + 0.5;
    }

    const scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attrArea.width - 2 * attrArea.marginX])
        .padding(0.1);

    const scaleY = d3.scaleLinear()
        .domain([Math.max(0, min - 0.5), max + 0.5])
        .range([attrArea.height - 2 * attrArea.marginY, 0]);

    const axisX = d3.axisBottom(scaleX);
    const axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attrArea.marginX}, ${attrArea.height - attrArea.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${attrArea.marginX}, ${attrArea.marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
}

function createChart(svg, data, scaleX, scaleY, attrArea, color, chartParams) {
    if (chartParams.chartType === "bar") {
        createBarChart(svg, data, scaleX, scaleY, attrArea, color, chartParams);
    } else if (chartParams.chartType === "line") {
        createLineChart(svg, data, scaleX, scaleY, attrArea, color, chartParams);
    } else {
        createDotChart(svg, data, scaleX, scaleY, attrArea, color, chartParams);
    }
}

function createDotChart(svg, data, scaleX, scaleY, attrArea, color, chartParams) {
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${attrArea.marginX}, ${attrArea.marginY})`);

    chartGroup.selectAll(`.dot-${chartParams.valueKey}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `dot-${chartParams.valueKey}`)
        .attr("r", 4)
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + chartParams.shift * 5)
        .attr("cy", d => scaleY(d[chartParams.valueKey]))
        .style("fill", color);
}

function createBarChart(svg, data, scaleX, scaleY, attrArea, color, chartParams) {
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${attrArea.marginX}, ${attrArea.marginY})`);

    const singleBarWidth = scaleX.bandwidth() / chartParams.barCount;

    chartGroup.selectAll(`.bar-${chartParams.valueKey}`)
        .data(data)
        .enter()
        .append("rect")
        .attr("class", `bar-${chartParams.valueKey}`)
        .attr("x", d => scaleX(d.labelX) + chartParams.shift * singleBarWidth)
        .attr("y", d => scaleY(d[chartParams.valueKey]))
        .attr("width", singleBarWidth)
        .attr("height", d => attrArea.height - 2 * attrArea.marginY - scaleY(d[chartParams.valueKey]))
        .style("fill", color);
}

function createLineChart(svg, data, scaleX, scaleY, attrArea, color, chartParams) {
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${attrArea.marginX}, ${attrArea.marginY})`);

    const line = d3.line()
        .x(d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .y(d => scaleY(d[chartParams.valueKey]));

    chartGroup
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line);

    chartGroup
        .selectAll(`.line-point-${chartParams.valueKey}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `line-point-${chartParams.valueKey}`)
        .attr("r", 4)
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", d => scaleY(d[chartParams.valueKey]))
        .style("fill", color);
}

function createLegend(svg, attrArea, showMin, showMax) {
    const legendData = [];

    if (showMin) {
        legendData.push({ text: "Минимальный рейтинг", color: "steelblue" });
    }

    if (showMax) {
        legendData.push({ text: "Максимальный рейтинг", color: "crimson" });
    }

    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${attrArea.marginX}, 20)`);

    legend.selectAll("circle")
        .data(legendData)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => i * 170)
        .attr("cy", 0)
        .attr("r", 5)
        .style("fill", d => d.color);

    legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 170 + 12)
        .attr("y", 4)
        .text(d => d.text);
}
