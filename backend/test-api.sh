#!/bin/bash

echo "======================================"
echo "  测试后端API"
echo "======================================"
echo ""

API_BASE="http://localhost:3001/api"

echo "1. 测试健康检查..."
curl -s "${API_BASE}/health" | python3 -m json.tool
echo ""

echo "2. 测试获取历史记录..."
curl -s "${API_BASE}/history" | python3 -m json.tool
echo ""

echo "3. 测试获取收藏列表..."
curl -s "${API_BASE}/favorites" | python3 -m json.tool
echo ""

echo "======================================"
echo "  测试完成"
echo "======================================"

