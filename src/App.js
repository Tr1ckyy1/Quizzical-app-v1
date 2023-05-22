import { useState, useEffect, useRef  } from "react";
import Questions from "./Questions";
import { nanoid } from "nanoid";
import he from "he";

function App() {
  const [quiz, setQuiz] = useState([]);
  const [finalOutput,setFinalOutput] = useState(false)
  const [answersChecked,setAnswersChecked] = useState(false)
  const [difficulty,setDifficulty] = useState()
  const [inputValue,setInputValue] = useState("")
  const [inputError, setInputError] = useState("");


// Getting data and setting that data with additional info
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


  useEffect(() => {
    if (quiz.length > 0) {
      document.body.classList.add("no-overflow");
    } else {
      document.body.classList.remove("no-overflow");
    }
  }, [quiz]);


  function selectAnswer(questionId, answer) {
    setQuiz(oldQuiz =>
      oldQuiz.map(data =>
        data.id === questionId ? { ...data, selectedAnswer: answer} : data
      )
    )
    setInputError("")
  }

  // If the user has ended the game, clicking on answers is no longer an option,
  // passing data(answer) inside selectAnswer function, from Questions button onClick
  function handleAnswerSelection(elementId,answer){
    if(!answersChecked){
      selectAnswer(elementId,answer)
    }
  }

// IF all the answers are clicked, render the coloring accordingly
  function checkAnswers(){
    const checkAllSelected = quiz.every(answer => answer.selectedAnswer)
   if(checkAllSelected){
    setFinalOutput(true)
    setAnswersChecked(true)
}
  setInputError(`You need to select all the answers`)
}



/*
StartQuiz - check if difficulty level is chosen and if number of questions is specified,
throw an error if either are missing.
call the function that makes api call and changes quiz state to an array of n amount of objects
and if the user presses play again, scroll to top
*/
const displayQuestionsRef = useRef(null);

function startQuiz() {
  if (!difficulty || !inputValue) {
    setInputError(`To start the quiz choose difficulty level and number of questions.`)
    return;
  }

  const num = parseInt(inputValue);

  if (num < 1 || num > 50 || isNaN(num)) {
    setInputError("Please enter a value between 1 and 50.");
    return;
  }

  setInputError("");
  getQuiz(difficulty.toLowerCase(), num);
  scrollToTop();
}


function scrollToTop() {
  if (displayQuestionsRef.current) {
    displayQuestionsRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }
}

function difficultyLevel (e){
  setDifficulty(e.target.textContent)
}

function handleInputChange(e){
  setInputValue(e.target.value.slice(0,2))
  setInputError("");
}


// Go back and reset everything to null
function backToMain(){
  setQuiz([])
  setDifficulty()
  setInputValue()
  setFinalOutput(false)
  setInputError("")
}

  const correctAnswers = quiz.filter(data => data.selectedAnswer === data.correct_answer)

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

    const styles = {
      backgroundColor: quiz.length < 0 && "green",
    }


  return (
    <main style={styles}>
      {quiz.length > 0 ? (
  <>
          <button onClick={backToMain} className="return-main-page">Main Page</button>
      <div ref={displayQuestionsRef} className="display-questions">
          {renderQuestions}
          <div>
            {finalOutput ?
            <div className="play-again-container">
              <h3 className="final-output">You scored {correctAnswers.length}/{quiz.length} correct answers</h3>
              <button onClick={startQuiz} className="btn check-final-btn">Play again</button>
            </div>
          :
          <div className="check-answers-container">
            <p className="error-message check-btn-error">{inputError}</p>
            <button onClick={checkAnswers}className="btn check-answers-btn">Check Answers</button>
         </div>
          }
            </div>
      </div>
</>
      )

      :

      (
        <div>
          <div className="head-content">
          <h1 className="difficulty-level">Difficulty: {difficulty}</h1>
          <h1 className="number-of-questions">Questions: {inputValue}</h1>
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
          <input  onChange={handleInputChange}
          placeholder="Enter a value between 1 and 50" type="number" min="1" max="50"
          maxLength={2}
          value={inputValue}
          />
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
