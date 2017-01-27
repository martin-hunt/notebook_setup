#!/usr/bin/env python
from __future__ import print_function
import sys
import os
import signal
import argparse
import json


def set_tool(name, tool):
    """ Set tool metadata. """
    data = json.load(open(name))
    if 'tool' in data['metadata']:
        file_tool = data['metadata']['tool']
    else:
        file_tool = False

    if tool is None:
        return file_tool

    if file_tool != tool:
        data['metadata']['tool'] = tool
        with open(name, 'w') as f:
            json.dump(data, f)
    return tool


def parse_cmd_line():
    prog = "jupyter_tool.py"

    parser = argparse.ArgumentParser(
         usage="""usage: %(prog)s [-h] [-t] [name]

Set, unset or query tool-mode on a notebook.  By default prints
current state, unless "-n" or "-t" flag is present.

positional arguments:
  name        Name of notebook.

optional arguments:
  -h, --help  show this help message and exit
  -n          Set Notebook mode.
  -t          set Tool mode.
""",
         prog=prog,
         add_help=False)
    parser.add_argument('-t', dest='tool', action='store_true')
    parser.add_argument('-n', dest='notebook', action='store_true')
    parser.add_argument('-h', '--help', dest='help', action='store_true')
    parser.add_argument('name', nargs='?')
    return parser


if __name__ == "__main__":

    if os.getuid() == 0:
        print("Do not run this as root.", file=sys.stderr)
        sys.exit(1)

    parser = parse_cmd_line()
    args = parser.parse_args()
    if args.name is None or args.help or (args.notebook and args.tool):
        parser.print_usage()
        sys.exit(0)

    tool_mode = None
    if args.notebook:
        tool_mode = False
    if args.tool:
        tool_mode = True

    tool = set_tool(args.name, tool_mode)
    print("Tool Mode is", tool)

