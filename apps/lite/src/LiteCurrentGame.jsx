import { useState } from 'react'
import { Icons } from '@main/components/Icons'
import { calculateProfitLoss, calculateBalance } from '@main/utils/helpers'

export default function LiteCurrentGame({
  gameName, setGameName,
  smallBlind, handleSmallBlindChange, handleSmallBlindBlur,
  bigBlind, handleBigBlindChange, handleBigBlindBlur,
  buyInChips, setBuyInChips,
  chipValue, setChipValue,
  gameStatus,
  playerName, setPlayerName,
  buyIns, setBuyIns,
  addPlayer,
  players,
  updatePlayerBuyIns,
  updatePlayerEndChips,
  removePlayer,
  startGame,
  endGame,
  resetGame
}) {
  const balance = calculateBalance(players, buyInChips)
  const [isAddingPlayer, setIsAddingPlayer] = useState(false)

  const handleAddPlayer = async () => {
    if (isAddingPlayer) return
    setIsAddingPlayer(true)
    try { await addPlayer() } finally { setTimeout(() => setIsAddingPlayer(false), 100) }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      {gameStatus !== 'notStarted' && (
        <div className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
          gameStatus === 'playing' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
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
          {/* Lite 版不显示计时器 */}
        </div>
      )}

      <div className="space-y-3 mb-6 px-1">
        <div className="flex gap-2">
          <div style={{flex: '0 0 calc(60% - 5.33px)'}}>
            <label className="block text-sm font-medium text-gray-700 mb-2">游戏名称</label>
            <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} placeholder="例如：周五夜局"
                   disabled={gameStatus === 'playing' || gameStatus === 'ended'}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"/>
          </div>
          <div style={{flex: '0 0 calc(20% - 2.67px)'}}>
            <label className="block text-sm font-medium text-gray-700 mb-2">小盲</label>
            <input type="number" value={smallBlind} onChange={(e) => handleSmallBlindChange(e.target.value)} onBlur={handleSmallBlindBlur}
                   placeholder="小盲" disabled={gameStatus === 'playing' || gameStatus === 'ended'}
                   className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"/>
          </div>
          <div style={{flex: '0 0 calc(20% - 2.67px)'}}>
            <label className="block text-sm font-medium text-gray-700 mb-2">大盲</label>
            <input type="number" value={bigBlind} onChange={(e) => handleBigBlindChange(e.target.value)} onBlur={handleBigBlindBlur}
                   placeholder="大盲" disabled={gameStatus === 'playing' || gameStatus === 'ended'}
                   className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"/>
          </div>
        </div>

        <div className="flex gap-2">
          <div style={{flex: '0 0 calc(50% - 4px)'}}>
            <label className="block text-sm font-medium text-gray-700 mb-2">每手Buy-in筹码量</label>
            <input type="number" value={buyInChips} onChange={(e) => setBuyInChips(e.target.value === '' ? '' : (parseInt(e.target.value) || 0))}
                   placeholder="例如：200" disabled={gameStatus === 'playing' || gameStatus === 'ended'}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"/>
          </div>
          <div style={{flex: '0 0 calc(50% - 4px)'}}>
            <label className="block text-sm font-medium text-gray-700 mb-2">筹码汇率(多少筹码=1$)</label>
            <input type="number" value={chipValue} onChange={(e) => setChipValue(e.target.value === '' ? '' : (parseInt(e.target.value) || 1))}
                   placeholder="例如：10" disabled={gameStatus === 'playing' || gameStatus === 'ended'}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"/>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-lg font-semibold text-gray-800 mb-2">添加玩家</label>
            <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !isAddingPlayer && handleAddPlayer()}
                   placeholder="玩家姓名" disabled={isAddingPlayer}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"/>
          </div>
          <div className="flex-shrink-0">
            <label className="block text-lg font-semibold text-gray-800 mb-2 text-center">手数</label>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setBuyIns((buyIns || 0) - 1)} disabled={isAddingPlayer}
                      className="w-8 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg transition-colors text-gray-700 font-bold text-lg">−</button>
              <input type="number" value={buyIns} onChange={(e) => setBuyIns(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                     disabled={isAddingPlayer}
                     className="w-14 h-10 px-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"/>
              <button type="button" onClick={() => setBuyIns((buyIns || 0) + 1)} disabled={isAddingPlayer}
                      className="w-8 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg transition-colors text-gray-700 font-bold text-lg">+</button>
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={handleAddPlayer} disabled={isAddingPlayer}
                    className={`px-6 h-10 text-white rounded-lg flex items-center justify-center gap-2 transition-colors flex-shrink-0 ${isAddingPlayer ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
              <span className="w-5 h-5"><Icons.Plus /></span>
              <span className="hidden sm:inline">{isAddingPlayer ? '添加中...' : '添加'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">玩家列表</h3>
        {players.length > 0 ? (
          <>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full border-collapse text-xs sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-left font-semibold">姓名</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-center font-semibold">Buy-in</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold hidden md:table-cell">买入</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold">最终码量</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold">筹码盈亏</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold">$盈亏</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold hidden md:table-cell">BB</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => {
                    const { profitChips, profitMoney, profitBB } = calculateProfitLoss(player, buyInChips, chipValue, bigBlind)
                    const totalBuyInChips = (player.buyIns || 0) * (buyInChips || 0)
                    return (
                      <tr key={player.id} className="border-b hover:bg-gray-50">
                        <td className="px-1 sm:px-4 py-2 sm:py-3 font-medium">{player.name}</td>
                        <td className="px-1 sm:px-4 py-2 sm:py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => updatePlayerBuyIns(player.id, (player.buyIns || 0) - 1)}
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors text-gray-700 font-bold text-xs sm:text-sm flex-shrink-0"
                              title="减少手数（可负数，表示卸码）"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={player.buyIns}
                              onChange={(e) => updatePlayerBuyIns(player.id, e.target.value)}
                              className="w-8 sm:w-12 px-1 py-1 border border-gray-300 rounded text-center text-xs sm:text-base"
                            />
                            <button
                              type="button"
                              onClick={() => updatePlayerBuyIns(player.id, (player.buyIns || 0) + 1)}
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors text-gray-700 font-bold text-xs sm:text-sm flex-shrink-0"
                              title="增加手数"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-1 sm:px-4 py-2 sm:py-3 text-right hidden md:table-cell">{totalBuyInChips.toLocaleString()}</td>
                        <td className="px-1 sm:px-4 py-2 sm:py-3 text-right">
                          <div className="flex justify-end">
                            <input
                              type="number"
                              value={player.endChips}
                              onChange={(e) => updatePlayerEndChips(player.id, e.target.value)}
                              min="0"
                              placeholder="0"
                              className="w-12 sm:w-3/4 px-1 sm:px-2 py-1 border border-gray-300 rounded text-right text-xs sm:text-base"
                            />
                          </div>
                        </td>
                        <td className={`px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold ${profitChips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitChips > 0 ? '+' : ''}{profitChips.toLocaleString()}
                        </td>
                        <td className={`px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold ${profitMoney >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitMoney > 0 ? '+' : ''}${profitMoney}
                        </td>
                        <td className={`px-1 sm:px-4 py-2 sm:py-3 text-right font-semibold hidden md:table-cell ${profitBB >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitBB > 0 ? '+' : ''}{profitBB}
                        </td>
                        <td className="px-1 sm:px-4 py-2 sm:py-3">
                          <button onClick={() => removePlayer(player.id)} className="text-red-600 hover:text-red-800">
                            <span className="w-4 h-4 sm:w-5 sm:h-5 inline-block"><Icons.Trash2 /></span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold text-xs sm:text-base">
                    <td className="px-1 sm:px-4 py-2 sm:py-3">总计</td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3"></td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3 text-right hidden md:table-cell">{balance.totalBuyIn.toLocaleString()}</td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3 text-right">{balance.totalEndChips.toLocaleString()}</td>
                    <td className={`px-1 sm:px-4 py-2 sm:py-3 text-right ${balance.difference === 0 ? 'text-gray-800' : 'text-red-600'}`}>
                      {balance.difference > 0 ? '+' : ''}{balance.difference.toLocaleString()}
                    </td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3"></td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3 hidden md:table-cell"></td>
                    <td className="px-1 sm:px-4 py-2 sm:py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>暂无玩家，请添加玩家</p>
          </div>
        )}
      </div>

      {/* Lite：按钮两行布局 */}
      <div className="space-y-3 mt-6">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={startGame} disabled={gameStatus !== 'notStarted'}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">
            <span className="w-5 h-5"><Icons.Play /></span>
            开始游戏
          </button>
          <button onClick={endGame} disabled={gameStatus !== 'playing'}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">
            <span className="w-5 h-5"><Icons.Square /></span>
            结束游戏
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => {
                    if (gameStatus === 'playing' || gameStatus === 'ended') {
                      if (!confirm('确定要重置吗？当前数据将被清空。')) return
                    }
                    resetGame()
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors">
            <span className="w-5 h-5"><Icons.Trash2 /></span>
            重置
          </button>
        </div>
      </div>
    </div>
  )
}


