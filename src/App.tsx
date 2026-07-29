import { useCallback, useEffect, useState } from "react"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import words from "./wordList.json"

const ALL_CATEGORIES = "All Words"
const RANDOM_NAMES = ["Sketchy Sam", "Lucky Luna", "Captain Ink", "Word Wizard"]

type WordEntry = (typeof words)[number]
type SetupStep = "name" | "category"

const categories = [
  ALL_CATEGORIES,
  ...Array.from(new Set(words.map(word => word.category))),
]

function getWord(category: string) {
  const candidates =
    category === ALL_CATEGORIES
      ? words
      : words.filter(word => word.category === category)

  return candidates[Math.floor(Math.random() * candidates.length)]
}

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [setupStep, setSetupStep] = useState<SetupStep>("name")
  const [pendingName, setPendingName] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)
  const [currentWord, setCurrentWord] = useState<WordEntry>(() =>
    getWord(ALL_CATEGORIES)
  )
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const wordToGuess = currentWord.word

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter))

  const goToCategoryStep = (name: string) => {
    setPlayerName(name.trim())
    setSetupStep("category")
  }

  const startSession = useCallback(
    () => {
      setCurrentWord(getWord(selectedCategory))
      setGuessedLetters([])
      setHasStarted(true)
    },
    [selectedCategory]
  )

  const startNewGame = useCallback(() => {
    setCurrentWord(getWord(selectedCategory))
    setGuessedLetters([])
  }, [selectedCategory])

  const useRandomName = () => {
    const randomName =
      RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]

    setPendingName(randomName)
    goToCategoryStep(randomName)
  }

  const playWithoutName = () => {
    setPendingName("")
    goToCategoryStep("")
  }

  const backToCategoryStep = () => {
    setHasStarted(false)
    setGuessedLetters([])
    setSetupStep("category")
  }

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return

      setGuessedLetters(currentLetters => [...currentLetters, letter])
    },
    [guessedLetters, isWinner, isLoser]
  )

  useEffect(() => {
    if (!hasStarted) return

    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [addGuessedLetter, hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return

      e.preventDefault()
      startNewGame()
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [hasStarted, startNewGame])

  if (!hasStarted) {
    if (setupStep === "name") {
      return (
        <main className="app-shell">
          <section className="game-card setup-card" aria-label="Choose player name">
            <div className="game-header">
              {/* <p className="eyebrow">Step 1</p> */}
              <h1>Who is Playing?</h1>
              {/* <p>Enter your name, select a random name, or play without one.</p> */}
            </div>

            <form
              className="setup-form"
              onSubmit={e => {
                e.preventDefault()
                goToCategoryStep(pendingName)
              }}
            >
              <label className="name-field">
                Please enter your name
                <input
                  value={pendingName}
                  onChange={e => setPendingName(e.target.value)}
                  placeholder="Your name"
                />
              </label>

              <div className="setup-actions">
                <button
                  className="secondary-action"
                  onClick={useRandomName}
                  type="button"
                >
                  Random Name
                </button>
                <button
                  className="secondary-action"
                  onClick={playWithoutName}
                  type="button"
                >
                  Play Without Name
                </button>
                <button
                  className="primary-action"
                  disabled={!pendingName.trim()}
                  type="submit"
                >
                  Next
                </button>
              </div>
            </form>
          </section>
        </main>
      )
    }

    return (
      <main className="app-shell">
        <section className="game-card setup-card" aria-label="Choose category">
          <div className="game-header">
            {/* <p className="eyebrow">Step 2</p> */}
            <h1>Choose Category</h1>
            <p>
              {playerName ? `Player: ${playerName}` : "Playing without a name"}
            </p>
          </div>

          <div className="setup-form">
            <div className="category-panel" aria-label="Choose a category">
              {/*<p>Choose a category</p>*/}
              <div className="category-list">
                {categories.map(category => (
                  <button
                    className={`choice-button ${
                      selectedCategory === category ? "selected" : ""
                    }`}
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-actions">
              <button
                className="primary-action"
                onClick={startSession}
                type="button"
              >
                Start Game
              </button>
              <button
                className="secondary-action"
                onClick={() => setSetupStep("name")}
                type="button"
              >
                Back
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="game-card" aria-label="Hangman game">
        <div className="game-header">
          {/* <p className="eyebrow">Hand drawn hangman</p> */}
          <h1>Guess the Word</h1>
          <p>
            {playerName ? `Good luck, ${playerName}! ` : "Good luck! "}
            Category:{" "}
            {selectedCategory === ALL_CATEGORIES ? "Mixed" : currentWord.category}
          </p>
        </div>

        <button
          aria-label="Back to categories"
          className="back-link"
          onClick={backToCategoryStep}
          type="button"
        >
          &larr;
        </button>

        <div className={`status-message ${isWinner || isLoser ? "visible" : ""}`}>
          {isWinner && "Winner! - Press Enter to try again"}
          {isLoser && "Nice try! - Press Enter to try again"}
        </div>

        <HangmanDrawing numberOfGuesses={incorrectLetters.length} />

        <HangmanWord
          reveal={isLoser}
          guessedLetters={guessedLetters}
          wordToGuess={wordToGuess}
        />

        <div className={`hint-card ${incorrectLetters.length >= 2 ? "visible" : ""}`}>
          <strong>Hint:</strong>{" "}
          {incorrectLetters.length >= 2
            ? currentWord.hint
            : "A hint appears after 2 wrong guesses."}
        </div>

        <div className="keyboard-wrap">
          <Keyboard
            disabled={isWinner || isLoser}
            activeLetters={guessedLetters.filter(letter =>
              wordToGuess.includes(letter)
            )}
            inactiveLetters={incorrectLetters}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
      </section>
    </main>
  )
}

export default App
