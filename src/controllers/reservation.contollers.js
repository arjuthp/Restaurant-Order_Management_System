const reservationService = require('../service/reservation.service');

class ReservationController {

  //create reservation (Customer)
  // Flow: User submits booking → Check availability → Create with transaction

  async createReservation(req, res){
    try{
      // Step 1: Prepare reservation data
      // Spread operator (...) copies all fields from req.body
      // Add user ID from authenticated user (req.user comes from auth middleware)
      const reservationData = {
        ...req.body,
        user: req.user.id //from auth middleware
      };
       // Step 2: Call service to create reservation
      // Service will use TRANSACTION to prevent double booking
      const reservation = await reservationService.createReservation(reservationData);
      // Step 3: Send success response with 201 (Created) status
      res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        data: reservation
      });
    }catch(error){
      // Step 4: If error (table already booked, validation failed, etc.)
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  //Get MY Reservations(Customer)
  //Flow: User requests their bookings - fetch from DB -> return list

  async getMyReservations(req, res){
    try{

      //1. Get logged-in users ID from auth middleware
      const userId = req.user.id;

      //2. Fetch all reservations for this user
      //Service will populate table details and sort by date
      const reservations = await reservationService.getMyReservations(userId);

      //3.Send success response with count and data
      res.status(200).json({
        success: true, 
        count: reservations.length,
        data: reservations
      });
    }catch(error){
      //4. if db error, send internal server error

      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  //Get reservation ID(Customer-own only)
  //flow: user req sp. booking -> check ownership -> Return details

  async  getReservationById(req, res){
    try{
      //1. Extract reservation ID form URL paramater
      const { id } = req.params;

      //2.Fetch reservation woth user and table details populated
      const reservation = await reservationService.getReservationById(id);

      //3. AUTHORIZATION CHECK - Ensure user owns this reservation
      //COmpare reservations user ID with logged in users ID
      if(reservation.user._id.toString() !== req.user.id.toString()){
        return res.status(403).json({
          success:false,
          message: 'You can only view your own reservations'
        });
      }

      //Step4: User owns it , send reservation details
      res.status(200).json({
        success: true,
        data: reservation
      });
    }catch(error){
      //5. if reservation not found 
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  //Cancel Reservation(customer)
  //flow: USer cancels booking -> check ownersship -> update statu


  async cancelReservation(req, res){
    try{
      //1.get reservation id from url and userId from auth
      const { id } = req.params;
      const userId = req.user.id;

      //2. Call Service to cancel
      //service will check ownership and update status to 'cancelled'
      const reservation = await reservationService.cancelReservation(id, userId);

      //3. Send success response
      res.status(200).json({
        success: true,
        message: 'Reservation cancelled successfully',
        data: reservation
      });
    }catch(error){
      //4. if error 
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  //check availability
  // flow: User checks free tables -> QUery DB ->   available tables 

  async checkAvailability(req, res){
    try{
      //1. Extract query parameters from url
      const  {date, timeSlot, numberOfGuests } = req.query;
      //2. Validation- ensure all required parameters provided
      if(!date || !timeSlot || !numberOfGuests){
        return res.status(400).json({
          success: false,
          message: 'Please provide date, timeSlot, and numberOfGuests'
        });
      }

      //3.call service to find available tables
      //Service will:
      //-find tables with enough capacity
      //-check which are not booked at that time
      //-Return List of tables

      const availableTables = await reservationService.checkAvailability(
        date,
        timeSlot,
        parseInt(numberOfGuests) //convert string to number
      );

      //step 4: Send List of available tables
       res.status(200).json({
        success: true,
        count: availableTables.length,
        data: availableTables
       });
    }catch(error){
      //5. If database error
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


  //GET ALL RESERVATIONS(Admin only)
  //Flow: Admin requests all bookings -> Apply filters -> Return List
  async getAllReservations(req, res){
    try {
      //1.build filters object from query parameters
      const filters = {
        date: req.query.date, //filter by date
        status: req.query.status //filter by status
      };
      //2.Fetch all reservations with optional filters
      //service will populate user and table details
      const reservations = await reservationService.getAllReservations(filters);

      //3. Send complete list to admin
      res.status(200).json({
        success: true,
        count: reservations.length,
        data: reservations
      });
    } catch (error) {
      //4. if db error
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  //UPDATE RESERVATION STATUS(Admin only)
  //Flow: Admin changes status -> Validate -> Update DB
  async updateReservationStatus(req, res){
    try {
      //1. Get reservation ID from URL and new status from body
      const { id } = req.params;
      const { status } = req.body;

      //2.Validation-> Ensure status is provided
      if(!status){
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      //3.Call services to update status
      const reservation = await reservationService.updateReservationStatus(id, status);

      //4. send updated reservation
      res.status(200).json({
        success: true,
        message: 'Reservation status updated successfully',
        data: reservation
      });
    } catch (error) {
      //5. if error
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }


}

module.exports = new ReservationController();