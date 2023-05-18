import he from "he";

export default function Questions(props) {

  const renderButtons = props.answers.map((answer) => {
    let backgroundColor,border,opacity

    if(props.finalOutput)
{
      if(props.selectedAnswer === answer){
        if(props.correctAnswer === props.selectedAnswer){
          backgroundColor="#94D7A2"
          border="none"
        }
         else{
          backgroundColor="#F8BCBC"
          opacity=0.5
          border="none"
         }
      }else{
        if(props.correctAnswer === answer){
          backgroundColor="#94D7A2"
          border="none"
        }
          else{
        opacity=0.5
        }
      }

    }else{
      if(props.selectedAnswer === answer){
        backgroundColor = "#D6DBF5"
        border="none"
      }else{
        backgroundColor="white"
        border="1px solid #4D5B9E"
      }

}


  const styles = {
    backgroundColor,
    opacity,
    border
}

    return (<button
      key={answer}
      style={styles}
      onClick={() => props.selectAnswer(answer)}
      className="answer"
    >
      {he.decode(answer)}
    </button>
  )});

  return (
    <div className="main-page-display">
      <div className="questions-container">
        <h3>{props.question}</h3>
        <div className="answers-container">{renderButtons}</div>
      </div>
    </div>
  );
}
