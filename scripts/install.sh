#!/bin/bash

dir="/tmp/yui3-npm"

if [ -d "$dir" ]; then
    rm -rRf $dir
    wait
fi

mkdir $dir
wait

echo "Moving source files to temp location"
mv ./lib/yui3 $dir
wait
mkdir ./lib/yui3
wait
cp -R $dir/yui3/build/* ./lib/yui3/

echo "Build files have been staged.. Publishing"

npm install .

wait

echo "Putting dev files back"

rm -rRf ./lib/yui3
wait
mv $dir/yui3 ./lib/
wait
rm -rRf $dir
wait
echo "All done.."


