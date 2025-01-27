import React from "react";
import { sComponent } from "./components/util/state.component";


//construct pages out of components,
//create page logic via the app
export class App extends sComponent {

    state = {
        currentPage:'main'
    };

    constructor(props) {
        super(props);
        //this.__setUseLocalStorage(true); //save all state information in local storage
    }

    render() {
   
        const { currentPage } = this.state;
        
        return (
            <>
                {
                    currentPage === 'main' && 
                    <>

                    </>
                }
                {
                    currentPage === 'search' && 
                    <>

                    </>
                }
            </>
        );
    }

}