//global variables
let meetings = [];
const baseUrl = "http://localhost:3000";



//getters 
//grab and return element "container"
function container() {
    return document.getElementById("container")
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

//grab container using container(), then clear it
function resetContainer() {
    container().innerHTML = ""
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
        .then(r => r.json())
        .then(function(data) {
            meetings = data

            renderMeetings();
        })
}

//templates 

//create the form to create an event
function formTemplate() {
    return `
    <h2>Add an Event</h2>
    <p class="mtg-page-info"> Share an upcoming event with the Rendezvous community. </p>
    <div class="form">
     <form id="form">
            <label for="host">Event Name:</label> 
            <input type="text" name="name" id="name" autocomplete="off">

            <label for="host">Host:</label> 
            <input type="text" name="host" id="host" autocomplete="off">

            <label for="date">Date:</label>
            <input type="date" name="date" id="date">

            <label for="location">Location:</label> 
            <input type="text" name="location" id="location" autocomplete="off">
        
            <label> Event Description: </label>
            <textarea cols="25" name="description" rows="8" id="description"></textarea>
            <br>
            <input type="submit" value="Create Event" id="mtg-submit" class="submit">

         
     </form>
     
</div>`;
}

function editFormTemplate(meeting) {
    return `
    <h2>Add an event</h2>
    <div class="form">
            <form id="form" data-id="${meeting.id}">
                
                <label for="name">Event:</label>
                <input type="text" name="name" id="name" autocomplete="off" value="${meeting.name}">
                
                <br>
                
                <label for="location">Location:</label>
                <input type="text" name="location" id="location" autocomplete="off" value="${meeting.location}">
                
                <br>
                
                    <label for="date">Date:</label>
                    <input type="date" name="date" id="date" value="${meeting.date}">
                
                <br>
                
                    <label for="description">Description:</label>
                    <textarea name="description" id="description" cols="30" rows="10">${meeting.description}</textarea>
                
                <br>
                <input type="submit" value="Update Event" class="submit">
            </form>
            </div>
        `;
}

//index template
function meetingsTemplate() {
    return `
        <h2>All Events</h3>
        <p class="mtg-page-info">See events added by members of the community.</span>
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
    resetContainer();
    container().innerHTML = formTemplate();
    form().addEventListener("submit", formSubmit)
}

function renderEditForm(meeting) {
    resetContainer();
    container().innerHTML = editFormTemplate(meeting);
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
    .then(r => r.json())
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

// function renderMeeting(meeting) {


//     let div = document.createElement("div")
//     div.className = "meeting-posts"
//     let li = document.createElement("li")
//     let p1 = document.createElement("p")
//     let p2 = document.createElement("p")
//     let p3 = document.createElement("p")
//     let p4 = document.createElement("p")
//     let p5 = document.createElement("p")
//     let button = document.createElement("button")
//     let span = document.createElement("span")
//     let span2 = document.createElement("span")


//     p1.innerText = meeting.name
//     p2.innerText = meeting.date
//     p3.innerText = meeting.hostName
//     p4.innerText = meeting.location
//     p5.innerText = meeting.description
//     span2.innerText = `Click to RSVP: `
//     button.innerText = "Attendees: "
//     button.id = meeting.id
//     span.innerText = meeting.attendees
//     button.append(span)


//     li.append(p1, p2, p3, p4, p5, span2, button)
//     div.append(li)
//     ul.append(div)

//     button.addEventListener("click", meeting.handleAttendees)

// }

// function handleAttendees(e){

//     let attendees = parseInt(e.target.children[0].innerText)
//     fetch(baseUrl + `/${meeting.id}`, {
//         method: "PATCH",
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({attendees: attendees += 1 })
//     })

//         .then(r => r.json())
//         .then(data => meeting.updateDom(data,meeting.id))
// }

// function updateDom(data) {

//     let button = document.getElementById(`${meeting.id.toString()}`)   
//     button.children[0].innerText = data.attendees.toString()
// }

function renderMeeting(meeting) {
    //create element for each tag we need (div, h4, h3, p)
    let div = document.createElement("div");
    div.className = "meeting-posts"
    let title = document.createElement("h3");
    let date = document.createElement("p");
    let loc = document.createElement("p")
    let hostedBy = document.createElement("p")
    let p = document.createElement("p");
    let deleteLink = document.createElement("button");
    deleteLink.className = "delete-button";
    let editLink = document.createElement("button");
    editLink.className = "update-button"
    let meetingsDiv = document.getElementById("meetings");
    let blank = document.createElement("p");


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
    title.innerText = meeting.name;
    date.innerText = `Event Date: ${meeting.date}`;
    loc.innerText = `Location: ${meeting.location}`;
    hostedBy.innerText = `Hosted By: ${meeting.host.name}`;
    p.innerText = `Description: ${meeting.description}`;


    //put the h3/h4/p tags inside the div
    div.appendChild(title);
    div.appendChild(date);
    div.appendChild(loc);
    div.appendChild(hostedBy);
    div.appendChild(p);
    div.appendChild(editLink);
    div.appendChild(deleteLink);



    //rendering above template
    meetingsDiv.appendChild(div);
    meetingsDiv.appendChild(blank);
}
//delete an event
function deleteMeeting(e) {
    e.preventDefault();

  let id = e.target.dataset.id;

  fetch(baseUrl + "/meetings/" + id, {
    method: "DELETE"
  })
  .then(r => r.json())
  .then(function(data) {

    meetings = meetings.filter(function(meeting){
      return meeting.id !== data.id;
    })

    renderMeetings();
  })
}

//render the index by resetting container and setting container innerHTML to meetingsTemplate
function renderMeetings() {
    resetContainer();
    container().innerHTML = meetingsTemplate();

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
            location: locationInput().value,
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
        .then(r => r.json())
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