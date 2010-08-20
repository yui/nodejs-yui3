#!/bin/bash

cd lib
wait

npm=`which npm`

if [ ! -x "$npm" ]; then
    echo "NPM not found! Please install it: http://github.com/isaacs/npm"
    exit 1;
fi

if [ ! -d "./yui3" ]; then
    echo "YUI 3 source files are not installed, please run: make dev"
    exit 1;

fi
