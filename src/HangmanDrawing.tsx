const HEAD = (
  <div
    key="head"
    className="hangman-part hangman-head"
  />
)
const BODY = (
  <div
    key="body"
    className="hangman-part hangman-body"
  />
)
const RIGHT_ARM = (
  <div
    key="right-arm"
    className="hangman-part hangman-right-arm"
  />
)
const LEFT_ARM = (
  <div
    key="left-arm"
    className="hangman-part hangman-left-arm"
  />
)

const RIGHT_LEG = (
  <div
    key="right-leg"
    className="hangman-part hangman-right-leg"
  />
)

const LEFT_LEG = (
  <div
    key="left-leg"
    className="hangman-part hangman-left-leg"
  />
)

const BODY_PART = [HEAD, BODY, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG]

type HangmanDrawingProps = {
  numberOfGuesses: number
}

export function HangmanDrawing({ numberOfGuesses }: HangmanDrawingProps) {
  return (
    <div className="drawing-frame">
      {BODY_PART.slice(0, numberOfGuesses)}
      <div className="scaffold scaffold-rope" />
      <div className="scaffold scaffold-top" />
      <div className="scaffold scaffold-post" />
      <div className="scaffold scaffold-base" />
    </div>
  )
}