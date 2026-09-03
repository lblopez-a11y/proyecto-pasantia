const { buscarProductoEnGLC } = require('./scraper');

async function probar() {
    const modeloABuscar = 'DS-KD9203-E6'; 
    console.log('--- INICIANDO PRUEBA DE SCRAPING EN VIVO ---');
    
    const datos = await buscarProductoEnGLC(modeloABuscar);
    
    console.log('\n--- RESULTADO OBTENIDO ---');
    console.log(JSON.stringify(datos, null, 2));
}

probar();