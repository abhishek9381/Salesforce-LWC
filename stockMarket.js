import { LightningElement } from 'lwc';

const APIKEY = 'YOURAPIKEY';



export default class StockMarket extends LightningElement {
    isinnerboxvisible = false;
    stockname;
    text1;
    errormessage;
    metadata;
    
    finalobject;

get getcode(){
    return this.metadata["2. Symbol"];

}
get getrefreshedstatus(){
    return this.metadata["3. Last Refreshed"];

}

    get getopen(){
        return this.finalobject[ "1. open"];
        

    }
   get gethigh(){
        return this.finalobject["2. high"];

    }
   get getlow(){
        return this.finalobject["3. low"];

    }
   get getclose(){
        return this.finalobject["4. close"];

    }
   get getvolume(){
        return this.finalobject["5. volume"];

    }
    

    renderedCallback() {
        const stylex = document.createElement('style');
        stylex.innerText = `
            c-stock-market .slds-input {
                background: #0f1d39;
                color: #04ebd8;
                max-width: 300px;
                border: 1px solid #04ebd8;
            }
            .slds-form-element__label{
                color: #04ebd8;

            }
        `;
        this.template.querySelector('lightning-input').appendChild(stylex);
    }

    changehandler(event) {
        console.log(event.target.value);
        this.stockname = event.target.value;
    }

    submithandler(event) {
        event.preventDefault();
        this.isinnerboxvisible = true;
        this.finalobject=null;
        this.fetchdata();
    }

    resethandler() {
        console.log('reset clicked');
        this.isinnerboxvisible=false;
    }

    fetchdata() {
        this.text1 = 'fetching stock data please wait.....';
        

        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.stockname}&apikey=${APIKEY}`;
        fetch(url).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data);
            if (Object.keys(data)[0] == 'Meta Data') {
                this.text1 = 'data fetched successfully';
                console.log('data fetched successfully');
                console.log(Object.keys(data)[0]);
                console.log(Object.keys(data)[1]);
                console.log(Object.values(data));
                const valuearray=Object.values(data);
                console.log(valuearray[0]);
                this.metadata=valuearray[0];
                console.log(valuearray[1]);
                const objx=valuearray[1];
                const firstkey=Object.keys(objx)[0];
                console.log(objx[firstkey]);
                const objy=objx[firstkey];
                console.log(objy[ "1. open"]);
                console.log(objy[ "2. high"]);
                console.log(objy["3. low"]);
                console.log(objy[ "4. close"]);
                console.log(objy["5. volume"]);
                this.finalobject=objy;
                console.log('final object is ')
                console.log(this.finalobject);
                

            } else if (data['Error Message'] != null) {
                this.text1 = 'an error occured error 444 (invalid stock code entered)';
            } else if (data['Information'] != null) {
                this.text1 = 'Daily request limit exceeded plz try again tomorrow or buy premium version';
            }
        }).catch((error) => {
            console.log(error);
            this.text1='';
            this.finalobject=null;
            this.errormessage=error.message;
        });
    }
}
