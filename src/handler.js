/* eslint-disable indent */
const books = require('./books')
const { nanoid } = require('nanoid')

const addBookHandler = (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload

    if (!name) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if (pageCount < readPage) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const id = nanoid(12) // 12 digit randomize id w/ nanoid
    const finished = (pageCount === readPage)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, insertedAt, updatedAt
    }

    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0 // -1 jika kosong

    if (isSuccess) {
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201)
        return response
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
}

const getAllBooksHandler = (req, res) => {
    const { finished, reading, name } = req.query
    let booksTitle = books

    if (finished) {
        booksTitle = booksTitle.filter((book) => book.finished === !!Number(finished))
    }

    if (reading) {
        booksTitle = booksTitle.filter((book) => book.reading === !!Number(reading))
    }

    if (name) {
        booksTitle = booksTitle.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    }

    const response = res.response({
        status: 'success',
        data: {
            books: booksTitle.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    })
    response.code(200)
    return response
}

const getBookByIdHandler = (req, res) => {
    const { id } = req.params

    const book = books.filter((n) => n.id === id)[0]

    if (book) {
        return {
            status: 'success',
            data: {
                book
            }
        }
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
}

const editBookByIdHandler = (req, res) => {
    const { id } = req.params

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload
    const updatedAt = new Date().toISOString()

    const index = books.findIndex((book) => book.id === id)

    if (index !== -1) {
        if (!name) {
            const response = res.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            })
            response.code(400)
            return response
        }

        if (pageCount < readPage) {
            const response = res.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            })
            response.code(400)
            return response
        }

        const finished = (pageCount === readPage)

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        }

        const response = res.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200)
        return response
    }

    const response = res.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

const deleteBookByIdHandler = (req, res) => {
    const { id } = req.params

    const index = books.findIndex((note) => note.id === id)

    if (index !== -1) {
        books.splice(index, 1)
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
}
