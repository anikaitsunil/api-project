//REQUIREMENT FOR OUR PROJECT

//We are a book management company 

//BOOKS
//ISBN, title, pub.date , language , number of pages, author[], category[]

//AUTHORS
//ID, name, books[], 

//PUBLICATIONS
//ID, name, books[]

//we have to design and code an API over this


//BOOKS 
//We need an API :-
//to get all the books                       DONE
//to get specific book                       DONE
//to get a list of books based on category   DONE
//to get a list of books based on languages


//AUTHORS
//We need an API:- 
//to get all the authors                     DONE
//to get a specific author
//to get a list of authors based on book     DONE

//PUBLICATION
//We need an API:-
//to get all publications                    DONE
//to get a specific publication
//to get a list of publications based on a book


//POST REQUESTS
//1.Add new book
//2.Add new publication
//3.Add new author


//PUT REQUESTS
//Update book details if author is changed

//DELETE REQUESTS
//Delete a book 
//Delete an author rom book
//Delete author from book and relted book from author

//Schema -> Blueprint of how data has to be constructed
//MongoDB Schema less
//Mongoose Schema
//mongoose helps in validation, helps check relationship with other data
//model -> document model of MogoDB
//Schema -> Model -> use them (Workflow)