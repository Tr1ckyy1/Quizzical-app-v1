import { useState, useEffect } from "react";
import Questions from "./Questions";
import { nanoid } from "nanoid";
import he from "he";

function App() {
  const [quiz, setQuiz] = useState([]);
  const [finalOutput,setFinalOutput] = useState(false)
  const [answersChecked,setAnswersChecked] = useState(false)
  const [difficulty,setDifficulty] = useState()
  const [questionNum,setQuestionNum] = useState()
  const [inputError, setInputError] = useState("");



  async function getQuiz(difficulty,amount) {
    const res = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=9&difficulty=${difficulty}&type=multiple`);
    const data = await res.json();
    const fullData = data.results.map(currentData => {
      const { incorrect_answers: incorrect, correct_answer: correct } = currentData;
      const answers = [...incorrect, correct];
      const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
      return { ...currentData, shuffledAnswers, id: nanoid(),selectedAnswer:"" };
    });
    setQuiz(fullData);
    setFinalOutput(false)
    setAnswersChecked(false)
  }

  function selectAnswer(questionId, answer) {
    setQuiz(oldQuiz =>
      oldQuiz.map(data =>
        data.id === questionId ? { ...data, selectedAnswer: answer} : data
      )
    )
  }

  function handleAnswerSelection(elementId,answer){
    if(!answersChecked){
      selectAnswer(elementId,answer)
    }
  }

  function checkAnswers(){
    const checkAllSelected = quiz.every(answer => answer.selectedAnswer)
   if(checkAllSelected){
    setFinalOutput(true)
    setAnswersChecked(true)
}
}

const renderQuestions = quiz.map(el => {
  return (
    <Questions
      key={el.id}
      question={he.decode(el.question)}
      answers={el.shuffledAnswers}
      selectedAnswer={el.selectedAnswer}
      selectAnswer={answer => handleAnswerSelection(el.id, answer)}
      finalOutput={finalOutput}
      correctAnswer={el.correct_answer}
    />
  );
});

function startQuiz() {
  if (!difficulty || !questionNum) {
    setInputError(`To start the quiz choose difficulty level and number of questions.`)
    return;
  }

  const num = parseInt(questionNum);

  if (num < 1 || num > 50 || isNaN(num)) {
    setInputError("Please enter a value between 1 and 50.");
    return;
  }

  setInputError("");
  getQuiz(difficulty.toLowerCase(), num);
}

function difficultyLevel (e){
  setDifficulty(e.target.textContent)
}

function backToMain(){
  setQuiz([])
  setDifficulty()
  setQuestionNum()
  setFinalOutput(false)
}

console.log(quiz)

  const correctAnswers = quiz.filter(data => data.selectedAnswer === data.correct_answer)

  return (
    <main>
      {quiz.length > 0 ? (
        <>
          <button onClick={backToMain} className="return-main-page">Main Page</button>
          {renderQuestions}
          {finalOutput ?

          <div className="play-again-container">
          <h3 className="final-output">You scored {correctAnswers.length}/{quiz.length} correct answers</h3>
            <button onClick={startQuiz} className="btn check-final-btn">Play again</button>
            </div>
            :
            <button onClick={checkAnswers}className="btn check-answers-btn">Check Answers</button>
        }
        </>
      )

      :

      (
        <div>
          <div className="head-content">
          <h1 className="difficulty-level">Difficulty: {difficulty}</h1>
          <h1 className="number-of-questions">Questions: {questionNum}</h1>
          </div>
        <div className="container">
          <h1 className="title">Quizzical</h1>
          <p className="description difficulty">Choose Difficulty</p>
          <div className="level-container">
          <button onClick={difficultyLevel} className="level btn-easy">Easy</button>
          <button onClick={difficultyLevel} className="level btn-medium">Medium</button>
          <button onClick={difficultyLevel} className="level btn-hard">Hard</button>
          </div>
          <p className="description questions">Choose Number of Questions</p>
          <input onChange={
            (e) =>
            {
           setQuestionNum(e.target.value);
           setInputError("");
            }
         } placeholder="Enter a value between 1 and 50" type="number" min="1" max="50"/>
          <p className="error-message">{inputError}</p>
          <button
          onClick={startQuiz}
          className="btn start-btn">
            Start quiz
          </button>

        </div>
        </div>
      )}
    </main>
  );
}

export default App;
