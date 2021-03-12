class Meeting {
    static all = []

    constructor(attr) {
        this.id = attr.id;
        this.name = attr.name;
        this.date = attr.date;
        this.location = attr.location;
        this.description = attr.description;
        this.host = attr.host;
    }

    render() {
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
        editLink.dataset.id = this.id
        editLink.setAttribute("href", "#")
        editLink.innerText = "Edit"

        //handles deleting meetings
        deleteLink.dataset.id = this.id
        deleteLink.setAttribute("href", "#")
        deleteLink.innerText = "Delete"

        editLink.addEventListener("click", Meeting.editMeeting);
        deleteLink.addEventListener("click", Meeting.deleteMeeting)

        //set inner text to inputed data
        title.innerText = this.name;
        date.innerText = `Event Date: ${this.date}`;
        loc.innerText = `Location: ${this.location}`;
        hostedBy.innerText = `Hosted By: ${this.host.name}`;
        p.innerText = `Description: ${this.description}`;


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

    save() {
        Meeting.all.push(this)
    }
// ** static mtg functions ** //
    static async getMeetings() {

        const data = await Api.get("/meetings");
        Meeting.createFromCollection(data)
        Meeting.renderMeetings();
    }

    static create(attr) {
        let meeting = new Meeting(attr);
        meeting.save();
        return meeting;
    }



    static createFromCollection(collection) {
        collection.forEach(data => Meeting.create(data))
    }

    static meetingsTemplate() {
        return `
            <h2>All Events</h3>
            <p class="mtg-page-info">See events added by members of the community.</span>
            <div id="meetings"></div>
            `;
    }

    static renderMeetings() {
        resetContainer();
        container().innerHTML = Meeting.meetingsTemplate();

        //iteration
        Meeting.all.forEach(meeting => meeting.render());
    }

    static editMeeting(e) {
        e.preventDefault();
    
        const id = e.target.dataset.id;
        const meeting = Meeting.all.find(function (meeting) {
            return meeting.id == id;
        })
    
        Meeting.renderEditForm(meeting)
    }
    static async deleteMeeting(e) {
        e.preventDefault();
      
        let id = e.target.dataset.id;
      
        const data = await Api.delete("/meetings/" + id);
      
        Meeting.all = Meeting.all.filter(function(meeting){
          return meeting.id !== data.id;
        })
      
        Meeting.renderMeetings();
      }

// ** static form functions ** //
    static formTemplate() {
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

    static renderForm() {
        resetContainer();
        container().innerHTML = Meeting.formTemplate();
        form().addEventListener("submit", Meeting.formSubmit)
    }

    static editFormTemplate(meeting) {
        return `
        <h2>Add an event</h2>
        <div class="form">
                <form id="form" data-id="${meeting.id}">
                    
                    <label for="name">Event:</label>
                    <input type="text" name="name" id="name" autocomplete="off" value="${meeting.name}">
                    
                    <br>
    
                    <label for="host">Host:</label> 
                    <input type="text" name="host" id="host" autocomplete="off" value="${meeting.host.name}">
    
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

    static renderEditForm(meeting) {
        resetContainer();
        container().innerHTML = Meeting.editFormTemplate(meeting);
        form().addEventListener("submit", Meeting.editFormSubmit)
    }

// ** event handlers ** //
    static formSubmit(e) {
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

        Api.post('/meetings', strongParams)
            .then(function(data) {
                Meeting.create(data);
                Meeting.renderMeetings();
            })
    }

    static editFormSubmit(e) {
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
        
        Api.patch("/meetings/" + id,  strongParams)
            .then(function (data) {
                // selects the meeting out of the array
    
                let m = Meeting.all.find((m) => m.id == data.id);
                //gets the index of the mtg
                let idx = Meeting.all.indexOf(m);
                //updates the index value with the updated mtg
                Meeting.all[idx] = new Meeting(data);
                //renders array of mtgs
                Meeting.renderMeetings();
            })
    }
}