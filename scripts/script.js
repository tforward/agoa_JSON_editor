"use strict";

const myApp = {};

myApp.actions = {active: undefined};

myApp.item_actions = {"visible" : set_hidden, "digitSeparator" : set_digit_sep, "show_labels" : edit_label};

// ======================================================================

function parse_json(data){
	const text_data = document.getElementById(data).value
	return JSON.parse(text_data)
}


function other(){

    // TODO
    //    - 
    
    // This tool assumes all fields based on the name

	// (key === "label") format to make this look nice remove _ etc.
	
    // label rules TitleCase, UpperCase, CamalCase, remove() or user_input
    
    // tooltip
    
    // date formats https://developers.arcgis.com/javascript/3/jshelp/intro_popuptemplate.html

    // save / load configururation

    // output

    // tooltip for app

    // formatting and make nice

    // error handling

}

// function dateObject(){
//     dateObject = {
//         "shortDate": "12/21/1997",
//         "shortDateLE": "21/12/1997",
//         "longMonthDayYear": "December 21,1997",
//         "dayShortMonthYear": "21 Dec 1997",
//         "longDate":	"Sunday, December 21, 1997",
//         "shortDateLongTime": "12/21/1997 6:00:00 PM",
//         "shortDateLELongTime":	"21/12/1997 6:00:00 PM",
//         "shortDateShortTime":	"12/21/1997 6:00 PM",
//         "shortDateLEShortTime":	"21/12/1997 6:00 PM",
//         "shortDateShortTime24":	"12/21/1997 18:00",
//         "shortDateLEShortTime24":	"21/12/1997 18:00",
//         "shortDateShortTime24":	"12/21/1997 18:00",
//         "shortDateLEShortTime24":	"21/12/1997 18:00",
//         "longMonthYear":	"December 1997",
//         "shortMonthYear":	"Dec 1997",
//         "year":	"1997"
//     }
// }


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
    add_elem.innerHTML = "<label class='lbl_class'>" + fieldname + "</label>";

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
    // Gets the active btn header
    let active = myApp.actions.active;

    let action = myApp.item_actions[active];
    action(btn.id);
    
    btn.dataset.toggle ^= 1;
}
    
    
function btn_toggle(elem_id, func, bool, btn_type="click"){

    const btn = document.getElementById(elem_id);
    
    btn.dataset.toggle = 0
    btn.addEventListener(btn_type, func.bind(null, btn, bool));
}


function reset_div(fieldname){
    const div_id = document.getElementById("div_" + fieldname);
    const label_elem = div_id.getElementsByClassName("lbl_class")[0];

    label_elem.textContent = fieldname;
    div_id.className = "aligner-div";
}


function reset_btn(id){
    const btn_elem = document.getElementById(id);
    btn_elem.textContent = "Edit";
    btn_elem.className = "aligner-btn";
    btn_elem.dataset.toggle = 0;
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
    reset_selection();

    myApp.field_names.forEach(function (fieldname){
        // Default / resets
        reset_div(fieldname)
        const has_digit = style_digit_sep(fieldname)
    
        if (has_digit === undefined){
            const elem_id = document.getElementById(fieldname);
            const div_id = document.getElementById("div_" + fieldname);
            elem_id.className = "aligner-btn";
            div_id.className = "hidden"
        }
    });
}


function set_hidden(id){
    const field_obj = myApp.field_objects[id];
    field_obj["visible"] = !field_obj["visible"];
    style_visible(id);
}


function style_visible(id){
    const elem_id = document.getElementById(id);
    const field_obj = myApp.field_objects[id];

    elem_id.className = field_obj["visible"] === false ? "aligner-btn off" : "aligner-btn on";
    elem_id.innerHTML = field_obj["visible"] === false ? "Off" : "On";
}


function highlight_visible(btn){
    myApp.actions.active = btn.id;

    reset_selection();

    myApp.field_names.forEach(function (fieldname) {
        //Reset the div
        reset_div(fieldname)
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
    let text_value = value === true ? "On" : "Off";
    
    myApp.field_names.forEach(function (field){
        let elem_id = document.getElementById(field);
        let fid = myApp.field_objects[field];
        
        if  (myApp.actions.active === "visible"){
            if (value === "invert"){
                set_hidden(field)
            }
            else{
                elem_id.className = "aligner-btn " + css_value;
                elem_id.innerHTML = text_value;
                fid["visible"] = value;
            }
        }

        else if (myApp.actions.active === "digitSeparator"){
            if (fid.format !== null && fid.format.hasOwnProperty("digitSeparator")){
                if (value === "invert"){
                    set_digit_sep(field);
                }
                else{
                    elem_id.className = "aligner-btn " + css_value;
                    elem_id.innerHTML = text_value;
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


function update_label_text(){
    myApp.field_names.forEach(function (fieldname){
        const label_elem = document.getElementById("div_" + fieldname).getElementsByClassName("lbl_class")[0];
        const field_obj = myApp.field_objects[fieldname];
        label_elem.textContent = field_obj.label;
        reset_btn(fieldname);
    });
}


function show_labels(btn){
    myApp.actions.active = btn.id;

    reset_selection();
 
    myApp.field_names.forEach(function (fieldname){
        reset_div(fieldname);
        reset_btn(fieldname);
        let label_elem = document.getElementById("div_" + fieldname).getElementsByClassName("lbl_class")[0];
        const btn_elem = document.getElementById(fieldname);
  
        let field_obj = myApp.field_objects[fieldname];
        // Reset the CSS Style so it's visible
        btn_elem.className = "aligner-btn";
        btn_elem.textContent = "Edit"
        label_elem.textContent = field_obj.label
    });
}


function edit_label(id){
    const btn_elem = document.getElementById(id);
    const field_obj = myApp.field_objects[id];
    const label_elem = document.getElementById("div_" + id).getElementsByClassName("lbl_class")[0];
    const add_elem = document.createElement("input");

    // Need a handle so that only one can be edit at a time
    if (btn_elem.dataset.toggle == 0){
        update_label_text()
        btn_elem.textContent = "Set"
        btn_elem.className = "aligner-btn on"

        label_elem.textContent = null;
    
        add_elem.type = "text";
        add_elem.id = "active_text_input";
        add_elem.autofocus = "autofocus";
        add_elem.value = field_obj.label;
    
        label_elem.appendChild(add_elem);
    }
    else if (btn_elem.dataset.toggle == 1){
        const edit_elem = document.getElementById("active_text_input");
        field_obj.label = edit_elem.value;

        edit_elem.remove();
        label_elem.textContent = field_obj.label

        // Reformat the Button
        btn_elem.textContent = "Edit";
        btn_elem.className = "aligner-btn";
    }
}


function label_dropdown(){

    // on option to do only on those selected would be good
    const selected = document.getElementById("label_dropdown").value;
    
    myApp.field_names.forEach(function (fieldname){
        const field_obj = myApp.field_objects[fieldname];

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
    update_label_text();
}


function addEventListener(elem_id, func, func_args=null, btn_type="click"){
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