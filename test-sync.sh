#!/bin/bash

echo "======================================"
echo "  测试多设备数据同步"
echo "======================================"
echo ""

API_BASE="http://localhost:3001/api"

echo "1. 检查服务器状态..."
curl -s "${API_BASE}/health" | python3 -m json.tool
echo ""

echo "2. 获取当前历史记录..."
curl -s "${API_BASE}/history" | python3 -m json.tool
echo ""

echo "3. 添加测试游戏记录..."
TEST_GAME='{
  "id": 9999999999999,
  "gameName": "测试同步游戏",
  "date": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
  "smallBlind": 1,
  "bigBlind": 2,
  "chipValue": 10,
  "buyInChips": 100,
  "sessionMinutes": 60,
  "startTime": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
  "endTime": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
  "players": [
    {
      "id": 9999999999998,
      "name": "测试玩家A",
      "buyIns": 1,
      "endChips": 150,
      "profit": 50,
      "position": 1,
      "notes": "测试数据"
    },
    {
      "id": 9999999999997,
      "name": "测试玩家B", 
      "buyIns": 1,
      "endChips": 50,
      "profit": -50,
      "position": 2,
      "notes": "测试数据"
    }
  ]
}'

echo "添加测试游戏..."
curl -s -X POST "${API_BASE}/history" \
  -H "Content-Type: application/json" \
  -d "$TEST_GAME" | python3 -m json.tool
echo ""

echo "4. 验证数据是否已保存..."
curl -s "${API_BASE}/history" | python3 -m json.tool
echo ""

echo "5. 测试新API接口..."
echo "获取玩家列表:"
curl -s "${API_BASE}/players" | python3 -m json.tool
echo ""

echo "获取游戏列表:"
curl -s "${API_BASE}/games" | python3 -m json.tool
echo ""

echo "======================================"
echo "  测试完成"
echo "======================================"
