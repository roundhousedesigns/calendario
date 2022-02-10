#! /bin/bash -e

optionaldir="$1"
dir="${optionaldir:-$HOME}"
dir="${dir%/}"
file="${dir}/calendario-premium.zip"

if [ ! -d "$dir" ]; then
	echo "Invalid directory specified."
	exit
fi

exclude=(
	.\*
	app/node_modules\*
	app/src\*
	app/build\*
	README.md
	release.sh
)

# IFS=' '
zip -qq -FSr "$file" . -x "${exclude[@]}"

if [ -f "$file" ]; then
	echo
	echo "Release ZIP can be found at ${file}."
	echo
fi
