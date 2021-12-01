#! /bin/bash -e

optionaldir="$1"
dir="${optionaldir:-$HOME}"
file="${dir}calendario.zip"

if [ ! -d "$dir" ]; then
	echo "Invalid directory specified."
	exit
fi

exclude=(
	.\*
	app/node_modules\*
	app/src\*
	app/build\*
	release-exclude.lst
	README.md
	release.sh
)

# IFS=' '
zip -qq -FSr "$file" . -x "${exclude[@]}"

if [ -f "$file" ]; then
	echo "Release ZIP can be found at ${file}."
fi
