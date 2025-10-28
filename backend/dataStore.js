// dataStore.js - 基于JSON文件的数据存储模块
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const GAME_PLAYERS_FILE = path.join(DATA_DIR, 'gamePlayers.json');
const FAVORITES_FILE = path.join(DATA_DIR, 'poker-favorites.json');

// 保留旧文件路径用于迁移
const HISTORY_FILE = path.join(DATA_DIR, 'poker-history.json');

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// 读取JSON文件
async function readJSONFile(filePath, defaultValue = null) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return defaultValue;
    }
    throw error;
  }
}

// 写入JSON文件
async function writeJSONFile(filePath, data) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// 生成唯一ID
function generateId(prefix = '') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 导出的数据存储API
export const dataStore = {
  // ==================== 玩家相关操作 ====================
  
  // 获取所有玩家
  async getPlayers() {
    return await readJSONFile(PLAYERS_FILE, []);
  },

  // 根据ID获取玩家
  async getPlayerById(playerId) {
    const players = await this.getPlayers();
    return players.find(player => player.id === playerId);
  },

  // 添加玩家
  async addPlayer(playerData) {
    const players = await this.getPlayers();
    const newPlayer = {
      id: generateId('player'),
      name: playerData.name,
      nickname: playerData.nickname || '',
      avatar: playerData.avatar || '',
      phone: playerData.phone || '',
      email: playerData.email || '',
      notes: playerData.notes || '',
      isFavorite: playerData.isFavorite || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalGames: 0,
      totalBuyIns: 0,
      totalProfit: 0
    };
    
    const newPlayers = [newPlayer, ...players];
    await writeJSONFile(PLAYERS_FILE, newPlayers);
    return newPlayer;
  },

  // 更新玩家
  async updatePlayer(playerId, updateData) {
    const players = await this.getPlayers();
    const playerIndex = players.findIndex(player => player.id === playerId);
    
    if (playerIndex === -1) {
      throw new Error('玩家不存在');
    }
    
    players[playerIndex] = {
      ...players[playerIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSONFile(PLAYERS_FILE, players);
    return players[playerIndex];
  },

  // 删除玩家
  async deletePlayer(playerId) {
    const players = await this.getPlayers();
    const newPlayers = players.filter(player => player.id !== playerId);
    await writeJSONFile(PLAYERS_FILE, newPlayers);
    
    // 同时删除相关的游戏玩家记录
    const gamePlayers = await this.getGamePlayers();
    const newGamePlayers = gamePlayers.filter(gp => gp.playerId !== playerId);
    await writeJSONFile(GAME_PLAYERS_FILE, newGamePlayers);
    
    return newPlayers;
  },

  // ==================== 游戏相关操作 ====================
  
  // 获取所有游戏
  async getGames() {
    return await readJSONFile(GAMES_FILE, []);
  },

  // 根据ID获取游戏
  async getGameById(gameId) {
    const games = await this.getGames();
    return games.find(game => game.id === gameId);
  },

  // 添加游戏
  async addGame(gameData) {
    const games = await this.getGames();
    const newGame = {
      id: generateId('game'),
      gameName: gameData.gameName,
      date: gameData.date || new Date().toISOString(),
      smallBlind: gameData.smallBlind,
      bigBlind: gameData.bigBlind,
      chipValue: gameData.chipValue,
      buyInChips: gameData.buyInChips,
      sessionMinutes: gameData.sessionMinutes || 0,
      startTime: gameData.startTime || new Date().toISOString(),
      endTime: gameData.endTime || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newGames = [newGame, ...games];
    await writeJSONFile(GAMES_FILE, newGames);
    return newGame;
  },

  // 更新游戏
  async updateGame(gameId, updateData) {
    const games = await this.getGames();
    const gameIndex = games.findIndex(game => game.id === gameId);
    
    if (gameIndex === -1) {
      throw new Error('游戏不存在');
    }
    
    games[gameIndex] = {
      ...games[gameIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSONFile(GAMES_FILE, games);
    return games[gameIndex];
  },

  // 删除游戏
  async deleteGame(gameId) {
    const games = await this.getGames();
    const newGames = games.filter(game => game.id !== gameId);
    await writeJSONFile(GAMES_FILE, newGames);
    
    // 同时删除相关的游戏玩家记录
    const gamePlayers = await this.getGamePlayers();
    const newGamePlayers = gamePlayers.filter(gp => gp.gameId !== gameId);
    await writeJSONFile(GAME_PLAYERS_FILE, newGamePlayers);
    
    return newGames;
  },

  // ==================== 游戏玩家关联操作 ====================
  
  // 获取所有游戏玩家记录
  async getGamePlayers() {
    return await readJSONFile(GAME_PLAYERS_FILE, []);
  },

  // 根据游戏ID获取玩家记录
  async getGamePlayersByGameId(gameId) {
    const gamePlayers = await this.getGamePlayers();
    return gamePlayers.filter(gp => gp.gameId === gameId);
  },

  // 根据玩家ID获取游戏记录
  async getGamePlayersByPlayerId(playerId) {
    const gamePlayers = await this.getGamePlayers();
    return gamePlayers.filter(gp => gp.playerId === playerId);
  },

  // 添加游戏玩家记录
  async addGamePlayer(gamePlayerData) {
    const gamePlayers = await this.getGamePlayers();
    const newGamePlayer = {
      id: generateId('gp'),
      gameId: gamePlayerData.gameId,
      playerId: gamePlayerData.playerId,
      buyIns: gamePlayerData.buyIns,
      endChips: gamePlayerData.endChips,
      profit: gamePlayerData.profit || (gamePlayerData.endChips - gamePlayerData.buyIns * gamePlayerData.buyInChips),
      position: gamePlayerData.position || 0,
      notes: gamePlayerData.notes || ''
    };
    
    const newGamePlayers = [newGamePlayer, ...gamePlayers];
    await writeJSONFile(GAME_PLAYERS_FILE, newGamePlayers);
    
    // 更新玩家统计信息
    await this.updatePlayerStats(gamePlayerData.playerId);
    
    return newGamePlayer;
  },

  // 更新游戏玩家记录
  async updateGamePlayer(gamePlayerId, updateData) {
    const gamePlayers = await this.getGamePlayers();
    const gamePlayerIndex = gamePlayers.findIndex(gp => gp.id === gamePlayerId);
    
    if (gamePlayerIndex === -1) {
      throw new Error('游戏玩家记录不存在');
    }
    
    const oldPlayerId = gamePlayers[gamePlayerIndex].playerId;
    gamePlayers[gamePlayerIndex] = {
      ...gamePlayers[gamePlayerIndex],
      ...updateData
    };
    
    await writeJSONFile(GAME_PLAYERS_FILE, gamePlayers);
    
    // 更新玩家统计信息
    await this.updatePlayerStats(oldPlayerId);
    if (updateData.playerId && updateData.playerId !== oldPlayerId) {
      await this.updatePlayerStats(updateData.playerId);
    }
    
    return gamePlayers[gamePlayerIndex];
  },

  // 删除游戏玩家记录
  async deleteGamePlayer(gamePlayerId) {
    const gamePlayers = await this.getGamePlayers();
    const gamePlayerIndex = gamePlayers.findIndex(gp => gp.id === gamePlayerId);
    
    if (gamePlayerIndex === -1) {
      throw new Error('游戏玩家记录不存在');
    }
    
    const playerId = gamePlayers[gamePlayerIndex].playerId;
    const newGamePlayers = gamePlayers.filter(gp => gp.id !== gamePlayerId);
    await writeJSONFile(GAME_PLAYERS_FILE, newGamePlayers);
    
    // 更新玩家统计信息
    await this.updatePlayerStats(playerId);
    
    return newGamePlayers;
  },

  // 更新玩家统计信息
  async updatePlayerStats(playerId) {
    const gamePlayers = await this.getGamePlayersByPlayerId(playerId);
    const games = await this.getGames();
    
    let totalGames = 0;
    let totalBuyIns = 0;
    let totalProfit = 0;
    
    // 计算统计信息
    const gameIds = [...new Set(gamePlayers.map(gp => gp.gameId))];
    totalGames = gameIds.length;
    
    gamePlayers.forEach(gp => {
      const game = games.find(g => g.id === gp.gameId);
      if (game) {
        totalBuyIns += gp.buyIns * game.buyInChips;
        totalProfit += gp.profit;
      }
    });
    
    // 更新玩家信息
    await this.updatePlayer(playerId, {
      totalGames,
      totalBuyIns,
      totalProfit
    });
  },

  // ==================== 收藏列表相关操作 ====================
  
  // 获取收藏列表
  async getFavorites() {
    return await readJSONFile(FAVORITES_FILE, []);
  },

  // 保存收藏列表
  async saveFavorites(favorites) {
    await writeJSONFile(FAVORITES_FILE, favorites);
    return favorites;
  },

  // ==================== 兼容性接口（保持向后兼容） ====================
  
  // 获取历史记录（兼容旧接口）
  async getHistory() {
    const games = await this.getGames();
    const gamePlayers = await this.getGamePlayers();
    const players = await this.getPlayers();
    
    return games.map(game => {
      const gamePlayerRecords = gamePlayers.filter(gp => gp.gameId === game.id);
      const gamePlayersWithDetails = gamePlayerRecords.map(gp => {
        const player = players.find(p => p.id === gp.playerId);
        return {
          id: gp.id,
          name: player ? player.name : '未知玩家',
          buyIns: gp.buyIns,
          endChips: gp.endChips,
          profit: gp.profit,
          position: gp.position,
          notes: gp.notes
        };
      });
      
      return {
        id: game.id,
        gameName: game.gameName,
        date: game.date,
        smallBlind: game.smallBlind,
        bigBlind: game.bigBlind,
        chipValue: game.chipValue,
        buyInChips: game.buyInChips,
        sessionMinutes: game.sessionMinutes,
        startTime: game.startTime,
        endTime: game.endTime,
        players: gamePlayersWithDetails
      };
    });
  },

  // 添加游戏记录（兼容旧接口）
  async addGameCompat(gameData) {
    // 如果是旧格式数据，进行转换
    if (gameData.players && Array.isArray(gameData.players)) {
      const games = await this.getGames();
      const newGame = {
        id: generateId('game'),
        gameName: gameData.gameName,
        date: gameData.date || new Date().toISOString(),
        smallBlind: gameData.smallBlind,
        bigBlind: gameData.bigBlind,
        chipValue: gameData.chipValue,
        buyInChips: gameData.buyInChips,
        sessionMinutes: gameData.sessionMinutes || 0,
        startTime: gameData.startTime || new Date().toISOString(),
        endTime: gameData.endTime || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const newGames = [newGame, ...games];
      await writeJSONFile(GAMES_FILE, newGames);
      
      // 添加玩家记录
      for (const playerData of gameData.players) {
        // 查找或创建玩家
        let player = await this.getPlayerById(playerData.id);
        if (!player) {
          player = await this.addPlayer({
            name: playerData.name,
            isFavorite: false
          });
        }
        
        // 添加游戏玩家记录
        await this.addGamePlayer({
          gameId: newGame.id,
          playerId: player.id,
          buyIns: playerData.buyIns,
          endChips: playerData.endChips,
          position: playerData.position || 0,
          notes: playerData.notes || ''
        });
      }
      
      return newGame;
    } else {
      // 新格式数据，直接添加
      return await this.addGame(gameData);
    }
  },

  // 保存历史记录（兼容旧接口）
  async saveHistory(history) {
    // 清空现有数据
    await writeJSONFile(PLAYERS_FILE, []);
    await writeJSONFile(GAMES_FILE, []);
    await writeJSONFile(GAME_PLAYERS_FILE, []);
    
    // 重新添加所有数据
    for (const gameData of history) {
      await this.addGameCompat(gameData);
    }
    
    return history;
  }
};

