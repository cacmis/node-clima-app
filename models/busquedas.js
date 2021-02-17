const { default: axios } = require("axios");



class Busquedas {

    historial = ['Tegucigalpa', 'Madrid', 'San Jose'];

    constructor() {
        // TODO: leer BD si existe
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language':'es'
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


}


module.exports = Busquedas;
