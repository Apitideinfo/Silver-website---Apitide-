import { useState } from 'react';
import { bookingApi } from '../api/booking.api';
import { BookingService } from '../services/BookingService';

export function useBooking() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const bookConsultation = async (bookingData) => {
    setSubmitting(true);
    setSuccess(false);
    setErrors({});

    const validation = BookingService.validateConsultation(bookingData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitting(false);
      return false;
    }

    try {
      await bookingApi.createConsultation(bookingData);
      setSuccess(true);
      setSubmitting(false);
      return true;
    } catch (err) {
      console.error(err);
      setErrors({ global: 'Failed to create booking. Please try again.' });
      setSubmitting(false);
      return false;
    }
  };

  const enrollSavings = async (enrollmentData) => {
    setSubmitting(true);
    setSuccess(false);
    setErrors({});

    const validation = BookingService.validateSavingsEnrollment(enrollmentData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitting(false);
      return false;
    }

    try {
      await bookingApi.enrollInSavingsScheme(enrollmentData);
      setSuccess(true);
      setSubmitting(false);
      return true;
    } catch (err) {
      console.error(err);
      setErrors({ global: 'Enrollment failed. Please try again.' });
      setSubmitting(false);
      return false;
    }
  };

  return {
    submitting,
    success,
    errors,
    setSuccess,
    bookConsultation,
    enrollSavings
  };
}
export default useBooking;
