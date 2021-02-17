require('dotenv').config();
require('colors');
const { leerInput, 
        inquirerMenu,
        pausa, 
        listarLugares
      } = require('./Helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {

    const busquedas = new Busquedas();

    let opt = -1;
    //console.clear();

    do {

        opt = await inquirerMenu();

        switch ( opt ) {
            case 1:
                
                // mostramos  mensaje
                const termino = await leerInput('Ciudad: ');
               
                 // Buscamos los lugares
                 const lugares = await busquedas.ciudad( termino );
                 // Seleccionamos el lugar
                 const id = await listarLugares(lugares);
                 const lugarSel = lugares.find( l => l.id === id)
                 //console.log({lugarSel});

                 // Clima


                 // Mostrar resultado 
                 console.log('\n Información de la ciudad \n'.green);
                 console.log('Ciudad:', lugarSel.nombre );
                 console.log('Lat:', lugarSel.lat);
                 console.log('Lng:', lugarSel.lng);
                 console.log('Temperatura:',);
                 console.log('Mínima:',);
                 console.log('Máxima :',);
            break;
            case 2:
                console.log('seleccionste Historial');
            break;

        }
        await pausa();

    } while (opt !== 0)
}


  main();


