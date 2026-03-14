@echo off
echo ========================================
echo Smart Sign Language Interpreter Setup
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b %errorlevel%
)
cd ..
echo Backend dependencies installed successfully!
echo.

echo Step 2: Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b %errorlevel%
)
cd ..
echo Frontend dependencies installed successfully!
echo.

echo Step 3: Installing Python Dependencies...
cd python-ai
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing Python dependencies
    pause
    exit /b %errorlevel%
)
cd ..
echo Python dependencies installed successfully!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Make sure MongoDB is running
echo 2. Run 'node backend/seed.js' to populate database
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start Python AI: cd python-ai ^&^& python app.py
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo.
pause
