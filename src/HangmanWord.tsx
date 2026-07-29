type HangmanWordProps = {
  guessedLetters: string[]
  wordToGuess: string
  reveal?: boolean
}

export function HangmanWord({
  guessedLetters,
  wordToGuess,
  reveal = false,
}: HangmanWordProps) {
  return (
    <div className="word-display">
      {wordToGuess.split("").map((letter, index) => (
        <span className="word-letter" key={index}>
          <span
            className={!guessedLetters.includes(letter) && reveal ? "missed-letter" : ""}
            style={{
              visibility:
                guessedLetters.includes(letter) || reveal ? "visible" : "hidden",
            }}
          >
            {letter}
          </span>
        </span>
      ))}
    </div>
  )
}