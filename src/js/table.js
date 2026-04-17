const formatCellValue = (key, value) => {
    if (key === "Длительность (мин)" && value !== "") {
        return `${value} мин`;
    }

    return value;
};

// Создание таблицы по образцу из лабораторной, но с поддержкой текущих данных.
const showTable = (idTable, data) => {
    const table = d3.select(`#${idTable}`);
    const headers = data.length > 0
        ? Object.keys(data[0])
        : (typeof animeData !== "undefined" && animeData.length > 0 ? Object.keys(animeData[0]) : []);

    table.html("");

    if (headers.length === 0) {
        return;
    }

    table
        .append("tr")
        .selectAll("th")
        .data(headers)
        .enter()
        .append("th")
        .text(d => d);

    if (data.length === 0) {
        table
            .append("tr")
            .append("td")
            .attr("colspan", headers.length)
            .text("Нет данных");

        return;
    }

    const rows = table
        .selectAll("tr.data-row")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", "data-row");

    rows
        .selectAll("td")
        .data(d => Object.entries(d))
        .enter()
        .append("td")
        .text(([key, value]) => formatCellValue(key, value));
};

const createTable = (data, idTable) => {
    showTable(idTable, data);
};

const clearTable = (idTable) => {
    d3.select(`#${idTable}`).html("");
};
