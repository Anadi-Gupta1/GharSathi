export class DateTimeService {
  // Format date for display
  static formatDate(date: string | Date, formatString: string = 'dd/MM/yyyy'): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      
      switch (formatString) {
        case 'dd/MM/yyyy':
          return `${day}/${month}/${year}`;
        case 'MM/dd/yyyy':
          return `${month}/${day}/${year}`;
        case 'yyyy-MM-dd':
          return `${year}-${month}-${day}`;
        default:
          return `${day}/${month}/${year}`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  // Format time for display
  static formatTime(date: string | Date, formatString: string = 'hh:mm a'): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      let hours = dateObj.getHours();
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      
      if (formatString.includes('a')) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      } else {
        return `${String(hours).padStart(2, '0')}:${minutes}`;
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  }

  // Format date and time together
  static formatDateTime(date: string | Date, formatString: string = 'dd/MM/yyyy hh:mm a'): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const datePart = this.formatDate(dateObj, 'dd/MM/yyyy');
      const timePart = this.formatTime(dateObj, 'hh:mm a');
      return `${datePart} ${timePart}`;
    } catch (error) {
      console.error('Error formatting date time:', error);
      return '';
    }
  }

  // Get relative time (e.g., "2 hours ago", "in 3 minutes")
  static getRelativeTime(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInMilliseconds = now.getTime() - dateObj.getTime();
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      
      if (diffInMinutes < 1) {
        return 'just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes < 1440) { // 24 hours
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    } catch (error) {
      console.error('Error getting relative time:', error);
      return '';
    }
  }

  // Get booking time slots for a date
  static getBookingSlots(date: Date): string[] {
    const slots: string[] = [];
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour < endHour; hour += 2) {
      const time = new Date(date);
      time.setHours(hour, 0, 0, 0);
      
      // Check if slot is in the future
      if (time > new Date()) {
        slots.push(this.formatTime(time, 'hh:mm a'));
      }
    }
    
    return slots;
  }

  // Check if date is today
  static isToday(date: string | Date): boolean {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const today = new Date();
      return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
      );
    } catch (error) {
      return false;
    }
  }

  // Check if date is tomorrow
  static isTomorrow(date: string | Date): boolean {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return (
        dateObj.getDate() === tomorrow.getDate() &&
        dateObj.getMonth() === tomorrow.getMonth() &&
        dateObj.getFullYear() === tomorrow.getFullYear()
      );
    } catch (error) {
      return false;
    }
  }

  // Get day name
  static getDayName(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (this.isToday(dateObj)) return 'Today';
      if (this.isTomorrow(dateObj)) return 'Tomorrow';
      
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[dateObj.getDay()];
    } catch (error) {
      return '';
    }
  }

  // Calculate duration between two dates
  static getDuration(startDate: string | Date, endDate: string | Date): {
    minutes: number;
    hours: number;
    days: number;
    formatted: string;
  } {
    try {
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

      const diffInMs = end.getTime() - start.getTime();
      const minutes = Math.floor(diffInMs / (1000 * 60));
      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      let formatted = '';
      if (days > 0) {
        formatted = `${days} day${days > 1 ? 's' : ''}`;
      } else if (hours > 0) {
        formatted = `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        formatted = `${minutes} minute${minutes > 1 ? 's' : ''}`;
      }

      return { minutes, hours, days, formatted };
    } catch (error) {
      console.error('Error calculating duration:', error);
      return { minutes: 0, hours: 0, days: 0, formatted: '0 minutes' };
    }
  }

  // Get next available booking date
  static getNextAvailableDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  // Check if time slot is available (not in the past)
  static isSlotAvailable(date: Date, time: string): boolean {
    try {
      const [timeStr, period] = time.split(' ');
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const slotDateTime = new Date(date);
      let adjustedHours = hours;
      
      if (period.toLowerCase() === 'pm' && hours !== 12) {
        adjustedHours += 12;
      } else if (period.toLowerCase() === 'am' && hours === 12) {
        adjustedHours = 0;
      }
      
      slotDateTime.setHours(adjustedHours, minutes, 0, 0);
      
      return slotDateTime > new Date();
    } catch (error) {
      return false;
    }
  }

  // Get working hours for service providers
  static getWorkingHours(): { start: string; end: string } {
    return {
      start: '06:00 AM',
      end: '10:00 PM'
    };
  }

  // Check if current time is within working hours
  static isWorkingHours(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 6 && currentHour < 22;
  }

  // Get estimated service duration based on service type
  static getServiceDuration(serviceType: string): number {
    const durations: Record<string, number> = {
      'cleaning': 120, // 2 hours
      'plumbing': 90, // 1.5 hours
      'electrical': 90, // 1.5 hours
      'appliance-repair': 120, // 2 hours
      'painting': 480, // 8 hours
      'carpentry': 240, // 4 hours
      'beauty': 90, // 1.5 hours
      'wellness': 60, // 1 hour
      'tutoring': 60, // 1 hour
      'fitness': 60, // 1 hour
      'pest-control': 180, // 3 hours
      'gardening': 120, // 2 hours
    };

    return durations[serviceType] || 120; // Default 2 hours
  }

  // Calculate estimated completion time
  static getEstimatedCompletion(startTime: string | Date, serviceType: string): Date {
    try {
      const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
      const duration = this.getServiceDuration(serviceType);
      const completion = new Date(start);
      completion.setMinutes(completion.getMinutes() + duration);
      return completion;
    } catch (error) {
      console.error('Error calculating estimated completion:', error);
      return new Date();
    }
  }

  // Format time remaining for live tracking
  static formatTimeRemaining(minutes: number): string {
    if (minutes <= 0) return 'Arriving now';
    
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      
      if (remainingMinutes === 0) {
        return `${hours} hr`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  }

  // Get date range for booking filters
  static getDateRange(range: 'week' | 'month' | 'quarter'): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (range) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  // Convert UTC to local time
  static utcToLocal(utcDate: string): Date {
    return new Date(utcDate);
  }

  // Convert local time to UTC
  static localToUTC(localDate: Date): string {
    return localDate.toISOString();
  }
}

export default DateTimeService;
