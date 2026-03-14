import os
import requests
from pathlib import Path
import time

# Create signs directory
signs_dir = Path(__file__).parent.parent / 'frontend' / 'public' / 'signs'
signs_dir.mkdir(parents=True, exist_ok=True)

print(f"Saving images to: {signs_dir.absolute()}")
print("=" * 60)

# Using a reliable public ASL dataset
base_url = "https://raw.githubusercontent.com/mon95/Sign-Language-and-Static-gesture-recognition-using-sklearn/master/gestures"

letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
           'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

success_count = 0
fail_count = 0

# Download alphabet images
print("\nDownloading Alphabet Images:")
print("-" * 60)
for letter in letters:
    try:
        # Try multiple possible URLs
        urls = [
            f"{base_url}/{letter}/1.jpg",
            f"{base_url}/{letter}/100.jpg",
            f"https://raw.githubusercontent.com/ayushkumarshah/Sign-Language-Interpreter/master/gestures/{letter}/100.jpg"
        ]
        
        downloaded = False
        for url in urls:
            try:
                print(f"Trying {letter}... ", end="", flush=True)
                response = requests.get(url, headers=headers, timeout=10)
                
                if response.status_code == 200 and len(response.content) > 1000:
                    output_path = signs_dir / f"{letter.lower()}.png"
                    with open(output_path, 'wb') as f:
                        f.write(response.content)
                    print(f"✓ Downloaded")
                    success_count += 1
                    downloaded = True
                    break
            except:
                continue
        
        if not downloaded:
            print(f"✗ Failed")
            fail_count += 1
        
        time.sleep(0.5)  # Be nice to the server
        
    except Exception as e:
        print(f"✗ Error: {str(e)[:40]}")
        fail_count += 1

# Download number images
print("\nDownloading Number Images:")
print("-" * 60)
for number in numbers:
    try:
        urls = [
            f"{base_url}/{number}/1.jpg",
            f"https://raw.githubusercontent.com/ayushkumarshah/Sign-Language-Interpreter/master/gestures/{number}/100.jpg"
        ]
        
        downloaded = False
        for url in urls:
            try:
                print(f"Trying {number}... ", end="", flush=True)
                response = requests.get(url, headers=headers, timeout=10)
                
                if response.status_code == 200 and len(response.content) > 1000:
                    output_path = signs_dir / f"{number}.png"
                    with open(output_path, 'wb') as f:
                        f.write(response.content)
                    print(f"✓ Downloaded")
                    success_count += 1
                    downloaded = True
                    break
            except:
                continue
        
        if not downloaded:
            print(f"✗ Failed")
            fail_count += 1
        
        time.sleep(0.5)
        
    except Exception as e:
        print(f"✗ Error: {str(e)[:40]}")
        fail_count += 1

print("\n" + "=" * 60)
print(f"Download Summary:")
print(f"  ✓ Success: {success_count}")
print(f"  ✗ Failed: {fail_count}")
print(f"  📁 Location: {signs_dir.absolute()}")
print("=" * 60)

if success_count > 0:
    print("\n✅ Images downloaded! Refresh your browser to see them.")
else:
    print("\n⚠️  No images downloaded. Try manual download:")
    print("   1. Visit: https://www.signingsavvy.com/")
    print("   2. Download each letter image")
    print(f"   3. Save to: {signs_dir.absolute()}")
