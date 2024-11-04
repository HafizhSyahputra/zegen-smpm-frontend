
export const formatDateIndo = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };
  
export const PDFDateIndo = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };
  
  export const setToEndOfDay = (dateString: string): string => {  
    const date = new Date(dateString);  
    date.setHours(23, 59, 0, 0);   
    return date.toISOString();
  };  