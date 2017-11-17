
var myApp = {};

myApp.actions = {hidden: set_hidden, 0: unhidden};

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
        
        if (field_objects[field_id]["visible"] === value){
            add_elem.className = "aligner-btn";
        }
        else{
            add_elem.className = "aligner-btn";
        }
        
        add_elem.id = field_id;
        var add_content = add_elem.innerHTML = entry ;
        add_to.appendChild(add_elem);
		
		btn_toggle(field_id);
    }

	
	// no sort, reverse_sort, sort
	// hide visable = false
	//array = Array.from(item_list).sort()
		
	

}

function set_hidden(){
     for (field in myApp.field_objects){
        var elem_id = document.getElementById(field);
        if (myApp.field_objects[field]["visible"] === true){
            elem_id.className = "aligner-btn";
        }
        else{
            elem_id.className = "aligner-btn hidden";
        }
     }
}


function unhidden(id){
	var elem_id = document.getElementById(id);
	// Instead of calling a particular class, rather determine what button is active in the header
	// then deal accordingly
	elem_id.className = "aligner-btn hidden";
}


function btn_action(btn){
    btn.dataset.toggle ^= 1
    console.log(btn.id);
	
	// Get the function for the button based on the ID
	action = myApp.actions[btn.id]
	
	// action calls the function assigned to the btn
	action(btn.id)
}



function btn_toggle(elem_id, only_once=false){
    var btn = document.getElementById(elem_id);
    
    btn.dataset.toggle = 0
    btn.addEventListener("click", btn_action.bind(null, btn), only_once);
}


function main(){
    ///https://stackoverflow.com/questions/7306669/how-to-get-all-properties-values-of-a-javascript-object-without-knowing-the-key/16643074#16643074
	var data = "text_data";
	json_data = parse_json(data);
	
	var data_layers = json_data.layers;

	myApp.field_objects  = traverse_data(data_layers);
    
    add_elem_to(myApp.field_objects, "content", "name", true)
    
    btn_toggle("hidden");
    
	console.log(myApp.field_objects);
	
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