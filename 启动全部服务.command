#!/bin/bash

# 获取脚本所在目录
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# 清屏
clear

echo "======================================"
echo "  德州扑克积分统计系统 - 全部服务"
echo "======================================"
echo ""

# 检查依赖
echo "📦 检查依赖..."
if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  安装前端依赖..."
    cd frontend
    npm install
    cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  安装后端依赖..."
    cd backend
    npm install
    cd ..
fi

echo ""
echo "✅ 依赖检查完成"
echo ""

# 启动后端服务器（后台运行）
echo "🚀 启动后端服务器..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 2

# 启动前端服务器（后台运行）
echo "🚀 启动前端服务器..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# 等待前端启动
sleep 3

echo ""
echo "======================================"
echo "  ✅ 所有服务启动成功！"
echo "======================================"
echo ""
echo "📡 后端API: http://localhost:3001"
echo "🌐 前端界面: http://localhost:3000"
echo ""
echo "📱 手机访问:"
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
echo "   http://${LOCAL_IP}:3000"
echo ""
echo "📝 日志文件:"
echo "   后端: backend.log"
echo "   前端: frontend.log"
echo ""
echo "⚠️  按 Ctrl+C 停止所有服务"
echo "======================================"
echo ""

# 等待用户中断
trap "echo ''; echo '停止所有服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; sleep 2; kill -9 $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '✅ 所有服务已停止'; exit" INT TERM

# 保持脚本运行并监控进程
while true; do
    # 检查进程是否还在运行
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "⚠️  后端服务意外停止"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "⚠️  前端服务意外停止"
        break
    fi
    sleep 5
done

