#!/bin/bash

pack=$1;

case $1 in
  base|bare|full) ;;
  *) echo "Invalid Package Name"; exit 1;;
esac

echo "Making YUI3 $pack package"

if test -d ./build/$pack; then
    rm -rRf ./build/$pack
fi

dir="./build/$pack/"

mkdir -p $dir

cp README.* $dir
wait
cp LICENSE $dir
wait
cp -R lib $dir
wait
cp ./cli.js $dir
wait
cp ./packages/$pack-package.json ${dir}package.json
wait
./scripts/merge_package_json.js $pack
wait
echo "Build Complete: $dir"
