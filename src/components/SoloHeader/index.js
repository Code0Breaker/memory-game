import React from "react";
import Timer from "../../containers/Timer";
export default function SoloHeader({seconds, delay, won, score, movies}) {
  return (
    <div className="solo-header">
      <div className="score">
        <h3 style={{ marginRight: 4 }}>Score:</h3>
        <div className="whiteBox">{score}</div>
      </div>
      <div className="rightStyles">
        <div
          className="whiteBox"
          style={{ paddingTop: 8, paddingBottom: 8, marginRight: 20 }}
        >
          <div className="moves">
            <h3 style={{ marginRight: 4 }}>Moves:</h3>
            <div className="num">{movies}</div>
          </div>
        </div>
        <div
          className="whiteBox"
          style={{ minWidth: "130px", textAlign: "center" }}
        >
          <div className="timer">
            <Timer seconds={seconds} delay={delay} stop={won} />
          </div>
        </div>
      </div>
    </div>
  );
}
