// helpers.js - 辅助函数

// 生成游戏名称（基于日期和星期）
export const generateGameName = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[now.getDay()];
  return `${month}/${day}/${year} ${weekday}`;
};

// 格式化时长
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}分钟`;
  if (mins === 0) return `${hours}小时`;
  return `${hours}小时${mins}分钟`;
};

// 格式化实时计时（从开始时间到现在）
export const formatElapsedTime = (startTime) => {
  if (!startTime) return '00:00:00';
  const now = new Date();
  const start = new Date(startTime);
  const elapsedMs = now - start;
  
  const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// 计算时长（分钟）
export const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end - start) / (1000 * 60));
};

// 计算玩家盈亏
export const calculateProfitLoss = (player, buyInChips, chipValue, bigBlind) => {
  const totalBuyInChips = (player.buyIns || 0) * (buyInChips || 0);
  const profitChips = (player.endChips || 0) - totalBuyInChips;
  const profitMoney = (profitChips / (chipValue || 1)).toFixed(2);
  const profitBB = (profitChips / (bigBlind || 1)).toFixed(1);
  
  return {
    profitChips,
    profitMoney: parseFloat(profitMoney),
    profitBB: parseFloat(profitBB)
  };
};

// 计算账目平衡
export const calculateBalance = (players, buyInChips) => {
  const totalBuyIn = players.reduce((sum, p) => sum + ((p.buyIns || 0) * (buyInChips || 0)), 0);
  const totalEndChips = players.reduce((sum, p) => sum + (p.endChips || 0), 0);
  const difference = totalEndChips - totalBuyIn;
  const isBalanced = difference === 0;
  
  return {
    totalBuyIn,
    totalEndChips,
    difference,
    isBalanced
  };
};

// 生成唯一ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

