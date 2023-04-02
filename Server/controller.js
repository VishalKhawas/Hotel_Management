//requiring files required
const Hotel = require("./model");
let alert = require('alert');

//creating function for adding new booking
exports.addNew = async (req, res)=>{
    //get all parameters from form body using body-parser
    const cname=req.body.name;
    const cemail=req.body.email;
    const croomNo=req.body.roomNo;
    const croomType=req.body.roomType;
    const cstartTime=req.body.startTime;
    const cendTime=req.body.endTime;
    
    //getting details of all already present booking
    const allBookings = await Hotel.find({});

    //getting the booking start and end time and creating its Date variable for ease in comparasion
    var curStDate = cstartTime.slice(0,10)+", "+cstartTime.slice(11,16)+":00";
    var curEnDate = cendTime.slice(0,10)+", "+cendTime.slice(11,16)+":00";

    curStDate = new Date(curStDate);
    curEnDate = new Date(curEnDate);

    var enter = 1;
    //iterating through allBookings to check if conflict in date happens or not
    for(let i=0; i<allBookings.length; i++){
        var stdate = allBookings[i].startTime;
        var endate = allBookings[i].endTime;
        stdate=stdate.slice(0,10)+", "+stdate.slice(11,16)+":00";
        endate=endate.slice(0,10)+", "+endate.slice(11,16)+":00";

        stdate = new Date(stdate);
        endate = new Date(endate);

        let today=new Date();

        //if entered date is less than today or if the booking end date is less than booking start date: invalid
        //set enter =-1 for invalid
        if(curStDate<today || curEnDate<curStDate){
            enter=-1;
            break;
        }
        //now check if there is conflict in date with any already existing record
        if(allBookings[i].roomNo==croomNo){
            if(curStDate>stdate && curStDate<endate){
                enter=0;
            }
            else if(curEnDate>stdate && curEnDate<endate){
                enter=0;
            }
            else if(curStDate<stdate && curEnDate>endate){
                enter=0;
            }
        }
    }

    //enter value = 1 means no conflict, hence can proceed with booking
    if(enter==1){
        //calculating difference between start and end time in hours
        var hours=Math.ceil(Math.abs(curEnDate.getTime() - curStDate.getTime()) / 3600000);
        var bill=0;
        //multipying by respective bill per hour of corrosponding room
        if(croomType=="Type - A"){
            bill=hours*100;
        }
        else if(croomType=="Type - B"){
            bill=hours*80
        }
        else if(croomType=="Type - C"){
            bill=hours*50;
        }
        //creating new object of Hotel type
        const booking=new Hotel({
            name: cname,
            email: cemail,
            roomNo: croomNo,
            roomType: croomType,
            startTime: cstartTime,
            endTime: cendTime,
            billAmnt: bill
        });
        //saving object to mongoDB
        booking.save(booking).then((data)=>{
            res.redirect("/");
        })
        .catch((err)=>{
            res.status(500);
        });
    }
    //enter value 0 means there is conflict between dates
    else if(enter==0){
        alert("Particular Room Already Booked At This Time")
    }
    //enter value -1 means invalid choice of date
    else if(enter==-1){
        alert("Invalid Choice Of Date")
    }
}

//creating a function for updating details of an existing record
exports.editExisting = async (req, res)=>{
    //get all parameters from form body using body-parser
    let userId=req.params.id;
    const cname=req.body.name;
    const cemail=req.body.email;
    const croomNo=req.body.roomNo;
    const croomType=req.body.roomType;
    const cstartTime=req.body.startTime;
    const cendTime=req.body.endTime;

    //getting details of all already present booking
    const allBookings = await Hotel.find({});

    //getting the booking start and end time and creating its Date variable for ease in comparasion
    var curStDate = cstartTime.slice(0,10)+", "+cstartTime.slice(11,16)+":00";
    var curEnDate = cendTime.slice(0,10)+", "+cendTime.slice(11,16)+":00";

    curStDate = new Date(curStDate);
    curEnDate = new Date(curEnDate);

    //below the same logic applies
    var enter = 1;
    for(let i=0; i<allBookings.length; i++){
        let stdate = allBookings[i].startTime;
        let endate = allBookings[i].endTime;
        stdate=stdate.slice(0,10)+", "+stdate.slice(11,16)+":00";
        endate=endate.slice(0,10)+", "+endate.slice(11,16)+":00";

        stdate = new Date(stdate);
        endate = new Date(endate);

        let today=new Date();

        if(curStDate<today || curEnDate<curStDate){
            enter=-1;
            break;
        }

        //if the conflict happens with the same record that we are updating, its not a valid conflict, hence check for this
        if(allBookings[i].roomNo==croomNo && allBookings[i]._id!=userId){
            if(curStDate>stdate && curStDate<endate){
                enter=0;
            }
            else if(curEnDate>stdate && curEnDate<endate){
                enter=0;
            }
            else if(curStDate<stdate && curEnDate>endate){
                enter=0;
            }
        }
    }

    //in case of no conflict, update
    if(enter==1){
        var hours=Math.ceil(Math.abs(curEnDate.getTime() - curStDate.getTime()) / 3600000);
        var bill=0;
        if(croomType=="Type - A"){
            bill=hours*100;
        }
        else if(croomType=="Type - B"){
            bill=hours*80
        }
        else if(croomType=="Type - C"){
            bill=hours*50;
        }
        //function findByIdAndUpdate of mongoose updates the record as required
        Hotel.findByIdAndUpdate({_id: userId}, {
            name: cname,
            email: cemail,
            roomNo: croomNo,
            roomType: croomType,
            startTime: cstartTime,
            endTime: cendTime,
            billAmnt: bill
        }).then((data)=>{
            res.redirect("/");
        }).catch((err)=>{
            res.status(500);
        });
    }
    //case of time conflict
    else if(enter==0){
        alert("Particular Room Already Booked At This Time");
    }
    //case of invalid choice of date
    else if(enter==-1){
        alert("Invalid Choice Of Date");
    }
}

//function for get route of delete route
exports.getDelete = async (req, res)=>{
    //tap into the id we want to delete
    let userId=req.params.id;
    //find the booking
    let user = await Hotel.findById(userId).exec();
    //get the booking start time
    let stdate=user.startTime.slice(0,10)+", "+user.startTime.slice(11,16)+":00";
    let dStart = new Date(stdate);

    //create a variable for current time and date
    let currDate = new Date();
    //find the difference in hours
    var diff=Math.floor(Math.abs(dStart.getTime() - currDate.getTime()) / 3600000);
    var msg;
    //if the booking start time is greater than 48 hours, show full refund
    if(diff>=48){
        msg="100% Refund Before More Than 48 Hours Of Booking";
        var refund = user.billAmnt;
    }
    //if the booking start time is less tha 48 hours and greater than 24 hours, show half refund
    else if(diff<48 && diff>=24){
        msg="50% Refund Before More Than 24 Hours Of Booking";
        var refund = user.billAmnt/2;
    }
    //if  booking start time is less tha 24 hours
    else{
        msg="No Refund Before Less Than 24 Hours Of Booking";
        var refund = 0;
    }
    //send data to delete page accordingly
    res.render('delete', {user: user, refund: refund, msg: msg});
}