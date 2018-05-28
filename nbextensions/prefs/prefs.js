/* Adds a Preferences link to the file menu */
define([
    'require',
    'jquery',
    'base/js/namespace',
], function (
    require,
    $,
    Jupyter,
) {
    'use strict';

    function load_jupyter_extension () {
	var url = "<li id=\"prefs\" title=\"Preferences\"><a href=\"";
	url += Jupyter.notebook.base_url + "notebooks/notebooks/_NOTEBOOK_EXAMPLES/NotebookSettings/NotebookSettings.ipynb\"";
	url += " target=\"_blank\">Preferences</a></li>";
        $("#open_notebook").after(url);
    }

    return {
        load_ipython_extension : load_jupyter_extension
    }
});
