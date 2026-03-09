//references -User  and Table that was booked

//fields reqd 
// User->> type: objectId ref user, reqd: yes, ref:user,
//table: type: obkjectid, reqd: yes, ref: Table-to know which table booked
//date ->> type: date, reqd: yes, what day reservation for?
//timeslot _>> type: String, required: yes, eg: 18:30, 19:00, what time is the reservation
//numberOfGuests->> type: Number, required: Yes, Min: 1, Max: 20 or whatever, why: how many peopple are comming
//status ->> type: string, required: yes, default:"pending",enum: ["pending","confirmed", "completed", "cancelled", "no-show"]=> track the reservation liefcycle
//spwcialRequests(opt)+> type: String, reqd: Yes, Restaurant needs to contact costumer if needed
//timestamps
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  
  //duration
  duration: {
    type: Number,
    min: 60,
    max: 240,
    default: 120
  },

  endTime:{
    type: Date
  },
  //pre-order
  preOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  //has customer pre-ordered?
  hasPreOrder: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "confirmed", "completed", "cancelled", "no-show"]
  },
  specialRequests: {
    type: String
  },
  contactPhone: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

//auto calculate endtime before validation
reservationSchema.pre('validate', function(next){
  console.log('🔍 Pre-validate hook triggered');
  console.log('📅 Date:', this.date);
  console.log('⏰ TimeSlot:', this.timeSlot);
  console.log('⏱️ Duration:', this.duration);
  
  if(this.date && this.timeSlot && this.duration){
    const [hours, minutes] = this.timeSlot.split(':');
    const startTime = new Date(this.date);
    startTime.setHours(parseInt(hours), parseInt(minutes || 0), 0, 0);
    this.endTime = new Date(startTime.getTime() + this.duration * 60000);
    console.log('✅ EndTime calculated:', this.endTime);
  } else {
    console.log('❌ Missing required fields for endTime calculation');
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
