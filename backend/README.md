# 德州扑克积分统计系统 - 后端服务器

## 📦 技术栈

- **Node.js** - JavaScript运行环境
- **Express** - Web框架
- **CORS** - 跨域资源共享
- **JSON文件** - 数据存储

## 🚀 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 启动服务器

#### 方式一：使用命令行
```bash
npm start
```

#### 方式二：双击启动脚本
双击 `启动后端服务器.command` 文件（macOS）

### 3. 验证服务器

服务器启动后，访问：http://localhost:3001/api/health

应该看到：
```json
{
  "status": "ok",
  "message": "服务器运行正常"
}
```

## 📡 API接口文档

### 基础信息
- **服务器地址**: `http://localhost:3001`
- **API前缀**: `/api`

### 新存储结构

系统现在使用三个独立的数据表：

1. **玩家表 (players.json)** - 存储玩家基本信息
2. **游戏表 (games.json)** - 存储游戏局信息
3. **游戏玩家关联表 (gamePlayers.json)** - 存储玩家在每局游戏中的表现

### 接口列表

#### 1. 健康检查
```
GET /api/health
```
**响应示例：**
```json
{
  "status": "ok",
  "message": "服务器运行正常"
}
```

#### 2. 玩家相关接口

##### 获取所有玩家
```
GET /api/players
```
**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "player_001",
      "name": "张三",
      "nickname": "小张",
      "avatar": "",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "notes": "",
      "isFavorite": true,
      "createdAt": "2025-01-28T16:39:20.629Z",
      "updatedAt": "2025-01-28T16:39:20.629Z",
      "totalGames": 5,
      "totalBuyIns": 2500,
      "totalProfit": 300
    }
  ]
}
```

##### 获取玩家详情
```
GET /api/players/:playerId
```

##### 添加玩家
```
POST /api/players
Content-Type: application/json
```
**请求体：**
```json
{
  "name": "张三",
  "nickname": "小张",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "notes": "备注信息",
  "isFavorite": true
}
```

##### 更新玩家
```
PUT /api/players/:playerId
Content-Type: application/json
```

##### 删除玩家
```
DELETE /api/players/:playerId
```

#### 3. 游戏相关接口

##### 获取所有游戏
```
GET /api/games
```
**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "game_001",
      "gameName": "10月28日周二",
      "date": "2025-10-28T16:39:20.629Z",
      "smallBlind": 1,
      "bigBlind": 2,
      "chipValue": 20,
      "buyInChips": 500,
      "sessionMinutes": 180,
      "startTime": "2025-10-28T16:39:10.063Z",
      "endTime": "2025-10-28T16:39:19.329Z",
      "createdAt": "2025-01-28T16:39:20.629Z",
      "updatedAt": "2025-01-28T16:39:20.629Z"
    }
  ]
}
```

##### 获取游戏详情
```
GET /api/games/:gameId
```

##### 添加游戏
```
POST /api/games
Content-Type: application/json
```
**请求体：**
```json
{
  "gameName": "10月28日周二",
  "smallBlind": 1,
  "bigBlind": 2,
  "chipValue": 20,
  "buyInChips": 500,
  "sessionMinutes": 180,
  "startTime": "2025-10-28T16:39:10.063Z",
  "endTime": "2025-10-28T16:39:19.329Z"
}
```

##### 更新游戏
```
PUT /api/games/:gameId
Content-Type: application/json
```

##### 删除游戏
```
DELETE /api/games/:gameId
```

#### 4. 游戏玩家关联接口

##### 获取游戏的所有玩家记录
```
GET /api/games/:gameId/players
```

##### 获取玩家的所有游戏记录
```
GET /api/players/:playerId/games
```

##### 添加游戏玩家记录
```
POST /api/game-players
Content-Type: application/json
```
**请求体：**
```json
{
  "gameId": "game_001",
  "playerId": "player_001",
  "buyIns": 1,
  "endChips": 200,
  "profit": -300,
  "position": 1,
  "notes": "备注"
}
```

##### 更新游戏玩家记录
```
PUT /api/game-players/:gamePlayerId
Content-Type: application/json
```

##### 删除游戏玩家记录
```
DELETE /api/game-players/:gamePlayerId
```

#### 5. 兼容性接口（保持向后兼容）

##### 获取历史记录
```
GET /api/history
```
**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "game_001",
      "gameName": "10月27日周五",
      "date": "2023-10-27T12:00:00.000Z",
      "smallBlind": 1,
      "bigBlind": 2,
      "chipValue": 10,
      "buyInChips": 200,
      "sessionMinutes": 180,
      "startTime": "2023-10-27T10:00:00.000Z",
      "endTime": "2023-10-27T13:00:00.000Z",
      "players": [
        {
          "id": "gp_001",
          "name": "张三",
          "buyIns": 1,
          "endChips": 200,
          "profit": -300,
          "position": 1,
          "notes": ""
        }
      ]
    }
  ]
}
```

##### 添加游戏记录
```
POST /api/history
Content-Type: application/json
```

##### 更新所有历史记录
```
PUT /api/history
Content-Type: application/json
```

##### 删除游戏记录
```
DELETE /api/history/:gameId
```

#### 6. 收藏列表接口

##### 获取收藏列表
```
GET /api/favorites
```
**响应示例：**
```json
{
  "success": true,
  "data": ["玩家A", "玩家B"]
}
```

##### 更新收藏列表
```
PUT /api/favorites
Content-Type: application/json
```
**请求体：**
```json
["玩家A", "玩家B", "玩家C"]
```

## 📁 数据存储

数据存储在 `backend/data/` 目录下：

### 新存储结构
- `players.json` - 玩家信息表
- `games.json` - 游戏局信息表
- `gamePlayers.json` - 游戏玩家关联表
- `poker-favorites.json` - 收藏的玩家列表

### 旧存储结构（已迁移）
- `poker-history.json` - 原始历史记录（已迁移）
- `poker-history-backup-*.json` - 迁移时的备份文件

这些文件会在首次使用时自动创建。系统启动时会自动检测并迁移旧数据。

## 🔧 配置说明

### 修改端口

在 `server.js` 中修改：
```javascript
const PORT = 3001; // 改为你想要的端口
```

### 允许的跨域来源

当前配置允许所有来源访问（开发环境）。生产环境建议修改 `server.js` 中的CORS配置：
```javascript
app.use(cors({
  origin: 'http://yourdomain.com' // 只允许特定域名
}));
```

## 📝 注意事项

1. **数据备份**：`data/` 目录下的JSON文件包含所有数据，请定期备份
2. **端口占用**：确保3001端口未被占用
3. **前端配置**：前端的 `src/utils/storage.js` 中配置了后端地址为 `http://localhost:3001`

## 🐛 常见问题

### Q: 启动失败，提示端口被占用？
A: 修改 `server.js` 中的 PORT 值，或关闭占用3001端口的程序

### Q: 前端无法连接后端？
A: 
1. 检查后端是否正常启动
2. 检查前端 `storage.js` 中的 API_BASE_URL 是否正确
3. 检查浏览器控制台是否有CORS错误

### Q: 数据丢失了？
A: 检查 `backend/data/` 目录下的JSON文件是否存在

