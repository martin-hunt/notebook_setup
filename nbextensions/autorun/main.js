// Automatically run trusted notebooks.
// Notebooks need metadata tag 'tool' set to true.
//
// Using line magics, cells can be marked as wait points.

define([
    'base/js/namespace',
    'jquery',
    'base/js/events'
], function(IPython, $, events) {
    "use strict";

    var waiting_for = -1;

    function handle_output(out){
        //console.log('OUTPUT');
        update_buttons(waiting_for);
    }

    function update_buttons(cell_number) {
        //console.log('update_buttons ' + waiting_for);
        var cell = IPython.notebook.get_cell(waiting_for);
        var end = IPython.notebook.ncells()
        var bgcolor = IPython.notebook.get_cell(0).element.css("background-color");
        // turn off the green or red backgrounds
        for (var i = 0; i < end; i++) {
            var tcell = IPython.notebook.get_cell(i);
            if ((tcell instanceof IPython.CodeCell)) {
                if (tcell.get_text().lastIndexOf("%wait") == 0) {

                    tcell.element.css("background-color", bgcolor);
                    var but = $(tcell.output_area.element).find(".continue_button");
                    if (but != undefined) {
                        name = but.attr("name");
                        if (name != 'undefined') {
                            //console.log('name=' + name);
                            name = name.split(",")[0];
                            //console.log('Name=' + name);
                            but.text(name);
                        }
                    }
                }
            }
        }
        cell.element.css("background-color", "lightgreen");
        cell.focus_cell();
    }

    function exec_code(code){
        //console.log('exec_code');
        var kernel = IPython.notebook.kernel;
        var callbacks = { 'iopub' : {'output' : handle_output}};
        //document.getElementById("result_output").value = "";  // clear output box
        var msg_id = kernel.execute(code, callbacks, {silent:false});
        //console.log("execute wait button");
        // IPython.notebook.clear_output();
    }

    IPython.wait_button_clicked = function() {
        //console.log('clicked');
        var cell = IPython.notebook.get_selected_cell();
        if (cell instanceof IPython.CodeCell) {
            if (cell.get_text().lastIndexOf("%wait") == 0) {
                cell.element.css("background-color", "red");
                var name = $(cell.output_area.element).find(".continue_button").attr("name");
                if (name != undefined) {
                    var wname = name.split(",")[1];
                    $(cell.output_area.element).find(".continue_button").text(wname);
                    IPython.exec_autorun();
                }
            }
        }
    }

    IPython.exec_autorun = function () {
        //console.log("autoruning cells");

        var cells = IPython.notebook.get_cells();
        var start = IPython.notebook.get_selected_index();
        var end = IPython.notebook.ncells();
        if (start == waiting_for) {
            start++;
            waiting_for = -1;
        }
        //console.log("start=" + start);
        for (var i=start; i<end; i++) {
            //console.log("Executing "+ i);
            // IPython.notebook.select(i);
            var cell = cells[i];
            cell.focus_cell();
            if (cell instanceof IPython.CodeCell) {
                // check to see if cell starts with magic
                var code = cell.get_text();
                if (code.lastIndexOf("%wait") == 0) {
                    cell.execute();
                    waiting_for = i;
                    exec_code(code);
                    IPython.notebook.scroll_to_cell(i, 1000);
                    break;
                } else {
                    cell.execute();
                };
            };
	    };
    };

    function hide_code () {
        $('div.input').hide();
        $('#header-container').hide();
        $('.header-bar').hide();
        $('.navbar').hide();
        IPython.notebook.clear_all_output();

        /* mark all cells read-only */
        var cells = IPython.notebook.get_cells();
        for(var i in cells) {
            cells[i].code_mirror.setOption('readOnly',true);
            if (cells[i].cell_type == 'markdown') {
                cells[i].element.unbind('dblclick');
            }
        };

        /* disable editing shortcuts */
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("a");  // insert above
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("b");  // insert below
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("d,d"); // delete cell
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("i,i");  // interrupt kernel
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("0,0");  // restart kernel
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("x");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("s");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("c");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("v");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("h");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("m");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("y");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("r");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("esc");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("cmdtrl-shift-p");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("ctrl-enter");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("alt-enter");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("shift-enter");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("enter");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("1");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("2");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("3");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("4");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("5");
        IPython.keyboard_manager.command_shortcuts.remove_shortcut("6");
    };

    function load_autorun () {
        // without the delay I get a bunch of errors about widgets not being ready
        setTimeout(IPython.exec_autorun, 10);
    };

    function load_nb() {
        if (IPython.notebook.metadata.tool == true && IPython.notebook.trusted == true) {
	    hide_code();
	    console.log("Autorun cell extension loaded and enabled for tool");
            // without the delay I get a bunch of errors about widgets not being ready
            setTimeout(IPython.exec_autorun, 10);
	}
    };

    var load_extension = function() {
        // IMPORTANT!  This extension only runs on TRUSTED notebooks with the proper metadata tag set.
	if (IPython.notebook.trusted == null) {
	    events.on('kernel_ready.Kernel', load_nb);
	} else {
            if (IPython.notebook.metadata.tool == true && IPython.notebook.trusted == true) {
		hide_code();
		console.log("autorun cell extension loaded and enabled for tool");
		events.on('kernel_ready.Kernel', load_autorun);
	    }
        };
    };

    return {load_ipython_extension : load_extension};
});
