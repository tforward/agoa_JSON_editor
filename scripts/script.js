"use strict";

const myApp = {};

myApp.actions = {active: undefined};

myApp.item_actions = {"visible" : set_hidden, "digitSeparator" : set_digit_sep};

// ======================================================================

function parse_json(data){
	const text_data = document.getElementById(data).value
	return JSON.parse(text_data)
}


function other(){
    
    // This tool assumes all fields based on the name

	// (key === "label") format to make this look nice remove _ etc. Title Case
	
    // label rules TitleCase, UpperCase, CamalCase, remove() or user_input
    
    // tooltip
    
    // date formats

    // save / load configururation

    // output

    // tooltip for app

    // formatting and make nice

    // error handling

}


function get_unique_field_objs(json_data) {

    const field_names_set = new Set();
	
    const field_objs = json_data.layers
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


function add_element(fieldname, add_to){
    const add_elem = document.createElement("btn");
    
    // Assign HTML class and id to element
    add_elem.className = "aligner-btn";
    add_elem.id = fieldname;

    const add_content = add_elem.innerHTML = fieldname;
    add_to.appendChild(add_elem);
    
    btn_toggle(fieldname, btn_action);
}


function add_elem_to(elem_id, value){

    const add_to = document.getElementById(elem_id);
    myApp.field_names.forEach(fieldname => add_element(fieldname, add_to));
    
	// no sort, reverse_sort, sort
}


function set_digit_sep(id){

	const elem_id = document.getElementById(id);
    let field = myApp.field_objects[id];

    if (field.format !== null && field.format.hasOwnProperty("digitSeparator")){
        elem_id.className = field.format["digitSeparator"] === false ?  "aligner-btn on" :  "aligner-btn off";

        // Switches boolean from true or false or vice-versa
        field.format["digitSeparator"] = !field.format["digitSeparator"];
    }
    else{
        alert("CANNOT SELECT GREYED OUT FIELDS.");
    }
}


function set_hidden(id){

	const elem_id = document.getElementById(id);
    let field = myApp.field_objects[id];

    elem_id.className = field["visible"] === true ? "aligner-btn off" : "aligner-btn on";

    field["visible"] = !field["visible"];

    console.log(field["visible"])
    
}


function btn_action(btn){
    
	// Gets the active btn header
    let active = myApp.actions.active;
    
    if (active == undefined){
        alert("PLEASE SELECT AN OPTION FIRST");
    }
    else{
        // Action calls the function assigned to the btn_neader
        let action = myApp.item_actions[active];
        action(btn.id);
    }
	
	btn.dataset.toggle ^= 1;
}


function btn_toggle(elem_id, func, bool, btn_type="click"){

    const btn = document.getElementById(elem_id);
    
    btn.dataset.toggle = 0
    btn.addEventListener(btn_type, func.bind(null, btn, bool));
}


function highlight_hidden(btn){
    // Highlights fields that are visable and hidden
    reset_selection()

    myApp.actions.active = btn.id;

    myApp.field_names.forEach(function (field) {
        const elem_id = document.getElementById(field);
        elem_id.className = myApp.field_objects[field][btn.id] === true ? "aligner-btn on" : "aligner-btn off";
    });
}


function highlight_digit_sep(btn, set_value=false){

    reset_selection()

    // Sets the active button global
    myApp.actions.active = btn.id;

    let sel_status = document.getElementById("selectable").checked === true ? "hidden" : "greyed_out";

    myApp.field_names.forEach(function (field){
        const elem_id = document.getElementById(field);
        
        // Default / resets
        elem_id.className = "aligner-btn";
    
        let id = myApp.field_objects[field];
    
        if (id.format !== null && id.format.hasOwnProperty("digitSeparator")){
            elem_id.className = id.format["digitSeparator"] === true ?  "aligner-btn on" :  "aligner-btn off";
        }
        else{
            elem_id.className = "aligner-btn " + sel_status;
        }
    });
}


function only_selectable(btn){
    const elems = document.getElementsByClassName("aligner-btn"); 

    myApp.field_names.forEach(function (field){
        elems[field].className = btn.checked === true ? (elems[field].className.replace("greyed_out", "hidden")) : (elems[field].className.replace("hidden", "greyed_out"));
    });
}


function addEventListener(elem_id, func, btn_type="click"){
	const btn = document.getElementById(elem_id);
	
	btn.addEventListener(btn_type, func.bind(null, btn));

}

function apply_to_all_active_fields(value){

    let css_value = value === true ? "on" : "off";
    
    myApp.field_names.forEach(function (field){
        let elem_id = document.getElementById(field);
        let fid = myApp.field_objects[field];
        
        if  (myApp.actions.active === "visible"){
            if (value === "invert"){
                elem_id.className = fid["visible"] === false ? "aligner-btn on" : "aligner-btn off";
                fid["visible"] = !fid["visible"];
            }
            else{
                elem_id.className = "aligner-btn " + css_value;
                fid["visible"] = value;
            }
        }

        else if (myApp.actions.active === "digitSeparator"){
            if (fid.format !== null && fid.format.hasOwnProperty("digitSeparator")){
                if (value === "invert"){
                    elem_id.className = fid.format["digitSeparator"] === false ?  "aligner-btn on" :  "aligner-btn off";
                    // Switches boolean from true or false or vice-versa
                    fid.format["digitSeparator"] = !fid.format["digitSeparator"];
                }
                else{
                    elem_id.className = "aligner-btn " + css_value;
                    fid.format["digitSeparator"] = value;
                }
            }
        }
    });
}


function reset_selection(){
    document.getElementById("selection_options").value = "none";
}


function selected_options(){
    const btn = document.getElementById("selection_options");
    
    if (btn.value == "all_on"){
        apply_to_all_active_fields(true);
    }
    else if (btn.value == "all_off"){
        apply_to_all_active_fields(false);
    }
    else if (btn.value == "all_invert"){
        apply_to_all_active_fields("invert");
    }
    else{
        console.log(btn.value);
    }
}

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function set_all_labels(){

    // generator?
    myApp.field_names.forEach(function (fieldname){
        let field_obj = myApp.field_objects.hasOwnProperty(fieldname) ?
         myApp.field_objects[fieldname] : console.log("ERROR: No field with this name: ", fieldname);

        field_obj.label = toTitleCase(field_obj.label);
        console.log(field_obj.label)

    })
}

function label_options(){
    
    const selected = document.getElementById("label_options").value;
    
    if (selected === "title_case"){
        console.log(selected);
        set_all_labels();
    }
    else if(selected === "lower_case"){
        console.log(selected);
    }
    else if(selected === "upper_case"){
        console.log(selected);
    }

}

// ======================================================================

myApp.main = function main(){
    let json_data = parse_json("text_data");

    myApp.field_objects = get_unique_field_objs(json_data);

    myApp.field_names = Object.keys(myApp.field_objects);
    
    add_elem_to("content", true);
    
    addEventListener("visible", highlight_hidden);
	
    addEventListener("digitSeparator", highlight_digit_sep);
    
    addEventListener("selectable", only_selectable);
	
    addEventListener("selection_options", selected_options, "change");

    addEventListener("label_options", label_options, "change");

    //console.log( myApp.field_objects)

}

// ======================================================================

// Onload fuction alt. to JQuery ready method.
myApp.initApplication = function(){
  console.log("App Loaded.\n");
  myApp.main();
};

  // Handler when the DOM is fully loaded
document.onreadystatechange = function () {
    document.readyState === "complete" ? myApp.initApplication(document.readyState) : console.log("Loading...");
}

// ======================================================================