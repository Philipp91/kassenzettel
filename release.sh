#!/bin/bash

release() {
    if ! [[ -f "dist/manifest.json" ]]; then
        echo "Please build the extension first with build.sh"
        exit 1
    fi
    rm -f release.zip
    cd dist || return
    zip -r ../release.zip ./*
    echo "Please upload release.zip to the Chrome store."
}

release
