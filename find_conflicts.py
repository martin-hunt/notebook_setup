#!/usr/bin/env python
from __future__ import print_function

import sys
import os
import argparse
from subprocess import check_output
from string import Template
from glob import glob
import socket

def get_pkg_list():
    olist = check_output("conda list", shell=True)
    olist = olist.decode('utf-8').split('\n')
    d = {}
    for line in olist:
        if line == '' or line[0] == '#':
            continue
        line = line.split()
        channel = ''
        if len(line) == 4:
            name, ver, prog, channel = line
        else:
            name, ver, prog = line
        if prog == "<pip>":
            prog = 'pip'
        else:
            prog = 'conda'
        if name in d:
            print("CONFLICT: %s\n\t%s %s %s\n\t%s %s %s \n" %
                (name, d[name]['prog'], d[name]['ver'], d[name]['channel'], prog, ver, channel))
        d[name] = {'prog': prog, 'ver': ver, 'channel': channel}
    return d

get_pkg_list()
