//grab and return element "main"
function main() {
    return document.getElementById("main")
}

//grab form inputs: meeting, description, date
function meetingInput(){
    return document.getElementById("meeting")
}

function descriptionInput(){
    return document.getElementById("description")
}

function dateInput(){
    return document.getElementById("date")
}

//grab main using main(), then clear it
function resetMain() {
    main().innerHTML = ""
}

//create the form to create an event (EFFECT)
function formTemplate() {
    return `
    <h3>Create Event</h3>
        <form id="form">
            <div class="input-field">
            <label for="meeting">Event:</label>
            <input type="text" name="meeting" id="meeting">
            </div>

            <br>

            <div class="input-field">
                <label for="description">Description:</label>
                <textarea name="description" id="description" cols="30" rows="10"></textarea>
            </div>

            <br>

            <div class="input-field">
                <label for="date">Date:</label>
                <input type="date" name="date" id="date">
            </div>

            <input type="submit" value="Create an Event">
        </form>
    `;
}

//render the form
function renderForm() {
    resetMain();
    main().innerHTML = formTemplate();
}

//event listeners
    //on document load: render the form
    document.addEventListener("DOMContentLoaded", function(){
        renderForm();
    });