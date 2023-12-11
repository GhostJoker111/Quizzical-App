import { useState, useEffect } from 'react'
import React from "react";
import {nanoid} from "nanoid"
import he from "he"
import Questions from "./components/Questions"

export default function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function getQuestionsData() {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=5')
        if (!response.ok) {
          throw new Error('Response error')
        }
        const apiData = await response.json()
        const {results} = apiData
        setData(results)

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    return getQuestionsData
  },[])

  function insertRandomly(arr, newItem) {
    const randomIndex = Math.floor(Math.random() * (arr.length + 1))
    arr.splice(randomIndex, 0, newItem)
    return arr
  }

  function decodingAnswers(arr) {
    const correctAnswers = arr.map(answer => he.decode(answer))
    return correctAnswers
  }

  function correctAnswersAndQuestions() {
    const allData = data.map(item => {
      const {correct_answer, incorrect_answers, question} = item
      const allAnswers = insertRandomly(incorrect_answers, correct_answer)
      const correctAnswers =  decodingAnswers(allAnswers)
      const correctQuestion = he.decode(question)
      return {
        question: correctQuestion,
        answers: correctAnswers,
      }
    })
    return allData
  }

  function newGame() {
    const questionsAndAnswers = correctAnswersAndQuestions()
    return questionsAndAnswers

  //  // return (<Questions 
  //     key={nanoid}
      

  //   />)
  }

  return (
    <main>
      <section className="relative flex justify-center items-center min-h-screen bg-slate-50">
        <img className="absolute bottom-0 left-0" src="./src/assets/blue-cloud.svg" alt="Blue cloud" />
        <img className="absolute top-0 right-0" src="./src/assets/yellow-cloud.svg" alt="Yellow cloud" />
        <div className="flex flex-col justify-center items-center text-blue-950">
          <h1 className="font-mono text-5xl font-semibold">Quizzical</h1>
          <p className="text-xl mt-3 mb-7">Random questions about general things</p>
          <button 
            className="text-xl py-4 px-14 bg-indigo-600 text-slate-50 rounded-2xl cursor-pointer"
            onClick={newGame}
          >
            Start quizz
          </button>
        </div>
      </section>
    </main>
  )
}

