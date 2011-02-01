#Testing the latest YUI release with Node

I've tried to make it simple to test the latest YUI source code against my nodejs package.
First you need to install expresso:

    npm install expresso

Now, go into your clone of the yui3 source tree and npm install it:

    cd /path/to/yui3
    npm install .

Now you can test this code:

    expresso ./tests/*.js

Currently there are over 100 tests that should pass 100% if your YUI3 code works ;)

##Developing

If you are patching YUI core or working with Dom/Event/Node code, you really need to check to make sure
that your code doesn't contain things that will break on the server. Each time you do a build, you should also
follow the steps above to `npm install` then `expresso ./tests/*.js` to make sure you didn't introduce a
change that will break when your code is executed on the server.
