from pathlib import Path

# Create signs directory
signs_dir = Path(__file__).parent.parent / 'frontend' / 'public' / 'signs'
signs_dir.mkdir(parents=True, exist_ok=True)

letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
           'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

def create_svg_placeholder(letter, filename):
    """Create an SVG placeholder image"""
    svg_content = f'''<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad{letter}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#grad{letter})" rx="10"/>
  <text x="100" y="120" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        fill="white" text-anchor="middle">{letter}</text>
  <text x="100" y="180" font-family="Arial, sans-serif" font-size="16" 
        fill="white" text-anchor="middle" opacity="0.8">ASL Sign</text>
</svg>'''
    
    with open(filename, 'w') as f:
        f.write(svg_content)

print("Creating placeholder images...")
print("=" * 60)

# Create alphabet placeholders
for letter in letters:
    filename = signs_dir / f"{letter.lower()}.svg"
    create_svg_placeholder(letter, filename)
    print(f"Created: {letter}.svg")

# Create number placeholders
for number in numbers:
    filename = signs_dir / f"{number}.svg"
    create_svg_placeholder(number, filename)
    print(f"Created: {number}.svg")

print("=" * 60)
print(f"✅ Created {len(letters) + len(numbers)} placeholder images")
print(f"📁 Location: {signs_dir.absolute()}")
print("\n⚠️  These are placeholder images.")
print("For real ASL images, download from:")
print("  - https://www.signingsavvy.com/")
print("  - https://www.lifeprint.com/")
