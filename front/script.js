function downloadData() {
    fetch(`${window.location.origin}/retrieve`)
        .then(data => data.json())
        .then(addDataTotable)
};

function addDataTotable(data) {
    const table = document.getElementById('tbody');
    if (table.rows.length) $("#tbody").empty();
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
    if (!event || !event.target || event.target.value === '') return downloadData();
    grecaptcha.ready(function () {
        grecaptcha.execute('6LdFB80eAAAAAJbBx-RpY4rb2aW3GV24K9Z5Cf54').then(function (token) {
            fetch(`${window.location.origin}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchPattern: event.target.value, token })
            })
                .then(data => data.json())
                .then(addDataTotable)
        });
    });
}

function activateModalPeopleInfo() {
    const modalContent = `<h2>Залиште інформацію про людину</h2>
      <form style="margin-top: 45px;" method="post" class="mui-form">
        <div class="mui-textfield">
            <textarea id="text" name="text" rows="4" cols="50" required></textarea>
        </div>
        <button class="mui-btn mui-btn--flat" onclick="mui.overlay('off')">Відміна</button>
        <button class="mui-btn mui-btn--primary" type="submit" onclick="sendEmail('/people-info')">Відправити</button>
      </form>`;
    const modalEl = document.createElement('div');
    modalEl.className = "mui-textfield";
    modalEl.style.width = '400px';
    modalEl.style.height = '310px';
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
    <form style="margin-top: 45px;" method="post" class="mui-form">
        <div class="mui-textfield">
            <input type="number" id="phone_number" name="phone_number" required>
            <label for="phone_number">Ваш номер телефону для зв'язку:</label>
        </div>
        <div class="mui-textfield">
            <input type="text" id="address" name="address" required>
            <label for="address">Залиште адресу для відправки:</label>
        </div>
        <div class="mui-textfield">
            <textarea id="text" name="text" rows="4" cols="50" required></textarea>
            <label for="w3review">Додаткова інформація:</label>
        </div>
        <button class="mui-btn mui-btn--flat" onclick="mui.overlay('off')">Відміна</button>
        <button class="mui-btn mui-btn--primary" type="submit" onclick="sendEmail('/help-needed')">Відправити</button>
    </form>
    `;
    const modalEl = document.createElement('div');
    modalEl.className = "mui-textfield";
    modalEl.style.width = '400px';
    modalEl.style.height = '500px';
    modalEl.style.margin = '100px auto';
    modalEl.style.paddingLeft = "10px";
    modalEl.style.paddingRight = "10px";
    modalEl.style.textAlign = "center";
    modalEl.style.backgroundColor = '#fff';
    modalEl.innerHTML = modalContent.trim();
    mui.overlay('on', modalEl);
}

$('#formU').submit(function (element) {
    element.preventDefault();
    document.getElementById('submitBtn').disabled = true;
    grecaptcha.ready(function () {
        grecaptcha.execute('6LdFB80eAAAAAJbBx-RpY4rb2aW3GV24K9Z5Cf54').then(function (token) {
            element.target.token.value = token;
            element.target.submit();
        });
    });
});

function sendEmail(url) {
    const text = $("textarea#text").val();
    const phone_number = $("input#phone_number").val();
    const address = $("input#address").val();
    let data = { text };
    if (phone_number) data = { ...data, phone_number };
    if (address) data = { ...data, address };
    if (!text) return;
    mui.overlay('off');
    grecaptcha.ready(function () {
        grecaptcha.execute('6LdFB80eAAAAAJbBx-RpY4rb2aW3GV24K9Z5Cf54').then(function (token) {
            data = {...data, token};
            fetch(`${window.location.origin}${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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
                    if ($("textarea#modal").length === 0)
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
                    if ($("textarea#modal").length === 0)
                        mui.overlay('off');
                }, 5000);
            });
        });
    });

}

window.onload = downloadData;

const search_input = document.getElementById('search-input');
search_input.addEventListener('input', search);
