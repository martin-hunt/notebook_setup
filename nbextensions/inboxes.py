
from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler
from tornado.web import RequestHandler
import os
from tornado.escape import json_decode
import json
from subprocess import check_call

log = None
inboxes_dir = '/data/tools/inboxes'

class SendToHandler(RequestHandler):

    def post(self):
        json_obj = json_decode(self.request.body)
        # log.info('SendTo Data Received')
        # log.info(json_obj)

        base_inbox = json_obj['inbox'].strip('/')
        inbox = os.path.join(inboxes_dir, base_inbox)
        if not os.path.isdir(inbox):
            message = "Inbox '%s' not found" % inbox
            self.set_status(400, message)
            return

        idir = os.path.join(inbox, os.environ['LOGNAME'])
        if not os.path.isdir(idir):
            os.mkdir(idir)

        # print("INBOX:", inbox)
        notebook = json_obj['notebook'].strip('/')
        # print("1. notebook=", notebook)
        # print("2. cwd=", os.getcwd())
        # print("notebook:", os.path.join(os.getcwd(), notebook))

        notebook = os.path.join(os.getcwd(), notebook)

        try:
            failed = check_call(['cp', notebook, idir])
        except:
            failed = 1

        if failed:
            msg = "Error. Copying %s to %s failed" % (notebook, base_inbox)
            self.set_status(400, msg)
        else:
            response_to_send = "Copied %s to %s" % (notebook, base_inbox)
            self.write(json.dumps(response_to_send))


class NewInboxHandler(RequestHandler):

    def post(self):
        json_obj = json_decode(self.request.body)
        log.info('New Inbox Data Received')
        log.info(json_obj)

        base_inbox = json_obj['inbox'].strip('/')
        inbox = os.path.join(inboxes_dir, base_inbox)
        if not os.path.isdir(inbox):
            try:
                os.makedirs(idir)
            except:
                message = "Could not create inbox '%s'" % inbox
                self.set_status(400, message)
                return


def load_jupyter_server_extension(nbapp):
    '''
    Register a hello world handler.

    Based on https://github.com/Carreau/jupyter-book/blob/master/extensions/server_ext.py
    '''
    global log
    log = nbapp.log
    log.info('Inbox Extension Loaded')

    web_app = nbapp.web_app
    host_pattern = '.*$'
    route_pattern = url_path_join(web_app.settings['base_url'], '/sendto')
    web_app.add_handlers(host_pattern, [(route_pattern, SendToHandler)])
    # route_pattern = url_path_join(web_app.settings['base_url'], '/new_inbox')
    # web_app.add_handlers(host_pattern, [(route_pattern, NewInboxHandler)])

