import PropTypes from 'prop-types'

export default function Questions (props) {
  const {answers, question, chooseAnswer, givenAnswer, rightAnswer, isFinished} = props

  const answerEls = answers.map((answer, index) => (
    <p 
      key={index}
      className={`
        px-4 py-1 rounded-xl border-2 text-blue-950 cursor-pointer focus:bg-blue-700
        ${givenAnswer === answer.value ? 'border-transparent bg-blue-200' : 'border-indigo-800'}
        ${(isFinished && (givenAnswer === answer.value && givenAnswer === rightAnswer)) && 'bg-green-400'}
        ${(isFinished && (givenAnswer === answer.value && givenAnswer !== rightAnswer)) && 'bg-red-500 opacity-50'}
        ${(isFinished && (givenAnswer !== answer.value && rightAnswer === answer.value)) && 'bg-green-400 border-transparent opacity-100'}
        ${isFinished && (givenAnswer !== answer.value) && 'opacity-50'}
      `}
      onClick={chooseAnswer}
      id={answer.id}
    >
      {answer.value}
    </p>
  ))

  return (
    <div className={`text-blue-950 border-b-2 border-gray-300 ${isFinished ? 'pointer-events-none' : ''}`}>
      <h1 className="text-xl font-semibold mt-7" >{question}</h1>
      <div className="flex gap-x-3.5 mt-3.5 mb-5">{answerEls}</div>
    </div>
  )
}

Questions.propTypes = {
  answers: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  chooseAnswer: PropTypes.func.isRequired,
  givenAnswer: PropTypes.string.isRequired,
  rightAnswer: PropTypes.string.isRequired,
  isFinished: PropTypes.bool.isRequired,
};