/* Adds a Preferences link to the file menu */
define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/i18n',
    'underscore'
], function (
    require,
    $,
    Jupyter,
    dialog, 
    i18n, 
    _
) {
    'use strict';

    function load_prefs() {
        console.log('prefs loaded');
        var host = window.location.hostname.replace('proxy.', '');
        var prefs = `https://${host}/tools/jupyterprefs`;
        var url = "<li id=\"prefs\" title=\"Preferences\"><a href=\"";
        url += prefs + "\" target=\"_blank\">Preferences</a></li>";
        $("#open_notebook").after(url);
    }

    function load_about() {
        $('#notebook_about').off("click"); //remove old
        $('#notebook_about').click(function () {
            // use underscore template to auto html escape
            if (sys_info) {
                var text = i18n.msg._('You are using Jupyter notebook.');
                var x = sys_info.sys_executable;
                x = x.slice(1, x.lastIndexOf('/bin/'))
                x = x.slice(x.lastIndexOf('/') + 1)
                text += 'Running in environment: <pre>' + x + '</pre>';
                text = text + i18n.msg._('The version of the notebook server is: ');
                text = text + _.template('<b><%- version %></b>')({
                    version: sys_info.notebook_version
                });
                if (sys_info.commit_hash) {
                    text = text + _.template('-<%- hash %>')({
                        hash: sys_info.commit_hash
                    });
                }
                text = text + '<br/>';
                text = text + i18n.msg._('The server is running on this version of Python:');
                text = text + _.template('<br/><pre>Python <%- pyver %></pre>')({
                    pyver: sys_info.sys_version
                });
                var kinfo = $('<div/>').attr('id', '#about-kinfo').text(i18n.msg._('Waiting for kernel to be available...'));
                var body = $('<div/>');
                body.append($('<h4/>').text(i18n.msg._('Server Information:')));
                body.append($('<p/>').html(text));
                body.append($('<h4/>').text(i18n.msg._('Current Kernel Information:')));
                body.append(kinfo);
            } else {
                var text = i18n.msg._('Could not access sys_info variable for version information.');
                var body = $('<div/>');
                body.append($('<h4/>').text(i18n.msg._('Cannot find sys_info!')));
                body.append($('<p/>').html(text));
            }
            dialog.modal({
                title: i18n.msg._('About Jupyter Notebook'),
                body: body,
                buttons: {
                    'OK': {}
                }
            });
            try {
                IPython.notebook.session.kernel.kernel_info(function (data) {
                    kinfo.html($('<pre/>').text(data.content.banner));
                });
            } catch (e) {
                kinfo.html($('<p/>').text(i18n.msg._('unable to contact kernel')));
            }
        });
    }

    function load_jupyter_extension () {
       load_prefs();
       load_about();
    }

    return {
        load_ipython_extension : load_jupyter_extension
    }
});
