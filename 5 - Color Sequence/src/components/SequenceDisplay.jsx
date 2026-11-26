function SequenceDisplay({ sequence, step }) {
  return (
    <div className="sequence" aria-label="Color sequence to follow">
      {sequence.map((color, index) => (
        <div
          key={color.name}
          className={`sequence-color ${index === step ? 'sequence-color--current' : ''} ${index < step ? 'sequence-color--done' : ''}`}
          style={{ backgroundColor: color.value }}
          title={`${index + 1}. ${color.name}`}
        />
      ))}
    </div>
  )
}

export default SequenceDisplay
