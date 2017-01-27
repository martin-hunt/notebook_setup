def _jupyter_server_extension_paths():
    return [{
        "module": "tool"
    }]


def load_jupyter_server_extension(nbapp):
    nbapp.log.info("Tool module enabled!")

