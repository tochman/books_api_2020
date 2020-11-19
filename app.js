const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const {  broadcast } = require('./wsConfig')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3474']
}))

const getBooks = (request, response) => {
  pool.query('SELECT * FROM books', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json({books: results.rows})
  })
}

const addBook = (request, response) => {
  const { author, title } = request.body
  pool.query('INSERT INTO books (author, title) VALUES ($1, $2)', [author, title], error => {
    if (error) {
      throw error
    }
    // wss.clients.forEach(client => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(JSON.stringify({message: `You created a book!!!`}))
    //   }
    // })
    broadcast({message: `You created a book!!!`})
    response.status(201).json({ status: 'success', message: 'Yay! Your book was added to the database...' })
  })
}
// test
app
  .route('/books')
  .get(getBooks)
  .post(addBook)


app.listen(3002, () => {
  console.log('Server is listening on port 3002')
})