function downloadData() {
    fetch(`${window.location.origin}/retrieve`)
    .then(data => data.json())
    .then(addDataTotable)
};

function addDataTotable(data) {
    data.forEach(element => {
        const table = document.getElementById('table');
        const rowCount = table.rows.length;
        const row = table.insertRow(rowCount);

        const cell1 = row.insertCell(0);
        const element1 = document.createElement("img");
        element1.src = element.picture || '';
        element1.width = 100;
        cell1.appendChild(element1);

        const cell2 = row.insertCell(1);
        cell2.innerHTML = `${element.last_name || ''} ${element.first_name || ''} ${element.middle_name || ''}`;

        const cell3 = row.insertCell(2);
        cell3.innerHTML = `${element.phone_numbers || ''}`;

        const cell4 = row.insertCell(3);
        cell4.innerHTML = `${element.additionaltext || ''}`;
    });
}

window.onload = downloadData;