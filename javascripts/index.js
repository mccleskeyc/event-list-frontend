//global variables
let meetings = [];
const baseUrl = "http://localhost:3000";



//getters 
    //grab and return element "container"
    //used: resetContainer(), renderForm(), renderEditForm(), renderMeetings(), getMeetings, renderFormSubmit()
    function container() {
        return document.getElementById("container")
    }

    //grab form inputs: meeting, description, date
    //used: formSubmit(), editFormSubmit()
    function nameInput() {
        return document.getElementById("name")
    }
    //used: formSubmit(), editFormSubmit()
    function locationInput() {
        return document.getElementById("location")
    }

    //used: formSubmit(), editFormSubmit(
    function descriptionInput() {
        return document.getElementById("description")
    }
    //used: formSubmit(), editFormSubmit()
    function dateInput() {
        return document.getElementById("date")
    }
    //used: formSubmit(), editFormSubmit()
    function hostInput() {
        return document.getElementById("host")
    }

    //grab form
    //used: renderForm(), renderEditForm()
    function form() {
        return document.getElementById("form")
    }

    //grab container using container(), then clear it 
        //used: renderForm(), renderEditForm(), renderMeetings()
        function resetContainer() {
            container().innerHTML = ""
        }                       

    //grab the link to the form
    //used: displayFormEvent() (=> DOMContentLoad)
    function formLink() {
        return document.getElementById("form-link")
    }

    //grab the link to the meetings index
    //used: displayMeetingsEvent() (=> DOMContentLoad)
    function meetingsLink() {
        return document.getElementById("meetings-link")
    }
//fetch the meetings from the api
//used: DOMContentLoad
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
//used: renderForm()
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
//used: renderEditForm()
function editFormTemplate(meeting) {
    return `
    <h2>Add an event</h2>
    <div class="form">
            <form id="form" data-id="${meeting.id}">
                
                <label for="name">Event:</label>
                <input type="text" name="name" id="name" autocomplete="off" value="${meeting.name}">
                
                <br>

                <label for="host">Host:</label> 
                <input type="text" name="host" id="host" autocomplete="off" value="${meeting.location}">

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
//used: renderMeetings()
function meetingsTemplate() {
    return `
        <h2>All Events</h3>
        <p class="mtg-page-info">See events added by members of the community.</span>
        <div id="meetings"></div>
        `;
}


//rendering the edit form
//used: renderMeeting
function editMeeting(e) {
    e.preventDefault();

    const id = e.target.dataset.id;
    const meeting = meetings.find(function(meeting){
        return meeting.id == id;
    })

    renderEditForm(meeting)
}
//render the form
//used: displayFormEvent
function renderForm() {
    resetContainer();
    container().innerHTML = formTemplate();
    form().addEventListener("submit", formSubmit)
}
//used: editMeeting()
function renderEditForm(meeting) {
    resetContainer();
    container().innerHTML = editFormTemplate(meeting);
    form().addEventListener("submit", editFormSubmit)
}
//used: renderEditForm
function editFormSubmit(e) {
    e.preventDefault();

    let strongParams = {
        meeting: {
            name: nameInput().value,
            date: dateInput().value,
            description: descriptionInput().value,  
            location: locationInput().value,
            host: hostInput().value,
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
//used: renderMeetings
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
//used: renderMeeting()
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
//used: deleteMeeting(), formSubmit(), displayMeetingsEvent(), getMeetings(), editFormSubmit()
function renderMeetings() {
    resetContainer();
    container().innerHTML = meetingsTemplate();

    //iteration
    meetings.forEach(function (meeting) {
        renderMeeting(meeting);
    });
}

//overrides the default refresh function of a form submit; adds the input to the array
//used: renderForm()
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
//used DOMContentLoaded
function displayFormEvent() {
    formLink().addEventListener("click", function (e) {
        e.preventDefault();

        renderForm();
    })
}

//display our index of events
//used DOMContentLoaded
function displayMeetingsEvent() {
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
    displayMeetingsEvent();
});