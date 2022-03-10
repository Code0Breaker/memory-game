import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Difficulties from "../constants/Difficulties";
import Timer from "../containers/Timer";
import { init } from "../scripts/init";
import backFace from "../images/grooming-1801287_640.png";
import SoloHeader from "./SoloHeader";
import MemoryGameFooterList from "./Footer";
import axios from "axios";

class SinglePlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flippedIndexes: [],
      flippedKeys: [],
      items: [],
      seconds: 20,
      delay: 5,
      won: false,
      loading: true,
      score: 0,
      movies: 0,
    };

    this.setStateAsync = this.setStateAsync.bind(this);
  }

  async componentDidMount() {
    const words = [];
    const getData = await axios.get(
      `https://2321.freelancedeveloper.site/services/VocabulariesService.php?url=get&id=[1,2,3]`
    );
    await getData.data.map((item) => {
      if (item.words) {
        words.push(JSON.parse(item.words));
      }
    });

    const randomed = Object.assign(...words);
    let tr1 = document.getElementById("tr1").value;
    let tr2 = document.getElementById("tr2").value;
    let arr = [].slice(0, 10);
    let index = 0;
    for (const [key, value] of Object.entries(randomed)) {
      if (tr2 == "eng") {
        if (index < 10) {
          arr.push({ id: key, name: key });
          index++;
        }
      } else {
        if (index < 10) {
          arr.push({ id: key, name: key });
          arr.push({ id: key, name: value });
          index++;
        }
      }
    }

    const { seconds } = init(this.props.gameRoom.difficulty);

    if (tr2 == "eng") {
      await this.setStateAsync({
        //   ...this.state,
        items: [...arr, ...arr].sort((a, b) => 0.5 - Math.random()),
        seconds,
        loading: false,
      });
    } else {
      await this.setStateAsync({
        items: arr.sort((a, b) => 0.5 - Math.random()),
        seconds,
        loading: false,
      });
    }

    /* keep images open for some time to memorize */
    this.state.items.map((source, key) =>
      this.setState({ flippedIndexes: [...this.state.flippedIndexes, key] })
    );
    setTimeout(() => {
      this.setState({ flippedIndexes: [] });
    }, this.state.delay * 1000);

    /* show modal when time is ended and make game over */
    let timeEnded = setInterval(() => {
      if (this.props.timeEnded) {
        clearInterval(timeEnded);
        setTimeout(this.props.endGame, 5000);
      }
    }, 1000);
  }

  /* make setState work with async/await */
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async flipItem(index, key) {
    if (
      this.state.flippedKeys.length < 2 &&
      index !==
        this.state.flippedIndexes[this.state.flippedIndexes.length - 1] &&
      this.state.flippedIndexes.length !== this.state.items.length
    ) {
      await this.setStateAsync({
        flippedIndexes: [...this.state.flippedIndexes, index],
        flippedKeys: [...this.state.flippedKeys, key],
      });

      if (this.state.flippedKeys.length === 2) {
        setTimeout(async () => {
          if (this.state.flippedKeys[0] === this.state.flippedKeys[1]) {
            this.props.increaseTime(this.state.delay + 1);
            if (this.state.flippedIndexes.length === this.state.items.length) {
              this.setState({ won: true, score: updateScore });
              setTimeout(this.props.endGame, 5000);
            }
            let updateScore = this.state.score + 1;
            this.setState({ score: updateScore });
          } else {
            let flippedIndexes = this.state.flippedIndexes;
            flippedIndexes.splice(-2, 2);
            let updateMovie = this.state.movies + 1;
            // await this.setStateAsync({score: updateMovie });
            await this.setStateAsync({ flippedIndexes: flippedIndexes });
          }
          this.setState({ flippedKeys: [] });
        }, 1000);
      }
    }
  }

  render() {
    const setDifficulty = () => {
      const difficulty = document.getElementById("difficulty");
      if (difficulty) {
        if (difficulty.value === "Standard") {
          return "0.3s";
        } else if (difficulty.value === "Fast") {
          return "0.2s";
        } else {
          return "0.5s";
        }
      }
      console.log(difficulty, "sssssssssssssssssssssssssssssssssssss");
    };

    return (
      <div className="game-room">
        {this.state.loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ maxWidth: 930, background: "#f1f4f6" }}>
            <SoloHeader
              seconds={this.state.seconds}
              delay={this.state.delay}
              stop={this.state.won}
              score={this.state.score}
              movies={this.state.movies}
            />
            <div
              className={
                "arena " + Difficulties[this.props.gameRoom.difficulty]
              }
            >
              {this.state.items.map((source, i) => {
                return (
                  <div
                    key={i}
                    // style={{ transition: `all ${setDifficulty()} linear` }}
                    className={
                      ~this.state.flippedIndexes.indexOf(i)
                        ? "item matched"
                        : "item flipped flipped-background"
                    }
                    onClick={() => this.flipItem(i, source.id)}
                  >
                    <div className="front face">
                      <h4>{source.name}</h4>
                    </div>
                    <div className="back face" />
                  </div>
                );
              })}
            </div>
            <div className="sign-out" onClick={this.props.endGame}>
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <Modal isOpen={this.props.timeEnded} centered>
              <ModalHeader>Time is up</ModalHeader>
              <ModalBody>
                Your time is over. You will be redirected soon.
              </ModalBody>
            </Modal>
            <Modal isOpen={this.state.won} centered>
              <ModalHeader>You Won!</ModalHeader>
              <ModalBody>
                You won this round. You will be redirected soon.
              </ModalBody>
            </Modal>
          </div>
        )}
        <MemoryGameFooterList />
      </div>
    );
  }
}

SinglePlayer.propTypes = {
  gameRoom: PropTypes.object.isRequired,
  timeEnded: PropTypes.bool.isRequired,
  endGame: PropTypes.func.isRequired,
  increaseTime: PropTypes.func.isRequired,
};

export default SinglePlayer;
