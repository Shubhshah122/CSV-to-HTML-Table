let tableStr = '';
let columns = [];
let infoText  = '';
let estimationRowCounter = 1; // First row is the headers
let starPointsTotal = 0;
let currId = 0;

document.getElementById("fileUpload").addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        let data = this.result;
        tableStr = data;
    }
    fr.readAsText(this.files[0]);
})

let updateFileName = () => {
    if (fileUpload.value) {
        let fName = document.getElementById("fileUpload").value;
        document.getElementById("fileName").innerHTML = fName;
        counter = fName.length - 1;
        while (fName.charAt(counter) != "\\") {
            counter = counter - 1;
        }
        fName = fName.substr(counter + 1);
        document.getElementById("fileName").innerHTML = ` ${fName} `;
    } 
    else {
        document.getElementById("fileName").innerHTML = "";
    }
}

let createTable = () => {
    // Can delete/comment out the 3 lines below to make duplicate entries
    // ... for EstimationType, EstimationDescription, Complexity easier.
    let lastRemoved = false;
    document.getElementById('estimationType').value = 'api';
    document.getElementById('estimationDescription').value = '';
    document.getElementById('complexity').value = 'simple';

    let rowHeight = estimationTable.rows.length;
    if(rowHeight > 0) {
        for(counter = 1; counter < rowHeight; counter++) {
            document.getElementById("estimationTable").deleteRow(1);
        }
    }

    if(document.getElementById('fileName').innerText.trim() == '') {
        alert('Please select a file.');
    }
    else {
        document.getElementById('storyID').innerHTML = '&emsp;&emsp;';
        document.getElementById('priorityID').innerHTML = '&emsp;&emsp;';
        document.getElementById('clientID').innerHTML = '&emsp;&emsp;';
        document.getElementById('titleID').innerHTML = '&emsp;&emsp;';
        document.getElementById("customerData").innerHTML = "";
        tableStr.trim();

        let table = document.getElementById('customerData');
        let rows = tableStr.split('\n');
        let headerRow = rows[0].split(',');
        headerRow.push('Estimate Now');
        rows.shift();

        for (rowElt = 0; rowElt < rows.length; rowElt++) {
            let estimation = `<p class="estimate" id=estimation${rowElt} onclick="estimate(this.id)">${starPointsTotal}</p>`;
            columns[rowElt] = (rows[rowElt].split(','));
            columns[rowElt].push(estimation);
        }

        let tempRow = table.insertRow();
        lastRow = columns[columns.length - 1]

        for (colHeader = 0; colHeader < headerRow.length; colHeader++) {
            tempRow.insertCell().innerText = headerRow[colHeader];
        }

        for (rowCount = 0; rowCount < rows.length; rowCount++) {
            tempRow = table.insertRow();
            let colContentLength = columns[rowCount].length;
            for (colCount = 0; colCount < colContentLength; colCount++) {
                if (colCount < colContentLength - 1) {
                    tempRow.insertCell().innerText = columns[rowCount][colCount];
                }
                else {
                    tempRow.insertCell().innerHTML = columns[rowCount][colCount];
                }
            }
        }


        // ToDo: Remove the last element from the table if it's an empty
    }
}

let estimate = (id) => {
    estimationRowCounter = 1;
    starPointsTotal = 0;
    // Can delete/comment out the 3 lines below to make duplicate entries
    // ... for EstimationType, EstimationDescription, Complexity easier.
    document.getElementById('estimationType').value = 'api';
    document.getElementById('estimationDescription').value = '';
    document.getElementById('complexity').value = 'simple';

    let rowHeight = estimationTable.rows.length;
    if(rowHeight > 0) {
        for(counter = 1; counter < rowHeight; counter++) {
            document.getElementById("estimationTable").deleteRow(1);
        }
    }

    clientNumber = parseInt(String(id).substr(-1));
    currId = clientNumber + 1;
    let storyID = columns[clientNumber][0];
    let titleID = columns[clientNumber][1];
    let priorityID = columns[clientNumber][2];
    let clientID = columns[clientNumber][3];
    document.getElementById('storyID').innerText = storyID;
    document.getElementById('titleID').innerText = titleID;
    document.getElementById('priorityID').innerText = priorityID;
    document.getElementById('clientID').innerText = clientID;
}

let appendEstimation = () => {
    if(document.getElementById('fileName').innerText.trim() == '') {
        alert('Please select a file.')
    }
    else if(document.getElementById('storyID').innerText.trim() == '') {
        alert('Please select a client.');
    }
    else {
        let estimationType = document.getElementById("estimationType");
        let estimationDescription = document.getElementById("estimationDescription");
        let complexity = document.getElementById("complexity");
        let starPoints = 0;
        let table = document.getElementById("estimationTable");
        if(estimationDescription.value != '') {
            let row = table.insertRow();

            row.insertCell().innerText = estimationType.options[estimationType.selectedIndex].text;
            row.insertCell().innerText = estimationDescription.value;
            row.insertCell().innerText = complexity.options[complexity.selectedIndex].text;

            estimationTypeID = estimationType.options[estimationType.selectedIndex].value;
            complexityID = complexity.options[complexity.selectedIndex].value;

            // To set/change starpoints: change the number after '+=' for the respective option.
            if(estimationTypeID == 'api') {
                starPoints += 2;
            }
            if(estimationTypeID == 'jasperReport') {
                starPoints += 3;
            }
            if(estimationTypeID == 'permission') {
                starPoints += 4;
            }
            if(complexityID == 'simple') {
                starPoints += 2;
            }
            if(complexityID == 'medium') {
                starPoints += 3;
            }
            if(complexityID == 'complex') {
                starPoints += 4;
            }

            row.insertCell().innerText = starPoints;
            starPointsTotal += starPoints;
            let deleteRowHTMLonClick = 'deleteEstimationRow(this)';
            let deleteRowHTMLID = `removeRow${estimationRowCounter}`;
            let deleteRowHTMLTitle = 'Delete this row.'
            let deleteRowHTML = `<span id='${deleteRowHTMLID}' title='${deleteRowHTMLTitle}' class='deleteEstimationRow' onclick='${deleteRowHTMLonClick}'>X</span>`;
            row.insertCell().innerHTML = deleteRowHTML;
            estimationRowCounter++;
        }
        else {
            alert('Please have something for the estimation description.');
        }
    }
}

let openForm = () => {
  document.getElementById("loginForm").style.display = "block";
}

let closeForm = () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
}

let saveData = () => {
    // ToDo: Update the data on the API
}

let validateLogin = () => {
    // ToDo: Verify user with database.
    let email = document.getElementById('email').value;
    email = email.toLowerCase();
    let pwd = document.getElementById('password').value;
    pwd = pwd.toLowerCase();
    if(email.toLowerCase().includes('@') == false) {
        alert('Invalid email!');
    }
}

let deleteEstimationRow = (id) => {
    rowNumber = id.parentNode.parentNode.rowIndex;
    deleteRowStoryPoints = document.getElementById("estimationTable").rows[rowNumber].cells;
    deletedStoryPoints = parseInt(deleteRowStoryPoints[3].innerHTML);
    deleteEstRow = confirm("Are you sure you want to delete this estimation row?\nFor Yes: Click OK\nFor No: Click Cancel");
    if(deleteEstRow) {
        document.getElementById("estimationTable").deleteRow(rowNumber);
        starPointsTotal -= deletedStoryPoints;
    }
}

let updateEstimationStoryPoint = () => {
    currRow = document.getElementById("customerData").rows[currId].cells;
    estimationElement = (document.getElementById("customerData").rows[currId].cells.length) - 1;
    currRow[estimationElement].innerHTML = `<p class="estimate" id=estimation${rowElt} onclick="estimate(this.id)">${starPointsTotal}</p>`;
}