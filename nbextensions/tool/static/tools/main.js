// Copyright (c) Purdue.
// Distributed under the terms of the Modified BSD License.

window.onload = init;

function init() {

    nb = JSON.parse(document.body.dataset.notebooks);
    console.log(nb);

    path = document.body.dataset.path;
    console.log(path);

    base_url = document.body.dataset.base_url;
    console.log("URL=" + base_url);

    loadNBlist(path, nb);
}

function handleClick(cb) {
    console.log(cb);
}

function loadNBlist(path, nlist) {
    console.log('loadNBlist');
    var table = document.getElementById("notebooks");

    Object.keys(nlist).forEach(function(key,index) {
        console.log(nlist[key]);
        var row = table.insertRow(-1);
        var name_cell = row.insertCell(0);
        var desc_cell = row.insertCell(1);
        var tool_cell = row.insertCell(2);
        var newAnchor = document.createElement("a");
        var href = "/notebooks/" + key + "/" + key + ".ipynb";
        newAnchor.textContent = key;
        newAnchor.setAttribute('href', href);
        newAnchor.setAttribute('target', '_blank');
        name_cell.appendChild(newAnchor);
        desc_cell.innerHTML = nlist[key]['desc'];

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = nlist[key]["tool"];
        checkbox.disabled=true;
        // checkbox.onclick = (function(cb, dataType) {
        //     return function () {
        //         console.log(cb.checked);
        //         console.log(dataType);
        //         console.log('-----');
        //     };
        // }(checkbox, key))

        tool_cell.appendChild(checkbox);
    });
}
