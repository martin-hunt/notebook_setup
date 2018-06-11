// Automatically run trusted notebooks.
// Notebooks need metadata tag 'tool' set to true.

define([
    'base/js/namespace',
    'jquery',
    'base/js/events',
    'notebook/js/codecell'
], function(IPython, $, events, codecell) {
    "use strict";

    IPython.exec_autorun = function () {
        if (IPython.notebook.trusted != true) { return };

        if (IPython.notebook.metadata.tool == true || IPython.notebook.metadata.tool == 'a') {
            console.log("Autorunning Cells");

            var cells = IPython.notebook.get_cells();
            var start = IPython.notebook.get_selected_index();
            var end = IPython.notebook.ncells();
            for (var i=start; i<end; i++) {
                if (cells[i] instanceof IPython.CodeCell) {
                    cells[i].execute();
                };
            };
        };
    };

    function hide_code () {
        $('div.input').hide();
        // $('#header-container').hide();
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

    function load_nb() {
        if (IPython.notebook.trusted == true && IPython.notebook.metadata.tool == true) {
            hide_code();
        };
    };

    var load_extension = function() {
        events.on('kernel_ready.Kernel', function () {setTimeout(IPython.exec_autorun, 1000)});
        IPython.notebook.config.loaded.then(load_nb);
    };

    return {
        load_jupyter_extension: load_extension,
        load_ipython_extension: load_extension
    };
});
