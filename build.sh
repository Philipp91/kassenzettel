#!/bin/bash

build() {
    echo 'Building react app...'

    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false
    react-scripts build
    rm build/receipts-*

    mkdir -p dist/
    cp -r build/* dist/
    echo "Done"
}

build
