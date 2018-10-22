import * as React from "react";
import "./App.css";
import CssBaseline from "@material-ui/core/CssBaseline";

interface Message {
  average: number;
  current: number;
}

interface State {
  average: number;
  current: number;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      average: 0,
      current: 0,
    };
  }

  public componentDidMount() {
    const socket = new WebSocket("ws://localhost:4000");

    socket.addEventListener("open", event => {
      socket.send("Hello Server!");
    });
    socket.addEventListener("message", event => {
      const data = JSON.parse(event.data) as Message;
      this.setState(data);
    });
  }

  public render() {
    const { average, current } = this.state;
    return (
      <CssBaseline>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to React</h1>
          </header>

          <div>
            <p>Lifetime Average CPU Temp is {average.toFixed(2)}C</p>
            <p>Current CPU Temp is {current.toFixed(2)}</p>
          </div>
        </div>
      </CssBaseline>
    );
  }
}

export default App;
