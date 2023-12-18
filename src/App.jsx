import { useState, useEffect } from 'react'
import { nanoid } from "nanoid"
import he from "he"
import Questions from "./components/Questions"

export default function App() {
  const [data, setData] = useState([])
  const [chosenAnswer, setChosenAnswer] = useState([])
  const [firstGame, setFirstGame] = useState(true)
  const [fetchData, setFetchData] = useState(true)

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
    const correctAnswers = newArr.map(answer => he.decode(answer))
    return correctAnswers
  }

  function startGame() {
    setFirstGame(false)
  }
  // function choosenAnswer(id) {
  // }

  const quizzElements = data.map((element, index) => (
      <Questions
        key={index}
        question={element.question}    
        answers={element.answers}
        rightAnswer={element.rightAnswer}
        //choosenAnswer={() => choosenAnswer(id)}
      />
    ))

  return (
    <main>
      <section className= {firstGame ? "relative flex justify-center items-center min-h-screen bg-slate-50" 
                                      : "relative flex flex-col justify-center items-center min-h-screen bg-slate-50"}
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
        {!firstGame && <div>{quizzElements}</div>}
        {!firstGame && <button 
            className="text-xl mt-7 py-4 px-14 bg-indigo-600 text-slate-50 rounded-2xl cursor-pointer"
          >
            Check answers
          </button>}
      </section>
    </main>
  )
}

