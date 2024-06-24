#!/bin/bash

# Navigate to the directory containing the files
cd ../definitions

# Loop through all .mdx files
for file in *.mdx; do
    # Check if the filename contains '#'
    if [[ $file == *"#"* ]]; then
        # Create the new filename by replacing '#' with 'symbol'
        newfile=$(echo "$file" | sed 's/#/symbol/')
        
        # Rename the file
        mv "$file" "$newfile"
        
        echo "Renamed: $file -> $newfile"
    fi
done

echo "Renaming complete."