import os
import glob

def fix_paths():
    target_dir = r"d:\AI-2025\frontend"
    html_files = glob.glob(os.path.join(target_dir, "**", "*.html"), recursive=True)
    
    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Only replace if it matches the exact incorrect string
        new_content = content.replace('../css/', '../../css/')
        new_content = new_content.replace('../js/', '../../js/')
        # Fix the weird ones like `../frontend/` to `../`
        new_content = new_content.replace('../frontend/user/', '../user/')
        new_content = new_content.replace('../frontend/index/', '../index/')
        new_content = new_content.replace('../frontend/news/', '../news/')
        new_content = new_content.replace('../frontend/login/', '../login/')
        # Also let's check index.html in the root
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")

if __name__ == "__main__":
    fix_paths()
