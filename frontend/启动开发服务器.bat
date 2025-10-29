@echo off
chcp 65001 >nul
setlocal

REM 获取脚本所在目录
cd /d "%~dp0"

REM 获取本机IP地址
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set LOCAL_IP=%%a
    goto :found_ip
)
:found_ip
set LOCAL_IP=%LOCAL_IP:~1%

REM 清屏
cls

echo ======================================
echo   德州扑克积分统计系统 - 开发服务器
echo ======================================
echo.
echo 正在启动Vite开发服务器...
echo.

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo ⚠️  首次运行需要安装依赖...
    call npm install
    echo.
)

echo ✅ 服务器启动成功！
echo.
echo 📱 手机访问地址：
echo    http://%LOCAL_IP%:3000
echo.
echo 💻 本机访问地址：
echo    http://localhost:3000
echo.
echo 提示：
echo   - 手机需要和电脑在同一个WiFi网络
echo   - 修改代码会自动热更新
echo   - 按 Ctrl+C 停止服务器
echo.
echo ======================================
echo.

REM 启动开发服务器
call npm run dev

pause

