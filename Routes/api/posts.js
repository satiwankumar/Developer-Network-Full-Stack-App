const express = require('express');

const router = express.Router();
const {check,validationResult} = require('express-validator')
const auth = require('../../Middleware/auth');

const Post = require('../../Models/Posts')
const Profile = require('../../Models/Profile')
const User = require('../../Models/User')




//@route Get api/post

//@desc ADD Post
//access Public


router.post('/',[auth,[
  check('text','text is required').not().isEmpty()

]],async (req,res)=>{

const errros = validationResult(req)
if(!errros.isEmpty){
  return res.this.status(400).json({errors:errors.array()})

}
try {
  
const user = await User.findById(req.user.id).select('-password')

const newPost  =new Post({
  text : req.body.text,
  name:user.name,
  avatar:user.avatar,
  user:req.user.id
})

const post = await newPost.save()

res.json(post)

} catch (error) {
  console.error(error.message)
  res.status(500).send('Server Error')
}


})

//@route Get and del api/post
//@desc get and del posts
//access private

router.get('/',auth,async(req,res)=>{

  try {
  const Posts =await Post.find()
  if(!Posts){
    return res.status(400).send('no posts yet') 
  
  }
  res.json(Posts)



    
  } catch (error) {
    console.error(error.message())
  }

})

//@route Get api/post/:positid
//@desc get and del posts
//access private

router.get('/:id',auth,async(req,res)=>{

  try {
   
  let posts = await Post.findById({_id:req.params.id})
  if(!posts){
    return res.status(400).send('no posts yet') 
  
  }
  res.json(posts)



    
  } catch (error) {
   
    console.error(error.message)
  }

})


//@route Get api/post/:positid
//@desc get and del posts
//access private

router.delete('/:id',auth,async(req,res)=>{

  try {
   
  const posts = await Post.findById({_id:req.params.id})
  if(posts.user.toString()!==req.user.id){
    return res.status(401).json({msg:'User not Authorized'})
  }

    await posts.remove()
  res.json({msg:'post removed'})
    
  } catch (error) {
   
    console.error(error.message)
  }

})

//@route Put api/post/like/:id
//@desc get and add like
//access private

router.put('/like/:id',auth,async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id)
    
    //check if the post is already being liked
    if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
        return res.status(400).json({msg:'post already been liked'})
    }
    post.likes.unshift({user:req.user.id})
    await post.save()
    res.json(post.likes)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')
  }

})


//@route Put api/post/unlike/:id
//@desc get and del like
//access private

router.put('/unlike/:id',auth,async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id)
    
    //check if the post is already being liked
    if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
        return res.status('400').json({msg:'post has not yet  been liked'})
    }

      //get remove index
      const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
      post.likes.splice(removeIndex,1)
      await post.save()
      res.json(post.likes)

    } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')
  }

})


//@route Put api/post/commment/:id
//@desc post comment
//access private

router.put('/comment/:id',[auth,[
  check('text','text is required').not().isEmpty()
]],async (req,res)=>{
  const errors = validationResult(req.body)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  try {
const user = await User.findById(req.user.id).select('-password')
const post = await Post.findById(req.params.id)

const newComment = {
  text : req.body.text,
  name:user.name,
  avatar:user.avatar,
  user:req.user.id

 
}

post.comments.unshift(newComment)
await post.save()
res.json(post.comments)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }


})


//@route Put api/dele/commment/:id/:comment_id
//@desc delete comment
//access private

router.delete('/comment/:id/:comment_id',auth,async (req,res)=>{
  console.log(req.user)
  try {
    const posts = await Post.findById(req.params.id)

    const comment = await posts.comments.find(comment=>comment.id===req.params.comment_id)
    if(!comment){
      return res.status(404).send('no comment found')
    }

    if (comment.user.toString() != req.user.id){
        return res.status(400).send('User not authorized')
    }

    let removeindex = posts.comments.indexOf(comment)
    console.log(removeindex)
    posts.comments.splice(removeindex,1)
    await posts.save()
res.json(comment)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }


})


module.exports = router 