# 德州扑克积分统计系统 - 前端

## 📦 技术栈

- **框架**: React 18
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: React Hooks

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

#### 方式一：使用启动脚本
```bash
./启动开发服务器.command
```

#### 方式二：使用命令行
```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动

### 3. 构建生产版本

```bash
npm run build
```

构建输出在 `dist/` 目录

### 4. 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
frontend/
├── src/                      # 源代码
│   ├── components/          # React组件
│   │   ├── Icons.jsx       # SVG图标组件
│   │   ├── CurrentGame.jsx # 当前游戏视图
│   │   ├── History.jsx     # 历史记录视图
│   │   └── PlayerDetail.jsx # 玩家详情视图
│   ├── utils/              # 工具函数
│   │   ├── storage.js      # API存储封装
│   │   └── helpers.js      # 辅助函数
│   ├── App.jsx             # 主应用组件
│   ├── main.jsx            # 入口文件
│   └── index.css           # 全局样式
├── index.html              # 入口HTML
├── package.json            # 依赖配置
├── vite.config.js          # Vite配置
├── tailwind.config.js      # Tailwind配置
├── postcss.config.js       # PostCSS配置
└── 启动开发服务器.command   # 启动脚本
```

## 🔧 配置说明

### 修改端口

在 `vite.config.js` 中修改：
```javascript
export default defineConfig({
  server: {
    port: 3000,  // 改为你想要的端口
    host: '0.0.0.0'
  }
})
```

### 修改后端API地址

在 `src/utils/storage.js` 中修改：
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

生产环境建议使用环境变量：
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

然后创建 `.env.production` 文件：
```
VITE_API_URL=https://your-api-domain.com/api
```

## 📱 移动端访问

### 局域网访问

1. 启动开发服务器后，查看控制台输出的网络地址
2. 确保手机和电脑在同一WiFi网络
3. 在手机浏览器输入网络地址（如 `http://192.168.31.205:3000`）

### PWA支持

应用支持PWA，可以添加到手机主屏幕：
1. 在手机浏览器打开应用
2. Safari: 点击分享 -> 添加到主屏幕
3. Chrome: 点击菜单 -> 添加到主屏幕

## 🐛 常见问题

### Q: 无法连接后端？
A: 
1. 确保后端服务器在 `http://localhost:3001` 运行
2. 检查浏览器控制台是否有CORS错误
3. 检查 `src/utils/storage.js` 中的API地址

### Q: 样式没有生效？
A: 
1. 清除浏览器缓存
2. 确保 Tailwind CSS 已正确配置
3. 检查 `index.css` 是否正确导入

### Q: 热更新不工作？
A: 
1. 重启开发服务器
2. 检查是否有文件监听权限问题
3. 尝试删除 `node_modules` 重新安装

## 📝 开发注意事项

1. **组件拆分**: 每个组件职责单一，便于维护
2. **Props传递**: 使用解构赋值，明确组件依赖
3. **状态管理**: 状态提升到App组件，子组件通过props接收
4. **API调用**: 统一在storage.js中封装，组件不直接调用API
5. **响应式设计**: 使用Tailwind的响应式类名（sm:, md:, lg:等）

## 🎨 样式规范

- 使用 Tailwind CSS 工具类
- 避免内联样式
- 自定义样式放在 `index.css`
- 颜色主题：
  - 主色：绿色 (green-600)
  - 成功：绿色 (green-50, green-600)
  - 警告/错误：红色 (red-50, red-600)
  - 中性：灰色 (gray-50 到 gray-800)

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

### 部署到静态托管平台

1. **Netlify**
   - 拖拽 `dist/` 文件夹到 Netlify
   - 或连接 Git 仓库自动部署

2. **Vercel**
   - 连接 Git 仓库
   - 设置构建命令: `npm run build`
   - 设置输出目录: `dist`

3. **GitHub Pages**
   ```bash
   npm run build
   # 将 dist/ 目录推送到 gh-pages 分支
   ```

### 环境变量配置

创建 `.env.production` 文件：
```
VITE_API_URL=https://your-backend-api.com/api
```

## 📚 相关文档

- [React 文档](https://react.dev/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

