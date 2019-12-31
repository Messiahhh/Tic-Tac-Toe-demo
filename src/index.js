import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    let x = squares[a] && squares[a] === squares[b] && squares[a] === squares[c]
    if (x) {
        return {
            winner: squares[a],
            winnerLine: [a, b, c],
        }
    }
  }

  return {
      winner: null,
      winnerLine: []
  };
}


function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{color: props.hightlight ? 'red' : '#000'}}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquares(i) {
        return <Square value={this.props.squares[i]} key={i} onClick={() => this.props.onClick(i)} hightlight={this.props.winnerLine.includes(i)} />
    }

    render() {
        let rows = []
        for (let i = 0; i < 3; i++) {
            let row = []
            for (let j = i * 3; j < i * 3 + 3; j++) {
                row.push(this.renderSquares(j))
            }
            rows.push(<div className="board-row" key={i}>{row}</div>)
        }
        return (
            <div>
                {rows}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastStep: 'Game start'
            }],
            xIsNext: true,
            stepNumber: 0,
            sort: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if (calculateWinner(squares).winner || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        let location = `(${ (i % 3) + 1} , ${ Math.floor(i / 3) + 1 })`
        let desc = `${squares[i]} moved to ${location}`
        this.setState({
            history: history.concat([{
                squares,
                lastStep: desc,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })

    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    sort() {
        this.setState({
            sort: !this.state.sort
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const {winner, winnerLine} = calculateWinner(current.squares)
        let status
        if (winner) {
            status = `赢家: ${winner}`
        } else {
            if (this.state.stepNumber === 9) {
                status = '没人胜利， 平局！'
            }
            else {
                status = '下个玩家: ' + (this.state.xIsNext ? 'X' : 'O')
            }
        }
        const moves = history.map((item, index) => {
            let desc = item.lastStep
            if (index === this.state.stepNumber) {
                return (
                    <li key={index}>
                        <button onClick={() => this.jumpTo(index)}><strong>{desc}</strong></button>
                    </li>
                )
            }
            else {
                return (
                    <li key={index}>
                        <button onClick={() => this.jumpTo(index)}>{desc}</button>
                    </li>
                );
            }
        })
        let sort = this.state.sort
        if (sort) {
            moves.reverse()
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winnerLine={winnerLine} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.sort()}>sort</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        )

    }
}




ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
