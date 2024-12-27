#!/usr/bin/env bash

################################################################################
# This script is meant to be run from:
#   client/src/app/dictionaries/mathematics/definitions/
#
# 1) Finds Rmd files in ./src/ named "mathematics_*.Rmd".
# 2) Knits each file, placing outputs in the current directory (definitions/).
# 3) Removes .html outputs.
# 4) Renames .md to .mdx.
# 5) For each *_files directory:
#      a) Move the contents of figure-html/ up one level (into the *_files folder).
#      b) Remove figure-html/ subfolder.
#      c) Move the *_files folder to client/public/dictionaries/mathematics/.
#
# The arrangement:
#   definitions/
#     build-math-rmd.sh (this script)
#     src/
#       mathematics_foo.Rmd
#     (the knitted .mdx will appear here in definitions/, not in src/)
################################################################################

# Where is your "src" subfolder?
SRC_DIR="./src"

# Where do you want to move images/figure output?
PUBLIC_IMG_DIR="../../../../../public/dictionaries/mathematics"

# Ensure the public directory for images exists (relative path might need adjusting)
mkdir -p "${PUBLIC_IMG_DIR}"

echo "Knitting all 'mathematics_*.Rmd' files in ${SRC_DIR}..."
echo "Outputs will be placed in the current directory (.), with .md renamed to .mdx"
echo "Any *_files directories will go to ${PUBLIC_IMG_DIR}, after reorganising figure-html."

###############################################################################
# 1) Render all Rmd files from src/ into current dir (definitions/)
###############################################################################
for f in "${SRC_DIR}"/mathematics_*.Rmd; do
  if [ -f "$f" ]; then
    echo "Rendering $f..."
    # Render into the current directory (definitions/)
    Rscript -e "rmarkdown::render(input='$f', output_dir='.')"
  fi
done

echo "All knitting complete."

###############################################################################
# 2) Remove all .html files in current directory
###############################################################################
echo "Removing all .html files in current directory..."
find . -maxdepth 1 -type f -name "*.html" -exec rm -v {} \;

###############################################################################
# 3) Rename all .md files in current directory to .mdx
###############################################################################
echo "Renaming all .md to .mdx in current directory..."
find . -maxdepth 1 -type f -name "*.md" | while read -r mdfile; do
  newfile="${mdfile%.md}.mdx"
  echo "Renaming $mdfile -> $newfile"
  mv "$mdfile" "$newfile"
done

###############################################################################
# 4) Adjust and move *_files directories
###############################################################################
echo "Processing all *_files directories..."
find . -maxdepth 1 -type d -name "*_files" | while read -r d; do
  base="$(basename "$d")"
  echo "Now working on directory: $d"

  # If figure-html/ subfolder exists, move its contents up, then remove it
  FIG_SUBFOLDER="$d/figure-html"
  if [ -d "$FIG_SUBFOLDER" ]; then
    echo "Moving contents of $FIG_SUBFOLDER -> $d"
    # Move everything inside figure-html up one level
    mv "$FIG_SUBFOLDER"/* "$d"/
    echo "Removing now-empty $FIG_SUBFOLDER"
    rmdir "$FIG_SUBFOLDER"
  fi

  # Finally move the entire *_files folder to the PUBLIC_IMG_DIR
  echo "Moving $d -> ${PUBLIC_IMG_DIR}/${base}"
  mv "$d" "${PUBLIC_IMG_DIR}/${base}"
done

echo "Done! All .html removed, .md -> .mdx, and *_files reorganised + moved to ${PUBLIC_IMG_DIR}."