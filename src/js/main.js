document.addEventListener("DOMContentLoaded", function () {
    const tableId = "list";
    const table = document.getElementById(tableId);
    const filterForm = document.getElementById("filter");
    const sortForm = document.getElementById("sort");
    const chartForm = document.getElementById("chart-form");
    const toggleButton = document.getElementById("toggle-table");
    const showMinCheckbox = document.getElementById("show-min");
    const showMaxCheckbox = document.getElementById("show-max");
    const chartYTitle = document.getElementById("chart-y-title");
    const chartType = document.getElementById("chart-type");
    const findButton = document.getElementById("findButton");
    const clearButton = document.getElementById("clearFilterButton");
    const sortButton = document.getElementById("sortButton");
    const resetSortButton = document.getElementById("resetSortButton");
    const firstSelect = document.getElementById("fieldsFirst");
    const secondSelect = document.getElementById("fieldsSecond");
    let isTableVisible = true;

    setSortSelects(animeData[0], sortForm);
    renderCurrentTable();
    updateGraph();

    function getSelectedGroupField() {
        const selectedRadio = document.querySelector('input[name="group-field"]:checked');
        return selectedRadio ? selectedRadio.value : "Год выхода";
    }

    function getTableData() {
        const filteredData = getFilteredData(animeData, filterForm);
        return getSortedData(filteredData, sortForm);
    }

    function renderCurrentTable() {
        showTable(tableId, getTableData());
    }

    function updateGraph() {
        const dataForm = {
            keyX: getSelectedGroupField(),
            showMin: showMinCheckbox.checked,
            showMax: showMaxCheckbox.checked,
            chartType: chartType.value,
            barCount: Number(showMinCheckbox.checked) + Number(showMaxCheckbox.checked)
        };

        drawGraph(getFilteredData(animeData, filterForm), dataForm);
    }

    function updateChartYState() {
        const hasSelectedValue = showMinCheckbox.checked || showMaxCheckbox.checked;
        chartYTitle.classList.toggle("chart-warning", !hasSelectedValue);
        return hasSelectedValue;
    }

    function clearChartYWarning() {
        chartYTitle.classList.remove("chart-warning");
    }

    firstSelect.addEventListener("change", function () {
        changeNextSelect(this, "fieldsSecond");
        changeNextSelect(document.getElementById("fieldsSecond"), "fieldsThird");
    });

    secondSelect.addEventListener("change", function () {
        changeNextSelect(this, "fieldsThird");
    });

    findButton.addEventListener("click", function () {
        resetSort(tableId, sortForm);
        renderCurrentTable();
        updateGraph();
    });

    clearButton.addEventListener("click", function () {
        filterForm.reset();
        resetSort(tableId, sortForm);
        renderCurrentTable();
        clearChartYWarning();
        updateGraph();
    });

    sortButton.addEventListener("click", function () {
        renderCurrentTable();
    });

    resetSortButton.addEventListener("click", function () {
        resetSort(tableId, sortForm);
        renderCurrentTable();
    });

    chartForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const hasSelectedValue = updateChartYState();

        if (!hasSelectedValue) {
            drawGraph([], {
                keyX: getSelectedGroupField(),
                showMin: false,
                showMax: false,
                chartType: chartType.value,
                barCount: 0
            });
            return;
        }

        updateGraph();
    });

    showMinCheckbox.addEventListener("change", function () {
        clearChartYWarning();
    });
    showMaxCheckbox.addEventListener("change", function () {
        clearChartYWarning();
    });
    clearChartYWarning();

    toggleButton.addEventListener("click", function () {
        if (isTableVisible) {
            table.innerHTML = "";
            toggleButton.textContent = "Показать таблицу";
        } else {
            renderCurrentTable();
            toggleButton.textContent = "Скрыть таблицу";
        }

        isTableVisible = !isTableVisible;
    });
});

const createOption = (str, val) => {
    const item = document.createElement("option");
    item.text = str;
    item.value = val;
    return item;
};

const setSortSelect = (arr, sortSelect) => {
    sortSelect.innerHTML = "";
    sortSelect.append(createOption("Нет", 0));

    arr.forEach((item, index) => {
        sortSelect.append(createOption(item, index + 1));
    });
};

const setSortSelects = (data, dataForm) => {
    const head = Object.keys(data);
    const allSelect = dataForm.getElementsByTagName("select");

    for (let i = 0; i < allSelect.length; i++) {
        setSortSelect(head, allSelect[i]);
        allSelect[i].disabled = i > 0;
    }

    const checks = dataForm.querySelectorAll('input[type="checkbox"]');
    checks.forEach(item => item.checked = false);
};

const changeNextSelect = (curSelect, nextSelectId) => {
    const nextSelect = document.getElementById(nextSelectId);

    nextSelect.innerHTML = curSelect.innerHTML;

    if (curSelect.value != 0) {
        nextSelect.disabled = false;
        nextSelect.remove(curSelect.value);
        nextSelect.value = 0;
    } else {
        nextSelect.disabled = true;
        nextSelect.value = 0;
    }

    const nextDesc = document.getElementById(nextSelectId + "Desc");
    if (nextDesc) {
        nextDesc.checked = false;
    }
};
