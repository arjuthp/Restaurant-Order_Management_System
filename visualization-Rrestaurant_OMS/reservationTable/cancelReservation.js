function validateAvailabilityParams(date, timeSLot, numberOfGuests){
    if(!date || !time || !numberOfGuests){
        const error = new Error('Please enter all credientials');
        error.status = 400;
        throw error;
    }
}
async function findSuitableTables(guestCount){
    const tables = await Table.find({
        capacity: {$gte: guestCount},
        status: 'active'
    });
}

async function BookedTableIds(date, timeSLot){
    const bookedReservation = await saveReservation.find({
        date: date,
        timSlot: timeSlot,
        status: {$ne : 'cancelled'}
    }).select('table');
    const bookedTables = bookedReservation.map(res=> res.tables.toString());
    return bookedTables;
}
function filterAvailableTables(suitableTables, bookedTableIds) {
    const availableTables = suitableTables.filter(table => 
        !bookedTableIds.includes(table._id.toString())
    );
    
    return availableTables;
}
async function checkAvailability(req,res){
    try {
        //extract query params
        const {date, timeSlot, numberOfGuests} = req.query;

        //1.validate required params exists
        validateAvailabilityParams(date, timeSlot, numberOfGuests);

        //2. conv noOfGuests to String
        const guestCount = parseInt(numberOGuests);

        //3. find table with sufficient capacity
        const suitableTables = await findSuitableTables(guestCount);
        //find booked table at same date and time
        const bookedTableIds = await findBookedTableIds(date, timeSlot);
        
        //filterout booked tables
        const availableTables = 
        //send success

    } catch (error) {
        
    }
}