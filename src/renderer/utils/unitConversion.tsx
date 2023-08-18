export const convertEpochToStandardTimeWithDate = (epochTimeInSeconds: number) =>{
    const dateObj = new Date(epochTimeInSeconds * 1000);
  
    const year = dateObj.getUTCFullYear().toString().slice(-2);
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getUTCDate().toString().padStart(2, '0');
    const hours = dateObj.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}


