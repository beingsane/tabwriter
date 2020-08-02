import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  componentDidMount(): void {
    fetch('/api/tabs')
      .then((res) => res.text())
      .then((text) => console.log(text));
  }

  render(): JSX.Element {
    return (
      <div className="row">
        <div className="col">
          <h1>Tab-Writer</h1>
        </div>
      </div>
    );
  }
}
