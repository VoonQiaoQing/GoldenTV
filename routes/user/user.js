import { Router } from 'express';
import { nanoid } from 'nanoid'
import { Modelticket } from '../../data/ticket.mjs';
import { Modeloption } from '../../data/option.mjs';
const router = Router();
export default router;
router.post("/booking/:choice", booking_process);
router.get("/booking/:choice", booking_page);
// booking page
var random_ref = nanoid(8);
export var room_details = { location: '', time: '', choice: '', uuid: '', roomtype: '', ref: random_ref };
async function booking_process(req, res) {
    console.log('Description created: $(booking.choice)');
    try {
        console.log(req.body.time);
        const roomtype = await Modeloption.findOne({ where: { time: req.body.time, location:req.body.location, date:req.body.date } });
        console.log(roomtype);
        console.log(roomtype.uuid);
        room_details.location = req.body.location;
        room_details.time = req.body.time;
        room_details.roomtype = req.body.room;
        room_details.uuid = roomtype.uuid;
        return res.redirect("/payment/generate");
    }
    catch (error) {
        console.error(error);
    }
}
async function booking_page(req, res) {
    console.log("booking page accessed");
    // const option = await Modeloption.findAll({
    //         attributes: ['location']
    //      });
   
    
    Modeloption.sync({ alert: true }).then(() => {
        return Modeloption.findAll({ attributes: ['location'] });
    }).then((data) => {
        let All_location = [];
        data.forEach(element => {
            
            All_location.push(element.toJSON().location);
            console.log(element.toJSON().location);
        })
        console.log(All_location);
        var location = [];
        for (let i = 0; i < All_location.length; i++) {
            if (location.indexOf(All_location[i]) === -1) {
                location.push(All_location[i]);
            }
        }
        console.log(location);
        return res.render('user/booking', {
            location, Modeloption, choice
        });
    })
        .catch((err) => {
            console.log(err)
        });
    
    // console.log(option);
   
    
}

// async function roomtype_process(req, res) {
//     console.log(req.body.roomtype);
//     room_details.roomtype = req.body.roomtype;
//     return res.redirect("/paymentOption");
// }
// async function roomtype_page(req, res) {
//     console.log("Choosing roomtype page accessed");
//     console.log(room_details);
//     var room_left = [];
//     const roomtype = await Modeloption.findOne({
//         where: {
//             time: room_details.time
//         }
//     });
//     if (roomtype.small != 0) {
//         room_left.push('Small')
//     };
//     if (roomtype.medium != 0) {
//         room_left.push('Medium')
//     };
//     if (roomtype.large != 0) {
//         room_left.push('Large')
//     };
//     if (room_left.length == 0) {
//         console.log("There is no room left")
//         return res.render('user/noroom')
//     };
//     return res.render('user/roomtype', {
//         room_details, roomtype, room_left
//     });
// }
router.post("/date", async function (req, res) {
    console.log("Loooking for all the date");
    console.log(req.body);
    Modeloption.sync({ alert: true }).then(() => {
        return Modeloption.findAll({ attributes: ['date'], where: { location: req.body.location } });
    }).then((data) => {
        let date = [];
        data.forEach(element => {
            date.push(element.toJSON().date);
            console.log(element.toJSON().date);
        })
        console.log(date);
        return res.json({
            date: date
        })
    })
});
router.post("/time", async function (req, res){
    console.log("Loooking for all the time");
    console.log(req.body);
    Modeloption.sync({ alert: true }).then(() => {
        return Modeloption.findAll({ attributes: ['time'], where: { location: req.body.location, date: req.body.date } });
    }).then((data) => {
        let time = [];
        data.forEach(element => {
            time.push(element.toJSON().time);
            console.log(element.toJSON().time);
        })
        console.log(time);
        return res.json({
            time: time
        })
    })
});
router.post("/roomtype", async function (req, res) {
    console.log("Loooking for all the roomtype");
    console.log(req.body);
    // Modeloption.sync({ alert: true }).then(() => {
    //     return Modeloption.findAll({ attributes: ['small'], where: { location: req.body.location, date: req.body.date } });
    // }).then((data) => {
    //     let time = [];
    //     data.forEach(element => {
    //         time.push(element.toJSON().time);
    //         console.log(element.toJSON().time);
    //     })
        
    // })
    var room_left = [];
    const roomtype = await Modeloption.findOne({
        where: {
            time: req.body.time, date: req.body.date, location: req.body.location
        }
    });
    if (roomtype.small != 0) {
        room_left.push('Small')
    };
    if (roomtype.medium != 0) {
        room_left.push('Medium')
    };
    if (roomtype.large != 0) {
        room_left.push('Large')
    };
    if (room_left.length == 0) {
        console.log("There is no room left")
        return res.render('user/noroom')
    };
    return res.json({
        room: room_left
    })
});
// ---------------------------------------
router.get("/booked_successfully", async function (req, res) {
    console.log("after booking page accessed");
    const roomtype = await ModelRoomtype.findOne({
        where: {
            time: room_details.time, location: room_details.location
        }
    });
    console.log(room_details.roomtype);
    if (room_details.roomtype == 'Small') {
        console.log('Small - 1');
        roomtype.update({
            small: roomtype.small - 1
        });
        roomtype.save();
    }
    else if (room_details.roomtype == 'Medium') {
        console.log('Medium - 1');
        roomtype.update({
            medium: roomtype.medium - 1
        });
        roomtype.save();
    }
    else if (room_details.roomtype == 'Big') {
        console.log('Big - 1');
        roomtype.update({
            big: roomtype.big - 1
        });
        roomtype.save();
    }
    const ticket = await Modelticket.create({
        choice: room_details.choice,
        location: room_details.location,
        date: room_details.date,
        time: room_details.time,
        roomtype: room_details.roomtype,
        ref: random_ref,
    });
    console.log(room_details);
    return res.render('user/after_booking', {
        room_details, ticket
    });
});