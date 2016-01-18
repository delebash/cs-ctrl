export class DateEx
{
    constructor()
    {
        this.setDateToXMas();
    }
    
    setDateToToday()
    {
        this.selectedDt = new Date();
    }
    
    setDateToXMas()
    {
        this.selectedDt = new Date(2015, 11, 25);
    }
}