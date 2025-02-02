import React, { Component } from "react";
import Signin from "./components/Login"
import Signup from "./components/Register"

class App extends Component {
  render() {
    return (
      <div className="container">
        <Signin />
        <Signup />
      </div>
    )
  }
}

export default App;
