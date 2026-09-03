/**
 * Extrae de forma limpia el código técnico del modelo
 */
function extraerModelo(nombreProducto) {
    if (!nombreProducto) return '';
    const palabras = nombreProducto.split(' ');
    for (let palabra of palabras) {
        if (palabra.includes('-') && palabra.length > 3) {
            return palabra;
        }
    }
    return nombreProducto;
}

function generarEnlaceDirecto(nombreProducto) {
    if (!nombreProducto) return null;
    
    const nombre = nombreProducto.toUpperCase();
    const codigoModelo = extraerModelo(nombreProducto);
    const queryCodificada = encodeURIComponent(codigoModelo);

    // 1. Proveedor TVC (Seguridad y Redes)
    if (
        nombre.includes('DAHUA') || 
        nombre.includes('HIKVISION') || 
        nombre.includes('HIKSEMI') || 
        nombre.includes('UBIQUITI') || 
        nombre.includes('UBNT') || 
        nombre.includes('MIKROTIK') ||
        nombre.includes('TP-LINK') ||
        nombre.includes('TENDA') ||
        nombre.includes('NETGEAR')
    ) {
        return `https://www.google.com/search?q=site:tvc.mx+${queryCodificada}`;
    } 
    
    // 2. Proveedor GLC Tec (Hardware, Componentes, Periféricos y Marca Propia GLC)
    else if (
        nombre.includes('GLC') ||
        nombre.includes('GLCTEC') ||
        nombre.includes('AMD') || 
        nombre.includes('INTEL') || 
        nombre.includes('KINGSTON') || 
        nombre.includes('HYPERX') ||
        nombre.includes('GIGABYTE') || 
        nombre.includes('MSI') || 
        nombre.includes('ASUS') || 
        nombre.includes('ASROCK') ||
        nombre.includes('BIOSTAR') ||
        nombre.includes('ADATA') || 
        nombre.includes('XPG') || 
        nombre.includes('WD') || 
        nombre.includes('WESTERN DIGITAL') || 
        nombre.includes('SEAGATE') || 
        nombre.includes('CRUCIAL') || 
        nombre.includes('PNY') || 
        nombre.includes('THERMALTAKE') || 
        nombre.includes('SENTEY') ||
        nombre.includes('COOLER MASTER') ||
        nombre.includes('DEEPCOOL') ||
        nombre.includes('CORSAIR') ||
        nombre.includes('ZOTAC') ||
        nombre.includes('SAPPHIRE') ||
        nombre.includes('EVGA') ||
        nombre.includes('GEFORCE') ||
        nombre.includes('RADEON')
    ) {
        return `https://www.google.com/search?q=site:glctec.com+${queryCodificada}`;
    } 
    
    // 3. Resto de productos -> Sin enlace
    else {
        return null;
    }
}

module.exports = { generarEnlaceDirecto };