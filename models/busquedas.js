const fs = require('fs');
const { default: axios } = require("axios");



class Busquedas {

    historial = ['Tegucigalpa', 'Madrid', 'San Jose'];
    dbPath = './db/database.json';

    constructor() {
        // TODO: leer BD si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar  => {
            let palabras = lugar.split( ' ');
            palabras = palabras.map( p => p[0].toLocaleUpperCase() + p.substring(1) );

            return palabras.join(' ')
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language':'es'
        }
    }
   
    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metrics'
        }
    }

    async ciudad( termino = ' ') {

        try {

            // peticion http
            
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${termino}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            //console.log(resp.data.features);
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));


        } catch (err) {
            console.log(err);
            return [];

        }
        

    }

    async climaLugar(lat,lon ) {
        try {
            // peticion http
            
            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon}
            });

            const resp = await instance.get();
            //console.log(resp.data.main);
            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (err) {
            console.log(err);
        }

    }

    agregarHistorial( lugar = ''){

        // TODO: prevenir duplicado
        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return;
        }
        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // grabar en un archivo de texto
        this.guardarDB();
    }


    guardarDB() {

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));
    
    }
    
    leerDB () {
        
        // debe de existir 
        if ( fs.existsSync( this.dbPath ) ) return;


        // cargar la informacion 
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;

    
    }
}




module.exports = Busquedas;
