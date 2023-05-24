import { useState } from 'react';

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

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = Math.round(((good - bad) / total) * 10) / 10;
  const positive = Math.round(((good * 100) / total) * 10) / 10;

  if (total === 0) {
    return <p>No feedback given</p>
  }
  return (
    <div>
      <table>
        <StatisticRow text='good' value={good} />
        <StatisticRow text='neutral' value={neutral} />
        <StatisticRow text='bad' value={bad} />
        <StatisticRow text='all' value={total} />
        <StatisticRow text='average' value={average} />
        <StatisticRow text='positive' value={positive} sign='%' />
      </table>
    </div>
  );
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClick = (feedback) => () => {
    switch (feedback) {
      case 'good':
        setGood(good + 1);
        break;
      case 'neutral':
        setNeutral(neutral + 1);
        break;
      case 'bad':
        setBad(bad + 1);
        break;
      default:
        console.log('No match feedback');
    }
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
      />
    </div>
  );
}

export default App;
