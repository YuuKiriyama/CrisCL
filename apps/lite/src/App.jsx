import { useEffect, useState } from 'react'
import LiteCurrentGame from './LiteCurrentGame'
import { Icons } from '@main/components/Icons'
import { generateGameName as genGameName } from '@main/utils/helpers'

export default function App() {
  const [chipValue, setChipValue] = useState('')
  const [buyInChips, setBuyInChips] = useState('')
  const [smallBlind, setSmallBlind] = useState(1)
  const [bigBlind, setBigBlind] = useState(2)
  const [gameName, setGameName] = useState('')
  const [gameStatus, setGameStatus] = useState('notStarted')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [players, setPlayers] = useState([])
  const [playerName, setPlayerName] = useState('')
  const [buyIns, setBuyIns] = useState(1)
  

  // 初始化恢复 & 默认生成名称
  useEffect(() => {
    const saved = localStorage.getItem('currentGameStateLite')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        setGameName(s.gameName || '')
        setSmallBlind(s.smallBlind || 1)
        setBigBlind(s.bigBlind || 2)
        setBuyInChips(s.buyInChips || '')
        setChipValue(s.chipValue || '')
        setGameStatus(s.gameStatus || 'notStarted')
        setStartTime(s.startTime ? new Date(s.startTime) : null)
        setEndTime(s.endTime ? new Date(s.endTime) : null)
        setPlayers(s.players || [])
      } catch {
        generateGameName()
      }
    } else {
      generateGameName()
    }
  }, [])

  // Lite 不显示计时器

  // 自动保存（Lite 专用 key）
  useEffect(() => {
    if (gameStatus !== 'notStarted') {
      const state = {
        gameName, smallBlind, bigBlind, buyInChips, chipValue,
        gameStatus,
        startTime: startTime ? startTime.toISOString() : null,
        endTime: endTime ? endTime.toISOString() : null,
        players,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem('currentGameStateLite', JSON.stringify(state))
    }
  }, [gameName, smallBlind, bigBlind, buyInChips, chipValue, gameStatus, startTime, endTime, players])

  const generateGameName = () => setGameName(genGameName())

  const handleSmallBlindChange = (value) => setSmallBlind(value === '' ? '' : parseInt(value))
  const handleSmallBlindBlur = () => {
    if (smallBlind && bigBlind && smallBlind > bigBlind) {
      alert('小盲不能超过大盲')
      setSmallBlind(bigBlind)
    }
  }
  const handleBigBlindChange = (value) => setBigBlind(value === '' ? '' : parseInt(value))
  const handleBigBlindBlur = () => {
    if (smallBlind && bigBlind && bigBlind < smallBlind) {
      alert('大盲不能低于小盲')
      setBigBlind(smallBlind)
    }
  }

  const startGame = () => {
    if (!gameName.trim()) return alert('请先输入游戏名称')
    if (!buyInChips || !chipValue || !smallBlind || !bigBlind) return alert('请填写完整的游戏配置')
    if (gameStatus === 'notStarted') {
      setGameStatus('playing')
      setStartTime(new Date())
      setEndTime(null)
    }
  }
  const endGame = () => {
    if (players.length === 0) return alert('请至少添加一名玩家')
    if (gameStatus === 'playing') {
      setGameStatus('ended')
      setEndTime(new Date())
    }
  }
  const resetGame = () => {
    setGameStatus('notStarted')
    setStartTime(null)
    setEndTime(null)
    setPlayers([])
    generateGameName()
    localStorage.removeItem('currentGameStateLite')
  }

  const addPlayer = () => {
    if (!playerName.trim()) return alert('请输入玩家姓名')
    if (players.some(p => p.name === playerName.trim())) return alert('该玩家已存在，不能添加重名玩家')
    const newPlayer = { name: playerName.trim(), buyIns: buyIns || 1, endChips: '', id: Date.now() }
    setPlayers([...players, newPlayer])
    setPlayerName('')
    setBuyIns(1)
  }
  const removePlayer = (playerId) => setPlayers(players.filter(p => p.id !== playerId))
  const updatePlayerBuyIns = (playerId, value) => setPlayers(players.map(p => p.id === playerId ? { ...p, buyIns: value === '' ? 0 : parseInt(value) || 0 } : p))
  const updatePlayerEndChips = (playerId, value) => setPlayers(players.map(p => p.id === playerId ? { ...p, endChips: value === '' ? '' : parseInt(value) || 0 } : p))

  const saveGame = () => alert('Lite 版本不支持保存到历史记录')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <header className="mb-6">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-shrink-0">
              <span className="w-6 h-6 mt-1"><Icons.DollarSign /></span>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-800 leading-tight">CrisCL Lite</h1>
                <h2 className="text-xs font-bold text-gray-600 leading-tight">我们Cris才是真正的CL</h2>
              </div>
            </div>
          </div>
        </header>

        <LiteCurrentGame
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
          resetGame={resetGame}
        />
      </div>
    </div>
  )
}


