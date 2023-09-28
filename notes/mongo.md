why use ObjectId instead of string?
Populate Functionality: Mongoose provides a populate method that allows you to automatically replace the ObjectId references with the actual documents they point to. This is very handy when you want to fetch related documents without making multiple queries. Using the mongoose.Schema.Types.ObjectId type ensures that this feature works seamlessly.

```ts
const userSchema = new mongoose.Schema({
    name: String
    // ... other fields
});

const postSchema = new mongoose.Schema({
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // This tells Mongoose which model to use during population
    }
    // ... other fields
});

Post.findById(postId).populate('author').exec((err, post) => {
    if (err) {
        // Handle error
    } else {
        console.log(post.author.name);  // This will give you the author's name, not just their ObjectId
    }
});
```