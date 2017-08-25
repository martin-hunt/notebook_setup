/* Adds a Preferences link to the file menu */
define([
    'require',
    'jquery',
], function (
    require,
    $,
) {
    'use strict';

    function load_jupyter_extension () {
        $("#open_notebook").after("<li id=\"prefs\" title=\"Preferences\"><a href=\"/notebooks/NotebookSettings/NotebookSettings.ipynb\" target=\"_blank\">Preferences</a></li>")
    }

    return {
        load_ipython_extension : load_jupyter_extension
    }
});
