#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [-h|--help] [--command <command>] [options]"
    echo "  -h, --help     Display this help message"
    echo "  --command      Specify a command (setup or update, defaults to setup)"
    echo ""
    echo "Options for setup command:"
    printf '\t%s\n' "<comp> Component to install, one or more of  docker | binary | samples | podman"
    printf '\t%s\n' "      First letter of component also accepted; If none specified docker | binary | samples is assumed"
    printf '\t%s\n' "-f, --fabric-version: FabricVersion (default: '2.5.12')"
    printf '\t%s\n' "-c, --ca-version: Fabric CA Version (default: '1.5.15')"
    exit 1
}

# Initialize variables
COMMAND="setup"
INSTALL_SCRIPT="./bin/install-fabric.sh"
COMPONENTS=()
FABRIC_VERSION="2.5.12"
CA_VERSION="1.5.15"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        --command)
            if [[ "$2" == "setup" || "$2" == "update" ]]; then
                COMMAND="$2"
                shift 2
            else
                echo "Error: Command must be either 'setup' or 'update'"
                usage
            fi
            ;;
        docker|binary|samples|podman|d|b|s|p)
            COMPONENTS+=("$1")
            shift
            ;;
        -f|--fabric-version)
            FABRIC_VERSION="$2"
            shift 2
            ;;
        -c|--ca-version)
            CA_VERSION="$2"
            shift 2
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
        if [ -f "$INSTALL_SCRIPT" ]; then
            echo "Executing install-fabric.sh..."
            if [ ${#COMPONENTS[@]} -eq 0 ]; then
                COMPONENTS=(docker binary samples)
            fi
            for component in "${COMPONENTS[@]}"; do
                echo "Installing component: $component"
                bash "$INSTALL_SCRIPT" "$component" -f "$FABRIC_VERSION" -c "$CA_VERSION"
                if [ $? -ne 0 ]; then
                    echo "Error installing component: $component"
                    exit 1
                fi
            done
            echo "All components installed successfully."
        else
            echo "Error: $INSTALL_SCRIPT not found. Please run the update command first."
            exit 1
        fi
        ;;
    update)
        echo "Executing update..."
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