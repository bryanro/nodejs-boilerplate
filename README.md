NodeJS Template
===========

## Setup

Install [node.js](http://nodejs.org) and [mongodb](http://www.mongodb.org/downloads).

To install all of the node dependencies, run:

	$ npm install

Finally, start the server:

	$ node server

## Openshift

Openshift is a great PaaS (Platform as a Service) that I've been using to get web services stood up quickly and easily.  The server.js file contains some code that is specific to openshift, but that can easily be removed (and ultimately it gets ignored if node isn't running on openshift).

## Installing bcrypt on Windows Machine

If Visual Studio 2012 is installed, try running: npm install bcrypt --msvs_version=2012

Otherwise try installing the following:
1. Windows 7.1 SDK: http://www.microsoft.com/en-us/download/details.aspx?id=8279
2. Visual Studio C++ 2010 Express: http://go.microsoft.com/?linkid=9709949
3. Compiler Update for 64-bit: http://www.microsoft.com/en-us/download/details.aspx?id=4422

## Back End

The back end is housed within the '''/app/server''' folder.
- controllers
- models
- modules
- routes.js

## Front End

The front end is housed in the '''/app/www''' folder.
- css: includes bootstrap 3.0 and a style.js file that should hold all of the custom CSS
- font: includes font awesome
- js
-- collections
-- lib: common libraries used including: jquery, bootstrap, backbone, underscore, require, moment, less
-- models
-- router
-- util: contains helper function for showing errors
-- views
-- app.js: the requirejs file that initializes the router
-- main.js: the requirejs configuration file that points to app.js
- index.html: the landing page