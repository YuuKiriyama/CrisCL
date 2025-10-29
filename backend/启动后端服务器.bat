@echo off
chcp 65001 >nul
setlocal

REM 获取脚本所在目录
cd /d "%~dp0"

REM 清屏
cls

echo ======================================
echo   德州扑克积分统计系统 - 后端服务器
echo ======================================
echo.
echo 正在启动后端服务器...
echo.

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo ⚠️  首次运行需要安装依赖...
    call npm install
    echo.
)

REM 启动后端服务器
call npm start

pause

