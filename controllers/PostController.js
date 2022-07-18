import PostModel from "../modules/Post.js"

export const create = async (req,res) => {

    try {
        const doc = new PostModel(
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId

            }
        )
        const post = await doc.save()
        res.json({
            success: true,
            post
        })
    } catch (error) {
        res.status(500).json({
            message: 'не удалось создать статью',
            error
        })
    }

}

export const getLastTags = async (req,res) => {
    try {
        const posts = await PostModel.find().sort({ $natural: -1 }).limit(5)
        let tags = posts.map(obg => obg.tags).flat()
        tags = tags.slice(0,5)
        res.json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'не удалось получить статьи'})
    }
}
export const getAll = async (req,res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'не удалось получить статьи'})
    }
}

export const getOne = async (req,res) => {
    try {
        const {postId} = req.params
        PostModel.findOneAndUpdate(
            {_id: postId},
            {$inc: {viewsCount: 1}},
            {returnDocument: 'after'},
            (err, doc) => {
                if(err) {
                    console.log('error -->> ',err)
                    return res.status(404).json({message: 'Статья не найдена.'})
                }
                if(!doc) return res.status(404).json({message: 'Статья не найдена'}) 

                return res.json(doc)
            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'не удалось получить статьи'})
    }
}

export const remove = async (req,res) => {
    try {
        const {postId} = req.params
        PostModel.findOneAndRemove(
            {_id: postId},
            (err, doc) => {
                if(err) {
                    console.log('error -->> ',err)
                    return res.status(404).json({message: 'не удалось удалить статью'})
                }
                if(!doc) return res.status(404).json({message: 'Статья не найдена'}) 

                return res.json({success: true,message: `Статья удалена`})
            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'не удалось получить статьи'})
    }
}

export const update = async (req,res) => {
    try {
        const {postId} = req.params

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                user: req.userId,
                imageUrl: req.body.imageUrl

            }
        )
        res.json({success: true})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'не удалось обновить статью'})
    }
}

