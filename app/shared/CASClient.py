#!/usr/bin/env python

#-----------------------------------------------------------------------------------
# CASClient.py
# Authors: Scott Karlin, Alex Halderman, Brian Kernighan, Bob Dondero
# PennyBottleCas/CASClient.py (Princeton University, COS333, Robert Dondero)
# Adapted for use with Flask and Python 3 by Lukas Heimes
#-----------------------------------------------------------------------------------

import urllib, re
from flask import session, request, redirect
from functools import wraps
import ssl

class CASClient:
    
    # Initialize a new CASClient object so it uses the given CAS
    # server, or fed.princeton.edu if no server is given.
    def __init__(self, url='https://fed.princeton.edu/cas/'):
        self.cas_url = url

    # Return the URL of the current request after stripping out the
    # "ticket" parameter added by the CAS server.
    def strip_ticket(self, request):
        url = request.url
        if url is None:
            return "something is badly wrong"
        url = re.sub(r'ticket=[^&]*&?', '', url)
        url = re.sub(r'\?&?$|&$', '', url)
        return url

    # Validate a login ticket by contacting the CAS server. If
    # valid, return the user's username; otherwise, return None.
    def validate(self, ticket):
        val_url = self.cas_url + 'validate' + \
            '?service=' + urllib.parse.quote(self.strip_ticket(request)) + \
            '&ticket=' + urllib.parse.quote(ticket)

        myssl = ssl.create_default_context()
        myssl.check_hostname=False
        myssl.verify_mode=ssl.CERT_NONE
        r = urllib.request.urlopen(val_url, context=myssl).readlines() # returns 2 lines # TODO: only for Princeton CAS or always?
        if len(r) == 2 and re.match('yes', r[0].decode('utf-8')) != None:
            return r[1].decode('utf-8').strip()
        return None

    # Authenticate the remote user, and return the user's username.
    # If authentication fails, return None.
    def authenticate(self):
        # If the user's username is in the session, then the user was
        # authenticated previously. So return the user's username.
        username = session.get('username')
        if username:
            return username

        # If the request contains a login ticket, then try to
        # validate it.
        ticket = request.values.get('ticket')
        if ticket:
            username = self.validate(ticket)
            if username:
                # The user is authenticated, so store the user's
                # username in the session.
                session['username'] = username
                return username

        # The request does not contain a valid login ticket
        return None

    def return_redirect(self):
        print('in return_redirect()')
        print('request.url = ' + request.url)
        print('after strip_ticket: ' + self.strip_ticket(request))
        login_url = self.cas_url + 'login' + \
        '?service=' + urllib.parse.quote(self.strip_ticket(request))
        return redirect(login_url)

    def cas_required(self, function):
        print('in cas_required()')
        @wraps(function)
        def wrap(*args, **kwargs):
            username = self.authenticate()
            if not username:
                print('not username')
                return self.return_redirect()
            else:
                return function(*args, **kwargs)
        return wrap

def main():
    print('CASClient does not run standalone')

if __name__ == '__main__':
    main()

    
