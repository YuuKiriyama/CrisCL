@echo off
chcp 65001 >nul
setlocal

REM 获取脚本所在目录
cd /d "%~dp0"

REM 清屏
cls

echo ======================================
echo   德州扑克积分统计系统 - 全部服务
echo ======================================
echo.

REM 检查依赖
echo 📦 检查依赖...
if not exist "frontend\node_modules" (
    echo ⚠️  安装前端依赖...
    cd frontend
    call npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo ⚠️  安装后端依赖...
    cd backend
    call npm install
    cd ..
)

echo.
echo ✅ 依赖检查完成
echo.

REM 启动后端服务器（后台运行）
echo 🚀 启动后端服务器...
start /B cmd /c "cd backend && npm start > ..\backend.log 2>&1"

REM 等待后端启动
timeout /t 2 /nobreak >nul

REM 启动前端服务器（后台运行）
echo 🚀 启动前端服务器...
start /B cmd /c "cd frontend && npm run dev > ..\frontend.log 2>&1"

REM 等待前端启动
timeout /t 3 /nobreak >nul

REM 获取本机IP地址
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set LOCAL_IP=%%a
    goto :found_ip
)
:found_ip
set LOCAL_IP=%LOCAL_IP:~1%

echo.
echo ======================================
echo   ✅ 所有服务启动成功！
echo ======================================
echo.
echo 📡 后端API: http://localhost:3001
echo 🌐 前端界面: http://localhost:3000
echo.
echo 📱 手机访问:
echo    http://%LOCAL_IP%:3000
echo.
echo 📝 日志文件:
echo    后端: backend.log
echo    前端: frontend.log
echo.
echo ⚠️  按任意键停止所有服务
echo ======================================
echo.

pause

REM 停止所有服务
echo.
echo 停止所有服务...
taskkill /F /IM node.exe 2>nul
echo ✅ 所有服务已停止

