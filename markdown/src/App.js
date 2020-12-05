// import logo from './logo.svg';
import './App.css';
import React from 'react';
import marked from 'marked';
marked.setOptions({
  breaks: true
})
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { markup: {__html : marked(this.props.name)},
                  text: this.props.name };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({ text: e.target.value });
    let markup = marked(e.target.value);
    markup = markup.replaceAll('\r', 'br')
    console.log(markup);
    this.setState({markup : {__html : markup}});
  }
  render() {
    return (
    <div className="App">
    <textarea id="editor" onChange={this.handleChange} value={this.state.text}>Text Area</textarea>
    <div id="preview" dangerouslySetInnerHTML={this.state.markup}/>
    </div>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//     <div className="App">
//     <textarea className="editor">Text Area</textarea>
//     </div>
//   );
// }

export default App;
