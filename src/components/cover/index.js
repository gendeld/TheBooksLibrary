import React, { PureComponent } from 'react';

import './style.css';

const imagesPrefix = "http://127.0.0.1:8080/"

class Cover extends PureComponent {
  render() {
    const { background, link } = this.props;
    return (
      <div className="cover" style={{backgroundImage: `url(${background})`}}>
        <a className="link" href={link} />
      </div>
    );
  }
}

export default Cover;
