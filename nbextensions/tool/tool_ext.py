"""Tornado handlers for the tools view."""

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

from tornado import web
import os
from IPython.html.base.handlers import IPythonHandler, path_regex
import json
import tornado.escape

from IPython.html.utils import url_path_join as ujoin
from IPython.html.utils import url_escape as uescape
from tornado.web import RequestHandler


class ToolsHandler(IPythonHandler):
    """Render the tool view, listing tools and notebooks"""

    def generate_page_title(self, path):
        comps = path.split('/')
        if len(comps) > 3:
            for i in range(len(comps)-2):
                comps.pop(0)
        page_title = ujoin(*comps)
        if page_title:
            return page_title+'/'
        else:
            return 'Home'

    @web.authenticated
    def get(self, path=''):
        print("TOOLS HANDLER GET", path)
        path = path.strip('/')

        # cm = self.contents_manager
        # if cm.dir_exists(path=path):
        #     if cm.is_hidden(path):
        #         self.log.info("Refusing to serve hidden directory, via 404 Error")
        #         raise web.HTTPError(404)
        #     page_title = self.generate_page_title(path)
        #     print('title=', page_title)
        #     model = cm.get(path, content=True)
        #     content = model['content']

        #     print("model=", model)
        # else:
        #     raise web.HTTPError(404)

        cwd = os.getcwd()
        files = os.listdir(cwd)
        dirs = [x for x in files if os.path.isdir(x)]
        notebooks = [d for d in dirs if os.path.exists(os.path.join(d, d+'.ipynb'))]

        nlist = {}
        for nb in notebooks:
            fn = os.path.join(nb, nb+'.ipynb')
            jdata = open(fn).read()
            x = json.loads(jdata)
            nlist[nb] = {}
            if 'tool' in x['metadata']:
                nlist[nb]['tool'] = 1
            else:
                nlist[nb]['tool'] = 0
            if 'description' in x['metadata']:
                nlist[nb]['desc'] = x['metadata']['description']
            else:
                nlist[nb]['desc'] = ''

        nlist = tornado.escape.json_encode(nlist)
        path = tornado.escape.json_encode(path)
        url = tornado.escape.json_encode(self.base_url)

        url = ujoin(url, 'notebooks', uescape(path), )
        print("nlist=", nlist)
        print("url=", url)
        self.write(self.render_template('tools.html',
                   notebooks=nlist, path=path, base_url=url))


def load_jupyter_server_extension(nbapp):
    nbapp.log.info('Hub Server Extension Loaded')

    webapp = nbapp.web_app
    base_url = webapp.settings['base_url']

    handlers = [
        (ujoin(base_url, r"/tools%s" % path_regex), ToolsHandler),
        (ujoin(base_url, r"/tools"), ToolsHandler),
    ]
    webapp.add_handlers(".*$", handlers)
