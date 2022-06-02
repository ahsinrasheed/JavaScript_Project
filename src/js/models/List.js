import uniqid from 'uniqid';

export default class List {

    constructor(){
        this.item  = [];
    }
    // Add new Item in the list...
    addItem (count, unit, ingredient){
        const item = {
            id : uniqid(),
            count,
            unit,
            ingredient
        };
        this.item.push(item);
        return item;
    };

    // Delete the item from the list 
    deleteItem(id){
        const index = this.item.findIndex(el => el.id === id );
        // [2,4,8] ===> splice(1,1) =====> returns 4, and the original array is [2,8]
        // [2,4,8] ===> slice(1,1)  =====> returns 4, and the original array is [2, 4, 8]
        this.item.splice(index, 1);
    };

    // Update the list Count ....
    updateCount (id, newCount){
        this.item.find(el => el.id === id).count = newCount;
    }

} ;


