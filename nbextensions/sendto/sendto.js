
define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/utils',
    'services/config',
    'base/js/dialog',

], function (
    require,
    $,
    Jupyter,
    utils,
    configmod,
    dialog,
) {
    'use strict';

    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    function _get_cookie(name) {
        // from tornado docs: http://www.tornadoweb.org/en/stable/guide/security.html
        var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
        return r ? r[1] : undefined;
    }

    function sendit_results(data) {
        dialog.modal({
            notebook: Jupyter.notebook,
            keyboard_manager: Jupyter.keyboard_manager,
            title : "Success",
            body : JSON.parse(data),
            buttons : {"OK" : {class : "btn-primary"}}
        })
    }

    function sendit(inbox) {
        // console.log('SENDIT: ' + inbox);

        var args = {'inbox': inbox,
                    'notebook': Jupyter.notebook.notebook_path};

        var settings = {
            url : '/sendto',
            type : "POST",
            dataType: "text",
            data: JSON.stringify(args),
            headers: {'X-XSRFToken': _get_cookie('_xsrf')},
            success: sendit_results,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                dialog.modal({
                    notebook: Jupyter.notebook,
                    keyboard_manager: Jupyter.keyboard_manager,
                    title : "Inbox Error",
                    body : errorThrown,
                    buttons : {"OK" : {class : "btn-primary"}}
                })
            }
        };
        $.ajax(settings)
    }

    function create_menu (sendlist) {
        // console.log('create_menu');
        // console.log(sendlist);

        if (sendlist.length === 0) { return }

        // put the menu right above the "Trusted Notebook" entry.

        var trusted = $("#trust_notebook");
        var divider = $("<li>")
            .attr('id', "send_to")
            .addClass('divider');
        trusted.prev().before(divider);


        var send_to_menu = $('<li/>')
            .addClass('dropdown-submenu')
            .append(
                $('<a href="#">')
                    .text('Send To ...')
                    .on('click', function (evt) { evt.preventDefault(); })
            )

        var sendto_submenu = $('<ul/>')
            .addClass('dropdown-menu')
            .appendTo(send_to_menu);

        for (var i = 0; i < sendlist.length; i++) {
            (function(inbox) {
                $('<li/>')
                    .attr('title', 'Send this notebook to an inbox.')
                    .append(
                        $('<a href="#">')
                            .text(inbox)
                            .on('click', function (evt) {
                                evt.preventDefault();
                                sendit(inbox);
                            })
                    )
                .appendTo(sendto_submenu);
            })(sendlist[i])
        }
        divider.after(send_to_menu);
    }

    config.loaded.then(function() {
        // console.log('LOADED');
        var Inbox = (config.data.Inbox || []);
        var sendlist = (Inbox.sendlist || []);
        // console.log(sendlist);
        create_menu(sendlist);
    });

    function load_jupyter_extension () {
        config.load();
    }

    return {
        load_ipython_extension : load_jupyter_extension
    };
});
