

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



function add_elem_to(elem_id, item_list){
	var add_to = document.getElementById(elem_id);
	
	// no sort, reverse_sort, sort
	// hide visable = false
	array = Array.from(item_list).sort()
		
	var count = 0;
	array.forEach(function(entry) {
		var add_elem = document.createElement("div");
		add_elem.className = "aligner-item";
		add_elem.id = count;
		var add_content = add_elem.innerHTML = entry ;
		add_to.appendChild(add_elem);
		count ++
	});
}




function main(){
    ///https://stackoverflow.com/questions/7306669/how-to-get-all-properties-values-of-a-javascript-object-without-knowing-the-key/16643074#16643074
	var data = "text_data";
	json_data = parse_json(data);
	
	var data_layers = json_data.layers;

	field_objects  = traverse_data(data_layers);
    
    console.log(field_objects);
	
	add_elem_to("all_fields", field_objects[1]);
	
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