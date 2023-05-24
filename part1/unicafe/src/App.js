import { useState } from 'react';

const StatisticRow = (props) => {
  return (
    <tbody>
      <tr>
        <th>{props.text}</th>
        <td>{props.value} {props.sign}</td>
      </tr>
    </tbody>
  );
}

const Statistics = (props) => {
  if (props.total === 0) {
    return <p>No feedback given</p>
  }
  return (
    <div>
      <table>
        <StatisticRow text='good' value={props.good} />
        <StatisticRow text='neutral' value={props.neutral} />
        <StatisticRow text='bad' value={props.bad} />
        <StatisticRow text='all' value={props.total} />
        <StatisticRow text='average' value={props.average} />
        <StatisticRow text='positive' value={props.positive} sign='%' />
      </table>
    </div>
  );
}

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const Buttons = (props) => {
  return (
    <>
      <Button handleClick={props.handleGood} text='good' />
      <Button handleClick={props.handleNeutral} text='neutral' />
      <Button handleClick={props.handleBad} text='bad' />
    </>
  );
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleClick = (feedback) => () => {
    const updatedTotal = total + 1;
    let updatedGood = good;
    let updatedScore = score;

    switch (feedback) {
      case 'good':
        setGood(updatedGood += 1);
        setScore(updatedScore += 1);
        break;
      case 'neutral':
        setNeutral(neutral + 1);
        break;
      case 'bad':
        setBad(bad + 1);
        setScore(updatedScore -= 1);
        break;
      default:
        console.log('No match feedback');
    }

    setTotal(updatedTotal);
    setAverage(Math.round((updatedScore / updatedTotal) * 10) / 10);
    setPositive(Math.round(((updatedGood * 100) / updatedTotal) * 10) / 10);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Buttons
        handleGood={handleClick('good')}
        handleNeutral={handleClick('neutral')}
        handleBad={handleClick('bad')}
      />
      <h1>statistics</h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  );
}

export default App;
