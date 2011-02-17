#!/bin/bash

yuitest=`which yuitest`

if [ ! -f "$yuitest" ]; then
    echo "YUITest CLI is required.. (npm install yuitest)"; exit 1;
fi

#Checking Dependencies
./tests/deps.js
if test $? -gt 0; then
    echo "Test dependencies failed.."; exit 1;
fi

$yuitest ./tests/*.js
