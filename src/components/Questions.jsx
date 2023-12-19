import PropTypes from 'prop-types'

export default function Questions (props) {
  const {answers, question, chooseAnswer, givenAnswer} = props

  const answerEls = answers.map((element, index) => (
    <p 
      key={index}
      className={ givenAnswer === "" ? "px-4 py-1 rounded-xl border-2 border-indigo-800 cursor-pointer" 
                              : "px-4 py-1 rounded-xl border-2 border-transparent bg-blue-200 cursor-pointer"}
      onClick={chooseAnswer}
      id={element.id}
    >
      {element.value}
    </p>
  ))

  return (
    <div className="text-blue-950 border-b-2 border-gray-300">
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
};