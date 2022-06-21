//simple function that runs first
//currently only runs the function to run the webix code to load the page but can have other code added
const func_Main = () => {
    func_WebixRender();
}


//Check query function decides how we will preform the search
//it takes in the value from the buttons to find out if we want to get all the results or filter it via the text Box
//we then check to see if its an int and if so search by id (this in theory would cause problems if someone wanted to search for a number in the task description
//however to resolve this we could return both ids and descriptions that match and provide a filter to the user)
//if its not an int we either get all (if nothing has been put in the text box) or search for what they need
const func_CheckQuery = (searchType) => {
    if (searchType == "getAll") {
        func_GetTaskAll();
    } else {
        var searchValue = $$("inp_SearchBox").getValue();
        if ((/^[1-9]\d*$/.test(searchValue)) == true) {
            func_GetTaskID(searchValue);
        } else if (searchValue == "") {
            func_GetTaskAll();
        } else {
            func_GetTaskName(searchValue);
        }
    }
}

//function that gets all the tasks from the server and passes it to the display function
const func_GetTaskAll = async () => {
    console.log("Search All");
    const response = await fetch('http://localhost:3000/tasks');
    const jsonResponse = await response.json();
    func_ParseResponse(jsonResponse);
}

//function that gets a task via its id and passes it to the display function
const func_GetTaskID = async (searchValue) => {
    console.log("Task ID");
    var fetchString = ("http://localhost:3000/tasks?id=" + searchValue);
    const response = await fetch(fetchString);
    const jsonResponse = await response.json();
    func_ParseResponse(jsonResponse);
}

//function that querys the database via the string entered and then passes it to the display function
const func_GetTaskName = async (searchValue) => {
    console.log("Task Name");
    var fetchString = ("http://localhost:3000/tasks?q=" + searchValue);
    const response = await fetch(fetchString);
    const jsonResponse = await response.json();
    func_ParseResponse(jsonResponse);
}

//display function here I parse the json slightly to make it clearer to read
//this could be used for other things such as parsing the json to a form or other interface
const func_ParseResponse = (response) => {
    console.log(response);
    reponseText = (JSON.stringify(response)).replace(/},{/gi,"}\n{");
    $$("id_NoteTextBox").setValue(reponseText);
}
