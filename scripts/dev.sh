#!/bin/bash

cd lib
wait

git=`which git`

if [ ! -x "$git" ]; then
    echo "Git is not installed, it is needed for developer access"
    exit 1;
fi

if [ -d "./yui3" ]; then
    echo "Found old source files, updating"
    cd yui3
    git pull
    wait
    cd ../
    wait
else 
    echo "Fetching YUI3 Source from Github (this may take a couple of minutes)"
    git clone git://github.com/yui/yui3.git
    wait
fi

echo "Done fetching source, now you can run: make link or make install"

