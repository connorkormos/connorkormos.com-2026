import { useState } from "react";
import Projects from "./components/Projects";
import GitHub from "./components/GitHub";
import TechStack from "./components/TechStack";
import Hello from "./components/Hello";
import TechStackFlow from "./components/TechStackFlow";
import Terminal from "./components/Terminal";

import "./App.css";

function App() {
  const [terminalIsExpanded, setTerminalIsExpanded] = useState(false);
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      className="app"
    >
      <div
        className={`${!isMobile ? terminalIsExpanded ? "flexColumnContentContainer" : "flexRowContentContainer" : "flexColumnContentContainer"}`}
        // fix this ismobile tertiary condition for styling
        style={isMobile ? { gap: '2.5rem'} : undefined}
      >
        <Hello terminalIsExpanded={terminalIsExpanded} />
        <Terminal
          terminalIsExpanded={terminalIsExpanded}
          setTerminalIsExpanded={setTerminalIsExpanded}
        />
      </div>
      {/* <About /> */}
      <Projects />
      {/* <div className="flexRowContentContainer"> */}
        <TechStackFlow />
        {/* <TechStackSecondary /> */}
      {/* </div> */}
      <TechStack />
      <GitHub />
    </div>
  );
}

export default App;
