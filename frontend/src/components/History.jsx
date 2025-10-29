import { useState } from 'react';
import { Icons } from './Icons';
import { calculateProfitLoss, formatDuration } from '../utils/helpers';

function History({ history, favorites, toggleFavorite, deleteGame, setViewPlayerDetail }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // 获取所有玩家名称
  const getAllPlayerNames = () => {
    const names = new Set();
    history.forEach(game => {
      game.players.forEach(player => {
        names.add(player.name);
      });
    });
    return Array.from(names).sort();
  };

  // 获取玩家历史记录
  const getPlayerHistory = (playerName) => {
    return history
      .filter(game => game.players.some(p => p.name === playerName))
      .reverse();
  };

  // 计算玩家统计
  const getPlayerStats = (playerName) => {
    const playerGames = history.filter(game => 
      game.players.some(p => p.name === playerName)
    );

    let totalProfit = 0;
    let totalProfitBB = 0;
    let totalMinutes = 0;

    playerGames.forEach(game => {
      const player = game.players.find(p => p.name === playerName);
      if (player) {
        const { profitMoney, profitBB } = calculateProfitLoss(
          player,
          game.buyInChips,
          game.chipValue,
          game.bigBlind
        );
        totalProfit += profitMoney;
        totalProfitBB += profitBB;
        totalMinutes += game.sessionMinutes || 0;
      }
    });

    const gamesPlayed = playerGames.length;
    const avgProfit = gamesPlayed > 0 ? (totalProfit / gamesPlayed).toFixed(2) : '0.00';
    const avgProfitBB = gamesPlayed > 0 ? (totalProfitBB / gamesPlayed).toFixed(1) : '0.0';
    // 精确到分钟计算每小时盈利：总盈利 * 60 / 总分钟数
    const hourlyProfit = totalMinutes > 0 ? (totalProfit * 60 / totalMinutes).toFixed(2) : '0.00';
    const hourlyBB = totalMinutes > 0 ? (totalProfitBB * 60 / totalMinutes).toFixed(1) : '0.0';

    return {
      gamesPlayed,
      totalProfit: totalProfit.toFixed(2),
      totalProfitBB: totalProfitBB.toFixed(1),
      avgProfit,
      avgProfitBB,
      hourlyProfit,
      hourlyBB
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="w-16 h-16 mx-auto mb-4 opacity-50 inline-block"><Icons.TrendingUp /></span>
          <p>暂无历史记录</p>
        </div>
      ) : (
        <div>
          {/* 收藏玩家列表 */}
          {favorites.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-3">
                <span className="w-4 h-4 text-yellow-500 fill-yellow-500"><Icons.Star /></span>
                收藏的玩家
              </h3>
              <div className="flex flex-wrap gap-2">
                {favorites.map(name => (
                  <button
                    key={name}
                    onClick={() => setViewPlayerDetail(name)}
                    className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-sm text-yellow-800 hover:bg-yellow-100 flex items-center gap-2"
                  >
                    <span className="w-3 h-3"><Icons.User /></span>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 玩家选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择玩家查看详细记录
            </label>
            <select
              value={selectedPlayer || ''}
              onChange={(e) => {
                const value = e.target.value || null;
                setSelectedPlayer(value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- 查看所有游戏 --</option>
              {getAllPlayerNames().map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* 玩家统计 */}
          {selectedPlayer && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mb-6 border border-green-200">
              <h3 className="text-xl font-bold mb-4 text-green-800">{selectedPlayer} 的统计数据</h3>
              {(() => {
                const stats = getPlayerStats(selectedPlayer);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-lg shadow">
                      <p className="text-xs text-gray-600 mb-1">游戏场次</p>
                      <p className="text-xl font-bold text-gray-800">{stats.gamesPlayed}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow">
                      <p className="text-xs text-gray-600 mb-1">总盈亏</p>
                      <p className={`text-xl font-bold ${parseFloat(stats.totalProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${stats.totalProfit}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{stats.totalProfitBB} BB</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow">
                      <p className="text-xs text-gray-600 mb-1">平均每局</p>
                      <p className={`text-xl font-bold ${parseFloat(stats.avgProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${stats.avgProfit}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{stats.avgProfitBB} BB</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow">
                      <p className="text-xs text-gray-600 mb-1">每小时盈亏</p>
                      <p className={`text-xl font-bold ${parseFloat(stats.hourlyProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${stats.hourlyProfit}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{stats.hourlyBB} BB</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 游戏历史列表 */}
          <div className="space-y-4">
            {(selectedPlayer ? getPlayerHistory(selectedPlayer) : [...history].reverse()).map((game) => (
              <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{game.gameName}</h4>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-3">
                        <span className="w-4 h-4"><Icons.Calendar /></span>
                        {new Date(game.date).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="w-4 h-4"><Icons.Clock /></span>
                        {formatDuration(game.sessionMinutes)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">盲注</div>
                    <div className="font-semibold">{game.smallBlind}/{game.bigBlind}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      (${((game.smallBlind || 0) / (game.chipValue || 1)).toFixed(2)}/${((game.bigBlind || 0) / (game.chipValue || 1)).toFixed(2)})
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">玩家</th>
                        <th className="px-3 py-2 text-right">盈亏$</th>
                        <th className="px-3 py-2 text-right">盈亏BB</th>
                      </tr>
                    </thead>
                    <tbody>
                      {game.players.map((player, idx) => {
                        const { profitMoney, profitBB } = calculateProfitLoss(
                          player,
                          game.buyInChips,
                          game.chipValue,
                          game.bigBlind
                        );
                        return (
                          <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <button
                                onClick={() => setViewPlayerDetail(player.name)}
                                className="flex items-center gap-3 hover:text-green-600 transition-colors"
                              >
                                {player.name}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(player.name);
                                  }}
                                  className={`text-gray-400 hover:text-yellow-500 ${
                                    favorites.includes(player.name) ? 'fill-yellow-500 text-yellow-500' : ''
                                  }`}
                                >
                                  <span className="w-4 h-4 inline-block"><Icons.Star /></span>
                                </button>
                              </button>
                            </td>
                            <td className={`px-3 py-2 text-right font-semibold ${profitMoney >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {profitMoney > 0 ? '+' : ''}${profitMoney}
                            </td>
                            <td className={`px-3 py-2 text-right font-semibold ${profitBB >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {profitBB > 0 ? '+' : ''}{profitBB}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 删除按钮 */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => deleteGame(game.id)}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-3"
                  >
                    <span className="w-4 h-4"><Icons.Trash2 /></span>
                    删除此记录
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default History;

