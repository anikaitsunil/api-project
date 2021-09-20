require("dotenv").config();

const express = require("express");
const mongoose = require('mongoose');
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

//Models
const BookModel=require("./database/book");
const AuthorModel=require("./database/author");
const PublicationModel=require("./database/publication");

//INITIALISE
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("Connection established"));

/*
Route:                  /
Description      Get all the books
Access                   PUBLIC
Parameter                 NONE
Methods                   GET
*/
booky.get("/",async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route:                  /is
Description      Get specific book on ISBN
Access                   PUBLIC
Parameter                 ISBN
Methods                   GET
*/
booky.get("/is/:isbn",async (req,res) => {
    const getSpecificBooks = await BookModel.findOne({ISBN: req.params.isbn});
//!0=1, !1=0
    if(!getSpecificBooks){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({book: getSpecificBooks});
});

/*
Route:                  /c
Description      Get specific book on category
Access                   PUBLIC
Parameter                 category
Methods                   GET
*/
booky.get("/c/:category",async (req,res) =>
{
    const getSpecificBooks = await BookModel.findOne({category: req.params.category});
    //!0=1, !1=0
        if(!getSpecificBooks){
            return res.json({error: `No book found for the ISBN of ${req.params.category}`})
        }
    
        return res.json({book: getSpecificBooks});
});

/*
Route:                  /author
Description      Get all books of an autor
Access                   PUBLIC
Parameter                 NONE
Methods                   GET
*/
booky.get("/author",async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

/*
Route:                  /author/book
Description      Get list of authors based on book
Access                   PUBLIC
Parameter                 ISBN
Methods                   GET
*/
booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter((author) => author.books.includes(req.params.isbn));
    if(getSpecificAuthor.length == 0){
        return res.json({error: `No author found for book ${req.params.isbn}`});
    }

    return res.json({author: getSpecificAuthor});
});

/*
Route:                  /publications
Description      Get all books of publication
Access                   PUBLIC
Parameter                 NONE
Methods                   GET
*/
booky.get("/publications",async(req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

/*
Route:                  /p
Description      Get specific publication
Access                   PUBLIC
Parameter                 id
Methods                   GET
*/
booky.get("/p/:id", (req,res) =>
{
    const getSpecificPublication = database.publication.filter((publication) => publication.ID === req.params.id);
    if(getSpecificPublication.length === 0)
    {
        return res.json({error:`Cannot find publiation of id ${req.params.id}`});
    }

    return res.json({publication: getSpecificPublication});
});

//POST


/*
Route:                  /book/new
Description            Add new books
Access                   PUBLIC
Parameter                 NONE
Methods                   POST
*/

booky.post("/book/new",async (req,res)=> {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: "Book was added!!"
    });

});

/*
Route:                  /author/new
Description            Add new authors
Access                   PUBLIC
Parameter                 NONE
Methods                   POST
*/

booky.post("/author/new",async (req,res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({
        author: addNewAuthor,
        message: "Author was added!!"
    });
});

/*
Route:                  /publication/new
Description            Add new publications
Access                   PUBLIC
Parameter                 NONE
Methods                   POST
*/

booky.post("/publications/new", (req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatesPublications: database.publication});
});

//PUT

/*
Route:                  /book/update
Description            Update book on isbn
Access                   PUBLIC
Parameter                 isbn
Methods                   PUT
*/

booky.put("/book/update/:isbn", async (req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
     {   ISBN: req.params.isbn
     },
     {
         title:req.body.bookTitle
     },
     {
         new:true
     }
     );

     return res.json({
         books: updatedBook
     });
});



/*
Route:                  /book/author/update
Description            Update/add new author
Access                   PUBLIC
Parameter                 isbn
Methods                   PUT
*/

booky.put("/book/author/update/:isbn",async (req,res) => {
    //Update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        }, 
        {
            $addToSet: {
                authors: req.body.newAuthor
            }
        },
        {
            new:true
        }
    );
    
    //Update the author database

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                    books: req.params.isbn
            }
        },
        {
            new:true
        }
    );


    return res.json({
        books: updatedBook,
        authors:updatedAuthor,
        message: "New author was added"
    });
});









/*
Route:                  /publication/update/book
Description            Update or add new publication
Access                   PUBLIC
Parameter                 isbn
Methods                   PUT
*/

booky.put("/publications/update/book/:isbn", (req,res) => {
    //update publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    });

    //Update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publications = req.body.pubId;
        return;        }
    });

    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated publications"
        }
    );
 });

 //DELETE
 /*
Route:                  /book/delete
Description            Delete a book
Access                   PUBLIC
Parameter                 isbn
Methods                   PUT
*/

booky.delete("/book/delete/:isbn",async (req,res) => {
    //Whichever book that does not match with the isbn , just send it to an updatedBookDatabase array 
    //and rest will be filtered out 
    const updatedBookDatabase = await BookModel.findByIdAndUpdate(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({
        books:updatedBookDatabase
    });
});

/*
Route:                  book/delete/author 
Description            Delete an author from a book and vice versa
Access                   PUBLIC
Parameter                 isbn,authorId
Methods                   PUT
*/

booky.delete("books/delete/author/:isbn/:authorId" , (req,res) => {
    //Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter((eachAuthor) => eachAuthor !== parseInt(req.params.authorId));
            book.author = newAuthorList;
            return;
        }
    });

    //Update the author database
database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)){
        const newBookList = eachAuthor.books.filter(
            (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
    }
});

return res.json({
    book: database.books,
    author: database.author,
    message: "Author was blehhh"
});

});




booky.listen(3000, () => {
    console.log("Server is Up and Running");
});


