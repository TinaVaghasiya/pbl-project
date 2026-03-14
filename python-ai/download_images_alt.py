import os
import requests
from pathlib import Path

# Create signs directory
signs_dir = Path('../frontend/public/signs')
signs_dir.mkdir(parents=True, exist_ok=True)

# Alternative ASL image sources
images = {
    # Alphabets
    'a': 'https://www.signingsavvy.com/images/words/alphabet/1/a.jpg',
    'b': 'https://www.signingsavvy.com/images/words/alphabet/1/b.jpg',
    'c': 'https://www.signingsavvy.com/images/words/alphabet/1/c.jpg',
    'd': 'https://www.signingsavvy.com/images/words/alphabet/1/d.jpg',
    'e': 'https://www.signingsavvy.com/images/words/alphabet/1/e.jpg',
    'f': 'https://www.signingsavvy.com/images/words/alphabet/1/f.jpg',
    'g': 'https://www.signingsavvy.com/images/words/alphabet/1/g.jpg',
    'h': 'https://www.signingsavvy.com/images/words/alphabet/1/h.jpg',
    'i': 'https://www.signingsavvy.com/images/words/alphabet/1/i.jpg',
    'j': 'https://www.signingsavvy.com/images/words/alphabet/1/j.jpg',
    'k': 'https://www.signingsavvy.com/images/words/alphabet/1/k.jpg',
    'l': 'https://www.signingsavvy.com/images/words/alphabet/1/l.jpg',
    'm': 'https://www.signingsavvy.com/images/words/alphabet/1/m.jpg',
    'n': 'https://www.signingsavvy.com/images/words/alphabet/1/n.jpg',
    'o': 'https://www.signingsavvy.com/images/words/alphabet/1/o.jpg',
    'p': 'https://www.signingsavvy.com/images/words/alphabet/1/p.jpg',
    'q': 'https://www.signingsavvy.com/images/words/alphabet/1/q.jpg',
    'r': 'https://www.signingsavvy.com/images/words/alphabet/1/r.jpg',
    's': 'https://www.signingsavvy.com/images/words/alphabet/1/s.jpg',
    't': 'https://www.signingsavvy.com/images/words/alphabet/1/t.jpg',
    'u': 'https://www.signingsavvy.com/images/words/alphabet/1/u.jpg',
    'v': 'https://www.signingsavvy.com/images/words/alphabet/1/v.jpg',
    'w': 'https://www.signingsavvy.com/images/words/alphabet/1/w.jpg',
    'x': 'https://www.signingsavvy.com/images/words/alphabet/1/x.jpg',
    'y': 'https://www.signingsavvy.com/images/words/alphabet/1/y.jpg',
    'z': 'https://www.signingsavvy.com/images/words/alphabet/1/z.jpg',
}

print("Downloading ASL sign language images...")
print("=" * 50)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

for name, url in images.items():
    try:
        print(f"Downloading {name.upper()}...", end=" ")
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            output_path = signs_dir / f"{name}.png"
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print("✓")
        else:
            print(f"✗ (Status: {response.status_code})")
    except Exception as e:
        print(f"✗ (Error: {str(e)[:30]})")

print("=" * 50)
print(f"Images saved to: {signs_dir.absolute()}")
print("Download complete!")
print("\nNote: Some images may not download due to website restrictions.")
print("You can manually download images from:")
print("- https://www.signingsavvy.com/")
print("- https://www.lifeprint.com/")
