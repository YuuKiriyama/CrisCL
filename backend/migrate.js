// migrate.js - 数据迁移脚本
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dataStore } from './dataStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'poker-history.json');

// 检查是否需要迁移
async function needsMigration() {
  try {
    // 检查新表是否存在
    const playersFile = path.join(DATA_DIR, 'players.json');
    const gamesFile = path.join(DATA_DIR, 'games.json');
    const gamePlayersFile = path.join(DATA_DIR, 'gamePlayers.json');
    
    await fs.access(playersFile);
    await fs.access(gamesFile);
    await fs.access(gamePlayersFile);
    
    // 如果新表都存在，检查是否有数据
    const players = await dataStore.getPlayers();
    const games = await dataStore.getGames();
    
    return players.length === 0 && games.length === 0;
  } catch {
    // 新表不存在，需要迁移
    return true;
  }
}

// 执行数据迁移
async function migrateData() {
  try {
    console.log('🔄 开始数据迁移...');
    
    // 检查是否需要迁移
    if (!(await needsMigration())) {
      console.log('✅ 数据已是最新格式，无需迁移');
      return;
    }
    
    // 读取旧数据
    let oldHistory = [];
    try {
      const historyData = await fs.readFile(HISTORY_FILE, 'utf-8');
      oldHistory = JSON.parse(historyData);
      console.log(`📊 发现 ${oldHistory.length} 条历史记录需要迁移`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📊 没有发现旧数据文件，创建新的数据结构');
        return;
      }
      throw error;
    }
    
    if (oldHistory.length === 0) {
      console.log('📊 旧数据为空，创建新的数据结构');
      return;
    }
    
    // 迁移数据
    let migratedGames = 0;
    let migratedPlayers = 0;
    
    for (const gameData of oldHistory) {
      try {
        // 添加游戏记录
        const game = await dataStore.addGame({
          gameName: gameData.gameName,
          date: gameData.date,
          smallBlind: gameData.smallBlind,
          bigBlind: gameData.bigBlind,
          chipValue: gameData.chipValue,
          buyInChips: gameData.buyInChips,
          sessionMinutes: gameData.sessionMinutes,
          startTime: gameData.startTime,
          endTime: gameData.endTime
        });
        
        migratedGames++;
        
        // 处理玩家数据
        if (gameData.players && Array.isArray(gameData.players)) {
          for (const playerData of gameData.players) {
            try {
              // 查找或创建玩家
              let player = await dataStore.getPlayerById(playerData.id);
              if (!player) {
                player = await dataStore.addPlayer({
                  name: playerData.name,
                  isFavorite: false
                });
                migratedPlayers++;
              }
              
              // 添加游戏玩家记录
              await dataStore.addGamePlayer({
                gameId: game.id,
                playerId: player.id,
                buyIns: playerData.buyIns,
                endChips: playerData.endChips,
                position: playerData.position || 0,
                notes: playerData.notes || ''
              });
            } catch (error) {
              console.error(`❌ 迁移玩家记录失败: ${playerData.name}`, error.message);
            }
          }
        }
      } catch (error) {
        console.error(`❌ 迁移游戏记录失败: ${gameData.gameName}`, error.message);
      }
    }
    
    console.log(`✅ 数据迁移完成！`);
    console.log(`   - 迁移游戏: ${migratedGames} 条`);
    console.log(`   - 迁移玩家: ${migratedPlayers} 个`);
    
    // 备份旧文件
    const backupFile = path.join(DATA_DIR, `poker-history-backup-${Date.now()}.json`);
    await fs.copyFile(HISTORY_FILE, backupFile);
    console.log(`📁 旧数据已备份到: ${path.basename(backupFile)}`);
    
  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本，执行迁移
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData()
    .then(() => {
      console.log('🎉 迁移脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 迁移脚本执行失败:', error);
      process.exit(1);
    });
}

export { migrateData };
