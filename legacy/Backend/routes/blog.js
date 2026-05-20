import express from "express";
import Blog from "../model/Blog.js";
import userModel from "../model/userModel.js";

const router = express();

/* CREATE BLOG */
router.post("/", async(req,res)=>{
 const newblog = new Blog(req.body);
 try{
  const savedPost= await newblog.save();
  res.status(200).json(savedPost);
 } catch (err){
  res.status(500).json(err);
 }
});


/* UPDATE */
router.get("/", async(req,res)=>{
  try{
    const blog = await Blog.findById(req.params.id);
    if (blog.username == req.body.username){
      try{
        const updateBlog = await Blog.findByIdAndUpdate(
          req.params.id,
        {
          $set: req.body,
        },
        {new: true}
        );
        res.status(200).json(updatedBlog);
      } catch (err){
        res.status(500).json(err);
      }
    } else{
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET BLOG */
router.get("/:id", async (req, res)=>{
  try{
    const post = await Blog.findById(req.params,id);
    res.status(200).json(blog);

  } catch (err){
    res.status(500).json(err);
  }
})

/* GET ALL BLOGS */
router.get("/", async (req, res)=>{
  const username = req.query.user;
  const catName = req.query.cat;
  try{
    let blogs;
    if (username){
      posts = await Blog.find({ username});

    } else if (catName){
      blogs = await Blog.find({
        categories: {
          $in:[catName],
        },
      });
    } else {
      blogs = await Blog.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
/* DELETE */
router.delete("/:id", async (req, res) =>{
  try{
    const blog = await Blog.findById(req.params.id);
    if(post.username === req.body.username){
      try{
        await blog.delete();
        res.status(200).json("Blog has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    }else{
      res.status(401).json("You can delete only your blog!")
    }
    } catch (err){
      res.status(500).json(err);
    }

});


export default router;