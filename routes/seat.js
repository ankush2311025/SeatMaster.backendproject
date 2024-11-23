
import express from "express";
import Seat from "../models/Seat.js";
import User from "../models/User.js";

const router = express.Router();

const Section = {
    VIP:{ price: 500,
         range:[151,200]},
    Normal:{ price : 300,
         range: [100,150]},
    Economy:{ price: 150, 
        range: [1,99]},
}


//for create the seat
router.post('/bookseat', async (req, res) => {
    const { seatNumber, section } = req.body;

    if (!seatNumber || !section || !Section[section]) {
        return res.status(400).json({ message: "Invalid seat number or section." });
    }

    try {
      //  const { price } = Section[section];

        const newSeat = new Seat({
            seatNumber,
           // price,
            section,
        });

        const savedSeat = await newSeat.save();
        res.json({ message: "Seat created successfully", seat: savedSeat });
    } catch (err) {
        res.status(500).json({ message: "Error creating seat" });
    }
});



// for reseve the seat 
router.post('/reserve', async (req,res) =>{
    const { userId, seatNumber} = req.body;
    try{
        const seat = await Seat.findOne({seatNumber});

        if (!seat|| seat.status !=='empty'){
            return res.status(400).json({
                message: "Seat is not available aur seat not create",
                
            });
        }
        seat.status = "reserved";
        seat.bookedBy= userId;
        await seat .save(); 

         const expireTime = 3 * 24 * 60 * 60 * 1000; 
         setTimeout(async () => {
             const reservedSeat = await Seat.findOne({ seatNumber });
            
             if (reservedSeat && reservedSeat.status === "reserved") {
                 reservedSeat.status = "empty";
                 reservedSeat.bookedBy = null;
                 await reservedSeat.save();
             }
         }, expireTime);
 
         res.json({
             message: "Seat is reserved",
             expiresIn: "3 days",
         });
 
    }catch(err){
        res.status(500).send("error");
    }
});



// Get seats status info 
router.get('/seatsinfo', async (req, res) => {


    try {
        const seats = await Seat.find();
        res.json(seats);
    } catch (err) {
        res.status(500).send("Error in finding seats");
    }
});



// seat booking and occupied route
 router.post('/booking', async (req,res) => {
     
    const { seatId, userId, section } = req.body;

    if (!seatId|| !userId  || !section || !Section[section]) {
        return res.status(400).json({
            message: "SeatId , section , userId and price must be provided  "
        });
    }
     try{
         const seat = await Seat.findById( seatId);
         if(!seat){
            return res.status(400).json({"message": "Seat is not found"})
         }

         if(seat.status== "occupied"){
            return res.status(400).json({message:"seat is already booked"});
         }

         const seatNumber = seat.seatNumber;
         const{range, price} = Section[section];

         if(seatNumber<range[0] || seatNumber>range[1]){
            return res.status(400).json({
            message : `Seat number ${seatNumber} does not blong to the ${section} section`
         });
        }
       seat.status = "occupied";
       seat.bookedBy = userId;
       seat.price = price;
       seat.section = section;


       await seat.save();

         res.json({
             message: "Seat book successfully", seat });
     } catch(err) {
         res.status(500).send("Error")
     }
 });



 //Cancelation the seat
 router.post('/cancel/:seatId', async (req,res) => {

    const {userId}= req.body;
    const seatId = req.params.seatId;
   

    try{
       
        const seat = await Seat.findById(seatId);

        if(!seat || seat.status !=='occupied'|| !seat.bookedBy.equals(userId))
        {
            return res.status(400).json({
                message : 'Not Cancel'
            });
            
        } 
        
        
        seat.status = 'empty';
        seat.bookedBy = null ;

        await seat.save();

        res.json({message : "seat cancel success"});
    }catch(err){
        res.status(500).send("noooo")
    }
 });

export default router;

