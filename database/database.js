const books = [
    {
        ISBN: "1234Book",
        title: "tesla",
        pubDate: "2021-08-05",
        language: "en",
        numPage: 250,
        author: [1,2],
        publication: [1],
        category: ["tech","space","education"]
    }
]

const author = [
    {
        id: 1,
        name: "Aradhana",
        books: ["1234Book", "secretbook"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["1234Book"]
    }
]

const publication = [
    {
        ID: 1,
        name: "writex",
        books: ["1234Book"]
    },
    {
        "id": 2,
        "name": "writey",
        "books": []
    }
]


module.exports = {books , author , publication};