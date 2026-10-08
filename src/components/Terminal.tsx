import React, { useLayoutEffect, useRef, useState } from "react";

import { Connor } from "../lib/Connor.ts";

import "../App.css";
import "./Terminal.css";

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

export default function Terminal({
  terminalIsExpanded,
  setTerminalIsExpanded,
}: {
  terminalIsExpanded: boolean;
  setTerminalIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {

  const isMobile = window.innerWidth <= 768;

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (isMobile) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX - dragOffset.x,
      y: event.clientY - dragOffset.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (isMobile) return;

    setDragOffset({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const initialConnorData = {
    name: `${Connor.firstName} ${Connor.lastName}`,
    role: Connor.roles[0],
    yearsExperience: Connor.yearsExperience,
    email: Connor.email,
    phone: Connor.phone,
    location: Connor.location,
  };

  const promptInputLabel = (
    <span className="greenText">
      connor@kormos
      <span className="whiteText">
        :<span className="blueText">~</span>
        $&nbsp;
      </span>
    </span>
  );

  // const [entries, setEntries] = useState<string[]>([]);

  const [promptInputValue, setPromptInputValue] = useState("");

  const valueStringReturn = (value: any) => {
    let className = "";
    if (typeof value === "string") className = "purpleText";
    if (typeof value === "number") className = "goldText";

    return (
      <span className={className}>
        {typeof value === "string"
          ? `'${value}'`
          : typeof value === "number"
            ? `${value}`
            : JSON.stringify(value)}
      </span>
    );
  };
  const initialConnorDataLines = Object.entries(initialConnorData).map(
    ([key, value]) => (
      <p className="terminalOutputLine" key={key}>
        <span className="">{key}: </span>
        {valueStringReturn(value)},{/* {value}, */}
      </p>
    ),
  );

  const [terminalTextContent, setTerminalTextContent] = useState(
    <>
      {" "}
      <p className="terminalPrompt">
        {promptInputLabel}
        <span>connor</span>
        {/* <span>cat ~/about.json</span> */}
      </p>
      <div className="terminalOutput">
        {"{"}
        {initialConnorDataLines}
        {"}"}
      </div>
    </>,
  );

  const handleTerminalInputSubmit = (input: string) => {
    const normalizedInput = normalizeKey(input);
    if (normalizedInput === "clear") {
      return setTerminalTextContent(<></>);
    }
    if (normalizedInput === "connor" || normalizedInput === "about") {
      setTerminalTextContent((prevContent) => (
        <>
          {prevContent}
          <p className="terminalPrompt">
            {promptInputLabel}
            <span>{input}</span>
          </p>
          <div className="terminalOutputLine">
            {"{"}
            {initialConnorDataLines}
            {"}"}
          </div>
        </>
      ));
      return;
    }
    const matchingKey = (
      Object.keys(Connor) as Array<keyof typeof Connor>
    ).find((key) => normalizeKey(String(key)) === normalizedInput);
    const connorData =
      matchingKey !== undefined ? Connor[matchingKey] : undefined;
    setTerminalTextContent((prevContent) => (
      <>
        {prevContent}
        <p className="terminalPrompt">
          {promptInputLabel}
          <span>{input}</span>
        </p>
        <div className="terminalOutput">
          {connorData !== undefined ? (
            Array.isArray(connorData) ? (
              <>
                {"["}
                {connorData.map((item, index) => {
                  return (
                    <div className="terminalOutputLine" key={index}>
                      {typeof item === "object" ? (
                        <>
                          {"{"}
                          {Object.entries(item).map(([key, value]) => (
                            <p key={key}>
                              <span className="">{key}: </span>
                              {valueStringReturn(value)},
                            </p>
                          ))}
                          {"},"}
                        </>
                      ) : (
                        valueStringReturn(item)
                      )}
                    </div>
                  );
                })}
                {"]"}
              </>
            ) : typeof connorData === "object" ? (
              <>
                {"{"}
                {Object.entries(connorData).map(([key, value]) => (
                  <p className="terminalOutputLine" key={key}>
                    <p className="greenText">{key}: </p>
                    {valueStringReturn(value)},
                  </p>
                ))}
                {"}"}
              </>
            ) : (
              valueStringReturn(connorData)
            )
          ) : (
            <span className="">Command "{input}" not found</span>
          )}
        </div>
      </>
    ));
  };

  const terminalContentRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const terminal = terminalContentRef.current;

    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }, [terminalTextContent]);

  const handleTerminalBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      terminalInputRef.current?.focus();
    }
  };

  const [caretPosition, setCaretPosition] = useState(0);

  const handleTerminalSelectionChange = (
    e: any,
    keyPress: "left" | "right" | "character" | "backspace" | "enter",
  ) => {

    if (keyPress === "left" && e.target.selectionEnd > 0) {
      setCaretPosition(e.target.selectionEnd - 1);
    } else if (
      keyPress === "right" &&
      e.target.selectionEnd < e.target.value.length
    ) {
      setCaretPosition(e.target.selectionEnd + 1);
    } else if (keyPress === "character") {
      setCaretPosition(e.target.selectionEnd + 1);
    } else if (keyPress === "backspace" && e.target.selectionEnd > 0) {
      setCaretPosition(e.target.selectionEnd - 1);
    } else if (keyPress === "enter") {
      setCaretPosition(0);
    }
    else {
      setCaretPosition(e.target.selectionEnd);
    }
    // setCaretPosition(e.target.selectionEnd);
  };

  return (
    <div
      className={`terminalContainer${terminalIsExpanded ? " expanded" : ""}`}
      style={{
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
        transition: isDragging ? "none" : undefined,
      }}
    >
      <div
        className="terminalTopBar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <div
          className="terminalButtons"
          style={{ fontSize: `${terminalIsExpanded ? 1 : 0.5}rem` }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="terminalButton red">
            <span className="terminalButtonText whiteText">x</span>
          </div>
          <div className="terminalButton yellow">
            <span className="terminalButtonText whiteText">-</span>
          </div>
          <div
            className="terminalButton green"
            onClick={() => {
              if (isMobile) return;
              setTerminalIsExpanded((isExpanded) => !isExpanded);
            }}
          >
            <span className="terminalButtonText whiteText">+</span>
          </div>
        </div>
      </div>
      <div
        className="terminalContent"
        ref={terminalContentRef}
        onClick={handleTerminalBackgroundClick}
      >
        {terminalTextContent}
        <p className="terminalPrompt">
          {promptInputLabel}
          <input
            ref={terminalInputRef}
            className="terminalInput"
            value={promptInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleTerminalInputSubmit(promptInputValue);
                setPromptInputValue("");
                handleTerminalSelectionChange(e, "enter");
              } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                // e.preventDefault();
                handleTerminalSelectionChange(
                  e,
                  e.key === "ArrowLeft" ? "left" : "right",
                );
              } else if (e.key.length === 1) {
                handleTerminalSelectionChange(e, "character");
              } else if (e.ctrlKey && e.key === "Backspace") {
                e.preventDefault();
                e.stopPropagation();
              } else if (e.key === "Backspace") {
                handleTerminalSelectionChange(e, "backspace");
              } else if (e.key === 'Tab') {
                e.preventDefault();
              }
            }}
            onChange={(e) => setPromptInputValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <span
            className={`terminalCaret${terminalIsExpanded ? " expanded" : ""}`}
            style={{ left: `min(${caretPosition + 19}ch, 92.5%)` }}
          ></span>
        </p>
      </div>
    </div>
  );
}
