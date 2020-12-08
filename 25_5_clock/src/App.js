import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      start_stop: false,
      label: 'session',
      session_left: 1500,
      break_left: 300
    };
    this.decrease_break = this.decrease_break.bind(this);
    this.increase_break = this.increase_break.bind(this);
    this.decrease_session = this.decrease_session.bind(this);
    this.increase_session = this.increase_session.bind(this)
    this.reset = this.reset.bind(this)
    this.start_stop = this.start_stop.bind(this)
  }

  decrease_break() {
    this.setState((state) => ({
      breakLength: Math.max(state.breakLength - 1, 1),
      break_left: 60 * Math.max(state.breakLength - 1, 1)
    }))
  }
  
  increase_break() {
    this.setState((state) => ({
      breakLength: Math.min(state.breakLength + 1, 60),
      break_left: 60 * Math.min(state.breakLength + 1, 60)
    }))
  }

  
  decrease_session() {
    this.setState((state) => ({
      sessionLength: Math.max(state.sessionLength - 1, 1),
      session_left: 60 * Math.max(state.sessionLength - 1, 1)
    }))
  }
  
  increase_session() {
    this.setState((state) => ({
      sessionLength: Math.min(state.sessionLength + 1, 60),
      session_left: 60 * Math.min(state.sessionLength + 1, 60)
    }))
  }

  reset() {
    clearInterval(this.interval)
    document.getElementById('beep').pause()
    document.getElementById('beep').currentTime  = 0
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      break_left: 300,
      session_left: 1500,
      start_stop: false
    })
  }

  start_stop() {
    if (this.state.start_stop){
      clearInterval(this.interval)
      this.setState({
        start_stop: false
      })
    } else {
      this.interval = setInterval(() => this.tick(), 1000);
      this.setState({
        start_stop: true
      })
    }
    
  }

  tick() {
    if (this.state.session_left >= 0) {
      this.setState({
        session_left: this.state.session_left - 1,
      })
    } else  if (this.state.break_left > 0){
      this.setState({
        break_left: this.state.break_left - 1,
      })
    }  else {
      this.setState((state) => ({
        session_left: 60 * state.sessionLength,
        break_left: 60 * state.breakLength
      }))
    }
  }

  componentDidUpdate() {
    console.log(this.get_time_string(), this.state.start_stop, this.state.session_left, this.state.break_left)
    if (this.state.session_left == 0 || this.state.break_left == 0) {
      document.getElementById('beep').play()
    }
  }

  get_time_string() {
    if (this.state.session_left >= 0){
      var str = parseInt(this.state.session_left / 60).toString().padStart(2,0) + ':' + (this.state.session_left % 60).toString().padStart(2,0)
    } else if (this.state.break_left >= 0) {
      var str = parseInt(this.state.break_left / 60).toString().padStart(2,0) + ':' + (this.state.break_left % 60).toString().padStart(2,0)
    } 
   
    return str;
  }

  get_label() {
    if (this.state.session_left > 0){
      return 'session';
    } else if (this.state.break_left > 0) {
      return 'break';
    } else {
      return 'session';
    }
  }
  render() {
    return (
      <div id='mainbox'>
      <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      <div id='break'>
      <div id="break-label">Break Length</div>
      <div id="break-decrement" className="inlinestuff" onClick={this.decrease_break}>break-decrement</div>
      <div id="break-length">{this.state.breakLength}</div>
      <div id="break-increment" className="inlinestuff" onClick={this.increase_break}>break-increment</div>
      </div>

      <div id='session'>
      <div id="session-label" >Session Length</div>
      <div id="session-decrement" className="inlinestuff" onClick={this.decrease_session}>session-decrement</div>
      <div id="session-length">{this.state.sessionLength}</div>
      <div id="session-increment" className="inlinestuff" onClick={this.increase_session}>session increment</div>
      </div>

    <div id="timer-label">{this.get_label()}</div>
      <div id="time-left">{this.get_time_string()}</div>
      <div id="reset" onClick={this.reset}>Reset</div>
      <div id="start_stop" onClick={this.start_stop}>Start-Stop</div>

      </div>
    );
  }
}

export default App;
