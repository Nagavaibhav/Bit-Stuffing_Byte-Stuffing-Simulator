import "./App.css";

import { useMemo, useState } from "react";

const topicContent = {
  byte: {
    id: "byte",
    title: "Byte Stuffing",
    subtitle: "Character-oriented framing",
    definition:
      "Byte stuffing adds a special escape byte before any data byte that matches a control flag, so the receiver can still detect the real frame boundaries.",
    purpose:
      "It keeps payload data transparent even when the payload contains the same characters used to mark the start or end of the frame.",
    usage:
      "Used in byte-oriented protocols and serial communication systems where control markers are sent as full bytes.",
    stepwise: [
      "Choose a flag byte to mark the start and end of the frame.",
      "Choose an escape byte to protect special control bytes inside the payload.",
      "Read each payload byte one by one.",
      "If the byte matches the flag or escape byte, insert the escape byte first.",
      "Transmit the framed output with starting and ending flag bytes.",
    ],
    parameters: ["Flag byte", "Escape byte", "Payload sequence", "Framed output"],
    workedExample: "Payload: A B F E C, Flag: F, Escape: E -> Framed output: F A B E F E E C F",
    video: {
      title: "Byte Stuffing Video",
      description: "A topic-specific explainer for byte stuffing, framing, and escape-byte handling.",
      url: "https://www.youtube.com/watch?v=llBPd2y4yw8",
      embed: "https://www.youtube.com/embed/llBPd2y4yw8",
    },
    references: [
      {
        label: "RFC 1662: PPP in HDLC-like Framing",
        url: "https://www.ietf.org/rfc/rfc1662.txt",
      },
      {
        label: "GeeksforGeeks: Framing in Data Link Layer",
        url: "https://www.geeksforgeeks.org/computer-networks/framing-in-data-link-layer/",
      },
    ],
  },
  bit: {
    id: "bit",
    title: "Bit Stuffing",
    subtitle: "Bit-oriented framing",
    definition:
      "Bit stuffing inserts a 0 after every sequence of five consecutive 1s so the flag pattern 01111110 does not accidentally appear inside user data.",
    purpose:
      "It preserves synchronization and protects the special flag pattern used by HDLC-like protocols.",
    usage:
      "Common in bit-oriented protocols such as HDLC, where communication is analyzed bit by bit instead of character by character.",
    stepwise: [
      "Use the standard flag pattern 01111110 to mark frame boundaries.",
      "Scan the bitstream from left to right.",
      "Count consecutive 1 bits as they appear.",
      "Whenever five consecutive 1s are detected, insert a stuffed 0 bit.",
      "Reset the counter and continue until the entire bitstream is sent.",
    ],
    parameters: ["Input bitstream", "Flag pattern", "Consecutive 1 count", "Stuffed output"],
    workedExample: "Input: 1111101111110 -> Stuffed output: 111110011111010",
    video: {
      title: "Bit Stuffing Video",
      description: "A separate explainer focused on HDLC-style bit stuffing and the five-ones rule.",
      url: "https://www.youtube.com/watch?v=NZTKA2LdfLo",
      embed: "https://www.youtube.com/embed/NZTKA2LdfLo",
    },
    references: [
      {
        label: "RFC 1662: PPP in HDLC-like Framing",
        url: "https://www.ietf.org/rfc/rfc1662.txt",
      },
      {
        label: "GeeksforGeeks: Framing in Data Link Layer",
        url: "https://www.geeksforgeeks.org/computer-networks/framing-in-data-link-layer/",
      },
    ],
  },
};

const textbookReference = {
  label: "Andrew S. Tanenbaum and David J. Wetherall, Computer Networks",
  url: "https://www.oreilly.com/library/view/computer-networks-fifth/9780133485936/",
};

const virtualLabs = [
  {
    label: "Virtual Labs main portal",
    url: "https://www.vlab.co.in/",
  },
  {
    label: "Amrita Virtual Labs: Computer Networks Lab",
    url: "https://vlab.amrita.edu/?sub=3&brch=257",
  },
];

function buildByteStuffingSimulation(payload, flagByte, escapeByte) {
  const normalizedPayload = payload.toUpperCase();
  const steps = [];
  const stuffedCharacters = [];

  normalizedPayload.split("").forEach((character, index) => {
    const shouldEscape = character === flagByte || character === escapeByte;

    if (shouldEscape) {
      stuffedCharacters.push(escapeByte);
    }

    stuffedCharacters.push(character);

    steps.push({
      index: index + 1,
      action: shouldEscape
        ? `Control character detected, so ${escapeByte} is inserted before ${character}.`
        : `${character} is copied directly into the frame body.`,
      outputSoFar: stuffedCharacters.join(" "),
    });
  });

  return {
    stuffedPayload: stuffedCharacters.join(" "),
    framedOutput: [flagByte, ...stuffedCharacters, flagByte].join(" "),
    steps,
  };
}

function buildBitStuffingSimulation(bitStream) {
  const cleanBits = bitStream.replace(/[^01]/g, "");
  const steps = [];
  const output = [];
  let consecutiveOnes = 0;

  cleanBits.split("").forEach((bit, index) => {
    output.push(bit);
    consecutiveOnes = bit === "1" ? consecutiveOnes + 1 : 0;

    let action = `Bit ${bit} copied to output.`;

    if (consecutiveOnes === 5) {
      output.push("0");
      action = "Five consecutive 1s reached, so a stuffed 0 is inserted.";
      consecutiveOnes = 0;
    }

    steps.push({
      index: index + 1,
      action,
      outputSoFar: output.join(""),
    });
  });

  return {
    cleanBits,
    stuffedPayload: output.join(""),
    framedOutput: `01111110 ${output.join("")} 01111110`,
    steps,
  };
}

function ScrollButton({ label, targetId, kind = "secondary" }) {
  return (
    <button
      className={`nav-button ${kind}`}
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })}
    >
      {label}
    </button>
  );
}

function App() {
  const [activeTopic, setActiveTopic] = useState("byte");
  const [showHelp, setShowHelp] = useState(false);
  const [showDeveloper, setShowDeveloper] = useState(false);

  const [bytePayload, setBytePayload] = useState("ABFEFC");
  const [flagByte, setFlagByte] = useState("F");
  const [escapeByte, setEscapeByte] = useState("E");
  const [bitStream, setBitStream] = useState("011111101111110111110");

  const byteSimulation = useMemo(
    () => buildByteStuffingSimulation(bytePayload, flagByte || "F", escapeByte || "E"),
    [bytePayload, flagByte, escapeByte]
  );
  const bitSimulation = useMemo(() => buildBitStuffingSimulation(bitStream), [bitStream]);

  const activeContent = topicContent[activeTopic];

  const handleDownload = () => {
    const summary = `${activeContent.title}

Definition: ${activeContent.definition}
Purpose: ${activeContent.purpose}
Where it is used: ${activeContent.usage}
Worked example: ${activeContent.workedExample}`;
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeContent.title.toLowerCase().replace(/\s+/g, "-")}-notes.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <nav className="top-navbar" aria-label="Utility navigation">
        <button className="nav-button secondary top-nav-button" onClick={() => setShowHelp(true)}>
          Help
        </button>
        <button className="nav-button secondary top-nav-button" onClick={handleDownload}>
          Download
        </button>
        <button className="nav-button secondary top-nav-button" onClick={() => setShowDeveloper(true)}>
          Developed by
        </button>
      </nav>

      <header className="hero-section">
        <div className="hero-copy">
          <h1>Byte Stuffing and Bit Stuffing Simulation</h1>
          <p className="hero-text">
            Study framing concepts through two focused tabs with explanation, live simulation, videos, and references for each topic.
          </p>

          <div className="button-row">
            <ScrollButton label="Learn" targetId="concept-tabs" kind="primary" />
            <ScrollButton label="Run Simulation" targetId="simulation-panel" kind="secondary" />
            <button
              className="nav-button secondary"
              onClick={() => window.open("https://www.vlab.co.in/", "_blank", "noopener,noreferrer")}
            >
              Virtual Lab Reference
            </button>
          </div>
        </div>
      </header>

      <main className="content-layout">
        <section className="tab-bar-section" id="concept-tabs">
          <div className="topic-tabs main-tabs compact-tabs">
            {Object.values(topicContent).map((topic) => (
              <button
                key={topic.id}
                className={`topic-tab ${activeTopic === topic.id ? "active" : ""}`}
                onClick={() => setActiveTopic(topic.id)}
              >
                <span>{topic.title}</span>
                <small>{topic.subtitle}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="learn-section">
          <div className="section-heading">
            <h2>{activeContent.title}</h2>
          </div>

          <article className="topic-card visible solo-card">
            <div className="topic-headline">
              <div>
                <p className="topic-subtitle">{activeContent.subtitle}</p>
                <h3>{activeContent.title}</h3>
              </div>
              <span className="topic-pill">Focused Tab</span>
            </div>

            <p><strong>Definition:</strong> {activeContent.definition}</p>
            <p><strong>Purpose:</strong> {activeContent.purpose}</p>
            <p><strong>Where it is used:</strong> {activeContent.usage}</p>
            <p><strong>Worked example:</strong> {activeContent.workedExample}</p>

            <div className="stepwise-block">
              <h4>Stepwise explanation</h4>
              <ol>
                {activeContent.stepwise.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="parameter-list">
              {activeContent.parameters.map((parameter) => (
                <span key={parameter}>{parameter}</span>
              ))}
            </div>
          </article>
        </section>

        <section className="simulator-section" id="simulation-panel">
          <div className="section-heading">
            <h2>{activeContent.title} Simulation</h2>
          </div>

          {activeTopic === "byte" ? (
            <article className="sim-card solo-card">
              <div className="sim-card-head">
                <h3>Byte Stuffing Simulator</h3>
                <span>Character-oriented framing</span>
              </div>

              <div className="input-grid three-up">
                <label>
                  Payload
                  <input value={bytePayload} maxLength={18} onChange={(event) => setBytePayload(event.target.value.toUpperCase())} />
                </label>
                <label>
                  Flag byte
                  <input value={flagByte} maxLength={1} onChange={(event) => setFlagByte(event.target.value.toUpperCase())} />
                </label>
                <label>
                  Escape byte
                  <input value={escapeByte} maxLength={1} onChange={(event) => setEscapeByte(event.target.value.toUpperCase())} />
                </label>
              </div>

              <div className="output-box">
                <p><strong>Input payload:</strong> {bytePayload || "-"}</p>
                <p><strong>Stuffed payload:</strong> {byteSimulation.stuffedPayload || "-"}</p>
                <p><strong>Framed output:</strong> {byteSimulation.framedOutput}</p>
              </div>

              <div className="step-list">
                {byteSimulation.steps.map((step) => (
                  <div key={`byte-${step.index}`} className="step-item">
                    <strong>Step {step.index}</strong>
                    <p>{step.action}</p>
                    <code>{step.outputSoFar}</code>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {activeTopic === "bit" ? (
            <article className="sim-card solo-card">
              <div className="sim-card-head">
                <h3>Bit Stuffing Simulator</h3>
                <span>HDLC-style bit framing</span>
              </div>

              <div className="input-grid">
                <label>
                  Bitstream input
                  <input value={bitStream} onChange={(event) => setBitStream(event.target.value.replace(/[^01]/g, ""))} />
                </label>
              </div>

              <div className="output-box">
                <p><strong>Clean input bits:</strong> {bitSimulation.cleanBits || "-"}</p>
                <p><strong>Stuffed payload:</strong> {bitSimulation.stuffedPayload || "-"}</p>
                <p><strong>Framed output:</strong> {bitSimulation.framedOutput}</p>
              </div>

              <div className="step-list">
                {bitSimulation.steps.map((step) => (
                  <div key={`bit-${step.index}`} className="step-item">
                    <strong>Step {step.index}</strong>
                    <p>{step.action}</p>
                    <code>{step.outputSoFar}</code>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </section>

        <section className="video-section">
          <div className="section-heading">
            <h2>{activeContent.video.title}</h2>
          </div>

          <div className="video-card solo-card">
            <div>
              <h3>{activeContent.video.title}</h3>
              <p>{activeContent.video.description}</p>
              <a href={activeContent.video.url} target="_blank" rel="noreferrer">
                Open on YouTube
              </a>
            </div>
            <iframe
              src={activeContent.video.embed}
              title={activeContent.video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        <section className="references-section">
          <div className="section-heading">
            <h2>{activeContent.title} References</h2>
          </div>

          <div className="reference-grid">
            <article className="reference-card">
              <h3>Prescribed Textbook</h3>
              <ul>
                <li>
                  <a href={textbookReference.url} target="_blank" rel="noreferrer">
                    {textbookReference.label}
                  </a>
                </li>
              </ul>
            </article>

            <article className="reference-card">
              <h3>Topic References</h3>
              <ul>
                {activeContent.references.map((item) => (
                  <li key={item.url}>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </article>

            <article className="reference-card">
              <h3>Virtual Lab Reference</h3>
              <ul>
                {virtualLabs.map((item) => (
                  <li key={item.url}>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </main>

      {showHelp ? (
        <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>How to use this app</h3>
            <p>1. Choose one of the two tabs at the top.</p>
            <p>2. Read the concept explanation and stepwise working for that topic.</p>
            <p>3. Use the simulator section for live input and output.</p>
            <p>4. Watch the separate video and use the references section for submission support.</p>
            <button className="nav-button primary" onClick={() => setShowHelp(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {showDeveloper ? (
        <div className="modal-backdrop" onClick={() => setShowDeveloper(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>Developed by</h3>

            <div className="profile-section">
              <p className="profile-section-title"><b>Developers:</b></p>
              <div className="profile-list">
                <div className="profile-item">
                  <img className="profile-photo" src="/nagavaibhav.png" alt="Nagavaibhav N" />
                  <div>
                    <p className="profile-name">Nagavaibhav N</p>
                    <p className="profile-role">24BAI1104</p>
                  </div>
                </div>
                <div className="profile-item">
                  <img className="profile-photo" src="/meiyappan.jpeg" alt="Meiyappan K" />
                  <div>
                    <p className="profile-name">Meiyappan K</p>
                    <p className="profile-role">24BAI1143</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <p className="profile-section-title"><b>Guided By:</b></p>
              <div className="profile-list">
                <div className="profile-item">
                  <img className="profile-photo" src="/swaminathan_sir.jpg" alt="Dr. Swaminathan A" />
                  <div>
                    <p className="profile-name">Dr. Swaminathan A</p>
                    <p className="profile-role">Guide</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="nav-button primary" onClick={() => setShowDeveloper(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
