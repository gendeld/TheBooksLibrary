import React, { Component } from 'react';
import './App.css';
import { fetchBooks } from './lib/functions.js';
import { Helmet } from "react-helmet";
import { Grid, Col } from 'react-bootstrap';
import Book from './components/book';
import Edit from './components/edit';

/* The Books Library show you amazing books */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      bookTitles: []
    };
  }

  async componentDidMount() {
    const books = await fetchBooks();
    if(!!books) {
      const bookTitles = this.mapTitles(books);
      this.setState({books, bookTitles});
    }
  }

  shouldComponentUpdate(nextProps,nextState) {
    return (JSON.stringify(nextState)!==JSON.stringify(this.state));
  }

  /* Return a list of book titles from a list of books */
  mapTitles(books) {
    return books.map((book) => {
      return book.title;
    });
  }

  /* Add new book to the start of the deck */
  submitBook(book) {
    const { books } = this.state;
    const { title, author, date } = book;
    let newBooks = books.slice();
    newBooks.unshift({
      title,
      author,
      date
    });
    const newBookTitles = this.mapTitles(newBooks);
    this.setState({
      books: newBooks,
      bookTitles: newBookTitles
    });
  }

  /* Removes a given book from state */
  removeBook(book) {
    var array = [...this.state.books];
    var i=0;
    var flag=false;
    while(!flag&&i<array.length) {
      if(JSON.stringify(array[i])==JSON.stringify(book)) {
        array.splice(i,1);
        flag=true;
      }
      i++;
    }
    const newBookTitles = this.mapTitles(array);
    this.setState({books: array, bookTitles: newBookTitles});
  }

  render() {
    const { books, bookTitles } = this.state;
    return (
      <div id="page">
        <Helmet>
          <meta charSet="utf-8" />
          <title>The Books Library</title>
          <link rel="icon" type="image/png" href="favicon.ico?v=3" sizes="48x48" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossOrigin="anonymous" />
        </Helmet>
        <div id="logo">
          The Books Library
        </div>
        <Edit isForAdd={true} submitBook={this.submitBook.bind(this)} />
        <Grid>
          {
            books.length>0 ?
              books.map((book, index) => {
                return (
                  <Col xs={12} sm={6} lg={4} key={book.title+book.author}>
                    <Book item={book} deleteFromArray={this.removeBook.bind(this)} bookTitles={bookTitles} />
                  </Col>
                );
              })
            :
              <div id="empty">{`There's nothing here...`}<br />Weird...</div>
          }
        </Grid>
      </div>
    );
  }
}

export default App;
