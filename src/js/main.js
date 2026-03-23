document.addEventListener("DOMContentLoaded", function () {
    createTable(animeData, "list");

    const filterForm = document.getElementById("filter");
    const findButton = document.getElementById("findButton");
    const clearButton = document.getElementById("clearFilterButton");

    const sortForm = document.getElementById("sort");
    setSortSelects(animeData[0], sortForm);

    const firstSelect = document.getElementById("fieldsFirst");
    const secondSelect = document.getElementById("fieldsSecond");
    const sortButton = document.getElementById("sortButton");
    const resetSortButton = document.getElementById("resetSortButton");

    firstSelect.addEventListener("change", function () {
        changeNextSelect(this, "fieldsSecond");
        changeNextSelect(document.getElementById("fieldsSecond"), "fieldsThird");
    });

    secondSelect.addEventListener("change", function () {
        changeNextSelect(this, "fieldsThird");
    });

    findButton.addEventListener("click", function () {
        resetSort("list", sortForm);
    });

    clearButton.addEventListener("click", function () {
        filterForm.reset();
        resetSort("list", sortForm);
    });

    sortButton.addEventListener("click", function () {
        sortTable("list", sortForm);
    });

    resetSortButton.addEventListener("click", function () {
        resetSort("list", sortForm);
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
