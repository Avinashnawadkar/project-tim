document.addEventListener("DOMContentLoaded", loadTable);

function addRow() {
    let day = document.getElementById("day").value;
    let time = document.getElementById("time").value;
    let subject = document.getElementById("subject").value;

    if (day && time && subject) {
        let table = document.getElementById("timetable").getElementsByTagName('tbody')[0];
        let newRow = table.insertRow();
        newRow.innerHTML = `<td>${day}</td><td>${time}</td><td>${subject}</td>
                            <td><button onclick="deleteRow(this)">Delete</button></td>`;

        saveData();
        clearInputs();
    } else {
        alert("Please fill all fields");
    }
}

function deleteRow(button) {
    let row = button.parentElement.parentElement;
    row.remove();
    saveData();
}

function saveData() {
    let table = document.getElementById("timetable").getElementsByTagName('tbody')[0];
    let rows = table.getElementsByTagName("tr");
    let timetable = [];

    for (let row of rows) {
        let cells = row.getElementsByTagName("td");
        if (cells.length > 0) {
            let entry = {
                day: cells[0].innerText,
                time: cells[1].innerText,
                subject: cells[2].innerText
            };
            timetable.push(entry);
        }
    }

    localStorage.setItem("timetable", JSON.stringify(timetable));
}

function loadTable() {
    let timetable = JSON.parse(localStorage.getItem("timetable")) || [];
    let table = document.getElementById("timetable").getElementsByTagName('tbody')[0];

    timetable.forEach(entry => {
        let newRow = table.insertRow();
        newRow.innerHTML = `<td>${entry.day}</td><td>${entry.time}</td><td>${entry.subject}</td>
                            <td><button onclick="deleteRow(this)">Delete</button></td>`;
    });
}

function clearInputs() {
    document.getElementById("day").value = "";
    document.getElementById("time").value = "";
    document.getElementById("subject").value = "";
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Timetable", 80, 15);

    let table = document.getElementById("timetable");
    let rows = table.getElementsByTagName("tr");

    let data = [];
    for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName("td");
        if (cells.length >= 3) {
            data.push([cells[0].innerText, cells[1].innerText, cells[2].innerText]);
        }
    }

    doc.autoTable({
        head: [['Day', 'Time', 'Subject']], 
        body: data,
        startY: 25,
        margin: { top: 10, bottom: 10 },
        styles: {
            font: "helvetica",
            fontSize: 12,
            cellPadding: 5,
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
            valign: 'middle',
        },
        headStyles: {
            fillColor: [51, 51, 51], 
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center',
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 0,
            halign: 'center',
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240],
        },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 50 },
            2: { cellWidth: 70 },
        }
    });

    doc.save("Timetable.pdf");
}
