export const fetchBooks = () => {
  return new Promise((resolve,reject) => {
    fetch('https://api.myjson.com/bins/134o9q', {
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
