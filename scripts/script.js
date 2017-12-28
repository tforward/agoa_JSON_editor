"use strict";

const myApp = {};

myApp.actions = {active: undefined};

myApp.item_actions = {"digitSeparator" : set_digit_sep, "show_labels" : edit_label};

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

    // places (decimals)

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

    add_toggle_div(fieldname, add_elem)

    const add_btn = document.createElement("btn");
    
    // By Default don't show the button
    add_btn.className = "hidden";
    add_btn.id = fieldname;
    add_btn.innerHTML = "Btn";

    add_elem.appendChild(add_btn);
    
    btn_toggle(fieldname, btn_action);
}

function add_toggle_div(fieldname, add_to){
    const add_tog_div = document.createElement("div");
    add_tog_div.className = "toggle_div";
    add_to.appendChild(add_tog_div);

    add_toggle_img(fieldname, add_tog_div, "label_", set_n_style_label);
    style_label(fieldname);

    add_toggle_img(fieldname, add_tog_div, "vis_", set_n_style_visibility);
    style_visibility(fieldname);

    add_toggle_img(fieldname, add_tog_div, "digit_", set_n_style_digit_sep);
    style_digit_sep(fieldname);

    add_toggle_img(fieldname, add_tog_div, "date_", set_n_style_date);
    style_date(fieldname);

    add_toggle_img(fieldname, add_tog_div, "decim_", set_n_style_decim);
    style_decim(fieldname);
}


function add_toggle_img(fieldname, add_to, prefix, func){
    const add_tog = document.createElement("img");
    add_tog.id = prefix + fieldname;
    add_tog.width = 20;
    add_tog.height = 20;
    add_to.appendChild(add_tog);
    btn_toggle(add_tog.id, func);
}

function set_n_style_visibility(fieldname){
    // Remove the "vis_" from fieldname
    const f_id = fieldname.id.split(/_(.+)/)[1]
    toggle_visibility(f_id);
    style_visibility(f_id);
}

function set_n_style_label(fieldname){
    // Remove the "label_" from fieldname
    const d_id = fieldname.id.split(/_(.+)/)[1]
    toggle_label(d_id);
    style_label(d_id);
}

function set_n_style_digit_sep(fieldname){
    // Remove the "digit_" from fieldname
    const d_id = fieldname.id.split(/_(.+)/)[1]
    toggle_digit_sep(d_id);
    style_digit_sep(d_id);
}

function set_n_style_date(fieldname){
    // Remove the "date_" from fieldname
    const d_id = fieldname.id.split(/_(.+)/)[1]
    toggle_date(d_id);
    style_date(d_id);
}

function toggle_date(fieldname){
    const field_obj = myApp.field_objects[fieldname];
    // Switches boolean from true or false or vice-versa
    if (field_obj.format !== null && field_obj.format.hasOwnProperty("dateFormat")){
        field_obj.format["dateFormat"] = !field_obj.format["dateFormat"];
    }
}

function set_n_style_decim(fieldname){
    style_decim(fieldname);
}

function style_decim(fieldname){
    const field_obj = myApp.field_objects[fieldname];
    const elem_id = document.getElementById("decim_" + fieldname);

    if (field_obj.format !== null && field_obj.format.hasOwnProperty("places")){
        const decimals = field_obj.format["places"];
        elem_id.src = "images/decimal.png";
        elem_id.alt, elem_id.title =  'Has ' + decimals + ' Decimal(s)';
    }
    else{
        elem_id.src = "images/na.png";
        elem_id.alt, elem_id.title =  "N/A"
        elem_id.className = "notApplicable";
    }
}


function style_date(fieldname){
    const field_obj = myApp.field_objects[fieldname];
    const elem_id = document.getElementById("date_" + fieldname);
    const date = ["shortDate", "shortDateLE", "longMonthDayYear", "dayShortMonthYear",
    "longDate", "longMonthYear", "shortMonthYear", "year"]

   const dateTime = ["shortDateLongTime", "shortDateLELongTime", "shortDateShortTime",
    "shortDateLEShortTime", "shortDateShortTime24", "shortDateLEShortTime24",
     "shortDateShortTime24", "shortDateLEShortTime24"]

    if (field_obj.format !== null && field_obj.format.hasOwnProperty("dateFormat")){
        const d = field_obj.format["dateFormat"]

        if (dateTime.indexOf(d) > -1){
            elem_id.src = "images/dateTime.png";
            elem_id.alt, elem_id.title =  "Has Date & Time";
        }
        else if(date.indexOf(d) > -1){
            elem_id.src = "images/date.png";
            elem_id.alt, elem_id.title =  "Has Date";
        }
    }
    else{
        elem_id.src = "images/date_na.png";
        elem_id.alt, elem_id.title =  "N/A"
        elem_id.className = "notApplicable";
    }
}


function toggle_digit_sep(fieldname){
    const field_obj = myApp.field_objects[fieldname];
    // Switches boolean from true or false or vice-versa
    if (field_obj.format !== null && field_obj.format.hasOwnProperty("digitSeparator")){
        field_obj.format["digitSeparator"] = !field_obj.format["digitSeparator"];
    }
}

function style_digit_sep(fieldname){
    const field_obj = myApp.field_objects[fieldname];
    const elem_id = document.getElementById("digit_" + fieldname);

    if (field_obj.format !== null && field_obj.format.hasOwnProperty("digitSeparator")){
        elem_id.src = !field_obj.format["digitSeparator"] === false ? "images/comma_off.png" : "images/comma_on.png";
        elem_id.alt, elem_id.title =  !field_obj.format["digitSeparator"] === false ? "Separator Off" : "Separator On";
    }
    else{
        elem_id.src = "images/comma_na.png";
        elem_id.alt, elem_id.title =  "N/A"
        elem_id.className = "notApplicable";
    }
}


function toggle_visibility(fieldname){
    const field_obj = myApp.field_objects[fieldname];
    field_obj["visible"] = !field_obj["visible"];
}


function style_visibility(fieldname){
    const field_obj = myApp.field_objects[fieldname];
    const elem_id = document.getElementById("vis_" + fieldname);

    elem_id.src = !field_obj["visible"] === false ? "images/light_on.svg" : "images/light_off.svg";
    elem_id.alt, elem_id.title = !field_obj["visible"] === false ? "Visible" : "Hidden";
}

function style_label(fieldname){
    const elem_id = document.getElementById("label_" + fieldname);

    if (elem_id.dataset.toggle == 0){
        elem_id.src = "images/label.png";
        elem_id.alt, elem_id.title = "Edit Label";
        elem_id.className = null;
    }
    else{
        elem_id.src = "images/set_label.png";
        elem_id.alt, elem_id.title = "Set Label";
    }
}


function reset_active_input(){
    const edit_elem = document.getElementById("active_text_input");

    if (edit_elem != null){
        const active_btn = document.getElementsByClassName("active_btn")[0];
        const d_id = active_btn.id.split(/_(.+)/)[1]

        set_btn_label(d_id);
        style_label(d_id);
    }
}


function submit_label(btn, fieldname, event){
    // If "Enter" is hit
    // PROB NEED TO DELETE THE EVENT HANDLE AFTER CLOSE OF THE BUTTON??????
    if (event.keyCode === 13){
        set_btn_label(fieldname)
        style_label(fieldname);
    }
}


function toggle_label(id){
    const btn_elem = document.getElementById("label_" + id);
    const field_obj = myApp.field_objects[id];
    const label_elem = document.getElementById("div_" + id).getElementsByClassName("lbl_class")[0];
    const add_elem = document.createElement("input");
    

    // Need a handle so that only one can be edit at a time
    if (btn_elem.dataset.toggle == 0){
        reset_active_input();
        label_elem.textContent = null;
    
        add_elem.type = "text";
        add_elem.id = "active_text_input";
        add_elem.autofocus = "autofocus";
        add_elem.value = field_obj.label;
    
        label_elem.appendChild(add_elem);
        btn_elem.dataset.toggle = 1;
        btn_elem.className = "active_btn";
        addEventListener("active_text_input", submit_label, id, "keyup");
    }
    else if (btn_elem.dataset.toggle == 1){
        set_btn_label(id)
    }
}

function set_btn_label(id){
    const btn_elem = document.getElementById("label_" + id);
    const field_obj = myApp.field_objects[id];
    const label_elem = document.getElementById("div_" + id).getElementsByClassName("lbl_class")[0];
    const edit_elem = document.getElementById("active_text_input");

    field_obj.label = edit_elem.value;
    edit_elem.remove();
    label_elem.textContent = field_obj.label;
    btn_elem.dataset.toggle = 0;
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


function set_digit_sep(id){
    
    const field_obj = myApp.field_objects[id];

    // Switches boolean from true or false or vice-versa
    field_obj.format["digitSeparator"] = !field_obj.format["digitSeparator"];
    style_digit_sep(id)
}


// ============= FILTERS =============


function format_filter(btn, prop){
    // Sets the active button global
    myApp.actions.active = btn.id;
    reset_selection();

    myApp.field_names.forEach(function (fieldname){
        const field_obj = myApp.field_objects[fieldname];
        const div_id = document.getElementById("div_" + fieldname);

        div_id.className =
         (field_obj.format == null || !field_obj.format.hasOwnProperty(prop)) ?
          "hidden" : "aligner-div";
    })
}


function filter_prop_bool(btn, args){
    // Sets the active button global
    myApp.actions.active = btn.id;
    reset_selection();

    myApp.field_names.forEach(function (fieldname){
        const field_obj = myApp.field_objects[fieldname];
        const div_id = document.getElementById("div_" + fieldname);

        div_id.className = (field_obj[args[0]] == args[1]) ?
          "hidden" : "aligner-div";
    })
}



// function set_hidden(fieldname){
//     const field_obj = myApp.field_objects[fieldname];
//     field_obj["visible"] = !field_obj["visible"];
//     style_visible(fieldname);
// }


// function style_visible(id){
//     const elem_id = document.getElementById(id);
//     const field_obj = myApp.field_objects[id];

//     elem_id.className = field_obj["visible"] === false ? "aligner-btn off" : "aligner-btn on";
//     elem_id.innerHTML = field_obj["visible"] === false ? "Off" : "On";
// }



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
    });
}


function show_labels(btn){
    myApp.actions.active = btn.id;
    reset_selection();
 
    myApp.field_names.forEach(function (fieldname){
        let label_elem = document.getElementById("div_" + fieldname).getElementsByClassName("lbl_class")[0];
        let field_obj = myApp.field_objects[fieldname];
        reset_div(fieldname);
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


function addEventListener(elem_id, func, func_args=null, event="click"){
	const btn = document.getElementById(elem_id);
	btn.addEventListener(event, func.bind(null, btn, func_args));
}

// ======================================================================

myApp.main = function main(){
    let json_data = parse_json("text_data");

    myApp.field_objects = get_unique_field_objs(json_data);

    myApp.field_names = Object.keys(myApp.field_objects);
    
    add_elem_to("content", true);

    addEventListener("filter_visible", filter_prop_bool, ["visible", false]);
    
    addEventListener("filter_digitSeparator", format_filter, "digitSeparator");
	
    addEventListener("selection_dropdown", selection_dropdown, null, "change");

    addEventListener("label_dropdown", label_dropdown, null, "change");

    addEventListener("show_labels", show_labels);

    addEventListener("filter_dates", format_filter, "dateFormat");

    console.log(myApp.field_objects);
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