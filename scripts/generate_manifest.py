import os
import json
import re

def get_frames(folder_path):
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpeg', '.jpg', '.png'))]
    # Sort files numerically if they have numbers
    def extract_number(f):
        match = re.search(r'RUN(\d+)\.', f)
        return int(match.group(1)) if match else f
    
    files.sort(key=extract_number)
    return files

def main():
    base_dir = r"public/example"
    manifest = {}
    
    for item in os.listdir(base_dir):
        path = os.path.join(base_dir, item)
        if os.path.isdir(path):
            frames = get_frames(path)
            csv_path = os.path.join(base_dir, f"{item}_phases.csv")
            stages = []
            if os.path.exists(csv_path):
                with open(csv_path, 'r') as f:
                    for line in f:
                        parts = line.strip().split(',')
                        if len(parts) >= 3:
                            stages.append({
                                "name": parts[0],
                                "startFrame": int(parts[1]),
                                "endFrame": int(parts[2])
                            })
            
            manifest[item] = {
                "folder": item,
                "frames": frames,
                "stages": stages
            }
            
    with open(os.path.join(base_dir, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)

if __name__ == "__main__":
    main()
