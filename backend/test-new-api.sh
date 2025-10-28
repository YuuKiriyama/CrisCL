#!/bin/bash

echo "======================================"
echo "  测试新的后端存储结构"
echo "======================================"
echo ""

API_BASE="http://localhost:3001/api"

echo "1. 测试健康检查..."
curl -s "${API_BASE}/health" | python3 -m json.tool
echo ""

echo "2. 测试获取玩家列表..."
curl -s "${API_BASE}/players" | python3 -m json.tool
echo ""

echo "3. 测试获取游戏列表..."
curl -s "${API_BASE}/games" | python3 -m json.tool
echo ""

echo "4. 测试添加玩家..."
PLAYER_DATA='{"name":"测试玩家","nickname":"小测","phone":"13800138000","email":"test@example.com","notes":"这是一个测试玩家","isFavorite":true}'
curl -s -X POST "${API_BASE}/players" \
  -H "Content-Type: application/json" \
  -d "$PLAYER_DATA" | python3 -m json.tool
echo ""

echo "5. 测试添加游戏..."
GAME_DATA='{"gameName":"测试游戏","smallBlind":1,"bigBlind":2,"chipValue":10,"buyInChips":100,"sessionMinutes":120}'
curl -s -X POST "${API_BASE}/games" \
  -H "Content-Type: application/json" \
  -d "$GAME_DATA" | python3 -m json.tool
echo ""

echo "6. 测试获取游戏玩家记录..."
curl -s "${API_BASE}/game-players" | python3 -m json.tool
echo ""

echo "7. 测试兼容性接口 - 获取历史记录..."
curl -s "${API_BASE}/history" | python3 -m json.tool
echo ""

echo "8. 测试兼容性接口 - 获取收藏列表..."
curl -s "${API_BASE}/favorites" | python3 -m json.tool
echo ""

echo "======================================"
echo "  测试完成"
echo "======================================"
