#!/usr/bin/env python

"""This is a blind proxy that we use to get around browser
restrictions that prevent the Javascript from loading pages not on the
same server as the Javascript.  This has several problems: it's less
efficient, it might break some sites, and it's a security risk because
people can use this proxy to browse the web and possibly do bad stuff
with it.  It only loads pages via http and https, but it can load any
content type. It supports GET and POST requests."""

import urllib2
import cgi
import sys, os

# Authentication info
top_level_url = "https://ws.nls.fi"

# Designed to prevent Open Proxy type stuff.
allowedHosts = ['ws.nls.fi']

method = os.environ["REQUEST_METHOD"]

if method == "POST":
    qs = os.environ["QUERY_STRING"]
    d = cgi.parse_qs(qs)
    if d.has_key("username"):
        username = d["username"][0]
    if d.has_key("password"):
        password = d["password"][0]
    if d.has_key("url"):
        url = d["url"][0]
    else:
        url = "http://www.openlayers.org"
else:
    fs = cgi.FieldStorage()
    url = fs.getvalue('url', "http://www.openlayers.org")
    username = fs.getvalue('username')
    password = fs.getvalue('password')

try:
    host = url.split("/")[2]
    if allowedHosts and not host in allowedHosts:
        print "Status: 502 Bad Gateway"
        print "Content-Type: text/plain"
        print
        print "This proxy does not allow you to access that location (%s)." % (host)
        print
        print os.environ
  
    elif url.startswith("http://") or url.startswith("https://"):

        if username or password:
            # Authentication starts -->
    
            # create a password manager
            password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
            
            # Add the username and password.
            # If we knew the realm, we could use it instead of None.
            password_mgr.add_password(None, top_level_url, username, password)
            
            handler = urllib2.HTTPBasicAuthHandler(password_mgr)
            
            # create "opener" (OpenerDirector instance)
            opener = urllib2.build_opener(handler)
            
            # use the opener to fetch a URL
            #opener.open(a_url)
            
            # Install the opener.
            # Now all calls to urllib2.urlopen use our opener.
            urllib2.install_opener(opener)
        
            # <-- Authentication ends
    
        if method == "POST":
            length = int(os.environ["CONTENT_LENGTH"])
            headers = {"Content-Type": os.environ["CONTENT_TYPE"]}
            body = sys.stdin.read(length)
            r = urllib2.Request(url, body, headers)
            y = urllib2.urlopen(r)
        else:
            y = urllib2.urlopen(url)
        
        # print content type header
        i = y.info()
        if i.has_key("Content-Type"):
            print "Content-Type: %s" % (i["Content-Type"])
        else:
            print "Content-Type: text/plain"
        print
        
        print y.read()
        
        y.close()
    else:
        print "Content-Type: text/plain"
        print
        print "Illegal request."

except Exception, E:
    print "Status: 500 Unexpected Error"
    print "Content-Type: text/plain"
    print 
    print "Some unexpected error occurred. Error text was:", E
