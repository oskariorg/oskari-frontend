#!/usr/bin/env python
# @author aapi

from slimmer import css_slimmer
import sys

argc = len(sys.argv)
if (argc <= 1):
    print "Usage: " + sys.argv[0] + " <cssfile>"
    sys.exit()
fp = open(sys.argv[1], "r")
data = fp.readlines()
fp.close()
all = "".join(data)
print css_slimmer(all)
