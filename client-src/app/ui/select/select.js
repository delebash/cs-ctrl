export class Select
{
    constructor()
    {
        this.fruits =
        [
            {id: 1, text: "Apple"},
            {id: 2, text: "Banana"},
            {id: 3, text: "Grape"},
            {id: 4, text: "Kiwi"},
            {id: 5, text: "Orange"},
            {id: 6, text: "Kumquat"},
            {id: 7, text: "Watermelon"}
        ];
        
        this.selectedFruit = null;
        
        
        
        this.people = 
        [
            {id: 1, text: "Adam",  sex: "m"},
            {id: 2, text: "Beth",  sex: "f"},
            {id: 3, text: "Carol", sex: "f"},
            {id: 4, text: "John",  sex: "m"},
        ];
        this.selectedPerson = this.people[0];
        this.selectedPersonID = 2;
    }
    
    
    renderPersonItem(obj, id, txt)
    {
        var color = obj.sex === "m" ? "blue" : "red";
        return "<span style='color:" + color + "'>" + txt + "</span>";
    }
    
    
    renderPersonResult(ddl, ctrl, obj, highlightedMarkup)
    {
        return highlightedMarkup;
    }
    
    setValueOne()
    {
        this.selectedPersonID = 1;
    }
}