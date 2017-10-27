

function parse_json(data){
	var text_data = document.getElementById(data).value
	return JSON.parse(text_data)
}



function boolean_switch(key, value, field, look, set){
	if (key === "digitSeparator"){
		if (value = look){
			value = set
		}
    }
	return key, value
}



//called with every property and its value
function process_data(key, value, fieldnames, digitSep) {
    
	if (key === "fieldName"){
		fieldname = value;
		// Add all unique fieldnames
		fieldnames.add(fieldname);
	}
	
	else if (key === "digitSeparator"){
		digitSep.add(fieldname);
	}
	
    return key, value, fieldnames
}

function other(){
		
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


function traverse_data(obj, func, fieldnames, digitSep) {
	
    for (var key in obj) {
        func.apply(this,[key, obj[key], fieldnames, digitSep]);  
        if (obj[key] !== null && typeof(obj[key]) == "object") {
            //going one step down in the object tree!!
            traverse_data(obj[key], func, fieldnames, digitSep);
        }
    }
	return fieldnames, digitSep
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

	var data = "text_data";
	json_data = parse_json(data);
	
	var layers = json_data.layers;
	var fieldnames_list = new Set();
	var digitSep_list = new Set();
	
	fieldnames_list, digitSep_list  = traverse_data(layers, process_data, fieldnames_list, digitSep_list);
	
	add_elem_to("all_fields", fieldnames_list);
	//console.log(digitSep_list)
	
	
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