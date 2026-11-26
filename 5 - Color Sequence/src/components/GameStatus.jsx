function GameStatus({ gameComplete, isWrong, target, step, total }) {
  const message = gameComplete
    ? 'Round complete! Shuffling a new sequence…'
    : isWrong
      ? 'Wrong color — restarting…'
      : `Find ${target.name} (${step + 1} of ${total})`

  return (
    <p className={`indicator ${gameComplete ? 'indicator--success' : ''}`} aria-live="polite">
      {message}
    </p>
  )
}

export default GameStatus
