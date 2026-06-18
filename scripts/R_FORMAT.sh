#!/bin/bash

# Format R code using air (https://posit-dev.github.io/air/)

set -eu

if ! command -v air &> /dev/null; then
    echo "Error: air is not installed."
    echo "Install: curl -LsSf https://github.com/posit-dev/air/releases/latest/download/air-installer.sh | sh"
    exit 1
fi

case "${1:-format}" in
    format)
        air format .
        echo "R code formatted."
        ;;
    check)
        if air format --check .; then
            echo "R code is properly formatted."
        else
            echo "Some files need formatting. Run: $0 format"
            exit 1
        fi
        ;;
    *)
        echo "Usage: $0 [format|check]"
        exit 1
        ;;
esac
