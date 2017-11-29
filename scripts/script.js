
var myApp = {};

myApp.actions = {active: undefined};

myApp.item_actions = {"visible" : set_hidden, "digitSeparator" : set_digit_sep};

function parse_json(data){
	var text_data = document.getElementById(data).value
	return JSON.parse(text_data)
}


function other(){
    
    // This tool assumes all fields based on the name
	
	// visibility
	// include list 
	// exclude list
	// super list
	// (key === "visible")
	// (key === "label") format to make this look nice remove _ etc. Title Case
	
	// global digitSep 
	// default values for visibility OFF
	// label rules TitleCase, UpperCase, CamalCase, remove() or user_input
    
	//console.log(key + " : " + value);
}


function get_unique_field_objs(json_data) {
    let field_names_set = new Set();
	
    let field_objs = json_data.layers
        .reduce((field_obj, lyr) => {
            // Gets a unique field object for each field by fieldname
			//     fieldName = object
            lyr.popupInfo.fieldInfos.forEach(field => {
                if (field_names_set.has(field.fieldName) == false){
                    field_names_set.add(field.fieldName);
                    field_obj[field.fieldName] = (field)
                }
            })
			return field_obj
		}, {});
		
	return field_objs
}

function add_elem_to(field_objects, elem_id, value){
	var add_to = document.getElementById(elem_id);
    
    // Add in option to pick a value as well, if none is given return all
    for (fieldname in field_objects){

        var add_elem = document.createElement("btn");
		
		// Assign HTML class and id to element
		add_elem.className = "aligner-btn";
        add_elem.id = fieldname;
		
        var add_content = add_elem.innerHTML = fieldname;
        add_to.appendChild(add_elem);
		
		btn_toggle(fieldname, btn_action);
    }

	// no sort, reverse_sort, sort
	// hide visable = false
	//array = Array.from(item_list).sort()
}


function set_digit_sep(id){
	
	var elem_id = document.getElementById(id);
    
    field = myApp.field_objects[id].format

    if (field.hasOwnProperty("digitSeparator")){
        if (field["digitSeparator"] === false){
            elem_id.className = "aligner-btn on";
            field["digitSeparator"] = true;
        }
        else{
            elem_id.className = "aligner-btn off";
            field["digitSeparator"] = false;
        }
    }
    else{
        alert("CANNOT SELECT GREYED OUT FIELDS.");
    }
}


function set_hidden(id){
	
	var elem_id = document.getElementById(id);
    
    field = myApp.field_objects[id]
    
    if (field["visible"] === true){
            elem_id.className = "aligner-btn on";
            field["visible"] = false;
        }
        else{
            elem_id.className = "aligner-btn off";
            field["visible"] = true;
        }
}

function btn_action(btn){
    
	// Gets the active btn header
	active = myApp.actions.active;
    
    if (active == undefined){
        alert("PLEASE SELECT AN OPTION FIRST");
    }
    else{
        // Action calls the function assigned to the btn_neader
        action = myApp.item_actions[active];
        action(btn.id);
    }
	
	btn.dataset.toggle ^= 1;
}


function btn_toggle(elem_id, func, bool, btn_type="click"){
    var btn = document.getElementById(elem_id);
    
    btn.dataset.toggle = 0
    btn.addEventListener(btn_type, func.bind(null, btn, bool));
}


function highlight_hidden(btn){
	state = btn.checked;
	myApp.actions.active = btn.id;

	for (field in myApp.field_objects){
		var elem_id = document.getElementById(field);
        
        // Default / resets
        elem_id.className = "aligner-btn off";
		
		if (state == true){
			if (myApp.field_objects[field][btn.id] === false){
				elem_id.className = "aligner-btn on";}
		}
	}
}

function highlight_digit_sep(btn){

    // Sets the active button global
    myApp.actions.active = btn.id;

	for (id in myApp.field_objects){
		var elem_id = document.getElementById(id);
        
        // Default / resets
        elem_id.className = "aligner-btn";

		if (btn.checked == true){
            field = myApp.field_objects[id]
            
            if (field.hasOwnProperty("format")){
                if (field.format !== null){
                    if (field.format.hasOwnProperty("digitSeparator")){
                        if (field.format["digitSeparator"] === true){
                            elem_id.className = "aligner-btn on";}
                        else{
                            elem_id.className = "aligner-btn off";}
                    }
                    else{
                        elem_id.className = "aligner-btn greyed_out"}
                }
                else{
                    elem_id.className = "aligner-btn greyed_out"
                }
            }
        }
    }
}




function radio_toggle(elem_id, func, btn_type="click"){
	
	var btn = document.getElementById(elem_id);
	
	btn.addEventListener(btn_type, func.bind(null, btn));

}




function main(){
	var data = "text_data";
	json_data = parse_json(data);

	myApp.field_objects = get_unique_field_objs(json_data);
    
    add_elem_to(myApp.field_objects, "content", true)
    
    radio_toggle("visible", highlight_hidden);
	
	radio_toggle("digitSeparator", highlight_digit_sep);
	
    //console.log(myApp.field_objects['CLOCK_AT_FROM'].format)
	
	// working on fixing digital seperator
	
}



// ======================================================================

// Onload fuction alt. to JQuery ready method. Modern browsers, and IE9+
var loaded = function(){
  // Handler when the DOM is fully loaded
  console.log("Page Loaded");
  main();
};

if (document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", loaded);
}

// ======================================================================