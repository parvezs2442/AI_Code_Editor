@echo off
title Vertex AI Code Editor - Services Launcher
echo ============================================================
echo   Starting All Vertex AI Code Editor Services...
echo ============================================================

echo [1/9] Ensuring Redis is running...
cd /d "%~dp0backend"
docker compose up -d

timeout /t 1 /nobreak >nul

echo [2/9] Launching Gateway (Port 3000)...
start "Gateway :3000" cmd /k "cd /d "%~dp0backend\gateway" && npm run dev"

echo [3/9] Launching Auth Service (Port 3001)...
start "Auth :3001" cmd /k "cd /d "%~dp0backend\services\auth" && npm run dev"

echo [4/9] Launching Project Service (Port 3002)...
start "Project :3002" cmd /k "cd /d "%~dp0backend\services\project" && npm run dev"

echo [5/9] Launching File Service (Port 3003)...
start "File :3003" cmd /k "cd /d "%~dp0backend\services\file" && npm run dev"

echo [6/9] Launching AI Service (Port 8004)...
start "AI :8004" cmd /k "cd /d "%~dp0backend\services\ai" && npm run dev"

echo [7/9] Launching Terminal Service (Port 8005)...
start "Terminal :8005" cmd /k "cd /d "%~dp0backend\services\terminal" && npm run dev"

echo [8/9] Launching Payment Service (Port 8006)...
start "Payment :8006" cmd /k "cd /d "%~dp0backend\services\payment" && npm run dev"

timeout /t 2 /nobreak >nul

echo [9/9] Launching Frontend (Port 5173)...
start "Frontend :5173" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo ============================================================
echo   All 8 Services + Redis Launched Successfully!
echo   Open Frontend in browser: http://localhost:5173
echo ============================================================
pause
