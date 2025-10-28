#!/bin/bash

# 获取脚本所在目录
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# 清屏
clear

echo "======================================"
echo "  德州扑克积分统计系统 - 停止服务"
echo "======================================"
echo ""

echo "🔍 检查运行中的服务..."

# 检查并停止后端服务
BACKEND_PIDS=$(ps aux | grep "node server.js" | grep -v grep | awk '{print $2}')
if [ ! -z "$BACKEND_PIDS" ]; then
    echo "🛑 停止后端服务 (PID: $BACKEND_PIDS)..."
    kill $BACKEND_PIDS 2>/dev/null
    sleep 1
    # 强制杀死如果还在运行
    kill -9 $BACKEND_PIDS 2>/dev/null
    echo "✅ 后端服务已停止"
else
    echo "ℹ️  后端服务未运行"
fi

# 检查并停止前端服务
FRONTEND_PIDS=$(ps aux | grep "vite" | grep -v grep | awk '{print $2}')
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "🛑 停止前端服务 (PID: $FRONTEND_PIDS)..."
    kill $FRONTEND_PIDS 2>/dev/null
    sleep 1
    # 强制杀死如果还在运行
    kill -9 $FRONTEND_PIDS 2>/dev/null
    echo "✅ 前端服务已停止"
else
    echo "ℹ️  前端服务未运行"
fi

# 检查并停止npm进程
NPM_PIDS=$(ps aux | grep "npm" | grep -E "(start|dev)" | grep -v grep | awk '{print $2}')
if [ ! -z "$NPM_PIDS" ]; then
    echo "🛑 停止npm进程 (PID: $NPM_PIDS)..."
    kill $NPM_PIDS 2>/dev/null
    sleep 1
    kill -9 $NPM_PIDS 2>/dev/null
    echo "✅ npm进程已停止"
fi

echo ""
echo "🔍 最终检查..."

# 最终检查
REMAINING=$(ps aux | grep -E "(node server.js|vite|npm.*dev|npm.*start)" | grep -v grep | grep CrisCL)
if [ -z "$REMAINING" ]; then
    echo "✅ 所有服务已成功停止！"
else
    echo "⚠️  仍有进程在运行："
    echo "$REMAINING"
fi

echo ""
echo "======================================"
echo "  服务停止完成"
echo "======================================"
echo ""
echo "💡 提示："
echo "  - 如果服务仍在运行，请手动执行："
echo "    pkill -f 'node server.js'"
echo "    pkill -f 'vite'"
echo "  - 或者使用 Activity Monitor 查看进程"
echo ""

# 等待用户按键
read -p "按任意键退出..."
