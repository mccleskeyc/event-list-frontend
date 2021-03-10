async function getMeetings() {


    const resp = await fetch(baseUrl + '/meetings')
    const data = await resp.json();
    Meeting.createFromCollection(data)
    Meeting.renderMeetings();
}

function resetContainer() {
    container().innerHTML = ""
}

function displayFormEvent() {
    formLink().addEventListener("click", function (e) {
        e.preventDefault();

        Meeting.renderForm();
    })
}

function displayMeetingsEvent() {
    meetingsLink().addEventListener("click", function (e) {
        e.preventDefault();

        Meeting.renderMeetings();
    })
}

document.addEventListener("DOMContentLoaded", function () {
    getMeetings();
    displayFormEvent();
    displayMeetingsEvent();
});