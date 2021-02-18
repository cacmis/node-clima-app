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
                 if( id === '0' ) continue;

                 const lugarSel = lugares.find( l => l.id === id)
                 // Guardar el historial
                 busquedas.agregarHistorial(lugarSel.nombre);

                 //console.log({lugarSel});

                 // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);
// console.log(clima);
                 // Mostrar resultado
                 console.clear(); 
                 console.log('\n Información de la ciudad \n'.green);
                 console.log('Ciudad:', lugarSel.nombre.green );
                 console.log('Lat:', lugarSel.lat);
                 console.log('Lng:', lugarSel.lng);
                 console.log('Temperatura:',clima.temp);
                 console.log('Mínima:',clima.min);
                 console.log('Máxima :',clima.max);
                 console.log('Como esta el clima:',clima.desc.green);
            break;
            case 2:
                busquedas.historialCapitalizado.forEach ( (lugar, i ) => {
                    const idx = `${ i + 1}.`.green;
                    console.log( `${ idx } ${ lugar }`);
                })
            break;

        }
        await pausa();

    } while (opt !== 0)
}


  main();


