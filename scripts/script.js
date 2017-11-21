
var myApp = {};

myApp.actions = {active: undefined};

myApp.item_actions = {"visible" : set_hidden, "digit_sep" : set_digit_sep};

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


function field_prop(name, visible, digit_sep, digits, date_format){
    this.name = name;
    this.visible = visible;
    this.digit_sep = digit_sep;
    this.digits = digits;
    this.date_format = date_format;
}


function traverse_data(obj) {
    var fieldnames = [];
    var field_objects = [];
    var fieldname = "";
    var visible = true;
    var digit_sep = false;
    var digits = false;
    var date_format = null;
	
    for (var key in obj) {
        var title = obj[key]["popupInfo"]["title"];
        var fields = obj[key]["popupInfo"]["fieldInfos"];
        
        for (var i in fields){
            // If not already in the fieldnames list
            if (fieldnames.indexOf(fields[i]["fieldName"]) == -1){
                fieldnames.push(fields[i]["fieldName"]);
                fieldname = fields[i]["fieldName"]

                if (fields[i]["visible"] === true){
                    visible = true;
                }
                else if (fields[i]["visible"] === false){
                    visible = false;
                }
                if (fields[i]["format"]){
                    if (fields[i]["format"]["digitSeparator"] === true){
                        digit_sep = true;
                        digits = true;
                    }
                    else if (fields[i]["format"]["digitSeparator"] === false){
                        digit_sep = false;
                        digits = false;
                    }
                    else if (fields[i]["format"].hasOwnProperty(["dateFormat"])){
                        date_format = true;
                    }
                }
                var field_obj = new field_prop(fieldname, visible, digit_sep, digits, date_format)
                field_objects.push(field_obj);            
            }
        }
    }
	return field_objects
}

function add_elem_to(field_objects, elem_id, prop, value){
	var add_to = document.getElementById(elem_id);
    
    // Add in option to pick a value as well, if none is given return all
    for (field_id in field_objects){

        entry = field_objects[field_id][prop];
	
        var add_elem = document.createElement("btn");
		
		// Assign HTML class and id to element
		add_elem.className = "aligner-btn";
        add_elem.id = field_id;
		
        var add_content = add_elem.innerHTML = entry ;
        add_to.appendChild(add_elem);
		
		btn_toggle(field_id, btn_action);
    }

	// no sort, reverse_sort, sort
	// hide visable = false
	//array = Array.from(item_list).sort()
}


function set_digit_sep(id){
	
	var elem_id = document.getElementById(id);
	// Instead of calling a particular class, rather determine what button is active in the header
	// then deal accordingly
    
    field = myApp.field_objects[id]
    
    if (field["digit_sep"] === false){
            elem_id.className = "aligner-btn highlight";
            field["digit_sep"] = true;
        }
        else{
            elem_id.className = "aligner-btn";
            field["digit_sep"] = false;
        }
}


function set_hidden(id){
	
	var elem_id = document.getElementById(id);
	// Instead of calling a particular class, rather determine what button is active in the header
	// then deal accordingly
    
    field = myApp.field_objects[id]
    
    if (field["visible"] === true){
            elem_id.className = "aligner-btn highlight";
            field["visible"] = false;
        }
        else{
            elem_id.className = "aligner-btn";
            field["visible"] = true;
        }
}

function btn_action(btn){
    
	// Gets the active btn header
	active = myApp.actions.active;
    
    if (active == undefined){
        alert("SELECT AN OPTION FIRST PLEASE");
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


function highlight_all(btn, bool){
	state = btn.checked

	myApp.actions.active = btn.id;

	for (field in myApp.field_objects){
		var elem_id = document.getElementById(field);
		elem_id.className = "aligner-btn";
		
		if (state == true){
			if (myApp.field_objects[field][btn.id] === bool){
				elem_id.className = "aligner-btn highlight";}
		}
	}
}


function radio_toggle(elem_id, func, bool, btn_type="click"){
	
	var btn = document.getElementById(elem_id);
	
	btn.addEventListener(btn_type, func.bind(null, btn, bool));

}




function main(){
	var data = "text_data";
	json_data = parse_json(data);
	
	var data_layers = json_data.layers;

	myApp.field_objects = traverse_data(data_layers);
    
    add_elem_to(myApp.field_objects, "content", "name", true)
    
    radio_toggle("visible", highlight_all, false);
	
	radio_toggle("digit_sep", highlight_all, true);
	
	console.log(myApp.field_objects)
	
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