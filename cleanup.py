import os
import shutil

# Files to keep (essential for the game)
essential_files = {
    'index.html',
    'script.js',
    'styles.css',
    'count.js',
    'sortCards.js',
    'carddatatype1.js',
    'carddatatype2.js',
    'carddatatype3.js',
    'carddatatype4.js',
    'carddatatype5.js',
    'images'  # directory
}

def cleanup():
    # Get all files in current directory
    items = os.listdir('.')
    
    for item in items:
        if item == 'cleanup.py':  # Don't delete this script while it's running
            continue
            
        if item not in essential_files:
            try:
                if os.path.isdir(item):
                    print(f"Removing directory: {item}")
                    shutil.rmtree(item)
                else:
                    print(f"Removing file: {item}")
                    os.remove(item)
            except Exception as e:
                print(f"Error removing {item}: {str(e)}")
    
    print("\nCleanup complete! Only essential game files remain.")
    print("You can now delete this cleanup.py script manually.")

if __name__ == "__main__":
    print("Starting cleanup...")
    print("The following files/directories will be kept:", ", ".join(sorted(essential_files)))
    cleanup()
