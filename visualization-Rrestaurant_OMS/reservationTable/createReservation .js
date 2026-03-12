/**
 * Purpose => create a new table reservation for customer .Vlidates table availability, capacity -> prevents double booking for same time slot
 *  
 * Inputs => req.body {table, date, timeslots all dfileds}
 * auth middleware =. userid
 * 
 * checks => auth validation
 *  - sevice checks => table exists, table status (available or unavailable), tbale capacity => if tablecapacit < number of Guestes , double booking ?
 * 
 * ACTIONS => extracts user infor id , and role 
 * parse req body
 * extract all fields using spread operator{...req.body}
 * adds user tp reservation data => calls service 
 *  
 * service actions=> fetch
 * table => validates table existence status-capacity
 * query for already existed reservation 
 * creates reservation 
 * retruns reservation to controller
 */

//1. fetch table
async function fetchTableById(tableId) {
    const table = await Table.findById(tableId);
    return table;
}

//validates table exists

function validateTableExists(table){
    if(!table){
        throw new Error('Table not found');
    }
}

function validateTableIsActive(table){
    if(table.status !=='active'){
        throw new Error ('Table not available for reservations')
    }
}

function validateTableCapacity(table, numberOfGuests){
    if(table.capacity < numberOfGuests){
        throw new Error(`Table capacity (${table.capacity}) is insufficient for ${numberOfGuests}guests`);
    }
}

//check for existing reservations
async function findConflictingReservations(tableId, date, timeSlot){
    const existingReservation = await Reservation.findOne({
        table:tableId,
        date:date,
        timeSlot: timeSlot,
        status: {$ne:'cancelled'}
    });
    return existingReservation;
}

function validateConflictingReservations(existingReservation){
    if(existingReservation){
        throw new Error('Table is already booked for this time.')
    }
}

async function saveReservation(reservationData){
    const reservation = await Reservation.create(reservationData);
    return reservation;
}

async function createReservation(req,res){
    try{
        //controller => extract and prep data
        const userId = req.user.Id;
        const reservationData = {
            ...req.body,
            user: userId
        };

        //service 
        const table = await fetchTableById(reservationData.table);
        validateTableExists(table);
        validateTableIsActive(table);
        validateTableCapacity(table, reservationData.numberOfGuests);

        const existingReservation = await findConflictingReservations(
            reservationData.table,
            reservationData.date,
            reservationData.timeSlot
        );

        validateConflictingReservations(existingReservation);
        const reservation = await saveReservation(reservationData);

        res.status(201).json({
            success: true,
            message:"successfully reserved",
            data: reservation
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}