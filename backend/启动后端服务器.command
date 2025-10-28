#!/bin/bash

# 获取脚本所在目录
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# 清屏
clear

echo "======================================"
echo "  德州扑克积分统计系统 - 后端服务器"
echo "======================================"
echo ""
echo "正在启动后端服务器..."
echo ""

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "⚠️  首次运行需要安装依赖..."
    npm install
    echo ""
fi

# 启动后端服务器
npm start

