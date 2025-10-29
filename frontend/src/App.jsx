import { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import { generateGameName as genGameName, formatElapsedTime } from './utils/helpers';
import { Icons } from './components/Icons';
import CurrentGame from './components/CurrentGame';
import History from './components/History';
import PlayerDetail from './components/PlayerDetail';

function App() {
  const [view, setView] = useState('current');
  const [chipValue, setChipValue] = useState('');
  const [buyInChips, setBuyInChips] = useState('');
  const [smallBlind, setSmallBlind] = useState(1);
  const [bigBlind, setBigBlind] = useState(2);
  const [gameName, setGameName] = useState('');
  const [gameStatus, setGameStatus] = useState('notStarted');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [buyIns, setBuyIns] = useState(1);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [viewPlayerDetail, setViewPlayerDetail] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // 初始化：加载数据并恢复游戏状态
  useEffect(() => {
    loadHistory();
    loadFavorites();
    checkConnection();
    
    // 尝试恢复当前游戏状态
    const savedGameState = localStorage.getItem('currentGameState');
    if (savedGameState) {
      try {
        const state = JSON.parse(savedGameState);
        // 恢复游戏状态
        setGameName(state.gameName || '');
        setSmallBlind(state.smallBlind || 1);
        setBigBlind(state.bigBlind || 2);
        setBuyInChips(state.buyInChips || '');
        setChipValue(state.chipValue || '');
        setGameStatus(state.gameStatus || 'notStarted');
        setStartTime(state.startTime ? new Date(state.startTime) : null);
        setEndTime(state.endTime ? new Date(state.endTime) : null);
        setPlayers(state.players || []);
        console.log('✅ 游戏状态已恢复');
      } catch (error) {
        console.error('恢复游戏状态失败:', error);
        generateGameName();
      }
    } else {
      generateGameName();
    }
    
    // 设置定期同步
    const syncInterval = setInterval(() => {
      if (isOnline) {
        loadHistory();
        loadFavorites();
      }
    }, 30000); // 每30秒同步一次
    
    return () => {
      clearInterval(syncInterval);
    };
  }, [isOnline]);

  // 计时器效果
  useEffect(() => {
    let interval;
    if (gameStatus === 'playing' && startTime) {
      interval = setInterval(() => {
        setElapsedTime(formatElapsedTime(startTime));
      }, 1000);
    } else {
      setElapsedTime('00:00:00');
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStatus, startTime]);

  // 自动保存当前游戏状态
  useEffect(() => {
    // 只在游戏进行中或已结束时保存状态
    if (gameStatus !== 'notStarted') {
      const currentGameState = {
        gameName,
        smallBlind,
        bigBlind,
        buyInChips,
        chipValue,
        gameStatus,
        startTime: startTime ? startTime.toISOString() : null,
        endTime: endTime ? endTime.toISOString() : null,
        players,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem('currentGameState', JSON.stringify(currentGameState));
      console.log('💾 游戏状态已自动保存');
    }
  }, [gameName, smallBlind, bigBlind, buyInChips, chipValue, gameStatus, startTime, endTime, players]);

  const generateGameName = () => {
    const name = genGameName();
    setGameName(name);
  };

  const checkConnection = async () => {
    const online = await storage.checkConnection();
    setIsOnline(online);
    if (online) {
      setLastSyncTime(new Date());
    }
  };

  const loadHistory = async () => {
    try {
      console.log('正在加载历史记录...');
      const result = await storage.get('poker-history');
      if (result) {
        const data = JSON.parse(result.value);
        setHistory(data);
        console.log(`历史记录加载成功，共 ${data.length} 条记录`);
        setLastSyncTime(new Date());
      } else {
        console.log('历史记录为空');
        setHistory([]);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
      setHistory([]);
      setIsOnline(false);
    }
  };

  const loadFavorites = async () => {
    try {
      console.log('正在加载收藏列表...');
      const result = await storage.get('poker-favorites');
      if (result) {
        const data = JSON.parse(result.value);
        setFavorites(data);
        console.log(`收藏列表加载成功，共 ${data.length} 个收藏`);
      } else {
        console.log('收藏列表为空');
        setFavorites([]);
      }
    } catch (error) {
      console.error('加载收藏列表失败:', error);
      setFavorites([]);
      setIsOnline(false);
    }
  };

  const saveHistory = async (newHistory) => {
    try {
      console.log('正在保存历史记录...');
      const success = await storage.set('poker-history', JSON.stringify(newHistory));
      if (success) {
        setHistory(newHistory);
        setLastSyncTime(new Date());
        console.log('历史记录保存成功');
        return true;
      } else {
        console.error('历史记录保存失败');
        return false;
      }
    } catch (error) {
      console.error('保存历史记录失败:', error);
      setIsOnline(false);
      return false;
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await storage.set('poker-favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('保存收藏失败:', error);
    }
  };

  const toggleFavorite = (playerName) => {
    const newFavorites = favorites.includes(playerName)
      ? favorites.filter(name => name !== playerName)
      : [...favorites, playerName];
    saveFavorites(newFavorites);
  };

  const handleSmallBlindChange = (value) => {
    const numValue = value === '' ? '' : parseInt(value);
    setSmallBlind(numValue);
  };

  const handleSmallBlindBlur = () => {
    if (smallBlind && bigBlind && smallBlind > bigBlind) {
      alert('小盲不能超过大盲');
      setSmallBlind(bigBlind);
    }
  };

  const handleBigBlindChange = (value) => {
    const numValue = value === '' ? '' : parseInt(value);
    setBigBlind(numValue);
  };

  const handleBigBlindBlur = () => {
    if (smallBlind && bigBlind && bigBlind < smallBlind) {
      alert('大盲不能低于小盲');
      setBigBlind(smallBlind);
    }
  };

  const startGame = () => {
    if (!gameName.trim()) {
      alert('请先输入游戏名称');
      return;
    }
    if (!buyInChips || !chipValue || !smallBlind || !bigBlind) {
      alert('请填写完整的游戏配置');
      return;
    }
    if (gameStatus === 'notStarted') {
      setGameStatus('playing');
      setStartTime(new Date());
      setEndTime(null);
    }
  };

  const endGame = () => {
    if (players.length === 0) {
      alert('请至少添加一名玩家');
      return;
    }
    if (gameStatus === 'playing') {
      setGameStatus('ended');
      setEndTime(new Date());
    }
  };

  const resetGame = () => {
    setGameStatus('notStarted');
    setStartTime(null);
    setEndTime(null);
    setPlayers([]);
    generateGameName();
    
    // 清除保存的游戏状态
    localStorage.removeItem('currentGameState');
    console.log('🗑️ 游戏状态已清除');
  };

  const addPlayer = () => {
    if (!playerName.trim()) {
      alert('请输入玩家姓名');
      return;
    }
    
    if (players.some(p => p.name === playerName.trim())) {
      alert('该玩家已存在，不能添加重名玩家');
      return;
    }
    
    const newPlayer = {
      name: playerName.trim(),
      buyIns: buyIns || 1,
      endChips: '',
      id: Date.now()
    };
    
    setPlayers([...players, newPlayer]);
    setPlayerName('');
    setBuyIns(1);
  };

  const removePlayer = (playerId) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const updatePlayerBuyIns = (playerId, value) => {
    setPlayers(players.map(p => 
      p.id === playerId 
        ? { ...p, buyIns: value === '' ? 0 : parseInt(value) || 0 }
        : p
    ));
  };

  const updatePlayerEndChips = (playerId, value) => {
    setPlayers(players.map(p => 
      p.id === playerId 
        ? { ...p, endChips: value === '' ? '' : parseInt(value) || 0 }
        : p
    ));
  };

  const saveGame = async () => {
    if (!gameName.trim()) {
      alert('请输入游戏名称');
      return;
    }

    if (!startTime || !endTime) {
      alert('请先开始并结束游戏');
      return;
    }

    if (players.length === 0) {
      alert('请至少添加一名玩家');
      return;
    }

    // 检查账目平衡
    const totalBuyIn = players.reduce((sum, p) => sum + ((p.buyIns || 0) * (buyInChips || 0)), 0);
    const totalEndChips = players.reduce((sum, p) => sum + (p.endChips || 0), 0);
    const difference = totalEndChips - totalBuyIn;
    
    if (difference !== 0) {
      const message = `账目不平！${difference > 0 ? '多算了' : '少算了'} ${Math.abs(difference).toLocaleString()} 筹码。\n\n是否强制保存？`;
      if (!confirm(message)) {
        return;
      }
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const sessionMinutes = Math.round((end - start) / (1000 * 60));

    const game = {
      id: Date.now(),
      gameName,
      date: new Date().toISOString(),
      smallBlind: parseInt(smallBlind) || 0,
      bigBlind: parseInt(bigBlind) || 0,
      chipValue: parseInt(chipValue) || 1,
      buyInChips: parseInt(buyInChips) || 0,
      sessionMinutes,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      players: players.map(p => ({
        ...p,
        buyIns: p.buyIns || 1,
        endChips: p.endChips || 0
      }))
    };

    const newHistory = [game, ...history];
    const success = await saveHistory(newHistory);
    if (success) {
      // 清除保存的游戏状态（因为已经保存到历史记录）
      localStorage.removeItem('currentGameState');
      resetGame();
      alert('游戏已保存！');
    } else {
      alert('游戏保存失败，请检查网络连接或重试');
    }
  };

  const deleteGame = (gameId) => {
    if (confirm('确定要删除这条记录吗？')) {
      const newHistory = history.filter(g => g.id !== gameId);
      saveHistory(newHistory);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <header className="mb-6">
          {/* 桌面版布局 */}
          <div className="hidden md:flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8"><Icons.DollarSign /></span>
              CrisCL积分统计
            </h1>
            <h2 className="text-xl font-bold text-gray-800">我们Cris才是真正的CL</h2>
            <div className="flex items-center gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? '在线' : '离线'}
              </span>
              {lastSyncTime && (
                <span className="text-gray-500 text-xs">
                  {new Date(lastSyncTime).toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => {
                  storage.resetApiUrl();
                  checkConnection();
                  loadHistory();
                  loadFavorites();
                }}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                title="刷新数据并重新检测服务器"
              >
                刷新
              </button>
            </div>
          </div>
          
          {/* 移动端布局 */}
          <div className="md:hidden">
            <div className="flex items-start justify-between gap-2">
              {/* 左侧：标题 */}
              <div className="flex items-start gap-2 flex-shrink-0">
                <span className="w-6 h-6 mt-1"><Icons.DollarSign /></span>
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-gray-800 leading-tight">CrisCL积分统计</h1>
                  <h2 className="text-xs font-bold text-gray-600 leading-tight">我们Cris才是真正的CL</h2>
                </div>
              </div>
              
              {/* 中间：状态信息 */}
              <div className="flex flex-col items-center flex-shrink-0 text-xs">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                    {isOnline ? '在线' : '离线'}
                  </span>
                </div>
                {lastSyncTime && (
                  <span className="text-gray-500 text-[10px] whitespace-nowrap">
                    {new Date(lastSyncTime).toLocaleTimeString()}
                  </span>
                )}
              </div>
              
              {/* 右侧：刷新按钮 */}
              <button
                onClick={() => {
                  storage.resetApiUrl();
                  checkConnection();
                  loadHistory();
                  loadFavorites();
                }}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex-shrink-0"
                title="刷新数据并重新检测服务器"
              >
                刷新
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="grid grid-cols-2 gap-0">
            <button
              onClick={() => setView('current')}
              className={`py-4 text-lg font-semibold rounded-tl-lg transition-colors ${
                view === 'current'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              当前游戏
            </button>
            <button
              onClick={() => {
                setView('history');
                setViewPlayerDetail(null);
              }}
              className={`py-4 text-lg font-semibold rounded-tr-lg transition-colors ${
                view === 'history'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              历史记录
            </button>
          </div>
        </div>

        {view === 'current' && (
          <CurrentGame
            gameName={gameName}
            setGameName={setGameName}
            smallBlind={smallBlind}
            handleSmallBlindChange={handleSmallBlindChange}
            handleSmallBlindBlur={handleSmallBlindBlur}
            bigBlind={bigBlind}
            handleBigBlindChange={handleBigBlindChange}
            handleBigBlindBlur={handleBigBlindBlur}
            buyInChips={buyInChips}
            setBuyInChips={setBuyInChips}
            chipValue={chipValue}
            setChipValue={setChipValue}
            gameStatus={gameStatus}
            elapsedTime={elapsedTime}
            playerName={playerName}
            setPlayerName={setPlayerName}
            buyIns={buyIns}
            setBuyIns={setBuyIns}
            addPlayer={addPlayer}
            players={players}
            updatePlayerBuyIns={updatePlayerBuyIns}
            updatePlayerEndChips={updatePlayerEndChips}
            removePlayer={removePlayer}
            startGame={startGame}
            endGame={endGame}
            saveGame={saveGame}
            resetGame={resetGame}
          />
        )}

        {view === 'history' && !viewPlayerDetail && (
          <History
            history={history}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            deleteGame={deleteGame}
            setViewPlayerDetail={setViewPlayerDetail}
          />
        )}

        {view === 'history' && viewPlayerDetail && (
          <PlayerDetail
            playerName={viewPlayerDetail}
            history={history}
            setViewPlayerDetail={setViewPlayerDetail}
          />
        )}
      </div>
    </div>
  );
}

export default App;

