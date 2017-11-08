
var myApp = {};

function parse_json(data){
	var text_data = document.getElementById(data).value
	return JSON.parse(text_data)
}


function other(){
    
    // This tool assumes all fields based on the name
		
	// It makes sence on the first pass to pick up the other features?
	key, value = boolean_switch(key, value, "digitSeparator", look=true, set=false);
	
	key, value = boolean_switch(key, value, "visible", look=true, set=false);
	
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
    for (field in field_objects){

        entry = field_objects[field][prop];
	
        var add_elem = document.createElement("div");
        
        if (field_objects[field]["visible"] === value){
            add_elem.className = "aligner-item";
        }
        else{
            add_elem.className = "aligner-item";
        }
        
        add_elem.id = field;
        var add_content = add_elem.innerHTML = entry ;
        add_to.appendChild(add_elem);

    }

	
	// no sort, reverse_sort, sort
	// hide visable = false
	//array = Array.from(item_list).sort()
		
	

}

function test(){
     for (field in myApp.field_objects){
        var elem_id = document.getElementById(field);
        if (myApp.field_objects[field]["visible"] === true){
            elem_id.className = "aligner-item";
        }
        else{
            elem_id.className = "aligner-item hidden";
        }
     }
}



function btn_action(btn){
    console.log(btn.dataset.toggle)
    //https://toddmotto.com/stop-toggling-classes-with-js-use-behaviour-driven-dom-manipulation-with-data-states/
    btn.dataset.toggle ^= 0
    
    console.log("hiiiiiii");
    test()

}



function btn_toggle(elem_id){
    var btn = document.getElementById(elem_id);
    
    btn.dataset.toggle = 1
    
    console.log(btn.dataset.toggle)
    btn.addEventListener("click", btn_action.bind(null, btn), false);
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