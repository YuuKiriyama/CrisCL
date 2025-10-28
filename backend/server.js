// server.js - Express服务器
import express from 'express';
import cors from 'cors';
import { dataStore } from './dataStore.js';
import { migrateData } from './migrate.js';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// ==================== 玩家相关接口 ====================

// 获取所有玩家
app.get('/api/players', async (req, res) => {
  try {
    const players = await dataStore.getPlayers();
    res.json({ success: true, data: players });
  } catch (error) {
    console.error('获取玩家列表失败:', error);
    res.status(500).json({ success: false, error: '获取玩家列表失败' });
  }
});

// 根据ID获取玩家
app.get('/api/players/:playerId', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const player = await dataStore.getPlayerById(playerId);
    if (!player) {
      return res.status(404).json({ success: false, error: '玩家不存在' });
    }
    res.json({ success: true, data: player });
  } catch (error) {
    console.error('获取玩家信息失败:', error);
    res.status(500).json({ success: false, error: '获取玩家信息失败' });
  }
});

// 添加玩家
app.post('/api/players', async (req, res) => {
  try {
    const playerData = req.body;
    const savedPlayer = await dataStore.addPlayer(playerData);
    res.json({ success: true, data: savedPlayer });
  } catch (error) {
    console.error('添加玩家失败:', error);
    res.status(500).json({ success: false, error: '添加玩家失败' });
  }
});

// 更新玩家
app.put('/api/players/:playerId', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const updateData = req.body;
    const updatedPlayer = await dataStore.updatePlayer(playerId, updateData);
    res.json({ success: true, data: updatedPlayer });
  } catch (error) {
    console.error('更新玩家失败:', error);
    res.status(500).json({ success: false, error: '更新玩家失败' });
  }
});

// 删除玩家
app.delete('/api/players/:playerId', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const newPlayers = await dataStore.deletePlayer(playerId);
    res.json({ success: true, data: newPlayers });
  } catch (error) {
    console.error('删除玩家失败:', error);
    res.status(500).json({ success: false, error: '删除玩家失败' });
  }
});

// ==================== 游戏相关接口 ====================

// 获取所有游戏
app.get('/api/games', async (req, res) => {
  try {
    const games = await dataStore.getGames();
    res.json({ success: true, data: games });
  } catch (error) {
    console.error('获取游戏列表失败:', error);
    res.status(500).json({ success: false, error: '获取游戏列表失败' });
  }
});

// 根据ID获取游戏
app.get('/api/games/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await dataStore.getGameById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, error: '游戏不存在' });
    }
    res.json({ success: true, data: game });
  } catch (error) {
    console.error('获取游戏信息失败:', error);
    res.status(500).json({ success: false, error: '获取游戏信息失败' });
  }
});

// 添加游戏
app.post('/api/games', async (req, res) => {
  try {
    const gameData = req.body;
    const savedGame = await dataStore.addGame(gameData);
    res.json({ success: true, data: savedGame });
  } catch (error) {
    console.error('添加游戏失败:', error);
    res.status(500).json({ success: false, error: '添加游戏失败' });
  }
});

// 更新游戏
app.put('/api/games/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const updateData = req.body;
    const updatedGame = await dataStore.updateGame(gameId, updateData);
    res.json({ success: true, data: updatedGame });
  } catch (error) {
    console.error('更新游戏失败:', error);
    res.status(500).json({ success: false, error: '更新游戏失败' });
  }
});

// 删除游戏
app.delete('/api/games/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const newGames = await dataStore.deleteGame(gameId);
    res.json({ success: true, data: newGames });
  } catch (error) {
    console.error('删除游戏失败:', error);
    res.status(500).json({ success: false, error: '删除游戏失败' });
  }
});

// ==================== 游戏玩家关联接口 ====================

// 获取游戏的所有玩家记录
app.get('/api/games/:gameId/players', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const gamePlayers = await dataStore.getGamePlayersByGameId(gameId);
    res.json({ success: true, data: gamePlayers });
  } catch (error) {
    console.error('获取游戏玩家记录失败:', error);
    res.status(500).json({ success: false, error: '获取游戏玩家记录失败' });
  }
});

// 获取玩家的所有游戏记录
app.get('/api/players/:playerId/games', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const gamePlayers = await dataStore.getGamePlayersByPlayerId(playerId);
    res.json({ success: true, data: gamePlayers });
  } catch (error) {
    console.error('获取玩家游戏记录失败:', error);
    res.status(500).json({ success: false, error: '获取玩家游戏记录失败' });
  }
});

// 添加游戏玩家记录
app.post('/api/game-players', async (req, res) => {
  try {
    const gamePlayerData = req.body;
    const savedGamePlayer = await dataStore.addGamePlayer(gamePlayerData);
    res.json({ success: true, data: savedGamePlayer });
  } catch (error) {
    console.error('添加游戏玩家记录失败:', error);
    res.status(500).json({ success: false, error: '添加游戏玩家记录失败' });
  }
});

// 更新游戏玩家记录
app.put('/api/game-players/:gamePlayerId', async (req, res) => {
  try {
    const gamePlayerId = req.params.gamePlayerId;
    const updateData = req.body;
    const updatedGamePlayer = await dataStore.updateGamePlayer(gamePlayerId, updateData);
    res.json({ success: true, data: updatedGamePlayer });
  } catch (error) {
    console.error('更新游戏玩家记录失败:', error);
    res.status(500).json({ success: false, error: '更新游戏玩家记录失败' });
  }
});

// 删除游戏玩家记录
app.delete('/api/game-players/:gamePlayerId', async (req, res) => {
  try {
    const gamePlayerId = req.params.gamePlayerId;
    const newGamePlayers = await dataStore.deleteGamePlayer(gamePlayerId);
    res.json({ success: true, data: newGamePlayers });
  } catch (error) {
    console.error('删除游戏玩家记录失败:', error);
    res.status(500).json({ success: false, error: '删除游戏玩家记录失败' });
  }
});

// ==================== 兼容性接口（保持向后兼容） ====================

// 获取所有历史记录（兼容旧接口）
app.get('/api/history', async (req, res) => {
  try {
    const history = await dataStore.getHistory();
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('获取历史记录失败:', error);
    res.status(500).json({ success: false, error: '获取历史记录失败' });
  }
});

// 添加新游戏记录（兼容旧接口）
app.post('/api/history', async (req, res) => {
  try {
    const game = req.body;
    const savedGame = await dataStore.addGameCompat(game);
    res.json({ success: true, data: savedGame });
  } catch (error) {
    console.error('添加游戏记录失败:', error);
    res.status(500).json({ success: false, error: '添加游戏记录失败' });
  }
});

// 删除游戏记录（兼容旧接口）
app.delete('/api/history/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const newHistory = await dataStore.deleteGame(gameId);
    res.json({ success: true, data: newHistory });
  } catch (error) {
    console.error('删除游戏记录失败:', error);
    res.status(500).json({ success: false, error: '删除游戏记录失败' });
  }
});

// 更新所有历史记录（用于批量操作，兼容旧接口）
app.put('/api/history', async (req, res) => {
  try {
    const history = req.body;
    const savedHistory = await dataStore.saveHistory(history);
    res.json({ success: true, data: savedHistory });
  } catch (error) {
    console.error('更新历史记录失败:', error);
    res.status(500).json({ success: false, error: '更新历史记录失败' });
  }
});

// ==================== 收藏列表相关接口 ====================

// 获取收藏列表
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await dataStore.getFavorites();
    res.json({ success: true, data: favorites });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({ success: false, error: '获取收藏列表失败' });
  }
});

// 更新收藏列表
app.put('/api/favorites', async (req, res) => {
  try {
    const favorites = req.body;
    const savedFavorites = await dataStore.saveFavorites(favorites);
    res.json({ success: true, data: savedFavorites });
  } catch (error) {
    console.error('更新收藏列表失败:', error);
    res.status(500).json({ success: false, error: '更新收藏列表失败' });
  }
});

// 启动服务器
async function startServer() {
  try {
    // 执行数据迁移
    await migrateData();
    
    // 启动服务器
    app.listen(PORT, '0.0.0.0', () => {
      console.log('====================================');
      console.log('  德州扑克积分统计系统 - 后端服务器');
      console.log('====================================');
      console.log('');
      console.log(`✅ 服务器启动成功！`);
      console.log('');
      console.log(`📡 API地址: http://localhost:${PORT}`);
      console.log(`📡 网络地址: http://0.0.0.0:${PORT}`);
      console.log('');
      console.log('API接口:');
      console.log(`  GET    /api/health            - 健康检查`);
      console.log('');
      console.log('玩家相关接口:');
      console.log(`  GET    /api/players           - 获取所有玩家`);
      console.log(`  GET    /api/players/:id       - 获取玩家详情`);
      console.log(`  POST   /api/players           - 添加玩家`);
      console.log(`  PUT    /api/players/:id       - 更新玩家`);
      console.log(`  DELETE /api/players/:id       - 删除玩家`);
      console.log('');
      console.log('游戏相关接口:');
      console.log(`  GET    /api/games             - 获取所有游戏`);
      console.log(`  GET    /api/games/:id         - 获取游戏详情`);
      console.log(`  POST   /api/games             - 添加游戏`);
      console.log(`  PUT    /api/games/:id         - 更新游戏`);
      console.log(`  DELETE /api/games/:id         - 删除游戏`);
      console.log('');
      console.log('游戏玩家关联接口:');
      console.log(`  GET    /api/games/:id/players - 获取游戏玩家记录`);
      console.log(`  GET    /api/players/:id/games - 获取玩家游戏记录`);
      console.log(`  POST   /api/game-players      - 添加游戏玩家记录`);
      console.log(`  PUT    /api/game-players/:id  - 更新游戏玩家记录`);
      console.log(`  DELETE /api/game-players/:id  - 删除游戏玩家记录`);
      console.log('');
      console.log('兼容性接口:');
      console.log(`  GET    /api/history           - 获取历史记录（兼容）`);
      console.log(`  POST   /api/history           - 添加游戏记录（兼容）`);
      console.log(`  PUT    /api/history           - 更新所有历史记录（兼容）`);
      console.log(`  DELETE /api/history/:gameId   - 删除游戏记录（兼容）`);
      console.log(`  GET    /api/favorites         - 获取收藏列表`);
      console.log(`  PUT    /api/favorites         - 更新收藏列表`);
      console.log('');
      console.log('====================================');
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer();

