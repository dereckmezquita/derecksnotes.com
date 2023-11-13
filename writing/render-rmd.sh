#!/bin/bash

# Check if the user provided an Rmd file as an argument
if [ $# -eq 0 ]; then
    echo "Usage: $0 <Rmd_file>"
    exit 1
fi

# Get the Rmd file path from the command line argument
rmd_file="$1"
# get the name without extension
file_name="${rmd_file%.*}"
# basename
file_name_base="$(basename "$file_name")"

# Check if the Rmd file exists
if [ ! -f "$rmd_file" ]; then
    echo "Error: File not found: $rmd_file"
    exit 1
fi

# Render the Rmd document
Rscript -e "rmarkdown::render(
    input = '$rmd_file',
    output_file = '$(basename "$file_name").html',
)"

# delete the html file created
rm "$file_name.html"
# rename the md to mdx
mv "$file_name.md" "$file_name.mdx"

# # move the file-name_files (contains plots etc) to static
# echo pwd
# /Users/work/Coding/projects/derecksnotes-playground/derecksnotes.com/client/src/content/courses
# mv with all content inside
# mv "$file_name"_files ../../../public/courses/
rm -rf ../../../public/courses/"$file_name_base"_files
mv -f "$file_name_base"_files/ ../../../public/courses/