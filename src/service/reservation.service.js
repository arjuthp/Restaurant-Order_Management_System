const mongoose = require('mongoose');
const Reservation = require('../models/reservation.model');
const Table = require('../models/table.model');

class ReservationService {
    //method 1: create reservation (without transaction for standalone MongoDB)
    async createReservation(reservationData){
        //check if table is already booked at this time
        const existingReservation = await Reservation.findOne({
            table: reservationData.table,
            date: reservationData.date,
            timeSlot: reservationData.timeSlot,
            status: {$ne: 'cancelled'} //ignore cancelled reservations
        });

        //if table is already booked, throw error
        if(existingReservation){
            throw new Error('Table is already booked for this time slot');
        }

        //create reservation
        const reservation = await Reservation.create(reservationData);

        //return the created reservation
        return reservation;
    }

    //Method 2: Get users reservation
    async getMyReservations(userId){
        const reservations = await Reservation.find({user: userId})
        .populate('table', 'tableNumber capacity location')
        .sort({date: -1, timeSlot: -1}); //newest first
        return reservations;
    }

    //Method 3: Get single reservation by ID
   async getReservationById(reservationId){
        const reservation = await Reservation.findById(reservationId)
        .populate('user', 'name email phone') //include user details
        .populate('table', 'tableNumber capacity location'); //include table details

        if(!reservation){
            throw new Error('Reservation not found');
        }
        return reservation;
    }

    //Method 4: Cancel Reservation
    async cancelReservation(reservationId, userId){
        //find reservation 
        const reservation = await Reservation.findById(reservationId);
        if(!reservation){
            throw new Error('Reservation not found');
        }

        //Check if user owns this reservation
        if(reservation.user.toString() !== userId.toString()){
            throw new Error('You can only cancel your own reservations');
        }
        //check if laready cancelled
        if(reservation.status === 'cancelled'){
            throw new Error('Reservation is already cancelled');
        }
        //Update status to cancelled
        reservation.status = 'cancelled';
        await reservation.save();

        return reservation;
    }

    //Method 5: Check availability (find free tables)
    async checkAvailability(date, timeSlot, numberOfGuests){
        //find all tables that can fit the number of guests
        const suitableTables = await Table.find({
            capacity: { $gte: numberOfGuests }, //capacity >= numberOfGuests
            status: 'active'
        });

        //Get all booked table IDs for this date and time
        const bookedReservations = await Reservation.find({
            date: date,
            timeSlot: timeSlot,
            status : { $ne: 'cancelled'}
        }).select('table');

        const bookedTableIds = bookedReservations.map(res => res.table.toString());

        //Filter out booked tables 
        const availableTables = suitableTables.filter(
            table => !bookedTableIds.includes(table._id.toString())
        );
        return availableTables;
    }

    //Method 6: Get all reservations(Admins only)
    async getAllReservations(filters = {}){
        const query = {};

        //apply filters if provided
        if(filters.date){
            query.date = filters.date;
            }
        if(filters.status){
            query.status = filters.status;
        }

        const reservations = await Reservation.find(query)
        .populate('user', 'name email phone')
        .populate('table', 'tableNumber capacity location')
        .sort({date: -1, timeSlot: -1});

        return reservations;
    }

    //Method 7: Update reservation status(Admin only)
    async updateReservationStatus(reservationId, status){
        const reservation = await Reservation.findByIdAndUpdate(
            reservationId,
            {status: status },
            { new: true, runValidators: true }
        );
        if(!reservation){
            throw new Error('Reservation not found');
        }
        return reservation;
    }
}
module.exports = new ReservationService();