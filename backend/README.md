# 德州扑克积分统计系统 - 后端 v0.1.1

基于Node.js + Express的后端API服务，提供德州扑克游戏数据的管理和存储功能。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动服务器
```bash
npm start
```
服务将在 `http://localhost:3001` 启动

### 测试API
```bash
./test-api.sh
```

## 🏗️ 技术栈

- **Node.js** - JavaScript运行环境
- **Express** - Web应用框架
- **JSON文件** - 轻量级数据存储
- **CORS** - 跨域资源共享

## 📁 目录结构

```
backend/
├── data/                   # 数据存储
│   ├── games.json          # 游戏历史记录
│   ├── players.json        # 玩家数据
│   └── poker-favorites.json # 收藏玩家
├── server.js               # Express服务器主文件
├── dataStore.js            # 数据存储模块
├── package.json            # 依赖配置
├── test-api.sh             # API测试脚本
└── 启动后端服务器.command   # 启动脚本
```

## 📡 API接口

### 基础信息
- **服务地址**: `http://localhost:3001`
- **API前缀**: `/api`
- **数据格式**: JSON
- **跨域支持**: 已配置CORS

### 接口列表

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| GET | /api/health | 健康检查 | - |
| GET | /api/games | 获取游戏历史 | - |
| POST | /api/games | 添加游戏记录 | Game对象 |
| DELETE | /api/games/:id | 删除游戏记录 | - |
| GET | /api/players | 获取玩家数据 | - |
| PUT | /api/players | 更新玩家数据 | Players数组 |
| GET | /api/favorites | 获取收藏列表 | - |
| PUT | /api/favorites | 更新收藏列表 | Favorites数组 |

### 响应格式

**成功响应:**
```json
{
  "success": true,
  "data": { /* 数据内容 */ }
}
```

**错误响应:**
```json
{
  "success": false,
  "error": "错误信息"
}
```

## 💾 数据存储

### 存储位置
`data/` 目录下的JSON文件

### 数据文件

**games.json** - 游戏历史记录
```json
[
  {
    "id": 1698765432000,
    "gameName": "10月27日周五",
    "date": "2023-10-27T12:00:00.000Z",
    "smallBlind": 1,
    "bigBlind": 2,
    "buyInChips": 200,
    "chipValue": 10,
    "sessionMinutes": 120,
    "players": [
      {
        "name": "玩家A",
        "buyInCount": 1,
        "finalChips": 250
      }
    ]
  }
]
```

**players.json** - 玩家数据
```json
[
  {
    "name": "玩家A",
    "totalGames": 5,
    "totalProfit": 150.50,
    "avgProfit": 30.10
  }
]
```

**poker-favorites.json** - 收藏玩家
```json
["玩家A", "玩家B", "玩家C"]
```

## 🔧 配置说明

### 端口配置
```javascript
// server.js
const PORT = 3001;  // 修改为所需端口
```

### CORS配置
```javascript
// server.js
app.use(cors({
  origin: 'http://localhost:3000'  // 生产环境需要修改
}));
```

### 生产环境配置

1. **修改CORS来源**:
```javascript
app.use(cors({
  origin: 'https://your-domain.com'
}));
```

2. **添加环境变量**:
```bash
NODE_ENV=production
PORT=3001
```

3. **添加HTTPS支持**:
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(PORT);
```

## 🧪 测试

### API测试
```bash
# 使用测试脚本
./test-api.sh

# 手动测试
curl http://localhost:3001/api/health
curl http://localhost:3001/api/games
curl http://localhost:3001/api/players
curl http://localhost:3001/api/favorites
```

### 测试用例
- 健康检查接口
- 数据CRUD操作
- 错误处理
- CORS跨域请求

## 🔍 故障排查

### 常见问题

**1. 端口被占用**
```bash
# 检查端口使用情况
lsof -i :3001

# 杀死占用进程
kill -9 <PID>
```

**2. 数据文件权限问题**
```bash
# 检查文件权限
ls -la data/

# 修改权限
chmod 644 data/*.json
```

**3. CORS错误**
- 检查CORS配置
- 确认前端地址正确
- 查看浏览器控制台错误

**4. 数据没有保存**
- 检查`data/`目录是否存在
- 确认文件写入权限
- 查看服务器日志

## 📊 性能优化

### 当前优化
- JSON文件轻量级存储
- Express中间件优化
- 错误处理机制

### 未来优化
- 添加数据缓存
- 实现数据分页
- 添加请求限流
- 升级到数据库

## 🔐 安全考虑

### 当前状态（开发环境）
- ✅ CORS基本配置
- ❌ 无身份验证
- ❌ 无数据加密
- ❌ 无输入验证

### 生产环境建议
1. **添加身份验证**: JWT或Session
2. **输入验证**: 验证所有API输入
3. **HTTPS**: 使用SSL证书
4. **日志记录**: 记录所有操作
5. **备份策略**: 定期备份数据

## 📈 可扩展性

### 短期扩展
- [ ] 添加数据验证中间件
- [ ] 实现API版本控制
- [ ] 添加请求日志
- [ ] 优化错误处理

### 中期扩展
- [ ] 升级到数据库（MongoDB/PostgreSQL）
- [ ] 添加用户认证系统
- [ ] 实现数据分页
- [ ] 添加缓存机制

### 长期扩展
- [ ] 微服务架构
- [ ] 分布式部署
- [ ] 实时同步（WebSocket）
- [ ] 数据分析服务

## 🔄 版本历史

### v0.1.1
- ✅ 支持游戏状态自动保存
- ✅ 数据持久化优化

### v0.0.1
- ✅ 初始版本发布
- ✅ Express服务器
- ✅ JSON文件存储
- ✅ RESTful API设计
- ✅ CORS跨域支持
- ✅ 基础错误处理

## 📚 相关文档

- **项目主文档**: `../README.md`
- **前端文档**: `../frontend/README.md`
- **API测试**: `test-api.sh`

---

**后端服务 v0.1.1**  
*可靠的德州扑克数据管理API*