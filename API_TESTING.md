# API Testing Guide

Test all API endpoints using curl, Postman, or any HTTP client.

## Base URLs

- Backend: `http://localhost:5000`
- Python AI: `http://localhost:5001`

## Backend API Tests

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Get All Signs
```bash
# Get all signs
curl http://localhost:5000/api/learn

# Filter by category
curl "http://localhost:5000/api/learn?category=alphabet"

# Search
curl "http://localhost:5000/api/learn?search=A"
```

### 3. Get Single Sign
```bash
curl http://localhost:5000/api/learn/{sign_id}
```

### 4. Create Sign
```bash
curl -X POST http://localhost:5000/api/learn \
  -H "Content-Type: application/json" \
  -d '{
    "letter": "TEST",
    "category": "word",
    "image": "/signs/test.png",
    "description": "Test sign"
  }'
```

### 5. Update Sign
```bash
curl -X PUT http://localhost:5000/api/learn/{sign_id} \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

### 6. Delete Sign
```bash
curl -X DELETE http://localhost:5000/api/learn/{sign_id}
```

### 7. Text to Sign Conversion
```bash
curl -X POST http://localhost:5000/api/text-to-sign \
  -H "Content-Type: application/json" \
  -d '{
    "text": "HELLO"
  }'
```

### 8. Process Detected Sign
```bash
curl -X POST http://localhost:5000/api/sign-to-text \
  -H "Content-Type: application/json" \
  -d '{
    "detectedSign": "A",
    "confidence": 0.85
  }'
```

### 9. Get Gesture History
```bash
curl http://localhost:5000/api/sign-to-text/history
```

## Python AI API Tests

### 1. Health Check
```bash
curl http://localhost:5001/api/health
```

### 2. Detect Sign (requires base64 image)
```bash
curl -X POST http://localhost:5001/api/detect-sign \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

### 3. Process Video Frame
```bash
curl -X POST http://localhost:5001/api/process-video \
  -H "Content-Type: application/json" \
  -d '{
    "frame": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

## Postman Collection

### Import to Postman

Create a new collection with these requests:

#### Collection Variables
- `backend_url`: `http://localhost:5000`
- `python_url`: `http://localhost:5001`

#### Requests

1. **Health Check**
   - Method: GET
   - URL: `{{backend_url}}/api/health`

2. **Get All Signs**
   - Method: GET
   - URL: `{{backend_url}}/api/learn`

3. **Get Signs by Category**
   - Method: GET
   - URL: `{{backend_url}}/api/learn?category=alphabet`

4. **Create Sign**
   - Method: POST
   - URL: `{{backend_url}}/api/learn`
   - Body (JSON):
   ```json
   {
     "letter": "X",
     "category": "alphabet",
     "image": "/signs/x.png",
     "description": "Index finger bent like hook"
   }
   ```

5. **Text to Sign**
   - Method: POST
   - URL: `{{backend_url}}/api/text-to-sign`
   - Body (JSON):
   ```json
   {
     "text": "HELLO WORLD"
   }
   ```

6. **Python AI Health**
   - Method: GET
   - URL: `{{python_url}}/api/health`

## Expected Responses

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Testing Scenarios

### Scenario 1: Complete Learning Flow
1. Get all signs
2. Filter by alphabet category
3. Search for specific letter
4. Get single sign details

### Scenario 2: Text to Sign Flow
1. Send text "HELLO"
2. Receive array of sign objects
3. Verify each letter has image and description

### Scenario 3: Sign Detection Flow
1. Start camera (frontend)
2. Capture frame
3. Send to Python AI
4. Receive detected sign
5. Send to backend for logging
6. Get gesture history

## Load Testing

### Using Apache Bench
```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:5000/api/health

# Test get all signs
ab -n 500 -c 5 http://localhost:5000/api/learn
```

### Using Artillery
```yaml
# artillery.yml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "API Load Test"
    flow:
      - get:
          url: "/api/health"
      - get:
          url: "/api/learn"
      - post:
          url: "/api/text-to-sign"
          json:
            text: "TEST"
```

```bash
artillery run artillery.yml
```

## Integration Testing

### Test Complete Flow
```bash
#!/bin/bash

echo "Testing complete flow..."

# 1. Health check
echo "1. Health check..."
curl -s http://localhost:5000/api/health | jq

# 2. Get signs
echo "2. Getting signs..."
curl -s http://localhost:5000/api/learn | jq '.data | length'

# 3. Text to sign
echo "3. Converting text to sign..."
curl -s -X POST http://localhost:5000/api/text-to-sign \
  -H "Content-Type: application/json" \
  -d '{"text": "HELLO"}' | jq '.data | length'

# 4. Python AI health
echo "4. Python AI health..."
curl -s http://localhost:5001/api/health | jq

echo "All tests completed!"
```

## Debugging Tips

### Enable Verbose Output
```bash
curl -v http://localhost:5000/api/health
```

### Check Response Headers
```bash
curl -I http://localhost:5000/api/health
```

### Save Response to File
```bash
curl http://localhost:5000/api/learn > response.json
```

### Test with Different Methods
```bash
# GET
curl -X GET http://localhost:5000/api/learn

# POST
curl -X POST http://localhost:5000/api/learn -d '...'

# PUT
curl -X PUT http://localhost:5000/api/learn/123 -d '...'

# DELETE
curl -X DELETE http://localhost:5000/api/learn/123
```

## Common Issues

### CORS Errors
- Ensure backend CORS is configured
- Check allowed origins
- Verify request headers

### 404 Not Found
- Verify endpoint URL
- Check route definitions
- Ensure server is running

### 500 Internal Server Error
- Check server logs
- Verify database connection
- Check request payload format

### Connection Refused
- Ensure service is running
- Check port numbers
- Verify firewall rules
