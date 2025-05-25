#!/usr/bin/env python3
import subprocess
import os

# Directories containing Terraform configurations
tf_dirs = [
    "/etc/localstack/init/ready.d/s3",
    "/etc/localstack/init/ready.d/dynamodb"
    # Add more paths if needed
]

def run_terraform(directory):
    print(f"Running Terraform in {directory}")
    try:
        subprocess.run(["tflocal", "init"], cwd=directory, check=True)
        subprocess.run(["tflocal", "apply", "-auto-approve"], cwd=directory, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running Terraform in {directory}: {e}")

def main():
    for tf_dir in tf_dirs:
        if os.path.isdir(tf_dir):
            run_terraform(tf_dir)
        else:
            print(f"Directory not found: {tf_dir}")

if __name__ == "__main__":
    main()
