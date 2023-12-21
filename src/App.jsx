import { useState, useEffect } from 'react'
import he from "he"
import { nanoid } from "nanoid"
import Confetti from "react-confetti";
import Questions from "./components/Questions"

export default function App() {
  const [data, setData] = useState([])
  const [firstGame, setFirstGame] = useState(true)
  const [fetchData, setFetchData] = useState(true)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    async function getQuizzData() {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=5')
        if (!response.ok) {
          throw new Error('Response error')
        }
        const apiData = await response.json()
        const {results} = apiData
        setData(results.map(item => {
          const {correct_answer, incorrect_answers, question} = item
    
          const correctAnswer = he.decode(correct_answer)
          const allAnswers = insertRandomly(incorrect_answers, correctAnswer)
    
          const decodedAnswers =  decodingAnswers(allAnswers)
          const decodedQuestion = he.decode(question)
          return {
            question: decodedQuestion,
            answers: decodedAnswers,
            rightAnswer: correctAnswer,
            givenAnswer: "",
          }
        }))

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    getQuizzData()
  }, [fetchData])

  function insertRandomly(arr, newItem) {
    const newArr = [...arr]
    const randomIndex = Math.floor(Math.random() * (newArr.length + 1))
    newArr.splice(randomIndex, 0, newItem)
    return newArr
  }

  function decodingAnswers(arr) {
    const newArr = [...arr]
    const correctAnswers = newArr.map(answer => {
      const decodedAnswer =  he.decode(answer)
      return {
        value: decodedAnswer,
        id: nanoid(),
      }
    })
    return correctAnswers
  }

  function startGame() {
    setFirstGame(false)
  }

  function chooseAnswer(e) {
    const givenAnswerId = e.target.id
    setData(prevData => {
      return prevData.map(element => {
        const choose = element.answers.find(answer => answer.id === givenAnswerId)
        return choose ? {...element, givenAnswer: choose.value} : element
      })
    })
  }

  function checkAnswers() {
    setIsFinished(prevIsFinished => !prevIsFinished)
  }

  function playAgain() {
    setIsFinished(prevIsFinished => !prevIsFinished)
    setFetchData(prevFetchData => !prevFetchData)
  }

  function rightAnswers() {
    const numOfRightAnswers = data.reduce((acc, element) => {
      const {givenAnswer, rightAnswer} = element
      return givenAnswer === rightAnswer ? acc + 1 : acc
    }, 0)

    return numOfRightAnswers
  }
 
  const quizzElements = data.map((element, index) => (
      <Questions
        key={index}
        question={element.question}    
        answers={element.answers}
        rightAnswer={element.rightAnswer}
        givenAnswer={element.givenAnswer}
        chooseAnswer={(e) => chooseAnswer(e)}
        isFinished={isFinished}
      />
    ))

  return (
    <main>
      {rightAnswers() === 5 && isFinished && <Confetti />}
      <section className={`relative flex justify-center items-center px-20 min-h-screen bg-slate-50 ${!firstGame ? "flex-col" : ""}`}
      >
        <img className="absolute bottom-0 left-0" src="./src/assets/blue-cloud.svg" alt="Blue cloud" />
        <img className="absolute top-0 right-0" src="./src/assets/yellow-cloud.svg" alt="Yellow cloud" />
        {firstGame && (
        <div className="flex flex-col justify-center items-center text-blue-950">
          <h1 className="font-mono text-5xl font-semibold">Quizzical</h1>
          <p className="text-xl mt-3 mb-7">Random questions about general things</p>
          <button 
            className="text-xl py-4 px-14 bg-indigo-600 text-slate-50 rounded-2xl cursor-pointer"
            onClick={startGame}
          >
            Start quizz
          </button>
        </div>
        )}
        {!firstGame && <section>{quizzElements}</section>}
        <div className='flex justify-between items-center mt-7 gap-x-8 text-xl'>
          {isFinished && <p className='text-blue-950'>You scored {rightAnswers()}/5 correct answers</p>}
          {!firstGame && <button 
            className="py-4 px-14 bg-indigo-600 text-slate-50 rounded-2xl cursor-pointer"
            onClick={!isFinished ? checkAnswers : playAgain}
          >
            {!isFinished ? "Check answers" : "Play again"}
          </button>}
        </div>
      </section>
    </main>
  )
}
