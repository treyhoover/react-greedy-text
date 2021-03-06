import React, { Component } from 'react';
import GreedyText from 'react-greedy-text';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <GreedyText>
            Greedy Text!
          </GreedyText>
        </header>

        <main style={{ flex: 1, display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <GreedyText>
              Greedy Text does a binary search to quickly maximize the font-size that will fill
              its parent container without overflowing.
            </GreedyText>
          </div>

          <div style={{ flex: 1, padding: '0px 40px' }}>
            <GreedyText>
              “I mean I guess if you had no other option...”
            </GreedyText>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
