import React, { Component } from 'react';
import './style.css';

const borderColors = {
  inactive: '#9f796a',
  invalid: 'rgb(252, 87, 71)',
  valid: 'rgb(70, 214, 119)'
};

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      everChanged: false,
      pressed: false,
      hover: false
    };
  }

  shouldComponentUpdate(nextProps,nextState) {
    return nextState.everChanged!==this.state.everChanged||
    nextState.pressed!==this.state.pressed||
    nextState.hover!==this.state.hover||
    nextProps.placeholder!==this.props.placeholder||
    nextProps.type!==this.props.type||
    nextProps.attr!==this.props.attr||
    nextProps.initialValue!==this.props.initialValue||
    JSON.stringify(nextProps.validator)!==JSON.stringify(this.props.validator);
  }

  /* Changes the color of the input's border to correspond with validity */
  inputBorderColor() {
    const { validator } = this.props;
    const { everChanged } = this.state;
    return everChanged===false ? borderColors.inactive : ((!validator.isValid) ? borderColors.invalid : borderColors.valid);
  }

  /* Clears the input and the state */
  clearValue() {
    this.input.value = "";
    this.setState({
      everChanged: false,
      pressed: false,
      hover: false
    });
  }

  render() {
    const { initialValue, inputChange, placeholder, type, attr, validator } = this.props;
    const { everChanged, pressed, hover } = this.state;
    return (
      <div class="inputContainer"
        onMouseOver={() => {
          if(hover===false) {
            this.setState({hover: true});
          }
        }}
        onMouseLeave={() => {
          if(hover===true) {
            this.setState({hover: false});
          }
        }}
      >
        <input defaultValue={initialValue} ref={el => this.input = el} style={{borderColor: this.inputBorderColor()}} type={type} placeholder={placeholder}
          onChange={(event) => {
            /* Mark that the input has changes */
            if(everChanged===false) {
              this.setState({everChanged: true});
            }
            /* Trigger change handler */
            inputChange(event,attr);
          }}
          onFocus={() => {
            /* Mark that the input has focused */
            if(pressed===false) {
              this.setState({pressed: true});
            }
          }}
          onBlur={() => {
            /* Mark that the input has blurred */
            if(pressed===true) {
              this.setState({pressed: false});
            }
          }}
        />
        {
          (everChanged===true&&validator.isValid===false) &&
          <div style={{paddingLeft: ((pressed===true||hover===true)&&type==="date") ? '15%' : 0, marginRight: ((pressed===true||hover===true)&&type==="date") ? 55 : 0}} className="error">
            {validator.text}
          </div>
        }
      </div>
    );
  }
}

export default Input;
