#!/bin/bash

# 获取脚本所在目录
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# 清屏
clear

echo "======================================"
echo "  德州扑克积分统计系统 - 进程检查"
echo "======================================"
echo ""

echo "🔍 检查运行中的服务..."
echo ""

# 检查后端服务
echo "📡 后端服务状态："
BACKEND_PROCESSES=$(ps aux | grep "node server.js" | grep -v grep)
if [ ! -z "$BACKEND_PROCESSES" ]; then
    echo "✅ 后端服务正在运行："
    echo "$BACKEND_PROCESSES" | while read line; do
        PID=$(echo $line | awk '{print $2}')
        CPU=$(echo $line | awk '{print $3}')
        MEM=$(echo $line | awk '{print $4}')
        TIME=$(echo $line | awk '{print $10}')
        echo "   PID: $PID | CPU: $CPU% | 内存: $MEM% | 运行时间: $TIME"
    done
else
    echo "❌ 后端服务未运行"
fi

echo ""

# 检查前端服务
echo "🌐 前端服务状态："
FRONTEND_PROCESSES=$(ps aux | grep "vite" | grep -v grep)
if [ ! -z "$FRONTEND_PROCESSES" ]; then
    echo "✅ 前端服务正在运行："
    echo "$FRONTEND_PROCESSES" | while read line; do
        PID=$(echo $line | awk '{print $2}')
        CPU=$(echo $line | awk '{print $3}')
        MEM=$(echo $line | awk '{print $4}')
        TIME=$(echo $line | awk '{print $10}')
        echo "   PID: $PID | CPU: $CPU% | 内存: $MEM% | 运行时间: $TIME"
    done
else
    echo "❌ 前端服务未运行"
fi

echo ""

# 检查端口使用情况
echo "🔌 端口使用情况："
echo "   3001 (后端): $(lsof -i :3001 2>/dev/null | wc -l | xargs -I {} echo {} 个连接)"
echo "   3000 (前端): $(lsof -i :3000 2>/dev/null | wc -l | xargs -I {} echo {} 个连接)"
echo "   5173 (Vite): $(lsof -i :5173 2>/dev/null | wc -l | xargs -I {} echo {} 个连接)"

echo ""

# 检查日志文件
echo "📝 日志文件状态："
if [ -f "backend.log" ]; then
    BACKEND_LOG_SIZE=$(ls -lh backend.log | awk '{print $5}')
    echo "   后端日志: backend.log ($BACKEND_LOG_SIZE)"
else
    echo "   后端日志: 不存在"
fi

if [ -f "frontend.log" ]; then
    FRONTEND_LOG_SIZE=$(ls -lh frontend.log | awk '{print $5}')
    echo "   前端日志: frontend.log ($FRONTEND_LOG_SIZE)"
else
    echo "   前端日志: 不存在"
fi

echo ""
echo "======================================"
echo "  进程检查完成"
echo "======================================"
echo ""
echo "💡 快捷操作："
echo "  - 启动服务: ./启动全部服务.command"
echo "  - 停止服务: ./停止所有服务.command"
echo "  - 查看日志: tail -f backend.log frontend.log"
echo ""

# 等待用户按键
read -p "按任意键退出..."
