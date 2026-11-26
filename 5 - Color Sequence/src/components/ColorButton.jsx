function ColorButton({ color, isRevealed, isWrong, onClick, disabled }) {
  const className = ['box', isRevealed && 'box--revealed', isWrong && 'box--wrong'].filter(Boolean).join(' ')

  return (
    <button
      className={className}
      // Hidden boxes keep the neutral CSS background; a correct guess reveals
      // the box's real color so progress is visible, not just outlined.
      style={isRevealed ? { backgroundColor: color } : undefined}
      aria-label={isRevealed ? 'Revealed color box' : isWrong ? 'Incorrect color box' : 'Hidden color box'}
      onClick={onClick}
      type="button"
      disabled={disabled || isRevealed}
    />
  )
}

export default ColorButton
