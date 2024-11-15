
import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

const Section = {
    VIP:{ price: 500, range:[151,200]},
    Normal:{ price : 300, range: [100,150]},
    Economy:{ price: 150, range: [1,99]},
}

router.post('/bookseat', async (req, res) => {
    const { seatNumber, section } = req.body;

    if (!seatNumber || !section || !Section[section]) {
        return res.status(400).json({ message: "Invalid seat number or section." });
    }

    try {
        const { price } = Section[section];

        const newSeat = new Seat({
            seatNumber,
            price,
            section,
        });

        const savedSeat = await newSeat.save();
        res.json({ message: "Seat created successfully", seat: savedSeat });
    } catch (err) {
        res.status(500).json({ message: "Error creating seat" });
    }
});




router.get('/seatsinfo', async (req, res) => {


    try {
        const seats = await Seat.find();
        res.json(seats);
    } catch (err) {
        res.status(500).send("Error in finding seats");
    }
});

 router.post('/booking', async (req,res) => {
     
    const { seatId, userId, section } = req.body;

    if (!seatId|| !userId  || !section || !Section[section]) {
        return res.status(400).json({
            message: "Seat  and price must be provided  "
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

export default router;

