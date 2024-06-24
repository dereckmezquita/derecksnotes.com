#!/bin/bash

# Navigate to the directory containing the files
cd ../definitions

# Counter for files with special characters
count=0

# Loop through all .mdx files
for file in *.mdx; do
    # Check if the filename contains any non-ASCII character or special character
    if [[ "$file" != "$(echo "$file" | LC_ALL=C tr -dc 'A-Za-z0-9_-.\n')" ]]; then
        echo "$file"
        # Print the full path to the file
        echo "  Full path to file: $(pwd)/$file"
        # Print the special characters found
        special_chars=$(echo "$file" | perl -ne 'print join(" ", grep {!/[A-Za-z0-9_.-]/ && !/\s/} split //)')
        echo "  Special characters: $special_chars"
        echo
        ((count++))
    fi
done

echo "Total files with special characters: $count"