import axios from 'axios';

export default class Search {
    constructor (query){
        this.query = query;
    }

    async  getResults(){
        // const proxy = 'https://crossorigin.me/';
        // const proxy = 'https://robwu.nl/cors-anywhere.html/';
        // const key =  "642b1cc8d4f2730081462fbc65136320";
        try{
            // const res = await axios(`${PROXY}http://food2fork.com/api/search?key=${KEY}&q=${this.query}`);
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
        } catch(error){
            alert(error);
        }
    }
}


