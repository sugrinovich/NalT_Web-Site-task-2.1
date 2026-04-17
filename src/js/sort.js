const createSortArr = (data) => {
    const sortArr = [];
    const sortSelects = data.getElementsByTagName("select");

    for (const item of sortSelects) {
        const keySort = item.value;

        if (keySort == 0) {
            break;
        }

        const desc = document.getElementById(item.id + "Desc").checked;

        sortArr.push({
            column: keySort - 1,
            direction: desc
        });
    }

    return sortArr;
};

const getSortedData = (data, formData) => {
    const sortArr = createSortArr(formData);

    if (sortArr.length === 0) {
        return [...data];
    }

    const headers = Object.keys(animeData[0]);
    const numericFields = [
        "Год выхода",
        "Эпизоды",
        "Длительность (мин)",
        "Рейтинг MAL"
    ];

    const sortedData = [...data];

    sortedData.sort((first, second) => {
        for (const { column, direction } of sortArr) {
            const key = headers[column];
            const firstVal = first[key];
            const secondVal = second[key];

            let comparison = 0;

            if (numericFields.includes(key)) {
                comparison = Number(firstVal) - Number(secondVal);
            } else if (key === "Возрастное ограничение") {
                comparison = parseInt(firstVal) - parseInt(secondVal);
            } else {
                comparison = String(firstVal).localeCompare(String(secondVal), "ru");
            }

            if (comparison !== 0) {
                return direction ? -comparison : comparison;
            }
        }

        return 0;
    });

    return sortedData;
};

const resetSort = (idTable, sortForm) => {
    sortForm.reset();
    setSortSelects(animeData[0], sortForm);

    const filterForm = document.getElementById("filter");
    const filteredData = getFilteredData(animeData, filterForm);

    clearTable(idTable);
    createTable(filteredData, idTable);
};

const sortTable = (idTable, formData) => {
    const filterForm = document.getElementById("filter");
    const tableData = getSortedData(getFilteredData(animeData, filterForm), formData);

    clearTable(idTable);
    createTable(tableData, idTable);
};
