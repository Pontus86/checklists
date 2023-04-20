#!/bin/bash
find . -depth -name '*[A-Z]*' -execdir sh -c '
for f do
mv -i "$f" "$(tr "[:upper:]" "[:lower:]" <<< "$f")"
done' sh {} +

