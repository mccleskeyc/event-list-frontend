let meetings = [];
//getters 
    //grab and return element "main"
    function main() {
        return document.getElementById("main")
    }

    //grab form inputs: meeting, description, date
    function nameInput(){
        return document.getElementById("name")
    }

    function descriptionInput(){
        return document.getElementById("description")
    }

    function dateInput(){
        return document.getElementById("date")
    }

    //grab form
    function form() {
        return document.getElementById("form")
    }

    //reset inputs
    function resetInputAll() {
        nameInput().value = ""
        descriptionInput().value = ""
        dateInput().value = ""
    }

    //grab main using main(), then clear it
    function resetMain() {
        main().innerHTML = ""
    }

    //grab the link to the form
    function formLink() {
        return document.getElementById("form-link")
    }

    //grab the link to the meetings index
    function meetingsLink() {
        return document.getElementById("meetings-link")
    }
    //fetch the meetings from the api
    function getMeetings(){
        //fetch to the api, meetings index, grab meetings
        fetch('http://localhost:3000/meetings')
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data){
            meetings = data

            renderMeetings();
        })
        //populate "main" with said meetings
    }

//templates 

    //create the form to create an event
    function formTemplate() {
        return `
        <h3>Create Event</h3>
            <form id="form">
                <div class="input-field">
                <label for="name">Event:</label>
                <input type="text" name="name" id="name" autocomplete="off">
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

    //index template
    function meetingsTemplate() {
        return `
        <h2>All Events</h3>
        <div id="meetings"></div>
        `;
    }
        
// rendering 
    //render the form
    function renderForm() {
        resetMain();
        main().innerHTML = formTemplate();
        form().addEventListener("submit", formSubmit)
    }

    function renderMeeting(meeting) {
        //create element for each tag we need (div, h4, h3, p)
        let div = document.createElement("div");
        let h3 = document.createElement("h3");
        let h4 = document.createElement("h4");
        let p = document.createElement("p");
        let meetingsDiv = document.getElementById("meetings")

        //set inner text to inputed data
        h3.innerText = meeting.name;
        h4.innerText = meeting.date;
        p.innerText = meeting.description

        //put the h3/h4/p tags inside the div
        div.appendChild(h3);
        div.appendChild(h4);
        div.appendChild(p)

        //rendering above template
        meetingsDiv.appendChild(div);
    }

    //render the index by resetting main and setting main innerHTML to meetingsTemplate
    function renderMeetings() {
        resetMain();
        main().innerHTML = meetingsTemplate();

        //iteration
        meetings.forEach(function(meeting){
            renderMeeting(meeting);
        })
    }

//overrides the default refresh function of a form submit; adds the input to the array
function formSubmit(e) {
    e.preventDefault();
    
    meetings.push({
        name: nameInput().value,
        description: descriptionInput().value,
        date: dateInput().value
    });

    renderMeetings();
}

//display our form as an event
function displayFormEvent() {
    formLink().addEventListener("click", function(e){
        e.preventDefault();

        renderForm();
    })
}

//display our index of events
function diplayMeetingsEvent() {
    meetingsLink().addEventListener("click", function(e){
        e.preventDefault();

        renderMeetings();
    })
}
//event listeners
    //on document load: render the form
    document.addEventListener("DOMContentLoaded", function(){
        getMeetings();
        renderForm();
        displayFormEvent();
        diplayMeetingsEvent();
    });