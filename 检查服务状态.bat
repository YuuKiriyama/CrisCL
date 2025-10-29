@echo off
chcp 65001 >nul
setlocal

REM 获取脚本所在目录
cd /d "%~dp0"

REM 清屏
cls

echo ======================================
echo   德州扑克积分统计系统 - 进程检查
echo ======================================
echo.

echo 🔍 检查运行中的服务...
echo.

REM 检查后端服务
echo 📡 后端服务状态：
tasklist /FI "IMAGENAME eq node.exe" /V 2>nul | findstr "server.js" >nul
if %errorlevel% equ 0 (
    echo ✅ 后端服务正在运行
    tasklist /FI "IMAGENAME eq node.exe" /V | findstr "server.js"
) else (
    echo ❌ 后端服务未运行
)

echo.

REM 检查前端服务
echo 🌐 前端服务状态：
tasklist /FI "IMAGENAME eq node.exe" /V 2>nul | findstr "vite" >nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务正在运行
    tasklist /FI "IMAGENAME eq node.exe" /V | findstr "vite"
) else (
    echo ❌ 前端服务未运行
)

echo.

REM 检查端口使用情况
echo 🔌 端口使用情况：
netstat -ano | findstr ":3001" >nul 2>&1
if %errorlevel% equ 0 (
    echo    3001 ^(后端^): 正在使用
) else (
    echo    3001 ^(后端^): 未使用
)

netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo    3000 ^(前端^): 正在使用
) else (
    echo    3000 ^(前端^): 未使用
)

netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo    5173 ^(Vite^): 正在使用
) else (
    echo    5173 ^(Vite^): 未使用
)

echo.

REM 检查日志文件
echo 📝 日志文件状态：
if exist "backend.log" (
    for %%A in ("backend.log") do echo    后端日志: backend.log ^(%%~zA 字节^)
) else (
    echo    后端日志: 不存在
)

if exist "frontend.log" (
    for %%A in ("frontend.log") do echo    前端日志: frontend.log ^(%%~zA 字节^)
) else (
    echo    前端日志: 不存在
)

echo.
echo ======================================
echo   进程检查完成
echo ======================================
echo.
echo 💡 快捷操作：
echo   - 启动服务: 启动全部服务.bat
echo   - 停止服务: 停止所有服务.bat
echo   - 查看日志: type backend.log 或 type frontend.log
echo.

pause

