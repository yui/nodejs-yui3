#!/bin/bash

node=`which node`

if [ ! -f "$node" ]; then
    echo "NodeJS is required.."; exit 1;
fi

npm=`which npm`

if [ ! -f "$npm" ]; then
    echo "NPM is required.."; exit 1;
fi

