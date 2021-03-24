const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
// const uri = "mongodb+srv://mongoCrud:cgs5b2rEQu5S7$E@cluster0.mpfxk.mongodb.net/mongoCrud?retryWrites=true&w=majority";
const uri = "mongodb+srv://crudOperation:uhKjQvrvRVrhxN8Q@cluster0.mpfxk.mongodb.net/mongoCrud?retryWrites=true&w=majority";

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true });

// 'cgs5b2rEQu5S7$E' 'mongoCrud'
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
    const collection = client.db("mongoCrud").collection("newCollection")

    app.get('/students', (req , res)=> {
        collection.find({})
        .toArray((err,documents)=> {
            res.send(documents)
        })
    })
    app.get('/student/:id', (req, res)=> {
        collection.find({_id:ObjectId(req.params.id)})
        .toArray((err, document)=> {
            res.send(document[0])
        })
    })
    app.patch('/update/:id', (req, res)=> {

        const toUpdate = req.body;
        collection.updateOne({_id:ObjectId(req.params.id)},
        {$set:toUpdate,$currentDate: { lastModified: true }})
        .then(result=> {
            // console.log('updated successfully');
            // res.send(result)
            res.send(result.modifiedCount > 0)
        })
        .catch(err => {
            console.log('Failed to update');
        })
    })
    app.post('/addStudent', (req, res) => {
        const student = req.body;
        collection.insertOne(student)
            .then(response => {
                // console.log('added successfully');
                // res.send('Success');
                res.redirect('/');
            })
            .catch(err => {
                console.log('Failed to add');
            })
    })

    app.delete('/delete/:id', (req, res) => {
        const stdId = req.params.id;
        console.log(req.params.id);
        collection.deleteOne({_id:ObjectId(stdId)})
        .then(response => {
            // console.log(response.deletedCount);
            res.send(response.deletedCount > 0);
        })
        .catch(err => console.log(`Delete failed with error: ${err}`))
    })




    //   collection.insertOne({
    //       name:'alamin',
    //       roll:'436',
    //       GPA:5.00
    //   })
    //   .then(res => {
    //       console.log('added');
    //   })
    // perform actions on the collection object
    //   console.log('db connected');
    //   client.close();
});


app.listen(3000);