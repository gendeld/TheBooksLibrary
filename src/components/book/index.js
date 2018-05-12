import React, { Component } from 'react';
import Cover from '../cover';
import Edit from '../edit';
import './style.css';

const imagesPrefix = "http://127.0.0.1:8080/"

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      author: null,
      date: null,
      isEditing: false
    };
  }

  shouldComponentUpdate(nextProps,nextState) {
    return (
      JSON.stringify(nextState)!==JSON.stringify(this.state)||
      JSON.stringify(nextProps.item)!==JSON.stringify(this.props.item)
    );
  }

  formatTitle(title) {
    if(!!title) {
      var words = title.split(" ");
      words.forEach((word,i) => {
        if(!!word) {
          let newWord = word.replace(/[^a-zA-Z]+/g, '');
          if(newWord.length>0) {
            words[i] = newWord.charAt(0).toUpperCase() + newWord.slice(1).toLowerCase();
          }
        }
      });
      return words.join(" ");
    }
    return "";
  }

  coverBackground(background) {
    if(!!background) {
      return `${imagesPrefix}${background}`;
    }
    return `${imagesPrefix}images/book-cover_template.jpg`;
  }

  submitBook(book) {
    const { title, author, date } = book;
    this.setState({ title, author, date });
    this.editToggle();
  }

  editToggle() {
    const { isEditing } = this.state;
    this.setState({isEditing: !isEditing});
  }

  render() {
    const { item } = this.props;
    const { title, author, date, isEditing } = this.state;
    /* Post-edit book */
    var newBook = null;
    if(!!title&&!!author&&!!date) {
      newBook = {title, author, date};
    }
    return (
      <div className="book">
        <Cover background={this.coverBackground(item.imageLink)} link={`${item.link}`} />
        <div className="divider"></div>
        <div className="info">
          <h3 className="title">
            <a href={`${item.link}`}>
              { this.formatTitle(!!title ? title : item.title) }
            </a>
          </h3>
          <h5 className="author">
            {`${!!author ? author : item.author}`}
          </h5>
          <h6 className="year">
            {`${!!date ? date : ((!!item.date) ? item.date : item.year)}`}
          </h6>
        </div>
        <div className="edit" onClick={this.editToggle.bind(this)}>
          <img src={`${imagesPrefix}images/pencil.png`} />
          <div className={`cancel-edit ${(isEditing===false) ? "cancel-edit-transform" : ""}`}>
            <img src={`${imagesPrefix}images/close.png`} />
          </div>
        </div>
        <div className="edit-form-container">
          <div className={`edit-form-inner ${isEditing===true ? "" : "edit-form-tranform"}`}>
          {
            isEditing &&
            <Edit book={!!newBook ? newBook : item} isForAdd={false} submitBook={this.submitBook.bind(this)} cancelEdit={this.editToggle.bind(this)} />
          }
          </div>
        </div>
      </div>
    );
  }
}

export default Book;
