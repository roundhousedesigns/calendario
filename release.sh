#! /bin/bash -e

dest="$HOME"

if [ ! -d "$dest" ]; then
	mkdir "$dest"
fi

zip -vr "${dest}/calendario.zip" . -x .\* app/node_modules\* app/src\* app/build\* release-exclude.lst README.md release.sh
