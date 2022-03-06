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

function activateModalPeopleInfo() {
      const modalContent = `<h2>Залиште інформацію про людину</h2>
      <textarea id="modal" type="text" rows="4" cols="50"></textarea>
      <button class="mui-btn mui-btn--flat" onclick="mui.overlay('off')">Відміна</button>
      <button class="mui-btn mui-btn--primary" onclick="sendEmail('/people-info')">Відправити</button>`;
      const modalEl = document.createElement('div');
      modalEl.className = "mui-textfield";
      modalEl.style.width = '400px';
      modalEl.style.height = '228px';
      modalEl.style.margin = '100px auto';
      modalEl.style.paddingLeft = "10px";
      modalEl.style.paddingRight = "10px";
      modalEl.style.textAlign = "center";
      modalEl.style.backgroundColor = '#fff';
      modalEl.innerHTML = modalContent.trim();
      mui.overlay('on', modalEl);
}

function activateModalHelpNeeded() {
    const modalContent = `<h2>Залиште інформацію про те, яка потрібна гуманітарна допомога</h2>
    <textarea id="modal" type="text" rows="4" cols="50"></textarea>
    <button class="mui-btn mui-btn--flat" onclick="mui.overlay('off')">Відміна</button>
    <button class="mui-btn mui-btn--primary" onclick="sendEmail('/help-needed')">Відправити</button>`;
    const modalEl = document.createElement('div');
    modalEl.className = "mui-textfield";
    modalEl.style.width = '400px';
    modalEl.style.height = '260px';
    modalEl.style.margin = '100px auto';
    modalEl.style.paddingLeft = "10px";
    modalEl.style.paddingRight = "10px";
    modalEl.style.textAlign = "center";
    modalEl.style.backgroundColor = '#fff';
    modalEl.innerHTML = modalContent.trim();
    mui.overlay('on', modalEl);
}

function sendEmail(url) {
    const text = $("textarea#modal").val();
    if(!text) return;
    mui.overlay('off');
    fetch(`${window.location.origin}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    }).then(data => {
        const modalContent = `<h2>Дякуємо! Ваше повідомлення успішно доставлено!</h2>
        <h2>Воно буде оброблено найближчим часом!</h2>
        <button class="mui-btn mui-btn--flat" onclick="mui.overlay('off')">Ок</button>`;
        const modalEl = document.createElement('div');
        modalEl.className = "mui-textfield";
        modalEl.style.width = '400px';
        modalEl.style.height = '228px';
        modalEl.style.margin = '100px auto';
        modalEl.style.paddingLeft = "10px";
        modalEl.style.paddingRight = "10px";
        modalEl.style.textAlign = "center";
        modalEl.style.backgroundColor = '#fff';
        modalEl.innerHTML = modalContent.trim();
        mui.overlay('on', modalEl);
        setTimeout(() => {
            if($("textarea#modal").length === 0)
                mui.overlay('off');
        }, 5000);
    }).catch(err => {
        const modalContent = `<h2>Ваше повідомлення не відвправлено!</h2>
        <h2>Спробуйте ще раз!</h2>
        <button class="mui-btn mui-btn--flat" onclick="mui.overlay('off')">Ок</button>`;
        const modalEl = document.createElement('div');
        modalEl.className = "mui-textfield";
        modalEl.style.width = '400px';
        modalEl.style.height = '228px';
        modalEl.style.margin = '100px auto';
        modalEl.style.paddingLeft = "10px";
        modalEl.style.paddingRight = "10px";
        modalEl.style.textAlign = "center";
        modalEl.style.backgroundColor = '#fff';
        modalEl.innerHTML = modalContent.trim();
        mui.overlay('on', modalEl);
        setTimeout(() => {
            if($("textarea#modal").length === 0)
                mui.overlay('off');
        }, 5000);
    });
}

window.onload = downloadData;

const search_input = document.getElementById('search-input');
search_input.addEventListener('input', search);
