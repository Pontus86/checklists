#!/bin/bash

checklists_dir="../express/checklists"
output_path="../express/checklistsFromIndex.js"

# Find all index.txt files in the checklists directory
index_files=$(find "$checklists_dir" -name "index.txt" -not -path "*/00_mallar/*" -not -path "*/99_checklists/english/*")

echo "Index Files: $index_files"

# Loop through each index.txt file
for index_file in $index_files; do
    # Get the subfolder name
    subfolder=$(dirname "$index_file" | awk -F/ '{print $(NF)}')
    echo "subfolder: $subfolder"

    # Read the file and store rows as a list of strings
    rows=()
    while IFS= read -r row; do
        # Remove rows that begin with ChapterTitle/ or contain "---"
        if [[ ! $row =~ ^ChapterTitle/ && ! $row =~ --- ]]; then
            rows+=("$row")
        fi
    done < "$index_file"

    # Create a new file with the subfolder name and export the list
    
    echo "const $subfolder = [$(printf '"%q",' "${rows[@]}")];" >> "$output_path"
    #echo "module.exports = $subfolder;" >> "$output_path"
done
echo "module.exports = $subfolder;" >> "$output_path"

# Create the checklistsFromIndex.js file in the express subfolder
#output_path="$checklists_dir/../checklistsFromIndex.js"
#echo "const checklists = {" > "$output_path"
#for index_file in $index_files; do
#    subfolder=$(dirname "$index_file" | awk -F/ '{print $(NF)}')
#    echo "  $subfolder: require('./$subfolder/$subfolder.js')," >> "$output_path"
#done
#echo "};" >> "$output_path"
#echo "module.exports = checklists;" >> "$output_path"
