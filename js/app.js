//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// [ CLASSES & METHODS ]
//                         Code Class: Represents a single code                         //
//////////////////////////////////////////////////////////////////////////////////////////

class Code {
    constructor (gameTitle, cheatCode, codeDesc) {
        this.gameTitle = gameTitle;
        this.cheatCode = cheatCode;
        this.codeDesc = codeDesc;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
//                            UI Class: Handles all UI tasks                            //
//////////////////////////////////////////////////////////////////////////////////////////

class UI {
    static displayCodes() {
        const codes = Storage.getCodes();

        //Adding a code
        codes.forEach((code) => UI.addCodeToList(code));
    }

    static addCodeToList(code) {
        const list = document.querySelector('#code-list');

        //Creating the new table data for submission
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${code.gameTitle}</td>
        <td>${code.cheatCode}</td>
        <td>${code.codeDesc}</td>
        <td><a href="#" title="Delete code" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        //Just appending the new submission data here, nothing special ;)
        list.appendChild(row);
    }

    //Creating and inserting the alert div
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#code-form');
        container.insertBefore(div, form);

        //Remove div in 2000ms (2s)
        setTimeout(() => document.querySelector('.alert').remove(),2000);
    }

    //Deleting a code
    static deleteCode(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
            //Show removal alert
            UI.showAlert('Cheat code was removed', 'info');
        }
    }

    //Clear input fields on submission
    static clearFields() {
        document.querySelector('#gameTitle').value = "";
        document.querySelector('#cheatCode').value = "";
        document.querySelector('#codeDesc').value = "";
    }
}
///////////////////////////////////////////////////////////////////////////////////////////
//                            Storage Class: Handles storage                            //
//////////////////////////////////////////////////////////////////////////////////////////

class Storage {
    //Get codes from localStorage
    static getCodes() {
        let codes;
        if(localStorage.getItem('codes') === null) {
            codes = [];
        }
        else {
            codes = JSON.parse(localStorage.getItem('codes'));
        }
        return codes;
    }

    //Add code into localStorage
    static addCode(code) {
        const codes = Storage.getCodes();

        codes.push(code);
        localStorage.setItem('codes', JSON.stringify(codes));
    }

    //Remove code from localStorage
    static removeCode(codeDesc) {
        const codes = Storage.getCodes();
        codes.forEach((code, index) => {
            if(code.codeDesc === codeDesc) {
                codes.splice(index, 1);
            }
        });

        localStorage.setItem('codes', JSON.stringify(codes));
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////[ EVENTS ]
//                                 Event: Display Codes                                 //
//////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', UI.displayCodes);

//Event: Adding a code
document.querySelector('#code-form').addEventListener('submit', (e) => {
    
    //Prevent accidental submit
    e.preventDefault();

    //Get the form values
    const gameTitle = document.querySelector('#gameTitle').value;
    const cheatCode = document.querySelector('#cheatCode').value;
    const codeDesc = document.querySelector('#codeDesc').value;

    //Validate submissions
    if(gameTitle === '' || cheatCode === '' || codeDesc === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    }
    else {
    //Initialize a new code
    const code = new Code(gameTitle, cheatCode, codeDesc);

    //Add code to table list
    UI.addCodeToList(code);

    //Add code to storage
    Storage.addCode(code);

    //Show success alert
    UI.showAlert('Cheat code added successfully', 'success');

    //Clear input fields
    UI.clearFields();
    }
});

///////////////////////////////////////////////////////////////////////////////////////////
//                                Event: Removing a Code                                //
//////////////////////////////////////////////////////////////////////////////////////////

document.querySelector('#code-list').addEventListener('click', (e) => {
    
    //Remove code from UI
    UI.deleteCode(e.target)

    //Remove code from storage
    Storage.removeCode(e.target.parentElement.previousElementSibling.textContent); //push ISBN
});

//Event: Sync the codes
function syncCodes() {
    UI.showAlert("Syncing is disabled until further notice.", 'info');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// [ SEARCH FUNCTION ]
//// used jQuery, sorry (not-sorry)! Aren't we going to review that at some point? :)

$("#search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    
    $("#code-list tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });

  });