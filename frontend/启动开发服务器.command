#!/bin/bash

# 获取脚本所在目录（frontend目录）
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# 获取本机IP地址
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

# 清屏
clear

echo "======================================"
echo "  德州扑克积分统计系统 - 开发服务器"
echo "======================================"
echo ""
echo "正在启动Vite开发服务器..."
echo ""

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "⚠️  首次运行需要安装依赖..."
    npm install
    echo ""
fi

echo "✅ 服务器启动成功！"
echo ""
echo "📱 手机访问地址："
echo "   http://${LOCAL_IP}:3000"
echo ""
echo "💻 本机访问地址："
echo "   http://localhost:3000"
echo ""
echo "提示："
echo "  - 手机需要和电脑在同一个WiFi网络"
echo "  - 修改代码会自动热更新"
echo "  - 按 Ctrl+C 停止服务器"
echo ""
echo "======================================"
echo ""

# 启动开发服务器
npm run dev

