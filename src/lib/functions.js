export const fetchBooks = () => {
  return new Promise((resolve,reject) => {
    fetch('http://127.0.0.1:8080/books.json', {
      mode: 'cors'
    })
    .then(async(response) => {
      if(!!response) {
        const books = await response.json();
        if(!!books&&books.length>0) {
          resolve(books);
        }
        else {
          throw("No books to fetch :(");
        }
      }
      else {
        throw("No books to fetch :(");
      }
    })
    .catch((err) => {
      console.warn(err);
      reject();
    });
  });

};
