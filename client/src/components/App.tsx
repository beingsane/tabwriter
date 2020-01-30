import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
  componentDidMount(): void {
    fetch('/api')
      .then(res => res.text())
      .then(text => console.log(text));
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
