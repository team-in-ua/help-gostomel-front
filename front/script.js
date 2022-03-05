function downloadData() {
    fetch(`${window.location.origin}/retrieve`)
    .then(data => data.json())
    .then(addDataTotable)
};

function addDataTotable(data) {
    const table = document.getElementById('tbody');
    if(table.rows.length) $("#tbody").empty();
    data.forEach(element => {
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

function search(event) {
    if(!event || !event.target || event.target.value === '') return downloadData();
    fetch(`${window.location.origin}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({searchPattern: event.target.value})
    })
    .then(data => data.json())
    .then(addDataTotable)
}

window.onload = downloadData;

const search_input = document.getElementById('search-input');
search_input.addEventListener('input', search);
