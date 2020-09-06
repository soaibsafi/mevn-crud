const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()

// Get Posts
router.get('/', async(req, res)=>{
    const posts = await loadPostsCollection()
    res.send(await posts.find({}).toArray())
})

//Add Posts
router.post('/', async(req, res)=>{
    const posts = loadPostsCollection()
    const post = {
        text: req.body.text,
        createdAt: new Date()
    }
    console.log(post)
    try {
        const posts = await loadPostsCollection()
        await posts.insertOne({
            text: req.body.text,
            createdAt: new Date()
        });
        res.status(201).send()
    } catch (err) {
        res.status(400).send(err.message)
    }
    
})

//Delete Posts
router.delete('/:id', async(req, res)=>{
    const posts = await loadPostsCollection()
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)})
    res.status(200).send()
})

// MongoDB connection
async function loadPostsCollection(){
    const client = await mongodb.MongoClient.connect
    (`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTERS}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    return client.db('mevn-crud').collection('posts')
}

module.exports = router