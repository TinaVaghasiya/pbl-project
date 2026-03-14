import os
import urllib.request
import ssl

# Create signs directory if it doesn't exist
signs_dir = '../frontend/public/signs'
os.makedirs(signs_dir, exist_ok=True)

# Bypass SSL verification (for downloading)
ssl._create_default_https_context = ssl._create_unverified_context

# ASL alphabet image URLs (from a public repository)
base_url = "https://raw.githubusercontent.com/ayushkumarshah/Sign-Language-Interpreter/master/gestures/"

# Alphabet letters
letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
           'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

# Numbers
numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

print("Downloading ASL sign language images...")
print("=" * 50)

# Download alphabet images
for letter in letters:
    try:
        url = f"{base_url}{letter}/100.jpg"
        output_path = os.path.join(signs_dir, f"{letter.lower()}.png")
        
        print(f"Downloading {letter}...", end=" ")
        urllib.request.urlretrieve(url, output_path)
        print("✓")
    except Exception as e:
        print(f"✗ (Error: {e})")

# Download number images
for number in numbers:
    try:
        url = f"{base_url}{number}/100.jpg"
        output_path = os.path.join(signs_dir, f"{number}.png")
        
        print(f"Downloading {number}...", end=" ")
        urllib.request.urlretrieve(url, output_path)
        print("✓")
    except Exception as e:
        print(f"✗ (Error: {e})")

print("=" * 50)
print(f"Images saved to: {os.path.abspath(signs_dir)}")
print("Download complete!")
