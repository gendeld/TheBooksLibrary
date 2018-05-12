import React, { PureComponent } from 'react';

import './style.css';

/* Cover photo for books */
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
