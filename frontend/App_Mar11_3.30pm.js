import React, { useState, useEffect } from "react";
import axios from "axios";

const CrosswordApp = () => {
  const [words, setWords] = useState("");
  const [crossword, setCrossword] = useState(null);
  const [error, setError] = useState(null);
  const [gridSize, setGridSize] = useState(21);
  const [colorized, setColorized] = useState(false);
  const [wordColorMap, setWordColorMap] = useState(new Map());
  const [wordNumbers, setWordNumbers] = useState({});

  useEffect(() => {
    if (crossword) {
      setGridSize(crossword.grid.length);
    }
  }, [crossword]);

  const colors = ["#FF6B6B", "#6B6BFF", "#FFD93D"]; 
  let colorIndex = 0;

  const assignWordColors = (words) => {
    const newColorMap = new Map(wordColorMap);
    words.forEach((word) => {
      if (!newColorMap.has(word)) {
        newColorMap.set(word, colors[colorIndex % colors.length]);
        colorIndex++;
      }
    });
    setWordColorMap(newColorMap);
  };

  const handleGenerate = async () => {
    setError(null);
    try {
      const wordList = words.split(",").map((w) => w.trim().toUpperCase());
      const response = await axios.post("http://localhost:5001/generate", { words: wordList });
      console.log("Backend Response:", response.data);

      if (!response.data.grid) {
        throw new Error("Invalid response from backend");
      }

      assignWordColors(response.data.placed_words);

      const newWordNumbers = {};
      let horizontalCount = 1;
      let verticalCount = 1;

      response.data.placed_words.forEach((word) => {
        const position = response.data.word_positions[word];
        if (position) {
          const [row, col, direction] = position;
          if (direction === "HORIZONTAL") {
            newWordNumbers[`${row},${col}`] = horizontalCount++;
          } else {
            newWordNumbers[`${row},${col}`] = verticalCount++;
          }
        }
      });

      setCrossword(response.data);
      setWordNumbers(newWordNumbers);
    } catch (err) {
      setError("Error generating crossword. Please check input and try again.");
      console.error("Error in handleGenerate:", err);
    }
  };

  const toggleColorMode = () => {
    setColorized(!colorized);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-6">Crossword Puzzle Generator</h1>
      <div className="flex flex-col items-center w-full">
        <label className="text-lg font-medium mb-2">Enter words and click generate</label>
        <textarea
          className="border p-4 w-3/4 h-32 text-center text-lg shadow-md bg-gray-50 rounded-lg resize-none"
          placeholder="Enter words separated by commas..."
          value={words}
          onChange={(e) => setWords(e.target.value)}
        />
      </div>
      <div className="mt-6 flex gap-6">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600" onClick={handleGenerate}>
          Generate Crossword
        </button>
        <button className="px-12 py-6 bg-purple-500 text-white rounded-lg text-2xl hover:bg-purple-600 transition-transform transform scale-110" onClick={toggleColorMode}>
          {colorized ? "Switch to Black & White" : "Colorize Words"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {crossword && crossword.grid && (
        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Generated Crossword</h2>
          <div
            className="grid border"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              gap: "2px",
              width: "90vw",
              maxWidth: "900px",
              height: "90vw",
              maxHeight: "900px",
            }}
          >
            {crossword.grid.flat().map((cell, index) => {
              const rowIndex = Math.floor(index / gridSize);
              const colIndex = index % gridSize;
              const isBlack = crossword.black_boxes[rowIndex]?.[colIndex] || false;

              let backgroundColor = "white";
              let textColor = "black";
              let fontWeight = "normal";

              if (isBlack) {
                backgroundColor = "black";
                textColor = "white";
                cell = ""; 
              } else if (colorized && cell) {
                const word = crossword.placed_words.find((w) => w.includes(cell));
                if (word && wordColorMap.has(word)) {
                  textColor = wordColorMap.get(word);
                  backgroundColor = `${wordColorMap.get(word)}40`;
                  fontWeight = "bold";
                }
              }

              const wordNumber = wordNumbers[`${rowIndex},${colIndex}`] || null;

              return (
                <div key={index} className="relative flex items-center justify-center border"
                  style={{
                    backgroundColor,
                    color: textColor,
                    fontWeight,
                    width: "100%",
                    height: "100%",
                    fontSize: "175%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px",
                    position: "relative",
                  }}
                >
                  {wordNumber && (
                    <span style={{ position: "absolute", top: "2px", left: "3px", fontSize: "60%", fontWeight: "bold", color: "black" }}>
                      {wordNumber}
                    </span>
                  )}
                  <span style={{ position: "absolute", top: "1px", right: "3px", fontSize: "50%", fontWeight: "bold", color: "green" }}>
                    {index + 1}
                  </span>
                  {cell || ""}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrosswordApp;