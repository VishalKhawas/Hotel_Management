//Code by Vishal Khawas
//Tech Stack Used: HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, EJS
//Server side code has been distributed over here and 3 files inside Server folder for ease of viewing and understanding

//requiring express
const express = require("express");
const app = express();

//requiring path to get directory paths easily
const path = require("path");

//requiring other server sidde files required here
const connectDB = require("./Server/connection");
const Hotel = require("./Server/model");
const Room = require("./Server/roomModel");
const controller = require("./Server/controller");

//calling connectDB function to connect to MongoDB database using Mongoose
connectDB();

//requiring body parser to tap body recieved from a form from frontend
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//setting view engine as ejs template engine
app.set('view engine', 'ejs');

//telling ejs files to use this location for their static css files
app.use("/css", express.static(path.resolve(__dirname, "static/css")));

//getting the root directory
app.get("/", async (req, res)=>{
    //finding all bookings from the mongoDB and rendering it to index.ejs along with data
    const allBookings = await Hotel.find({});
    res.render('index', {bookings: allBookings});
});

//get_data get route to return roomNo available for a particular roomType in database
app.get('/get_data', async (req, res)=>{
    var type=req.query.type;
    var search = req.query.parent;
    if(type=='load_roomNo'){
        var query = await Room.find({type: search}).exec();
    }
    //return result as json
    res.json(query);
});

//getting the bookRoom directory
app.get("/bookRoom", async (req, res)=>{
    //retrieving all distincts room type from mongoDB and rendering to bookRoom
    const allRoom = await Room.find({}).select('type').distinct("type");
    res.render('addroom', {rooms: allRoom});
});

//creating post route for post from bookRoom.ejs, function available in controller file
app.post("/bookRoom", controller.addNew);

//creating get route for update directory using a given id as parameter from url
app.get("/update/:id", async (req, res)=>{
    let userId=req.params.id;
    
    //find user with userId 
    let user = await Hotel.findById(userId).exec();
    const allRoom = await Room.find({}).select('type').distinct("type");
    res.render('update', {user: user, rooms: allRoom});
});

//creating post route for update, function for it exists in controller file
app.post("/update/:id", controller.editExisting);

//creating get route for delete a given id
app.get("/delete/:id", controller.getDelete);

//post route for deletion of a given id
app.post("/delete/:id", async (req, res)=>{
    let userId=req.params.id;
    Hotel.findByIdAndDelete({_id: userId}).then((data)=>{
        res.redirect("/");
    }).catch((err)=>{
        res.status(500)
    });
})

//listen to post 3000
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server Up and Running");
});