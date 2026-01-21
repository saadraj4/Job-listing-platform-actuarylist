import os
import subprocess
import sys
import time
import venv

# Define paths
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_DIR = os.path.join(ROOT_DIR, "venv")
REQUIREMENTS_FILE = os.path.join(ROOT_DIR, "requirements.txt")
BACKEND_PATH = os.path.join(ROOT_DIR, "backend", "app.py")
SCRAPER_PATH = os.path.join(ROOT_DIR, "scraper", "scrape.py")

def create_virtualenv():
    """Create a virtual environment if it doesn't exist."""
    if not os.path.exists(VENV_DIR):
        print(" Creating virtual environment...")
        venv.create(VENV_DIR, with_pip=True)
    else:
        print("Virtual environment already exists.")

def get_python_exec():
    """Get the path to the Python executable inside the venv."""
    if os.name == "nt":  # Windows
        return os.path.join(VENV_DIR, "Scripts", "python.exe")
    else:  # macOS/Linux
        return os.path.join(VENV_DIR, "bin", "python")

def install_requirements(python_exec):
    """Install required packages."""
    print("Installing dependencies...")
    subprocess.run([python_exec, "-m", "pip", "install", "--upgrade", "pip"])
    subprocess.run([python_exec, "-m", "pip", "install", "-r", REQUIREMENTS_FILE])

def run_backend_and_scraper(python_exec):
    """Run backend first, then scraper, both concurrently."""
    print("Starting Flask backend...")
    backend_process = subprocess.Popen([python_exec, BACKEND_PATH])

    # Wait a few seconds for backend to start
    print("Waiting for backend to initialize...")
    time.sleep(5)

    print("🕷️ Starting scraper...")
    scraper_process = subprocess.Popen([python_exec, SCRAPER_PATH])

    try:
        backend_process.wait()
        scraper_process.wait()
    except KeyboardInterrupt:
        print("\nStopping both processes...")
        backend_process.terminate()
        scraper_process.terminate()

def main():
    create_virtualenv()
    python_exec = get_python_exec()
    install_requirements(python_exec)
    run_backend_and_scraper(python_exec)

if __name__ == "__main__":
    main()
