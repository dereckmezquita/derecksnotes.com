#!/bin/bash

# R Package Format Script
# Formats R and C++ code for the package

set -e  # Exit on any errors
set -u  # Exit on undefined variables

# ============================================================================
# Configuration
# ============================================================================

SCRIPT_NAME=$(basename "$0")

# Colours for output
if [[ -t 1 ]]; then
    RED=$'\033[0;31m'
    GREEN=$'\033[0;32m'
    YELLOW=$'\033[1;33m'
    BLUE=$'\033[0;34m'
    BOLD=$'\033[1m'
    NC=$'\033[0m' # No Colour
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    BOLD=''
    NC=''
fi

# ============================================================================
# Helper Functions
# ============================================================================

print_header() {
    echo -e "${BOLD}${BLUE}==>${NC} ${BOLD}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ============================================================================
# Help Function
# ============================================================================

show_help() {
    cat << EOF
${YELLOW}USAGE:${NC}
    ${BOLD}$SCRIPT_NAME${NC} [OPTIONS] [COMMAND]

${YELLOW}DESCRIPTION:${NC}
    Format R and C++ code in the package.

${YELLOW}COMMANDS:${NC}
    ${GREEN}r${NC}            Format R code using air (extremely fast formatter)
    ${GREEN}r-check${NC}      Check if R code is formatted (no changes)
    ${GREEN}cpp${NC}          Format C++ code using clang-format
    ${GREEN}cpp-check${NC}    Check if C++ code is formatted (no changes)
    ${GREEN}all${NC}          Format both R and C++ code (default)
    ${GREEN}check${NC}        Check formatting for both R and C++ code
    ${GREEN}help${NC}         Show this help message

${YELLOW}OPTIONS:${NC}
    ${GREEN}-h, --help${NC}   Show this help message
    ${GREEN}-v, --verbose${NC} Enable verbose output

${YELLOW}EXAMPLES:${NC}
    ${BLUE}# Format all code${NC}
    $SCRIPT_NAME

    ${BLUE}# Format only R code${NC}
    $SCRIPT_NAME r

    ${BLUE}# Format only C++ code${NC}
    $SCRIPT_NAME cpp

    ${BLUE}# Check all formatting (for CI)${NC}
    $SCRIPT_NAME check

${YELLOW}NOTES:${NC}
    - Requires: air (R formatter), clang-format (C++ formatter)
    - Install air: ${BLUE}curl -LsSf https://github.com/posit-dev/air/releases/latest/download/air-installer.sh | sh${NC}
    - Install clang-format: ${BLUE}brew install clang-format${NC}

EOF
}

# ============================================================================
# Command Functions
# ============================================================================

run_cmd() {
    if [[ "${VERBOSE:-0}" == "1" ]]; then
        print_info "Running: $*"
    fi
    "$@"
}

cmd_format_r() {
    print_header "Formatting R code with air..."
    if ! command -v air &> /dev/null; then
        print_error "air is not installed. Install it from: https://posit-dev.github.io/air/"
        print_info "Quick install: curl -LsSf https://github.com/posit-dev/air/releases/latest/download/air-installer.sh | sh"
        exit 1
    fi
    run_cmd air format .
    print_success "R code formatted"
}

cmd_format_r_check() {
    print_header "Checking R code formatting..."
    if ! command -v air &> /dev/null; then
        print_error "air is not installed. Install it from: https://posit-dev.github.io/air/"
        print_info "Quick install: curl -LsSf https://github.com/posit-dev/air/releases/latest/download/air-installer.sh | sh"
        exit 1
    fi
    if run_cmd air format --check .; then
        print_success "All R code is properly formatted"
    else
        print_error "Some files need formatting. Run '$SCRIPT_NAME r' to fix."
        exit 1
    fi
}

cmd_format_cpp() {
    print_header "Formatting C++ code with clang-format..."
    if ! command -v clang-format &> /dev/null; then
        print_error "clang-format is not installed."
        print_info "Install with: brew install clang-format"
        exit 1
    fi

    # Find all C++ files in src/
    local cpp_files=$(find src -name "*.cpp" -o -name "*.h" -o -name "*.hpp" 2>/dev/null)
    if [[ -z "$cpp_files" ]]; then
        print_info "No C++ files found in src/"
        return 0
    fi

    run_cmd clang-format -i $cpp_files
    print_success "C++ code formatted"
}

cmd_format_cpp_check() {
    print_header "Checking C++ code formatting..."
    if ! command -v clang-format &> /dev/null; then
        print_error "clang-format is not installed."
        print_info "Install with: brew install clang-format"
        exit 1
    fi

    # Find all C++ files in src/
    local cpp_files=$(find src -name "*.cpp" -o -name "*.h" -o -name "*.hpp" 2>/dev/null)
    if [[ -z "$cpp_files" ]]; then
        print_info "No C++ files found in src/"
        return 0
    fi

    # Check if files are formatted (--dry-run --Werror returns non-zero if changes needed)
    if run_cmd clang-format --dry-run --Werror $cpp_files 2>/dev/null; then
        print_success "All C++ code is properly formatted"
    else
        print_error "Some C++ files need formatting. Run '$SCRIPT_NAME cpp' to fix."
        exit 1
    fi
}

cmd_format_all() {
    cmd_format_r
    echo ""
    cmd_format_cpp
    print_success "All code formatted"
}

cmd_check_all() {
    cmd_format_r_check
    echo ""
    cmd_format_cpp_check
    print_success "All code properly formatted"
}

# ============================================================================
# Argument Parsing
# ============================================================================

VERBOSE=0
COMMAND=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help|help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=1
            shift
            ;;
        r|r-check|cpp|cpp-check|all|check)
            COMMAND=$1
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
done

# ============================================================================
# Main Execution
# ============================================================================

# Default to 'all' if no command specified
if [[ -z "$COMMAND" ]]; then
    COMMAND="all"
fi

# Execute the command
case $COMMAND in
    r)
        cmd_format_r
        ;;
    r-check)
        cmd_format_r_check
        ;;
    cpp)
        cmd_format_cpp
        ;;
    cpp-check)
        cmd_format_cpp_check
        ;;
    all)
        cmd_format_all
        ;;
    check)
        cmd_check_all
        ;;
esac

exit 0
