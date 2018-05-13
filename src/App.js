import React, { Component} from "react";
import "./App.css";

function Square(props) {
	return (
		<button className={'square' + (props.win ? ' win' : '')} onClick={props.onClick}>
		  {props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				win={this.props.combination && (this.props.combination.indexOf(i) >= 0)}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		const rows = [];
		for (let i = 0; i < 3; i++) {
			let cols = [];
			for (let j = 3 * i; j < 3 * (i + 1); j++) {
				cols.push(this.renderSquare(j));
			}
			rows.push(<div className="board-row">{cols}</div>);
		}
		return (
			<div>{rows}</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					cell: '',
				}
			],
			stepNumber: 0,
			xIsNext: true,
			active: false,
			isReversed: false
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const winner  = calculateWinner(squares);
		if (((winner !== null) && winner.winner) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares,
					cell: getLocation(i)
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			active: false
		});
		console.log(this.state.stepNumber);
		console.log(this.state.history.length);
	}

	jumpTo(step) {
		this.setState({
			//stepNumber: (!this.state.isReversed ? step : this.state.history.length - step - 1),
			stepNumber: step,
			xIsNext: (step % 2) === 0,
			active: true
		});
	}
  
	reverse() {
		this.setState({
			history: this.state.history.reverse(),
			isReversed: ! this.state.isReversed
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
		
			const desc = (!this.state.isReversed) ? 
						(move ? 'Go to move #' + move + ' ' + step.cell : 'Go to game start') : 
						((move == history.length - 1) ? 'Go to game start' : 'Go to move #' + (history.length - move - 1) + ' ' + step.cell);
			return (
				<li key={move}>
					<button className={(this.state.active && this.state.stepNumber === move) ? 'active': null}  onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		let sort = "Sort moves " + (this.state.isReversed ? "ascending" : "descending");
		if ((winner !== null) && winner.winner) {
			status = "Winner: " + winner.winner;
		} else if (checkTie(current.squares)) {
			status = "It's tie!";
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						combination={(winner !== null) && winner.combination}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={() => this.reverse()}>{sort}</button>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {winner: squares[a], combination: [a, b, c]};
		}
	}
	return null;
}

function getLocation(i) {
	const locations = [
		'1, 1', '1, 2', '1, 3',
		'2, 1', '2, 2', '2, 3',
		'3, 1', '3, 2', '3, 3'
	];
	return '(' + locations[i] + ')';
}

function checkTie(squares) {
	let tie = true;
	for (let i = 0; i < squares.length; i++) {
		if (squares[i] === null)
			return false;
	}
	return true;
}

export default Game;