import React, { Component } from 'react';
import GreedyText from 'react-greedy-text';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      text: 'Edit me'
    }
  }

  onTextChange = (e) => {
    this.setState({
      text: e.target.value,
    });
  };

  render() {
    const { text } = this.state;

    return (
      <div className="App">
        <textarea cols="30" rows="10" value={text} onChange={this.onTextChange} />

        <div style={{ flex: 1 }}>
          <GreedyText>
            {text}
          </GreedyText>
        </div>
      </div>
    );
  }
}

export default App;
