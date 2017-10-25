

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
function process(key, value, fieldnames) {
    
	if (key === "fieldName"){
		// Add all unique fieldnames
		fieldnames.add(value);
		console.log(value);
	}
	
	// It makes sence on the first pass to pick up the other features?
	key, value = boolean_switch(key, value, "digitSeparator", look=true, set=false);
	
	// visibility
	// include list 
	// exclude list
	// super list
    
	//console.log(key + " : " + value);
	
	
	
    return key, value, fieldnames
}


function traverse(obj, func, fieldnames) {
	
    for (var key in obj) {
        func.apply(this,[key, obj[key], fieldnames]);  
        if (obj[key] !== null && typeof(obj[key]) == "object") {
            //going one step down in the object tree!!
            traverse(obj[key], func, fieldnames);
        }
    }
	
	return fieldnames
}





function main(){

	var data = "text_data";
	json_data = parse_json(data);
	
	var layers = json_data.layers;
	var fieldnames = new Set();
	result = traverse(layers, process, fieldnames);
	console.log(result)
	
	
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