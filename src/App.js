import React, { Component } from 'react';
import './App.css';
import { fetchBooks } from './lib/functions.js';
import { Helmet } from "react-helmet";
import { Grid, Col } from 'react-bootstrap';
import Book from './components/book';
import Edit from './components/edit';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    };
  }
  async componentDidMount() {
    const books = await fetchBooks();
    if(!!books) {
      this.setState({books});
    }
  }
  shouldComponentUpdate(nextProps,nextState) {
    return (JSON.stringify(nextState)!==JSON.stringify(this.state));
  }

  submitBook(book) {
    const { books } = this.state;
    const { title, author, date } = book;
    let newBooks = books.slice();
    newBooks.unshift({
      title,
      author,
      date
    });
    this.setState({
      books: newBooks
    });
  }

  render() {
    const { books } = this.state;
    return (
      <div id="page">
        <Helmet>
          <meta charSet="utf-8" />
          <title>The Books Library</title>
          <link rel="icon" type="image/png" href="favicon.ico?v=3" sizes="48x48" /><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossOrigin="anonymous" />
        </Helmet>
        <div id="logo">
          The Books Library
        </div>
        <Edit isForAdd={true} submitBook={this.submitBook.bind(this)} />
        <Grid>
          {
            books.length>0 ?
              books.map((book) => {
                console.warn("book: "+JSON.stringify(book));
                return (
                  <Col xs={12} sm={6} lg={4} key={book.title+book.author}>
                    <Book item={book} />
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
