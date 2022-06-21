//initial data list
var notes_List_Data = [
	               { id:1, title:"This is a note", note:"This is a note", date:"04/01/2022", time:"09:56"},
	               { id:2, title:"Lorem ipsum dolor sit amet, consectetur adipiscing", note:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date:"17/06/2022", time:"18:34"},
	               { id:3, title:"Ut enim ad minim veniam, quis nostrud exercitation", note:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", date:"12/05/2022", time:"16:18"},
	               { id:4, title:"Duis aute irure dolor in reprehenderit in volup...", note:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", date:"10/08/2022", time:"12:30"},
                   { id:5, title:"Excepteur sint occaecat cupidatat non proident,", note:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", date:"12/06/2022", time:"16:33"},
                ];


//webix function date format we use to format dates for the list
var dateFormat = webix.Date.dateToStr("%d/%m/%Y");

//variable that we use to store the currently selected item in the list
var currentSelected = -1;

//simple function that runs first
//currently only runs the function to run the webix code to load the page but can have other code added
const func_Main = () => {
    func_WebixRender();
}

//this function adds a new note to the list and then selects it so the user can edit it
const func_AddNote = () => {
	//get creation date and time
    var addDate = new Date();
    var formattedDate = dateFormat(addDate);
    var formattedTime = (addDate.toTimeString().slice(0, 5));
	var lastId = 1;

	//update the id if there are more than 0 items in the list
	if (notes_List_Data.length != 0) {
		lastId = $$('id_notesList').getLastId();
	}

	//add the note and then select it so that it can be edited
    notes_List_Data[notes_List_Data.length] = {id:(lastId+1), title:"", note:"", date:formattedDate, time:formattedTime};
	console.log(notes_List_Data);
	$$("id_notesList").parse(notes_List_Data);
    $$("id_notesList").select($$('id_notesList').getLastId());
}

//delete a single note from the list and then selects the first note again
const func_DeleteNote = () => {
    var selectedId = $$("id_notesList").getSelectedId();
	notes_List_Data.splice(func_ConvertIdToElement(selectedId), 1);
	currentSelected = -1;
    $$("id_notesList").clearAll();
    $$("id_notesList").parse(notes_List_Data);
	var firstNote = $$('id_notesList').getFirstId();
	$$("id_notesList").select(firstNote);
}


//this function saves the note and creates a title based on the text within the note
//it can cut it in various ways as listed below in the function
//this isnt the best way todo this as character widths vary character to character and it will look off if the user spams "w" but for a simple mock up I felt this was best and it works with a high consistency with normal sentences
//the reason I create the title like this is due to the way webix displays text within the list
const func_SaveSelection = () => {
	var savedNote = $$("id_NoteTextBox").getValue();
	var spaceCut = false;
	notes_List_Data[currentSelected].note = savedNote;

	//we do 4 different things here to create the title
	//first we check if its over 50 characters if not then theres no need to shorten it
	//second we check if the character after the 50 is a space or not and if so leave it there
	//third we check if theres a space within the last 5 characters and shorten it to that
	//if all these fail we then replace the last 3 letters with "..."
	if (savedNote.length > 50) {
		if (savedNote.charAt(50) != " ") {
			savedNote = savedNote.slice(0, 50);
			for (i = savedNote.length;i > (savedNote.length - 5);i--) {
				if (savedNote.charAt(i) == " ") {
					savedNote = savedNote.slice(0, i);
					spaceCut = true;
					break;
				}
			}
			if (spaceCut == false) {
				savedNote = savedNote.slice(0, 47);
				savedNote = savedNote.concat("...");
			}
		} else {
			savedNote = savedNote.slice(0, 50);
		}
	}
	notes_List_Data[currentSelected].title = savedNote;
}

//this function we use to convert an id from the table to an element within the dataset
//we need todo this as the id might not always be the same as the element in the list as items can be added and removed
const func_ConvertIdToElement = (id) => {
	for (i = 0; i < notes_List_Data.length;i++) {
        if (notes_List_Data[i].id == id) {
            return i;
        }
    }
}

//this runs every time a change is detected in the text box by attaching it to the text box in the webix render function
//if the text in the text box changes we save it and update the list to represent this change
const func_TextChanged = () => {
	console.log("changed");
	func_SaveSelection();
	$$("id_notesList").parse(notes_List_Data);
}

//this runs every time a change is detected within the selection list (the list at the side)
//it saves the current one being worked on and then loads the new note the user has selected
const func_ChangeSelection = () => {
	//this is to stop the text box saving before it loads as it detects the initial selection as a "change" and would try to save nothing as a result
	if (currentSelected != -1) {
		func_SaveSelection();
	}

	//updates the currently selected item and then loads the note into the text box
	var currentId = $$("id_notesList").getSelectedId();
	currentSelected = func_ConvertIdToElement(currentId);
	$$("id_NoteTextBox").setValue(notes_List_Data[currentSelected].note);
	$$("id_notesList").parse(notes_List_Data);
	console.log(JSON.stringify(notes_List_Data));
}
