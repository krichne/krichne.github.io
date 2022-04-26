var BASE_URL = "https://desolate-reef-68174.herokuapp.com"

var tasks = [];

var gotoLoginButton = document.querySelector("#goto-login-button");
console.log("button query:", gotoLoginButton);
gotoLoginButton.onclick = function() {
    document.getElementById("register-div").style.display = "none";
    document.getElementById("login-div").style.display = "block";
}

var gotoRegisterButton = document.querySelector("#goto-register-button");
console.log("button query:", gotoRegisterButton);
gotoRegisterButton.onclick = function() {
    document.getElementById("register-div").style.display = "block";
    document.getElementById("login-div").style.display = "none";
}

var registerButton = document.querySelector("#register-button");
console.log("button query:", registerButton);
registerButton.onclick = function() {
    var firstNameInput = document.querySelector("#first-name");
    var firstName = firstNameInput.value;
    var lastNameInput = document.querySelector("#last-name");
    var lastName = lastNameInput.value;
    var emailInput = document.querySelector("#email");
    var email = emailInput.value;
    var passwordInput = document.querySelector("#password");
    var password = passwordInput.value;

    var data = 'first-name=' + encodeURIComponent(firstName);
    data += '&last-name=' + encodeURIComponent(lastName);
    data += '&email=' + encodeURIComponent(email);
    data += '&password=' + encodeURIComponent(password);
    console.log("This is the data I'm going to send to the server:", data);

    fetch(BASE_URL + "/users", {
        method: 'POST',
        credentials: 'include',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
        if (response.status == 422) {
            console.log("registration failed");
            document.getElementById("email-hint").style.display = "block";
        }
        if (response.status == 201) {
            console.log("registration successful");
            document.getElementById("main").style.display = "block";
            document.getElementById("register-div").style.display = "none";
            loadTasks();
        }
    });
}

var loginButton = document.querySelector("#login-button");
console.log("button query:", loginButton);
loginButton.onclick = function() {
    var emailInput = document.querySelector("#login-email");
    var email = emailInput.value;
    var passwordInput = document.querySelector("#login-password");
    var password = passwordInput.value;

    var data = 'login-email=' + encodeURIComponent(email);
    data += '&login-password=' + encodeURIComponent(password);
    console.log("This is the data I'm going to send to the server:", data);

    fetch(BASE_URL + "/sessions", {
        method: 'POST',
        credentials: 'include',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
        if (response.status == 201) {
            console.log("login successful");
            document.getElementById("main").style.display = "block";
            document.getElementById("login-div").style.display = "none";
            loadTasks();
        }
        if (response.status == 401) {
            console.log("login failed");
            document.getElementById("bad-credentials").style.display = "block";
        }
    });
}

var addButton = document.querySelector("#add-button");
console.log("button query:", addButton);
addButton.onclick = function() {
    var taskNameInput = document.querySelector("#name");
    var taskName = taskNameInput.value;
    var taskGenreInput = document.querySelector("#genre");
    var taskGenre = taskGenreInput.value;
    var taskRatingInput = document.querySelector("#rating");
    var taskRating = taskRatingInput.value;
    var taskCompletionInput = document.querySelector("#completion");
    var taskCompletion = taskCompletionInput.value;
    var taskPlatformInput = document.querySelector("#platform");
    var taskPlatform = taskPlatformInput.value;

    document.getElementById("name").value = ""
    document.getElementById("genre").value = ""
    document.getElementById("rating").value = ""
    document.getElementById("completion").value = ""
    document.getElementById("platform").value = ""

    createTask(taskName, taskGenre, taskRating, taskCompletion, taskPlatform);
}

function createTask(taskName, taskGenre, taskRating, taskCompletion, taskPlatform){
    var data = 'name=' + encodeURIComponent(taskName);
    data += '&genre=' + encodeURIComponent(taskGenre);
    data += '&rating=' + encodeURIComponent(taskRating);
    data += '&completion=' + encodeURIComponent(taskCompletion);
    data += '&platform=' + encodeURIComponent(taskPlatform);
    console.log("This is the data I'm going to send to the server:", data);

    fetch(BASE_URL + "/games", {
        method: 'POST',
        credentials: 'include',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
        loadTasks();
    });
}

function deleteTaskFromServer(taskId) {
    fetch(BASE_URL + "/games/" + taskId, {
        method: "DELETE",
        credentials: 'include',
    }).then(function (response) {
        if (response.status == 200) {
            console.log("the game was deleted")
            loadTasks();
        }
    });
}

function displayEditForm(gameId, gameName, gameGenre, gameRating, gameCompletion, gamePlatform) {
    document.getElementById("edit-name").value = gameName
    document.getElementById("edit-genre").value = gameGenre
    document.getElementById("edit-rating").value = gameRating
    document.getElementById("edit-completion").value = gameCompletion
    document.getElementById("edit-platform").value = gamePlatform
    document.getElementById("edit-form").style.display = "block";

    var cancelButton = document.querySelector("#cancel-button");
    console.log("button query:", cancelButton);
    cancelButton.onclick = function() {
        document.getElementById("edit-form").style.display = "none";
    }

    var submitButton = document.querySelector("#submit-button");

    console.log("button query:", submitButton);
    submitButton.onclick = function() {
        var data = 'name=' + encodeURIComponent(document.getElementById("edit-name").value);
        data += '&genre=' + encodeURIComponent(document.getElementById("edit-genre").value);
        data += '&rating=' + encodeURIComponent(document.getElementById("edit-rating").value);
        data += '&completion=' + encodeURIComponent(document.getElementById("edit-completion").value);
        data += '&platform=' + encodeURIComponent(document.getElementById("edit-platform").value);
        console.log("This is the data I'm going to send to the server:", data);

        fetch(BASE_URL + "/games/" + gameId, {
        method: 'PUT',
        credentials: 'include',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
        if (response.status == 200) {
            document.getElementById("edit-form").style.display = "none";
            console.log("the game was edited")
            loadTasks();
        }
    });
    }
}

function loadTasks() {
    fetch(BASE_URL + "/games", {
        credentials: 'include'
    }).then(function (response) {
        if (response.status == 401) {
            document.getElementById("login-div").style.display = "block";
            document.getElementById("register-div").style.display = "none";
            document.getElementById("main").style.display = "none";
        }
        if (response.status == 200) {
            document.getElementById("login-div").style.display = "none";
            document.getElementById("register-div").style.display = "none";
            document.getElementById("main").style.display = "block";

            response.json().then(function (data) {

                tasks = data;
                console.log("games from the server:", tasks);
    
                var taskList = document.querySelector("#to-do-list");
                console.log("my game list query:", taskList);
    
                taskList.innerHTML = "";
    
                tasks.forEach(function(task){
                    
                    var newListItem = document.createElement("li");
                    //name div
                    var nameDiv = document.createElement("div");
                    nameDiv.innerHTML = task[1];
                    nameDiv.classList.add("task-name");
                    newListItem.appendChild(nameDiv);
                    //genre div
                    var genreDiv = document.createElement("div");
                    genreDiv.innerHTML = "Genre: " + task[2];
                    //genreDiv.classList.add("task-genre");
                    newListItem.appendChild(genreDiv);
                    //rating div
                    var ratingDiv = document.createElement("div");
                    ratingDiv.innerHTML = "Rating: " + task[3];
                    //ratingDiv.classList.add("task-rating");
                    newListItem.appendChild(ratingDiv);
                    //completion div
                    var completionDiv = document.createElement("div");
                    completionDiv.innerHTML = "Completion: " + task[4];
                    //completionDiv.classList.add("task-completion");
                    newListItem.appendChild(completionDiv);
                    //platform div
                    var platformDiv = document.createElement("div");
                    platformDiv.innerHTML = "Platform: " + task[5];
                    //platformDiv.classList.add("task-platform");
                    newListItem.appendChild(platformDiv);
    
                    //delete button
                    var deleteButton = document.createElement("button");
                    deleteButton.innerHTML = "Delete";
                    deleteButton.onclick = function () {
                        console.log("delete button clicked", task[0]);
                        if (confirm("Are you sure?")) {
                            deleteTaskFromServer(task[0]);
                        }
                    }
                    newListItem.appendChild(deleteButton);
    
                    //edit button
                    var editButton = document.createElement("button");
                    editButton.innerHTML = "Edit";
                    editButton.onclick = function () {
                        console.log("edit button clicked", task[0]);
                        displayEditForm(task[0], task[1], task[2], task[3], task[4], task[5]);
                    }
                    newListItem.appendChild(editButton);
    
                    taskList.appendChild(newListItem);
                });
            });
        }
    });
}
loadTasks();