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
    Meeting.getMeetings();
    displayFormEvent();
    displayMeetingsEvent();
});