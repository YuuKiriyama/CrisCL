# 德州扑克积分统计系统

一个用于记录和统计德州扑克游戏数据的Web应用，支持移动端和桌面端。

## 📋 功能特性

- ✅ 游戏记录管理（开始、结束、保存）
- ✅ 玩家盈亏统计（筹码、现金、BB）
- ✅ 历史记录查询
- ✅ 玩家详情分析
- ✅ 收藏玩家功能
- ✅ 账目平衡检查
- ✅ 响应式设计（支持手机、平板、PC）
- ✅ PWA支持（可添加到主屏幕）
- ✅ 本地数据存储

## 🛠️ 技术栈

### 前端
- **框架**: React 18
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: React Hooks

### 后端
- **运行环境**: Node.js
- **Web框架**: Express
- **数据存储**: JSON文件
- **跨域支持**: CORS

## 📁 项目结构

```
CrisCL/
├── frontend/                # 前端应用
│   ├── src/                # 源代码
│   │   ├── components/     # React组件
│   │   │   ├── Icons.jsx       # SVG图标组件
│   │   │   ├── CurrentGame.jsx # 当前游戏视图
│   │   │   ├── History.jsx     # 历史记录视图
│   │   │   └── PlayerDetail.jsx # 玩家详情视图
│   │   ├── utils/          # 工具函数
│   │   │   ├── storage.js      # API存储封装
│   │   │   └── helpers.js      # 辅助函数
│   │   ├── App.jsx         # 主应用组件
│   │   ├── main.jsx        # 入口文件
│   │   └── index.css       # 全局样式
│   ├── index.html          # 入口HTML
│   ├── package.json        # 依赖配置
│   ├── vite.config.js      # Vite配置
│   ├── tailwind.config.js  # Tailwind配置
│   ├── postcss.config.js   # PostCSS配置
│   ├── 启动开发服务器.command  # 启动脚本
│   └── README.md           # 前端文档
├── backend/                # 后端服务器
│   ├── data/               # 数据存储目录（JSON文件）
│   ├── server.js           # Express服务器
│   ├── dataStore.js        # 数据存储模块
│   ├── package.json        # 依赖配置
│   ├── test-api.sh         # API测试脚本
│   ├── 启动后端服务器.command # 启动脚本
│   └── README.md           # 后端文档
├── 启动全部服务.command     # 一键启动脚本
├── 前后端分离说明.md        # 架构说明
├── 快速开始.txt            # 快速参考
└── README.md               # 项目文档
```

## 🚀 快速开始

### 方式一：使用启动脚本（推荐）

#### 1. 启动后端服务器
双击 `backend/启动后端服务器.command` 或：
```bash
cd backend
npm install  # 首次运行
npm start
```
后端将在 `http://localhost:3001` 启动

#### 2. 启动前端开发服务器
双击 `启动开发服务器.command` 或：
```bash
npm install  # 首次运行
npm run dev
```
前端将在 `http://localhost:3000` 启动

#### 3. 访问应用
打开浏览器访问：`http://localhost:3000`

### 方式二：使用命令行

#### 1. 安装所有依赖
```bash
# 安装前端依赖
cd frontend
npm install
cd ..

# 安装后端依赖
cd backend
npm install
cd ..
```

#### 2. 启动服务（需要两个终端窗口）

**终端1 - 后端服务器：**
```bash
cd backend
npm start
```

**终端2 - 前端开发服务器：**
```bash
cd frontend
npm run dev
```

### 3. 构建生产版本

```bash
cd frontend
npm run build
```

构建输出在 `frontend/dist/` 目录。

## 📱 移动端使用

### 方式1: 开发服务器（局域网访问）

1. 启动开发服务器：
```bash
npm run dev
```

2. 查看本机IP地址：
```bash
# macOS/Linux
ifconfig | grep "inet "
# Windows
ipconfig
```

3. 在手机浏览器访问：
```
http://[你的IP地址]:8080
```

4. （可选）添加到主屏幕以获得类似App的体验

### 方式2: 构建并部署

1. 构建项目：
```bash
npm run build
```

2. 将 `dist/` 目录部署到以下任一平台：
   - **GitHub Pages**: 免费静态网站托管
   - **Netlify**: 拖拽上传 dist 文件夹即可
   - **Vercel**: 自动部署
   - **Cloudflare Pages**: CDN加速

### 方式3: 使用单文件版本

如果不想安装Node.js环境，可以直接使用 `poker-tracker.html` 或 `index.html` 单文件版本：

1. 启动Python HTTP服务器：
```bash
# 使用提供的脚本
./启动服务器.command

# 或者手动启动
python3 -m http.server 8080 --bind 0.0.0.0
```

2. 在手机浏览器访问：
```
http://[你的IP地址]:8080/poker-tracker.html
```

## 🎮 使用说明

### 当前游戏页面

1. **配置游戏**
   - 游戏名称会自动生成（如"10月28日周二"）
   - 设置小盲/大盲（默认1/2）
   - 设置每个Buy-in筹码量（如200）
   - 设置筹码与真钱比率（如10筹码=1元）

2. **添加玩家**
   - 输入玩家姓名和Buy-in次数
   - 按回车或点击"添加"按钮

3. **游戏流程**
   - 点击"开始游戏"记录开始时间
   - 在游戏过程中可以继续添加玩家
   - 更新每个玩家的最终筹码数
   - 点击"结束游戏"记录结束时间
   - 确认账目平衡后点击"保存游戏"

4. **账目检查**
   - 系统会自动检查账目是否平衡
   - 绿色提示表示账目一致
   - 红色提示表示有差异，需要检查输入

### 历史记录页面

1. **查看所有游戏**
   - 显示所有已保存的游戏记录
   - 包含日期、时长、盲注等信息
   - 显示每局玩家的盈亏

2. **按玩家筛选**
   - 在下拉菜单选择玩家姓名
   - 查看该玩家的统计数据和历史记录

3. **收藏玩家**
   - 点击玩家名字旁的星标图标收藏
   - 收藏的玩家会显示在顶部快捷入口

4. **查看玩家详情**
   - 点击玩家姓名进入详情页
   - 查看完整的统计数据和游戏历史

## 💾 数据存储

### 当前版本（后端存储）
- 数据存储在后端服务器的JSON文件中
- 位置：`backend/data/`
  - `poker-history.json` - 游戏历史记录
  - `poker-favorites.json` - 收藏的玩家
- 支持多设备访问同一数据
- 建议定期备份 `backend/data/` 目录

### 数据备份
```bash
# 备份数据
cp -r backend/data backend/data_backup_$(date +%Y%m%d)

# 恢复数据
cp -r backend/data_backup_YYYYMMDD/* backend/data/
```

## 🐛 已知问题

- 首次访问需要清除浏览器缓存以加载最新版本
- iOS Safari可能需要添加到主屏幕才能获得最佳体验

## 📝 更新日志

### v2.0.0 (2025-10-28)
- ✅ **前后端分离架构**
- ✅ 创建Express后端服务器
- ✅ 使用JSON文件作为数据库
- ✅ 支持多设备访问同一数据
- ✅ 完整的RESTful API
- ✅ CORS跨域支持

### v1.0.0 (2025-10-28)
- ✅ 项目模块化重构
- ✅ 组件拆分（CurrentGame, History, PlayerDetail, Icons）
- ✅ 工具函数提取（storage, helpers）
- ✅ 使用Vite构建工具
- ✅ 支持开发热更新
- ✅ 优化移动端表格显示
- ✅ 修复盲注金额计算
- ✅ 添加游戏状态管理
- ✅ 改进账目平衡检查
- ✅ 修复端口冲突问题
- ✅ 移动端Buy-in列显示优化
- ✅ 账目平衡提示优化

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

