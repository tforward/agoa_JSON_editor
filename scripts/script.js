"use strict";

const myApp = {};

myApp.actions = {active: undefined};

myApp.item_actions = {"visible" : set_and_style_hidden, "digitSeparator" : set_digit_sep, "show_labels" : edit_label};

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
    const add_elem = document.createElement("div");
    
    // Assign HTML class and id to element
    add_elem.className = "aligner-div";
    add_elem.id = "div_" + fieldname;
    add_elem.innerHTML = fieldname;

    add_to.appendChild(add_elem);

    const add_btn = document.createElement("btn");
    
    // By Default don't show the button
    add_btn.className = "hidden";
    add_btn.id = fieldname;
    add_btn.innerHTML = "Btn";

    add_elem.appendChild(add_btn);
    
    btn_toggle(fieldname, btn_action);
}


function add_elem_to(elem_id, value){

    const add_to = document.getElementById(elem_id);
    myApp.field_names.forEach(fieldname => add_element(fieldname, add_to));
    
	// no sort, reverse_sort, sort
}

function btn_action(btn){
    
        // This can be redone to get the value from the html form versus the js object
        
        // Gets the active btn header
        let active = myApp.actions.active;
        
        // if (active == undefined){
        //     alert("PLEASE SELECT AN OPTION FIRST");
        // }
        // else{
            // Action calls the function assigned to the btn_neader
    
        let action = myApp.item_actions[active];
        action(btn.id);
    
        // }
        
        btn.dataset.toggle ^= 1;
    }
    
    
function btn_toggle(elem_id, func, bool, btn_type="click"){

    const btn = document.getElementById(elem_id);
    
    btn.dataset.toggle = 0
    btn.addEventListener(btn_type, func.bind(null, btn, bool));
}


function reset(fieldname){
    const div_id = document.getElementById("div_" + fieldname);
    div_id.className = "aligner-div";

    document.getElementById("selection_dropdown").value = "none";
}


function style_digit_sep(id){
    const elem_id = document.getElementById(id);
    const field_obj = myApp.field_objects[id];

    if (field_obj.format !== null && field_obj.format.hasOwnProperty("digitSeparator")){
        elem_id.className = field_obj.format["digitSeparator"] === false ?  "aligner-btn off" :  "aligner-btn on";
        elem_id.innerHTML = field_obj.format["digitSeparator"] === false ?  "Off" :  "On";
        return id
    }
}


function set_digit_sep(id){
    
    const field_obj = myApp.field_objects[id];

    // Switches boolean from true or false or vice-versa
    field_obj.format["digitSeparator"] = !field_obj.format["digitSeparator"];
    style_digit_sep(id)
}


function highlight_digit_sep(btn, set_value=false){
    // Sets the active button global
    myApp.actions.active = btn.id;

    let sel_status = document.getElementById("selectable").checked === true ? "hidden" : "greyed_out";

    myApp.field_names.forEach(function (fieldname){
        // Default / resets
        reset(fieldname)
        const has_digit = style_digit_sep(fieldname)
    
        if (has_digit === undefined){
            const elem_id = document.getElementById(fieldname);
            const div_id = document.getElementById("div_" + fieldname);
            elem_id.className = "aligner-btn " + sel_status;
            div_id.className = "hidden" //+ sel_status;
        }
    });
}


function set_hidden(id){
    const field_obj = myApp.field_objects[id];
    
    
    field_obj["visible"] = !field_obj["visible"];
}


function style_visible(id){
    const elem_id = document.getElementById(id);
    const field_obj = myApp.field_objects[id];

    elem_id.className = field_obj["visible"] === false ? "aligner-btn off" : "aligner-btn on";
    elem_id.innerHTML = field_obj["visible"] === false ? "Off" : "On";
}


function set_and_style_hidden(id){
    set_hidden(id);
    style_visible(id);
}


function highlight_visible(btn){
    myApp.actions.active = btn.id;

    myApp.field_names.forEach(function (fieldname) {
        //Reset the div
        reset(fieldname)

        style_visible(fieldname);
    });
}


function only_selectable(btn){
    const elems = document.getElementsByClassName("aligner-btn"); 

    myApp.field_names.forEach(function (field){
        elems[field].className = btn.checked === true ? (elems[field].className.replace("greyed_out", "hidden")) : (elems[field].className.replace("hidden", "greyed_out"));
    });
}


function apply_to_all_active_fields(value){

    let css_value = value === true ? "on" : "off";
    
    myApp.field_names.forEach(function (field){
        let elem_id = document.getElementById(field);
        let fid = myApp.field_objects[field];
        
        if  (myApp.actions.active === "visible"){
            if (value === "invert"){
                set_and_style_hidden(field)
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
    document.getElementById("selection_dropdown").value = "none";
}


function selection_dropdown(){
    const btn = document.getElementById("selection_dropdown");

    switch(btn.value){
        case "all_on":
            apply_to_all_active_fields(true);
            break;
        case "all_off":
            apply_to_all_active_fields(false);
            break;
        case "all_invert":
            apply_to_all_active_fields("invert");
            break;
        default:
            console.log(btn.value);
    };
}


function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


function show_obj_prop(btn, item){
    // btn = The html element the function is being called from
    myApp.field_names.forEach(function (fieldname){
        let elem_id = document.getElementById(fieldname);
        let field_obj = myApp.field_objects[fieldname];
        elem_id.innerHTML = field_obj[item];
    });
}


function show_labels(btn){
    myApp.actions.active = btn.id;
    
    myApp.field_names.forEach(function (fieldname){
        let elem_id = document.getElementById(fieldname);
        let field_obj = myApp.field_objects[fieldname];
        // Reset the CSS Style
        elem_id.className = "aligner-btn";
        elem_id.innerHTML = field_obj.label
    });
}


function edit_label(id){
    const elem_id = document.getElementById(id);
    const field_obj = myApp.field_objects[id];
    const add_elem = document.createElement("input");

    if (elem_id.dataset.toggle == 0){
        elem_id.innerHTML = null;
    
        add_elem.type = "text";
        add_elem.id = "active_text_input";
        add_elem.autofocus = "autofocus";
        add_elem.value = field_obj.label;
    
        elem_id.appendChild(add_elem);
    }
    else if (elem_id.dataset.toggle == 1){
        console.log(elem_id.target)
        //elem_id.innerHTML = field_obj.label;
    }
}


function label_dropdown(){

    // on option to do only on those selected would be good
    const selected = document.getElementById("label_dropdown").value;
    
    myApp.field_names.forEach(function (fieldname){
        let field_obj = myApp.field_objects[fieldname];

        switch (selected){
            case "title_case":
                field_obj.label = toTitleCase(field_obj.label);
                break;
            case "lower_case":
                field_obj.label = field_obj.label.toLowerCase();
                break;
            case "upper_case":
                field_obj.label = field_obj.label.toUpperCase();
                break;
            case "match_fields":
                field_obj.label = field_obj.fieldName;
                break;
            default:
                console.log("No case selected");
        }
        // Add a Preserve Starting State
    });
    // Refresh the labels on screen
    show_obj_prop("label_options", "label");
}


function addEventListener(elem_id, func, func_args=null, btn_type="click"){
    console.log(elem_id)
	const btn = document.getElementById(elem_id);
	btn.addEventListener(btn_type, func.bind(null, btn, func_args));
}

// ======================================================================

myApp.main = function main(){
    let json_data = parse_json("text_data");

    myApp.field_objects = get_unique_field_objs(json_data);

    myApp.field_names = Object.keys(myApp.field_objects);
    
    add_elem_to("content", true);
    
    addEventListener("visible", highlight_visible);
	
    addEventListener("digitSeparator", highlight_digit_sep);
    
    addEventListener("selectable", only_selectable);
	
    addEventListener("selection_dropdown", selection_dropdown, null, "change");

    addEventListener("label_dropdown", label_dropdown, null, "change");

    addEventListener("show_labels", show_labels);

    console.log( myApp.field_objects)
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