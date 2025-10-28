# 德州扑克积分统计系统 v0.0.1

一个现代化的德州扑克游戏数据统计Web应用，采用前后端分离架构，支持多设备访问。

## ✨ 功能特性

- 🎮 **游戏记录管理** - 开始、结束、保存游戏
- 📊 **玩家盈亏统计** - 筹码、现金、BB统计
- 📈 **历史记录查询** - 完整的游戏历史
- 👤 **玩家详情分析** - 个人统计数据
- ⭐ **收藏玩家功能** - 快速访问常用玩家
- ⚖️ **账目平衡检查** - 自动验证数据一致性
- 📱 **响应式设计** - 支持手机、平板、PC
- 🔄 **实时数据同步** - 多设备数据共享

## 🏗️ 技术架构

### 前端技术栈
- **React 18** - 现代化UI框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **React Hooks** - 状态管理

### 后端技术栈
- **Node.js** - JavaScript运行环境
- **Express** - Web应用框架
- **JSON文件** - 轻量级数据存储
- **CORS** - 跨域资源共享

## 📁 项目结构

```
CrisCL/
├── frontend/                    # 前端应用
│   ├── src/
│   │   ├── components/          # React组件
│   │   │   ├── CurrentGame.jsx  # 当前游戏页面
│   │   │   ├── History.jsx     # 历史记录页面
│   │   │   ├── PlayerDetail.jsx # 玩家详情页面
│   │   │   └── Icons.jsx       # SVG图标组件
│   │   ├── utils/              # 工具函数
│   │   │   ├── storage.js      # API存储封装
│   │   │   └── helpers.js      # 辅助函数
│   │   ├── App.jsx             # 主应用组件
│   │   ├── main.jsx            # 应用入口
│   │   └── index.css           # 全局样式
│   ├── index.html              # HTML模板
│   ├── package.json            # 前端依赖
│   ├── vite.config.js          # Vite配置
│   ├── tailwind.config.js      # Tailwind配置
│   ├── 启动开发服务器.command   # 前端启动脚本
│   └── README.md               # 前端文档
│
├── backend/                    # 后端服务
│   ├── data/                   # 数据存储
│   │   ├── games.json          # 游戏历史记录
│   │   ├── players.json        # 玩家数据
│   │   └── poker-favorites.json # 收藏玩家
│   ├── server.js               # Express服务器
│   ├── dataStore.js            # 数据存储模块
│   ├── package.json            # 后端依赖
│   ├── test-api.sh             # API测试脚本
│   ├── 启动后端服务器.command   # 后端启动脚本
│   └── README.md               # 后端文档
│
├── 启动全部服务.command         # 一键启动脚本
├── 停止所有服务.command         # 停止服务脚本
├── 检查服务状态.command         # 服务状态检查
└── README.md                   # 项目主文档
```

## 🚀 快速开始

### 方式一：一键启动（推荐）

双击 `启动全部服务.command` 文件，系统会自动：
1. 检查并安装依赖
2. 启动后端服务器（端口3001）
3. 启动前端服务器（端口3000）
4. 显示访问地址

### 方式二：分别启动

**启动后端：**
```bash
cd backend
npm install  # 首次运行
npm start
```

**启动前端：**
```bash
cd frontend
npm install  # 首次运行
npm run dev
```

### 访问应用

打开浏览器访问：`http://localhost:3000`

## 📱 移动端使用

1. 确保手机和电脑在同一WiFi网络
2. 启动服务后查看终端显示的IP地址
3. 在手机浏览器访问：`http://[IP地址]:3000`
4. （可选）添加到主屏幕获得App体验

## 🎮 使用指南

### 当前游戏页面

1. **配置游戏**
   - 游戏名称自动生成
   - 设置小盲/大盲（默认1/2）
   - 设置Buy-in筹码量
   - 设置筹码与现金比率

2. **添加玩家**
   - 输入玩家姓名和Buy-in次数
   - 系统自动计算初始筹码

3. **游戏流程**
   - 点击"开始游戏"记录开始时间
   - 更新玩家最终筹码数
   - 点击"结束游戏"记录结束时间
   - 确认账目平衡后保存游戏

### 历史记录页面

1. **查看所有游戏** - 显示完整的游戏历史
2. **按玩家筛选** - 查看特定玩家的记录
3. **收藏玩家** - 点击星标收藏常用玩家
4. **查看详情** - 点击玩家姓名查看统计数据

## 💾 数据管理

### 数据存储
- **位置**: `backend/data/` 目录
- **格式**: JSON文件
- **文件**:
  - `games.json` - 游戏历史记录
  - `players.json` - 玩家数据
  - `poker-favorites.json` - 收藏玩家

### 数据备份
```bash
# 备份数据
cp -r backend/data backend/data_backup_$(date +%Y%m%d)

# 恢复数据
cp -r backend/data_backup_YYYYMMDD/* backend/data/
```

## 🔧 服务管理

### 检查服务状态
```bash
./检查服务状态.command
```

### 停止所有服务
```bash
./停止所有服务.command
```

### 手动停止
```bash
# 停止后端
pkill -f "node server.js"

# 停止前端
pkill -f "vite"
```

## 📡 API接口

### 基础信息
- **后端地址**: `http://localhost:3001/api`
- **前端地址**: `http://localhost:3000`
- **数据格式**: JSON

### 主要接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/health | 健康检查 |
| GET | /api/games | 获取游戏历史 |
| POST | /api/games | 添加游戏记录 |
| DELETE | /api/games/:id | 删除游戏记录 |
| GET | /api/players | 获取玩家数据 |
| PUT | /api/players | 更新玩家数据 |
| GET | /api/favorites | 获取收藏列表 |
| PUT | /api/favorites | 更新收藏列表 |

## 🛠️ 开发指南

### 环境要求
- Node.js 16+
- npm 或 yarn

### 开发命令
```bash
# 前端开发
cd frontend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview       # 预览生产版本

# 后端开发
cd backend
npm start            # 启动服务器
npm test             # 运行测试
```

### 代码结构
- **组件化**: 每个功能独立为React组件
- **模块化**: 工具函数和API调用分离
- **响应式**: 使用Tailwind CSS实现
- **类型安全**: 使用现代JavaScript特性

## 🔍 故障排查

### 常见问题

**1. 服务启动失败**
- 检查端口3000和3001是否被占用
- 确认Node.js版本兼容性
- 重新安装依赖：`rm -rf node_modules && npm install`

**2. 前端无法连接后端**
- 确认后端服务正常运行
- 检查CORS配置
- 查看浏览器控制台错误信息

**3. 数据没有保存**
- 检查`backend/data/`目录权限
- 查看后端日志文件
- 确认API请求成功

**4. 移动端无法访问**
- 确认设备在同一WiFi网络
- 检查防火墙设置
- 使用正确的IP地址（非localhost）

## 📈 版本历史

### v0.0.1 (2025-10-28)
- ✅ 初始版本发布
- ✅ 前后端分离架构
- ✅ 完整的游戏记录功能
- ✅ 玩家统计和分析
- ✅ 响应式设计
- ✅ 多设备数据同步

## 🤝 贡献

欢迎提交Issue!

## 📄 许可证

MIT License

---

**德州扑克积分统计系统 v0.0.1**  
*让每一局游戏都有数据可循*