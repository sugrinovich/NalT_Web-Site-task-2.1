const formatCellValue = (key, value) => {
    if (key === "Длительность (мин)" && value !== "") {
        return `${value} мин`;
    }

    return value;
};

const createTable = (data, idTable) => {
    const table = document.getElementById(idTable);
    if (!table) return;

    const header = data.length > 0
        ? Object.keys(data[0])
        : (typeof animeData !== "undefined" && animeData.length > 0 ? Object.keys(animeData[0]) : []);

    if (header.length > 0) {
        const headerRow = createHeaderRow(header);
        table.append(headerRow);
    }

    if (data.length === 0) {
        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = header.length || 1;
        td.textContent = "Нет данных";
        tr.append(td);
        tbody.append(tr);
        table.append(tbody);
        return;
    }

    const bodyRows = createBodyRows(data);
    table.append(bodyRows);
};

const createHeaderRow = (headers) => {
    const tr = document.createElement("tr");

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tr.append(th);
    });

    return tr;
};

const createBodyRows = (data) => {
    const tbody = document.createElement("tbody");

    data.forEach(item => {
        const tr = document.createElement("tr");

        Object.entries(item).forEach(([key, value]) => {
            const td = document.createElement("td");
            td.textContent = formatCellValue(key, value);
            tr.append(td);
        });

        tbody.append(tr);
    });

    return tbody;
};

const clearTable = (idTable) => {
    const table = document.getElementById(idTable);
    if (table) {
        table.innerHTML = "";
    }
};
