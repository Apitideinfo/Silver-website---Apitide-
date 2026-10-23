export const BookingService = {
  // Validate consultation appointment parameters
  validateConsultation(bookingData) {
    const errors = {};
    if (!bookingData.name || bookingData.name.trim() === '') {
      errors.name = 'Full name is required';
    }
    if (!bookingData.phone || !/^\+?[0-9\s-]{10,15}$/.test(bookingData.phone)) {
      errors.phone = 'Please provide a valid phone number';
    }
    if (bookingData.type !== 'custom_design') {
      if (!bookingData.date) {
        errors.date = 'Appointment date is required';
      }
      if (!bookingData.timeSlot) {
        errors.timeSlot = 'Please select a preferred hour slot';
      }
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate scheme enrollment parameters
  validateSavingsEnrollment(enrollmentData) {
    const errors = {};
    if (!enrollmentData.fullName || enrollmentData.fullName.trim() === '') {
      errors.fullName = 'Full name is required';
    }
    if (!enrollmentData.whatsapp || !/^\+?[0-9\s-]{10,15}$/.test(enrollmentData.whatsapp)) {
      errors.whatsapp = 'Valid WhatsApp contact is required';
    }
    if (!enrollmentData.amount || Number(enrollmentData.amount) < 1000) {
      errors.amount = 'Minimum monthly installment is ₹1,000';
    }
    if (!enrollmentData.nomineeName || enrollmentData.nomineeName.trim() === '') {
      errors.nomineeName = 'Nominee details are mandatory';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
