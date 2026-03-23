const correspond = {
    "Название": "title",
    "Тип": "type",
    "Год выхода": ["yearFrom", "yearTo"],
    "Эпизоды": ["episodesFrom", "episodesTo"],
    "Длительность (мин)": ["durationFrom", "durationTo"],
    "Студия": "studio",
    "Режиссёр": "director",
    "Жанр": "genre",
    "Рейтинг MAL": ["ratingFrom", "ratingTo"],
    "Возрастное ограничение": "ageRating",
    "Статус": "status"
};

const dataFilter = (dataForm) => {
    const dictFilter = {};

    for (const item of dataForm.elements) {
        if (item.type === "button") {
            continue;
        }

        let valInput = item.value;

        if (item.type === "text" || item.tagName === "SELECT") {
            valInput = valInput.trim().toLowerCase();
        }

        if (item.type === "number") {
            if (valInput === "") {
                if (item.id.includes("From")) {
                    valInput = -Infinity;
                } else if (item.id.includes("To")) {
                    valInput = Infinity;
                }
            } else {
                valInput = Number(valInput);
            }
        }

        dictFilter[item.id] = valInput;
    }

    return dictFilter;
};

const getFilteredData = (data, dataForm) => {
    const datafilter = dataFilter(dataForm);

    return data.filter(item => {
        let result = true;

        Object.entries(item).forEach(([key, val]) => {
            if (typeof val === "string") {
                result &&= val.toLowerCase().includes(datafilter[correspond[key]]);
            }

            if (typeof val === "number") {
                const [fromKey, toKey] = correspond[key];
                const from = datafilter[fromKey];
                const to = datafilter[toKey];
                result &&= (val >= from && val <= to);
            }
        });

        return result;
    });
};

const filterTable = (data, idTable, dataForm) => {
    const tableFilter = getFilteredData(data, dataForm);
    clearTable(idTable);
    createTable(tableFilter, idTable);
};
