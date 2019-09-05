const express = require('express')
const db = require('../data/db.js')

const router = express.Router()

router.get('/', (req, res) => {
    db.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        return res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' })
    }

    db.insert({ title, contents })
        .then(({ id }) => {
            db.findById(id)
                .then(([post]) => {
                    res.status(201).json(post)
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: 'There was an error while saving the post to the database' })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    db.findById(id)
        .then(([post]) => {
            console.log(post)
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." })
            }
        })
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const { title, contents } = req.body

    if (!title && !contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db.update(id, { title, contents })
        .then(updated => {
            console.log(updated)
            db.findById(id)
                .then(([post]) => {
                    console.log(post)
                    if (post) {
                        res.status(201).json(post)
                    } else {
                        res.status(404).json({ error: "The post with the specified ID does not exist." })
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: "There was an error while saving the post to the database" })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the post to the database." })
        })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    db.remove(id)
        .then(removed => {
            if (removed) {
                res.status(204).end()
            } else (
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            )
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post could not be removed." })
        })
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    db.findPostComments(id)
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

module.exports = router