import { useState } from 'react'

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const Buttons = (props) => {
  return (
    <div>
      <Button handleClick={props.vote} text='vote' />
      <Button handleClick={props.nextAnecdote} text='next anecdote' />
    </div>
  );
}

const Display = (props) => {
  return (
    <>
      <p>{props.anecdote}</p>
      <p>has {props.vote} votes</p>
    </>
  );
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // Create votes object based on anecdotes length
  const votes = {};
  for (let i = 0; i < anecdotes.length; i++) {
    votes[i] = 0;
  }
   
  // State hooks
  const [selected, setSelected] = useState(0)
  const [points, setPoint] = useState(votes);
  const [mostVotes, setMostVotes] = useState(0)

  // Function to get new random anecdote
  function selectAnecdote() {
    let random = Math.floor(Math.random() * anecdotes.length);
    
    // Prevent selecting same anecdote again
    if (selected === random) {
      random = Math.floor(Math.random() * anecdotes.length)
    }

    setSelected(random);
  }

  // Function to increase vote of a particular anecdote
  function vote() {
    const newPoints = { ...points }
    newPoints[selected] += 1

    setPoint(newPoints);

    // Get object key for most vote anecdote
    getMostVotes(newPoints);
  }

  // Function to find most voted anecdote
  function getMostVotes(points) {
    let updatedMostVotes = Object.keys(points).reduce((a, b) => points[a] > points[b] ? a : b);
    setMostVotes(updatedMostVotes);
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Display
        anecdote={anecdotes[selected]}
        vote={points[selected]}
      />
      <Buttons
        vote={vote}
        nextAnecdote={selectAnecdote}
      />
      <h1>Anecdote with most votes</h1>
      <Display
        anecdote={anecdotes[mostVotes]}
        vote={points[mostVotes]}
      />
    </div>
  )
}

export default App
