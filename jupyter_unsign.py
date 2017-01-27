#!/usr/bin/env python
import os
import sys

from nbformat.sign import NotebookNotary
from nbformat import read

try:
    fname = sys.argv[1]
except:
    print "Usage: %s notebook_name" % sys.argv[0]
    sys.exit(1)

with open(fname, 'r') as f:
    nb = read(f, as_version=4)

ddir = os.path.join(os.environ['HOME'], ".local/share/jupyter")
db_file = os.path.join(ddir, "nbsignatures.db")
secret_file = os.path.join(ddir, "notebook_secret")

with open(secret_file, 'r') as f:
    sdata = f.read()

nn = NotebookNotary(
    db_file=db_file,
    secret=sdata,
    data_dir=ddir
)

nn.unsign(nb)
