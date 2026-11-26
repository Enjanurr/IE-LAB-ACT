import { useEffect, useRef, useState } from 'react'
import ColorButton from './components/ColorButton.jsx'
import SequenceDisplay from './components/SequenceDisplay.jsx'
import GameStatus from './components/GameStatus.jsx'

const baseSequence = [
  { name: 'Pink', value: '#e92ed6' }, { name: 'Blue', value: '#4568d4' }, { name: 'Red', value: '#e8174c' },
  { name: 'Orange', value: '#fc842d' }, { name: 'Cyan', value: '#43c8e2' }, { name: 'Green', value: '#36b44a' },
  { name: 'Lime', value: '#b8ef36' }, { name: 'Yellow', value: '#ffe016' }, { name: 'Purple', value: '#9620ad' },
]

// These colors stay in their board positions for the entire game.
const initialBoard = [baseSequence[4], baseSequence[1], baseSequence[7], baseSequence[2], baseSequence[5], baseSequence[0], baseSequence[8], baseSequence[3], baseSequence[6]]

function shuffle(colors) {
  const shuffled = [...colors]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}

function App() {
  const cardRef = useRef(null)
  const [sequence, setSequence] = useState(baseSequence)
  const [boardColors, setBoardColors] = useState(initialBoard)
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState([])
  const [wrongBox, setWrongBox] = useState(null)
  const gameComplete = step === sequence.length
  const target = sequence[step]

  // A wrong guess resets the current round shortly after the shake animation plays.
  useEffect(() => {
    if (wrongBox === null) return undefined
    const restartTimer = window.setTimeout(() => { setRevealed([]); setStep(0); setWrongBox(null) }, 850)
    return () => window.clearTimeout(restartTimer)
  }, [wrongBox])

  // New requirement: once a round is fully solved, roll a freshly randomized
  // sequence + board so the player keeps going instead of the game just stopping.
  useEffect(() => {
    if (!gameComplete) return undefined
    const newRoundTimer = window.setTimeout(() => {
      setSequence(shuffle(baseSequence))
      setBoardColors(shuffle(baseSequence))
      setRevealed([])
      setStep(0)
    }, 1200)
    return () => window.clearTimeout(newRoundTimer)
  }, [gameComplete])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setSequence(shuffle(baseSequence))
        setBoardColors(shuffle(baseSequence))
        setRevealed([])
        setStep(0)
        setWrongBox(null)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  function handleBoxClick(index) {
    if (wrongBox !== null || gameComplete) return
    if (boardColors[index].name === target.name) {
      setRevealed((current) => [...current, index])
      setStep((current) => current + 1)
    } else setWrongBox(index)
  }

  return (
    <main className="page">
      <section className="card" ref={cardRef} aria-labelledby="page-title">
        <p className="eyebrow">Color matching game</p>
        <h1 id="page-title">Color Sequence</h1>
        <p className="intro">
          Click the hidden board colors in the same order as the sequence above. A correct
          guess reveals that box's true color; a wrong one restarts the round.
        </p>

        <SequenceDisplay sequence={sequence} step={step} />

        <GameStatus
          gameComplete={gameComplete}
          isWrong={wrongBox !== null}
          target={target}
          step={step}
          total={sequence.length}
        />

        <div className="board" aria-label="Hidden color board">
          {boardColors.map((color, index) => (
            <ColorButton
              key={color.name}
              color={color.value}
              isRevealed={revealed.includes(index)}
              isWrong={wrongBox === index}
              onClick={() => handleBoxClick(index)}
              disabled={wrongBox !== null || gameComplete}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
