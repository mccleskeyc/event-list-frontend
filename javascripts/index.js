//global variables
let meetings = [];
const baseUrl = "http://localhost:3000"


//getters 
//grab and return element "main"
function main() {
    return document.getElementById("main")
}

//grab form inputs: meeting, description, date
function nameInput() {
    return document.getElementById("name")
}

function locationInput() {
    return document.getElementById("location")
}

function descriptionInput() {
    return document.getElementById("description")
}

function dateInput() {
    return document.getElementById("date")
}

function hostInput() {
    return document.getElementById("host")
}

//grab form
function form() {
    return document.getElementById("form")
}

//reset inputs
function resetInputAll() {
    nameInput().value = ""
    dateInput.value = ""
    descriptionInput().value = ""
    locationInput().value = ""
   
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
function getMeetings() {
    //fetch to the api, meetings index, grab meetings
    fetch(baseUrl + '/meetings')
        .then(function (resp) {
            return resp.json();
        })
        .then(function(data) {
            meetings = data

            renderMeetings();
        })
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
                <label for="host">Host:</label>
                <input type="text" name="host" id="host" autocomplete="off">
                </div>

                <div class="input-field">
                <label for="location">Location:</label>
                <input type="text" name="location" id="location" autocomplete="off">
                </div>

                <br>

                <div class="input-field">
                    <label for="date">Date:</label>
                    <input type="date" name="date" id="date"
                </div>

                <br>

                <div class="input-field">
                    <label for="description">Description:</label>
                    <textarea name="description" id="description" cols="30" rows="10"></textarea>
                </div>

                <br>

                

                <input type="submit" value="Create an Event">
            </form>
        `;
}

function editFormTemplate(meeting) {
    return `
        <h3>Edit Event</h3>
            <form id="form" data-id="${meeting.id}">
                <div class="input-field">
                <label for="name">Event:</label>
                <input type="text" name="name" id="name" autocomplete="off" value="${meeting.name}">
                </div>

    
                <div class="input-field">
                <label for="location">Location:</label>
                <input type="text" name="location" id="location" autocomplete="off" value="${meeting.location}">
                </div>

                <br>

                <div class="input-field">
                    <label for="date">Date:</label>
                    <input type="date" name="date" id="date" value="${meeting.date}">
                </div>

                <br>

                <div class="input-field">
                    <label for="description">Description:</label>
                    <textarea name="description" id="description" cols="30" rows="10">${meeting.description}</textarea>
                </div>

                <br>

                

                <input type="submit" value="Edit Event">
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


//rendering the edit form
function editMeeting(e) {
    e.preventDefault();

    const id = e.target.dataset.id;
    const meeting = meetings.find(function(meeting){
        return meeting.id == id;
    })

    renderEditForm(meeting)
}
//render the form
function renderForm() {
    resetMain();
    main().innerHTML = formTemplate();
    form().addEventListener("submit", formSubmit)
}

function renderEditForm(meeting) {
    resetMain();
    main().innerHTML = editFormTemplate(meeting);
    form().addEventListener("submit", editFormSubmit)
}

function editFormSubmit(e) {
    e.preventDefault();

    let strongParams = {
        meeting: {
            name: nameInput().value,
            date: dateInput().value,
            description: descriptionInput().value,  
            location: locationInput().value,
        }
    }
    const id = e.target.dataset.id;

    fetch(baseUrl + "/meetings/" + id, {
        method: "PATCH",
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify(strongParams)
    })
    .then(function(resp) {
        return resp.json();
    })
    .then(function(meeting) {
        // selects the meeting out of the array

        let m = meetings.find(function(m) {
            return m.id == meeting.id;
        })
        //gets the index of the mtg
        let idx = meetings.indexOf(m);
        //updates the index value with the updated mtg
        meetings[idx] = meeting;
        //renders array of mtgs
        renderMeetings();
    })
}

function renderMeeting(meeting) {
    //create element for each tag we need (div, h4, h3, p)
    let div = document.createElement("div");
    let h3 = document.createElement("h3");
    let h4 = document.createElement("h4");
    let loc = document.createElement("h4")
    let hostedBy = document.createElement("p")
    let p = document.createElement("p");
    let deleteLink = document.createElement("a");
    let editLink = document.createElement("a");
    let meetingsDiv = document.getElementById("meetings");

    //handles editing meetings
    editLink.dataset.id = meeting.id
    editLink.setAttribute("href", "#")
    editLink.innerText = "Edit"
    
    //handles deleting meetings
    deleteLink.dataset.id = meeting.id
    deleteLink.setAttribute("href", "#")
    deleteLink.innerText = "Delete"

    editLink.addEventListener("click", editMeeting);
    deleteLink.addEventListener("click", deleteMeeting)

    //set inner text to inputed data
    h3.innerText = meeting.name;
    h4.innerText = meeting.date;
    loc.innerText = meeting.location;
    hostedBy.innerText = `Hosted By: ${meeting.host.name}`;
    p.innerText = meeting.description

    //put the h3/h4/p tags inside the div
    div.appendChild(h3);
    div.appendChild(h4);
    div.appendChild(loc);
    div.appendChild(hostedBy);
    div.appendChild(p);
    div.appendChild(editLink);
    div.appendChild(deleteLink);

    //rendering above template
    meetingsDiv.appendChild(div);
}
//delete an event
function deleteMeeting(e) {
    e.preventDefault();

  let id = e.target.dataset.id;

  fetch(baseUrl + "/meetings/" + id, {
    method: "DELETE"
  })
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {

    meetings = meetings.filter(function(meeting){
      return meeting.id !== data.id;
    })

    renderMeetings();
  })
}

//render the index by resetting main and setting main innerHTML to meetingsTemplate
function renderMeetings() {
    resetMain();
    main().innerHTML = meetingsTemplate();

    //iteration
    meetings.forEach(function (meeting) {
        renderMeeting(meeting);
    });
}

//overrides the default refresh function of a form submit; adds the input to the array
function formSubmit(e) {
    e.preventDefault();

    let strongParams = {
        meeting: {
            name: nameInput().value,
            date: dateInput().value,
            description: descriptionInput().value,
            host_attributes: hostInput().value
        }
    }

    //send data to the backend using a POST request
    fetch(baseUrl + '/meetings', {
        headers: {
            "Accpet": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(strongParams),
        method: "POST"
    })
        .then( function (resp) {
            return resp.json();
        })
        .then( function (meeting) {
            meetings.push(meeting)
            renderMeetings()
        })
}

//display our form as an event
function displayFormEvent() {
    formLink().addEventListener("click", function (e) {
        e.preventDefault();

        renderForm();
    })
}

//display our index of events
function diplayMeetingsEvent() {
    meetingsLink().addEventListener("click", function (e) {
        e.preventDefault();

        renderMeetings();
    })
}
//event listeners
//on document load: render the form
document.addEventListener("DOMContentLoaded", function () {
    getMeetings();
    displayFormEvent();
    diplayMeetingsEvent();
});