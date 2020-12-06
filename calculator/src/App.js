import logo from "./logo.svg";
import "./App.css";
import React from "react";
const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  zero: 0,
  decimal: ".",
};
const EQUALS = "=";
const calcFunction = {
  add: "+",
  subtract: "-",
  multiply: "*",
  divide: "/",
  equals: EQUALS,
};
const funcArray = ["+", "-", "*", "/", EQUALS];
class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.clicknumber = this.clicknumber.bind(this);
  }

  clicknumber(e) {
    this.props.display(e.target.textContent);
  }

  render() {
    var keys = Object.keys(numbers);
    var listNum = keys.map((x) => (
      <div id={x} className="numbers" onClick={this.clicknumber}>
        {numbers[x]}
      </div>
    ));
    return listNum;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: "",
      computarray: [],
      text: "0",
    };
    this.clicknumber = this.clicknumber.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
    this.clickFunc = this.clickFunc.bind(this);
  }

  clicknumber(str) {
    console.log(this.state.computarray);
    var arr = [...this.state.computarray];
    if (isNaN(parseFloat(arr[arr.length - 1])) == false) {
      arr.pop();
    }
    this.setState((state) => {
      var num = state.number.concat(str);
      let tag = num.match(/([-]*[0-9]+)(\.)*([0-9]*)/);
      var before_decimal = parseInt(tag[1]);
      var decimal = tag[2];
      var after_decimal = tag[3];
      console.log(decimal, decimal == undefined);
      if (decimal == undefined) {
        console.log("no decimal");
        decimal = "";
      }
      var before_decimal = parseInt(tag[1]).toString();
      num = before_decimal + decimal + after_decimal;
      console.log(tag, num);
      return {
        number: num,
        text: num,
        computarray: arr,
      };
    });
  }

  componentDidUpdate() {
    var _computearray = [...this.state.computarray];
    console.log(_computearray, this.state.number);
    if (_computearray[_computearray.length - 1] == EQUALS) {
      var arr = [...this.state.computarray];
      arr.pop();
      var val = arr.reduce((a, x) => {
        console.log(a);
        var lastchar = a.charAt(a.length - 1);
        var _result = 0;
        switch (lastchar) {
          case "+":
            _result = parseFloat(a) + parseFloat(x);
            _result = _result.toString();
            break;
          case "-":
            _result = parseFloat(a) - parseFloat(x);
            _result = _result.toString();
            break;
          case "/":
            _result = parseFloat(a) / parseFloat(x);
            _result = _result.toString();
            break;
          case "*":
            _result = parseFloat(a) * parseFloat(x);
            _result = _result.toString();
            break;
          default:
            _result = a.concat(x);
        }
        return _result;
      });
      this.setState({
        text: val,
        computarray: [val],
        number: "",
      });
    }
  }
  clickFunc(e) {
    this.setState((state) => {
      var arr = [...this.state.computarray];
      var num = "";
      if (funcArray.includes(arr[arr.length - 1]) && (state.number == "" || state.number == "-")) {
        if (e.target.textContent == "-") {
          num = "-";
          num = num.toString();
        } else {
          arr.pop();
          arr.push(e.target.textContent);
        }
      } else {
        arr.push(state.number, e.target.textContent);
      }
      return {
        computarray: arr,
        number: num,
      };
    });
  }

  clearDisplay() {
    this.setState({
      text: "0",
      computarray: [],
      number: "",
    });
  }

  render() {
    var calcFunctiondiv = Object.keys(calcFunction).map((x) => (
      <div id={x} className={x} onClick={this.clickFunc}>
        {calcFunction[x]}
      </div>
    ));
    return (
      <div id="mainbox">
        <div id="display">{this.state.text}</div>
        <div id="clear" onClick={this.clearDisplay}>
          AC
        </div>
        {calcFunctiondiv}
        <div className="numberbox">
          <Buttons display={this.clicknumber} />
        </div>
      </div>
    );
  }
}
export default App;
