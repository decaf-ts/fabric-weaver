#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [-h|--help] [-c|--command <command>]"
    echo "  -h, --help     Display this help message"
    echo "  -c, --command  Specify a command (setup or update, defaults to setup)"
    exit 1
}

# Initialize variables
COMMAND="setup"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -c|--command)
            if [[ "$2" == "setup" || "$2" == "update" ]]; then
                COMMAND="$2"
                shift 2
            else
                echo "Error: Command must be either 'setup' or 'update'"
                usage
            fi
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Echo the received command
echo "Received command: $COMMAND"

# Execute based on the command
case $COMMAND in
    setup)
        echo "Executing setup..."
        # Add your setup logic here
        ;;
    update)
        echo "Executing update..."
        INSTALL_SCRIPT="./bin/install-fabric.sh"
        SCRIPT_URL="https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh"

        # Remove the existing file if it exists
        if [ -f "$INSTALL_SCRIPT" ]; then
            echo "Removing existing install-fabric.sh..."
            rm "$INSTALL_SCRIPT"
        fi

        # Download the new file
        echo "Downloading new install-fabric.sh..."
        if curl -s -o "$INSTALL_SCRIPT" "$SCRIPT_URL"; then
            echo "Download successful."
            
            # Make the file executable
            chmod +x "$INSTALL_SCRIPT"
            echo "Made $INSTALL_SCRIPT executable."
        else
            echo "Error: Failed to download the file."
            exit 1
        fi
        ;;
esac