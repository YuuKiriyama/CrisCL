import { useState } from 'react';
import { Icons } from './Icons';
import { calculateProfitLoss, calculateBalance } from '../utils/helpers';

function CurrentGame({
  gameName, setGameName,
  smallBlind, handleSmallBlindChange,
  bigBlind, handleBigBlindChange,
  buyInChips, setBuyInChips,
  chipValue, setChipValue,
  gameStatus,
  elapsedTime,
  playerName, setPlayerName,
  buyIns, setBuyIns,
  addPlayer,
  players,
  updatePlayerBuyIns,
  updatePlayerEndChips,
  removePlayer,
  startGame,
  endGame,
  saveGame
}) {
  const balance = calculateBalance(players, buyInChips);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);

  const handleAddPlayer = async () => {
    if (isAddingPlayer) return;
    
    setIsAddingPlayer(true);
    try {
      await addPlayer();
    } finally {
      // 使用 setTimeout 确保状态更新完成后再重置按钮状态
      setTimeout(() => {
        setIsAddingPlayer(false);
      }, 100);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      {/* 游戏状态提示 */}
      {gameStatus !== 'notStarted' && (
        <div className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
          gameStatus === 'playing' 
            ? 'bg-blue-50 border border-blue-200' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            {gameStatus === 'playing' ? (
              <span className="w-6 h-6 text-blue-600"><Icons.Play /></span>
            ) : (
              <span className="w-6 h-6 text-gray-600"><Icons.Square /></span>
            )}
            <div>
              <p className={`font-semibold ${gameStatus === 'playing' ? 'text-blue-800' : 'text-gray-800'}`}>
                {gameStatus === 'playing' ? '游戏进行中' : '游戏已结束'}
              </p>
            </div>
          </div>
          {gameStatus === 'playing' && (
            <div className="text-right">
              <p className="text-sm text-blue-600 font-medium">游戏时长</p>
              <p className="text-2xl font-mono font-bold text-blue-800">{elapsedTime}</p>
            </div>
          )}
        </div>
      )}

      {/* 游戏配置 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            游戏名称
          </label>
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="例如：周五夜局"
            disabled={gameStatus === 'playing' || gameStatus === 'ended'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            小盲/大盲
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={smallBlind}
              onChange={(e) => handleSmallBlindChange(e.target.value)}
              placeholder="小盲"
              disabled={gameStatus === 'playing' || gameStatus === 'ended'}
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <input
              type="number"
              value={bigBlind}
              onChange={(e) => handleBigBlindChange(e.target.value)}
              placeholder="大盲"
              disabled={gameStatus === 'playing' || gameStatus === 'ended'}
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            每个Buy-in筹码量
          </label>
          <input
            type="number"
            value={buyInChips}
            onChange={(e) => setBuyInChips(e.target.value === '' ? '' : (parseInt(e.target.value) || 0))}
            placeholder="例如：200"
            disabled={gameStatus === 'playing' || gameStatus === 'ended'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            筹码与真钱比率（多少筹码=1元）
          </label>
          <input
            type="number"
            value={chipValue}
            onChange={(e) => setChipValue(e.target.value === '' ? '' : (parseInt(e.target.value) || 1))}
            placeholder="例如：10"
            disabled={gameStatus === 'playing' || gameStatus === 'ended'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* 添加玩家 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">添加玩家</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isAddingPlayer && handleAddPlayer()}
            placeholder="玩家姓名"
            disabled={isAddingPlayer}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <input
            type="number"
            value={buyIns}
            onChange={(e) => setBuyIns(e.target.value === '' ? '' : (parseInt(e.target.value) || 1))}
            placeholder="Buy-in次数"
            min="1"
            disabled={isAddingPlayer}
            className="w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAddPlayer}
            disabled={isAddingPlayer}
            className={`w-full sm:w-auto px-6 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition-colors ${
              isAddingPlayer 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <span className="w-5 h-5"><Icons.Plus /></span>
            {isAddingPlayer ? '添加中...' : '添加'}
          </button>
        </div>
      </div>

      {/* 玩家列表 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">玩家列表</h3>
        {players.length > 0 ? (
          <>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full border-collapse text-xs sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-left font-semibold">姓名</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold">Buy-in</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold hidden md:table-cell">买入</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold">最终</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold hidden md:table-cell">盈亏筹码</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold">盈亏$</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold hidden sm:table-cell">BB</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => {
                    const { profitChips, profitMoney, profitBB } = calculateProfitLoss(player, buyInChips, chipValue, bigBlind);
                    const totalBuyInChips = (player.buyIns || 0) * (buyInChips || 0);
                    return (
                      <tr key={player.id} className="border-b hover:bg-gray-50">
                        <td className="px-1 sm:px-4 py-2 sm:py-3 font-medium">{player.name}</td>
                        <td className="px-1 sm:px-4 py-2 sm:py-3 text-right">
                          <input
                            type="number"
                            value={player.buyIns}
                            onChange={(e) => updatePlayerBuyIns(player.id, e.target.value)}
                            min="1"
                            className="w-12 sm:w-20 px-1 sm:px-2 py-1 border border-gray-300 rounded text-right text-xs sm:text-base"
                          />
                        </td>
                        <td className="px-1 sm:px-4 py-2 sm:py-3 text-right hidden md:table-cell">{totalBuyInChips.toLocaleString()}</td>
                        <td className="px-1 sm:px-4 py-2 sm:py-3 text-right">
                          <input
                            type="number"
                            value={player.endChips}
                            onChange={(e) => updatePlayerEndChips(player.id, e.target.value)}
                            min="0"
                            placeholder="0"
                            className="w-16 sm:w-full px-1 sm:px-2 py-1 border border-gray-300 rounded text-right text-xs sm:text-base"
                          />
                        </td>
                        <td className={`px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold hidden md:table-cell ${profitChips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitChips > 0 ? '+' : ''}{profitChips.toLocaleString()}
                        </td>
                        <td className={`px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold ${profitMoney >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitMoney > 0 ? '+' : ''}${profitMoney}
                        </td>
                        <td className={`px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold hidden sm:table-cell ${profitBB >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitBB > 0 ? '+' : ''}{profitBB}
                        </td>
                        <td className="px-1 sm:px-4 py-2 sm:py-3">
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <span className="w-4 h-4 sm:w-5 sm:h-5 inline-block"><Icons.Trash2 /></span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold text-xs sm:text-base">
                    <td className="px-1 sm:px-4 py-2 sm:py-3">总计</td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3"></td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3 text-right hidden md:table-cell">{balance.totalBuyIn.toLocaleString()}</td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3 text-right">{balance.totalEndChips.toLocaleString()}</td>
                    <td className={`px-1 sm:px-4 py-2 sm:py-3 text-right hidden md:table-cell ${balance.difference === 0 ? 'text-gray-800' : 'text-red-600'}`}>
                      {balance.difference > 0 ? '+' : ''}{balance.difference.toLocaleString()}
                    </td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3"></td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3 hidden sm:table-cell"></td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 账目平衡提示 - 只在游戏开始后显示 */}
            {gameStatus !== 'notStarted' && (
              <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                balance.isBalanced 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {balance.isBalanced ? (
                  <>
                    <span className="w-6 h-6 text-green-600 flex-shrink-0"><Icons.CheckCircle /></span>
                    <div>
                      <p className="font-semibold text-green-800">账目平衡 ✓</p>
                      <p className="text-sm text-green-700">买入筹码总量与最终筹码总量一致</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="w-6 h-6 text-red-600 flex-shrink-0"><Icons.AlertCircle /></span>
                    <div>
                      <p className="font-semibold text-red-800">
                        账目不平！{balance.difference > 0 ? '多算了' : '少算了'} {Math.abs(balance.difference).toLocaleString()} 筹码
                      </p>
                      <p className="text-sm text-red-700">
                        {balance.difference > 0 
                          ? '最终筹码总量大于买入总量，请检查是否有输入错误'
                          : '最终筹码总量小于买入总量，请检查是否有遗漏'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>暂无玩家，请添加玩家</p>
          </div>
        )}
      </div>

      {/* 游戏控制按钮 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <button
          onClick={startGame}
          disabled={gameStatus !== 'notStarted'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <span className="w-5 h-5"><Icons.Play /></span>
          开始游戏
        </button>
        <button
          onClick={endGame}
          disabled={gameStatus !== 'playing'}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <span className="w-5 h-5"><Icons.Square /></span>
          结束游戏
        </button>
        <button
          onClick={saveGame}
          disabled={gameStatus !== 'ended'}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <span className="w-5 h-5"><Icons.Save /></span>
          保存游戏
        </button>
      </div>
    </div>
  );
}

export default CurrentGame;

