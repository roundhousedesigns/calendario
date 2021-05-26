#! /bin/bash -e

dest="$HOME/calendario"

if [ ! -d "$dest" ]; then
	mkdir "$dest"
fi

zip -vr "${dest}/calendario.zip" . -x .\* app/node_modules\* app/src\* release-exclude.lst .distignore release.sh
