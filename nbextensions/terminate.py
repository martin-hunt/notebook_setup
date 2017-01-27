"""Server Extension that Removes Terminals and the Tree view

We are doing this to support run-only notebooks (tools).
Without this hack, users can simply edit the URL to
access the tree view or open terminals.

This is pretty evil.  It edits the tornado handler list,
stripping out any Terminal or Tree handlers.  Because it only
happens at startup, it should be safe enough.

To use, copy it to the nbextensions directory. Then

> jupyter notebook --NotebookApp.nbserver_extensions="{'terminate':True}" foo.ipynb

You must specify the notebook to load because you will not get a tree view to select one!
"""

def load_jupyter_server_extension(nbapp):
    nbapp.log.info('Terminal Killer Loaded')

    webapp = nbapp.web_app

    new_handlers = []
    for handler in webapp.handlers:
        newh = []
        for h in handler[1]:
            if h.handler_class.__name__.startswith("Term"):
                continue
            elif h.handler_class.__name__.startswith("Tree"):
                continue
            else:
                newh.append(h)
        new_handlers.append([handler[0], newh])

    # Now strip out any empty lists
    nh = []
    for handler in new_handlers:
        if len(handler[1]) > 0:
            nh.append(handler)
    webapp.handlers = nh



