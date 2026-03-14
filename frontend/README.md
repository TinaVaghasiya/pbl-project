# Frontend Documentation

React.js + Vite + TailwindCSS frontend for Sign Language Interpreter

## Setup

```bash
npm install
npm run dev
```

Application runs on `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar with theme toggle
│   ├── Footer.jsx      # Footer with links
│   ├── SignCard.jsx    # Sign display card
│   └── common/
│       └── Loading.jsx # Loading spinner
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Learning.jsx    # Learning module
│   ├── TextToSign.jsx  # Text to sign converter
│   ├── SignToText.jsx  # Sign detection page
│   ├── VoiceToText.jsx # Voice recognition page
│   └── About.jsx       # About page
├── utils/              # Utilities
│   ├── api.js          # API client
│   └── ThemeContext.jsx # Theme management
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Components

### Navbar
- Responsive navigation
- Mobile hamburger menu
- Theme toggle (light/dark)
- Active route highlighting

### Footer
- Quick links
- Social media icons
- Copyright information

### SignCard
- Display sign letter/number
- Show description
- Category badge
- Hover animations

### Loading
- Animated spinner
- Custom loading message

## Pages

### Home
- Hero section with CTA
- Feature cards
- About sign language section
- Animated elements

### Learning
- Browse all signs
- Search functionality
- Category filters
- Responsive grid layout

### TextToSign
- Text input area
- Convert to sign sequence
- Animated playback
- Sign timeline navigation

### SignToText
- Webcam integration
- Real-time detection
- Display detected text
- Copy/clear functionality

### VoiceToText
- Speech recognition
- Live transcript
- Interim results display
- Copy/clear functionality

### About
- Project information
- Technology stack
- Features list
- System architecture

## Utilities

### API Client (api.js)
```javascript
// Learning API
getAllSigns(params)
getSignById(id)
createSign(data)

// Text to Sign
convertTextToSign(text)

// Sign to Text
processDetectedSign(data)
getGestureHistory()

// Python AI
detectSign(imageData)
processVideoFrame(frameData)
```

### Theme Context
```javascript
// Usage
const { isDark, toggleTheme } = useTheme();
```

## Styling

### TailwindCSS Classes
- `btn-primary`: Primary button style
- `btn-secondary`: Secondary button style
- `card`: Card container with hover effect
- `input-field`: Styled input field

### Dark Mode
- Uses `class` strategy
- Persists in localStorage
- Smooth transitions

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Flexible grid layouts

## Features

### Theme Toggle
- Light/dark mode
- Persists preference
- System preference detection

### Responsive Navigation
- Desktop: Horizontal menu
- Mobile: Hamburger menu
- Smooth transitions

### Camera Access
- Request permissions
- Handle errors gracefully
- Display error messages

### Speech Recognition
- Browser API integration
- Interim results
- Error handling

## Browser Support

### Recommended
- Chrome 90+
- Edge 90+

### Limited Support
- Firefox (no speech recognition)
- Safari (limited speech recognition)

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000
VITE_PYTHON_API_URL=http://localhost:5001
```

## Build

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

## Deployment

### Build Output
```bash
npm run build
# Output in dist/ folder
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## Performance Optimization

### Code Splitting
- React.lazy for route-based splitting
- Dynamic imports for heavy components

### Image Optimization
- Use WebP format
- Lazy loading
- Responsive images

### Bundle Size
- Tree shaking enabled
- Minimize dependencies
- Analyze with `vite-bundle-visualizer`

## Accessibility

### ARIA Labels
- Semantic HTML
- Alt text for images
- Keyboard navigation

### Color Contrast
- WCAG AA compliant
- Dark mode support
- High contrast mode

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS (required for camera)
- Try different browser

### Speech Recognition Not Working
- Use Chrome or Edge
- Check microphone permissions
- Ensure HTTPS

### API Connection Issues
- Verify backend is running
- Check CORS settings
- Verify API URLs

## Future Enhancements

1. **User Authentication**
   - Login/Register
   - User profiles
   - Progress tracking

2. **Offline Support**
   - Service workers
   - Cache API responses
   - PWA features

3. **Internationalization**
   - Multi-language support
   - Different sign languages
   - RTL support

4. **Advanced Features**
   - Video recording
   - Share functionality
   - Social features
