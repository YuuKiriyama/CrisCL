# 德州扑克积分统计系统 - 前端 v0.1.1

基于React + Vite的现代化前端应用，提供德州扑克游戏数据统计的用户界面。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
访问：`http://localhost:3000`

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🏗️ 技术栈

- **React 18** - UI框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **React Hooks** - 状态管理

## 📁 目录结构

```
src/
├── components/          # React组件
│   ├── CurrentGame.jsx  # 当前游戏页面
│   ├── History.jsx     # 历史记录页面
│   ├── PlayerDetail.jsx # 玩家详情页面
│   └── Icons.jsx       # SVG图标组件
├── utils/              # 工具函数
│   ├── storage.js      # API存储封装
│   └── helpers.js      # 辅助函数
├── App.jsx             # 主应用组件
├── main.jsx            # 应用入口
└── index.css           # 全局样式
```

## 🔧 开发指南

### 组件说明

**App.jsx** - 主应用组件
- 状态管理（游戏数据、历史记录、玩家列表）
- 视图切换逻辑

**CurrentGame.jsx** - 当前游戏页面
- 游戏配置界面
- 玩家管理
- 盈亏计算展示
- 游戏控制（开始/结束/保存）

**History.jsx** - 历史记录页面
- 历史记录列表
- 玩家筛选
- 统计数据展示
- 收藏玩家管理

**PlayerDetail.jsx** - 玩家详情页面
- 单个玩家详细信息
- 历史对局记录
- 统计图表

**Icons.jsx** - 图标组件
- 所有SVG图标组件
- 便于统一管理和复用

### 工具函数

**storage.js** - API存储封装
- 与后端API通信
- 数据持久化

**helpers.js** - 辅助函数
- 日期格式化
- 盈亏计算
- 时长计算
- 其他通用工具函数

## 📱 移动端支持

- 响应式设计，自动适配各种屏幕尺寸
- 支持触摸操作
- 可添加到主屏幕获得App体验

## 🔗 API集成

前端通过HTTP API与后端通信：
- **后端地址**: `http://localhost:3001/api`
- **数据格式**: JSON
- **跨域支持**: CORS已配置

## 🎨 样式指南

使用Tailwind CSS进行样式开发：
- 实用优先的CSS框架
- 响应式设计
- 组件化样式

## 🐛 常见问题

### 1. 开发服务器启动失败
```bash
# 清理缓存重试
rm -rf node_modules package-lock.json
npm install
```

### 2. 端口被占用
修改 `vite.config.js` 中的 port 值

### 3. 移动端无法访问
- 检查防火墙设置
- 确认WiFi网络相同
- 尝试使用本机IP地址

### 4. 修改代码不生效
- 检查文件是否保存
- 重启开发服务器
- 清除浏览器缓存

## 📈 构建和部署

### 构建生产版本
```bash
npm run build
```
输出到 `dist/` 目录

### 部署选项
- **静态托管**: Netlify, Vercel, GitHub Pages
- **CDN**: Cloudflare, AWS CloudFront
- **服务器**: Nginx, Apache

## 🔄 版本历史

### v0.1.1
- ✅ 游戏状态自动保存（localStorage）
- ✅ 移动端布局优化
- ✅ UI细节改进
- ✅ 输入验证优化

### v0.0.1
- ✅ 初始版本发布
- ✅ React 18 + Vite架构
- ✅ Tailwind CSS样式
- ✅ 响应式设计
- ✅ 组件化开发

---

**前端应用 v0.1.1**  
*现代化的德州扑克统计界面*