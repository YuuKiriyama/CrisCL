@echo off
chcp 65001 >nul
setlocal

REM 获取脚本所在目录
cd /d "%~dp0"

REM 清屏
cls

echo ======================================
echo   德州扑克积分统计系统 - 停止服务
echo ======================================
echo.

echo 🔍 检查运行中的服务...

REM 停止后端服务
echo 🛑 停止后端服务...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *server.js*" 2>nul
if %errorlevel% equ 0 (
    echo ✅ 后端服务已停止
) else (
    echo ℹ️  后端服务未运行
)

REM 停止前端服务
echo 🛑 停止前端服务...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *vite*" 2>nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务已停止
) else (
    echo ℹ️  前端服务未运行
)

REM 停止所有Node进程（谨慎使用）
echo 🛑 停止所有相关npm进程...
taskkill /F /IM node.exe 2>nul

echo.
echo ✅ 所有服务已停止！
echo.
echo ======================================
echo   服务停止完成
echo ======================================
echo.
echo 💡 提示：
echo   - 如果端口仍被占用，请重启计算机
echo   - 或在任务管理器中手动结束node.exe进程
echo.

pause

