import React, {Component} from 'react';
import {Jumbotron, Button, Panel} from 'react-bootstrap';
import './App.css';
import {Animate} from 'react-move';

// Create the ball that moves around the screen
class Ball extends Component {

    constructor(props) {
        super(props);
        this.state = {
            xLocation: 0,
            yLocation: 0
        };

        this.boundaries = {
            xMin: -10,
            xMax: 1340,
            yMin: -10,
            yMax: 40

        };
    }


    // Grab props from parent component
    componentWillReceiveProps(nextProps) {

        if (nextProps.reset === true) {
            this.setState({
                    xLocation: 0,
                    yLocation: 0
                }
            );

        } else if (nextProps.currentAxisValue === "X") {
            let nextXValue = this.state.xLocation;
            nextXValue += nextProps.currentMoveValue;
            this.setState({
                xLocation: nextXValue,

            });

        } else if (nextProps.currentAxisValue === "Y") {
            let nextYValue = this.state.yLocation;
            nextYValue += nextProps.currentMoveValue;
            this.setState({
                yLocation: nextYValue,
            });

        } else {
            // Do nothing
        }



    }

    render() {

        return (
            <div><p>The current x location is: {this.state.xLocation} | The current y location
                is: {this.state.yLocation}</p>
                <Animate

                    // Initial position for the ball
                    start={() => ({
                        xLocation: 0,
                        yLocation: 0,
                    })}

                    // Used to update the position of the ball
                    update={() => ({
                        xLocation: this.state.xLocation,
                        yLocation: this.state.yLocation,
                    })}>

                    {/* Pass down to the animation */}
                    {(state) => {
                        const {xLocation} = state;
                        const {yLocation} = state;

                        return (
                            <div style={{
                                backgroundColor: '#d9534f',
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: '#d9534f',
                                borderRadius: '50%',
                                height: 40,
                                width: 40,
                                position: 'relative',
                                WebkitTransform: `translate3d(${xLocation}px, ${-yLocation}px, 0)`,
                                transform: `translate3d(${xLocation}px, ${-yLocation}px, 0)`,
                            }}/>
                        )
                    }}
                </Animate>
            </div>
        );
    }
}

class GameBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAxisValue: 0,
            currentMoveValue: 0,
            isInside: true,
        };
    };

    handleKeyboardInput(e) {

        let code = e.keyCode ? e.keyCode : e.which;

        // Change X and Y values
        if (code === 40) { //down key
            this.setState({
                currentAxisValue: "Y",
                currentMoveValue: -10,
            });

        } else if (code === 38) { //up key
            this.setState({
                currentAxisValue: "Y",
                currentMoveValue: 10,
            });

        } else if (code === 37) { // left key
            this.setState({
                currentAxisValue: "X",
                currentMoveValue: -10,
            });

        } else if (code === 39) { // right key
            this.setState({
                currentAxisValue: "X",
                currentMoveValue: 10,
            });
        }
    };

    componentWillMount() {
        window.addEventListener('keydown', this.handleKeyboardInput.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyboardInput);
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.reset === true) {
            this.setState({
                    currentAxisValue: "Reset",
                    currentMoveValue: "Reset"
                }
            );
        }
    }

    render() {

        let boardStyle = {
            'marginLeft': '20px',
            'marginRight': '20px',
            'textAlign': 'center'
        };

        let headerText = "The ball's the current input is: " + this.state.currentAxisValue + " | " + this.state.currentMoveValue;

        return (

            <Panel style={boardStyle} header={headerText} bsStyle={this.state.currentAxisValue === "X" ? "info" : (this.state.currentAxisValue === "Y" ? "warning" : "default")}>
                <Ball currentAxisValue={this.state.currentAxisValue} currentMoveValue={this.state.currentMoveValue}
                      reset={this.props.reset}/>
            </Panel>
        )
    }

}

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            reset: false,
        };

        this.handleResetButton = this.handleResetButton.bind(this);
    }

    handleResetButton() {
        this.setState({
            reset: true
        });
    }

    // Update the state once the reset button has been pressed
    componentDidUpdate(prevProps, prevState) {

        if (this.state.reset === true) {
            this.setState({
                reset: prevState.reset
            });
        }
    }


    render() {

        const marginStyle = {
            'marginLeft': '20px'
        };

        return (
            <div>
                <Jumbotron>
                    <h1 style={marginStyle}>Welcome to Moving Objects</h1>
                    <p style={marginStyle}>Move the ball below using the arrow keys!</p>
                    <Button bsStyle="primary" style={marginStyle} onClick={this.handleResetButton}>Reset</Button>
                </Jumbotron>
                <GameBoard reset={this.state.reset}/>
            </div>
        );
    }
}

export default App;
