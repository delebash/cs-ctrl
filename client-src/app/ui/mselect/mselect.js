export class Mselect
{
    constructor()
    {
        this.people = 
        [
            {id: 1, text: "Adam"},
            {id: 2, text: "Beth"},
            {id: 3, text: "Carol"},
            {id: 4, text: "John"}
        ];
        
        this.selectedPeople = [this.people[1]];
        this.selectedPerson = null;
    
        this.sports = 
        [
            {id: 1, text: "Baseball"},
            {id: 2, text: "Basketball"},
            {id: 3, text: "Golf"},
            {id: 4, text: "Football"},
            {id: 5, text: "Soccer"},
            {id: 6, text: "Tennis"},
            {id: 7, text: "Hearthstone"}
        ];
        
        this.selectedSports = [];
    }
}