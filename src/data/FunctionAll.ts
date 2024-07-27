export const genNumberByTime = () =>{
    
    return Date.now();
}
export const formatNumberToDot = (number: any) => {
    if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return 0;
}
export const formatNumberFixed4 = (number:number)=>{
    return parseFloat(number.toFixed(4));
} 
