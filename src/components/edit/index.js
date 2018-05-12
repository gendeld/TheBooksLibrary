import React, { Component } from 'react';
import Input from '../input';
import './style.css';

const months = [{"name":"January","short":"Jan","number":1,"days":31},{"name":"February","short":"Feb","number":2,"days":28},{"name":"March","short":"Mar","number":3,"days":31},{"name":"April","short":"Apr","number":4,"days":30},{"name":"May","short":"May","number":5,"days":31},{"name":"June","short":"Jun","number":6,"days":30},{"name":"July","short":"Jul","number":7,"days":31},{"name":"August","short":"Aug","number":8,"days":31},{"name":"September","short":"Sep","number":9,"days":30},{"name":"October","short":"Oct","number":10,"days":31},{"name":"November","short":"Nov","number":11,"days":30},{"name":"December","short":"Dec","number":12,"days":31}];
const imagesPrefix = "http://127.0.0.1:8080/images/";
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth()+1;
const currentDay = today.getDate();

/* An edit/add form for books */
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: (props.isForAdd===true) ? false : true,
      title: !!props.book ? props.book.title : "",
      author: !!props.book ? props.book.author : "",
      date: !!props.book ? (!!props.book.date ? props.book.date : this.yearToDate(props.book.year)) : null,
    };
  }

  shouldComponentUpdate(nextProps,nextState) {
    return (
      JSON.stringify(nextState)!==JSON.stringify(this.state)||
      JSON.stringify(nextProps.book)!==JSON.stringify(this.props.book)||
      nextProps.isForAdd!==this.props.isForAdd
    );
  }


  /* Change handler that receives event and attribute and sets the state attribute to the event's value */
  inputChange(event, attr) {
    var ob = {};
    if(!!event&&!!event.target&&event.target.value) {
      ob[attr] = event.target.value;
    }
    else {
      ob[attr] = (attr=="date" ? null : "");
    }
    this.setState(ob);
  }

  /* Checks if title, once all spaces were removed, is longer than 0 and doesn't match any existing title */
  titleValid() {
    const { bookTitles, book } = this.props;
    const { title } = this.state;
    var validator = { isValid: false, text: "Title must contain at least one letter" };
    if(!!title) {
      if(!!book)
        console.warn(`bookTitle: ${book.title}, title: ${title}`);
      if(!!book && !!book.title && title.toLocaleLowerCase()===book.title.toLocaleLowerCase()) {
        validator = { isValid: true };
      }
      else {
        if(!!bookTitles&&!!bookTitles.includes(title.toLocaleLowerCase())) {
          validator.text = `There's already a book named ${title}`;
        }
        else {
          if(!!title&&title.replace(/ /g,"").length > 0) {
            validator = { isValid: true };
          }
        }
      }
    }
    return validator;
  }

  /* Checks if author contains two valid words */
  authorValid() {
    const { author } = this.state;
    var validator = { isValid: false, text: "Author name must contain at least two words" };
    const authorWords = author.split(" ");
    var authorValidWordsCount = 0;
    authorWords.forEach((word) => {
      if(!!word) {
        authorValidWordsCount++;
      }
    });
    if(authorValidWordsCount>1) {
      validator = { isValid: true };
    }
    return validator;
  }

  /* Checks if day has past or does not exist in given month */
  checkDay(isCurrentMonth,month,day) {
    if(day<=months[month-1].days) {
      if(isCurrentMonth===true) {
        if(day>currentDay) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /* Checks if month has past or does not exist */
  checkMonth(isCurrentYear,month) {
    if(month<13) {
      if(isCurrentYear===true) {
        if(month>currentMonth) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /* Checks if given date is valid */
  dateValid() {
    const { date } = this.state;
    var dateParts = (!date) ? [] : date.split("-");
    var validator = { isValid: false, text: "Please fill out date" };
    if (dateParts.length===3) {
      var year = parseInt(dateParts[0]);
      var month = parseInt(dateParts[1]);
      var day = parseInt(dateParts[2]);
      if(year<=currentYear) {
        var isCurrentYear = (year===currentYear);
        var isMonthValid = this.checkMonth(isCurrentYear,month);
        if(isMonthValid===true) {
          var isCurrentMonth = (isCurrentYear===true && month===currentMonth);
          var isDayValid = this.checkDay(isCurrentMonth,month,day);
          if(isDayValid===true) {
            validator = { isValid: true };
          }
          else {
            validator.text = (day<=months[month-1].days) ? 'Specified day is in the future' : `${months[month-1].name} only has ${months[month-1].days} days`;
          }
        }
        else {
          validator.text = `Specified month ${month<13 ? 'is in the future' : 'does not exist'}`;
        }
      }
      else {
        validator.text = "Specified year is in the future";
      }
    }
    return validator;
  }

  /* Clears all inputs and nulls state */
  clearAll() {
    this.inputTitle.clearValue();
    this.inputAuthor.clearValue();
    this.inputDate.clearValue();
    this.setState({
      isActive: false,
      title: "",
      author: "",
      date: null,
    });
  }

  /* Renders add, submit, and cancel buttons */
  renderButtons(titleValid,authorValid,dateValid) {
    const { submitBook, cancelEdit, isForAdd } = this.props;
    const { isActive, title, author, date } = this.state;
    const isValidBook = (titleValid.isValid&&authorValid.isValid&&dateValid.isValid);
    return (
      <div className="buttons">
        <div
          className={
            "add-book libraryButton " +
            (
              (isActive===false) ? "" :
              (
                (isValidBook===true) ?
                "valid-book" : "invalid-book"
              )
            )
          }
          onClick={() => {
            if(!isActive) {
              this.setState({isActive: true});
            }
            else {
              if(isValidBook===true) {
                let newBook = {title, author, date};
                submitBook(newBook);
                this.clearAll();
              }
            }
          }}
        >
          <div className={`${(isForAdd===true&&isActive===false) ? "" : "no-show"}`}>
            <img src={`${imagesPrefix}book-open-page-variant.png`} />
            Add a book
          </div>
          <div className={`${isActive===true ? "" : "no-show"}`}>
            <img src={`${imagesPrefix}check.png`} />
            Confirm
          </div>
        </div>
        <div
          className={
            "cancel libraryButton " +
            (
              (isActive===true) ? "" : "no-show no-height"
            )
          }
          onClick={() => {
            this.clearAll();
            if(!!cancelEdit) {
              /* Callback received from parent */
              cancelEdit();
            }
          }}
        >
          <div>
            <img src={`${imagesPrefix}close.png`} />
            Cancel
          </div>
        </div>
      </div>
    );
  }

  /* Transforms year to date
    "2017" -> "2017-01-01" */
  yearToDate(year) {
    if(!!year) {
      return year+"-01-01";
    }
    return null;
  }

  render() {
    const { isForAdd, book } = this.props;
    const { isActive, title, author, date } = this.state;
    const titleValid = this.titleValid();
    const authorValid = this.authorValid();
    const dateValid = this.dateValid();
    return (
      <div className="editModal">
        <div className={`book-form ${(isForAdd===true) ? "add-form" : "edit-form"} ${(isActive===true) ? "" : "no-show no-height"}`}>
          <div style={{height: 30}} />
          <Input initialValue={title} ref={el => this.inputTitle = el} type="text" placeholder="Title" attr="title" validator={titleValid} inputChange={this.inputChange.bind(this)} />
          <div style={{height: 30}} />
          <Input initialValue={author} ref={el => this.inputAuthor = el} type="text" placeholder="Author" attr="author" validator={authorValid} inputChange={this.inputChange.bind(this)} />
          <div style={{height: 30}} />
          <Input initialValue={date} ref={el => this.inputDate = el} type="date" placeholder="Release date" attr="date" validator={dateValid} inputChange={this.inputChange.bind(this)} />
          <div style={{height: 30}} />
        </div>
        { this.renderButtons(titleValid,authorValid,dateValid) }
      </div>
    );
  }
}

export default Edit;
