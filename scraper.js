require('dotenv').config();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function explicacionProductoIA(nombreProducto) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("No se encontró GROQ_API_KEY en el archivo .env");
    }

    const prompt = `Explica brevemente este producto técnico: "${nombreProducto}". 
    Escribe un primer párrafo con especificaciones, luego en una línea aparte escribe exactamente "¿Para qué sirve?" y un último párrafo con su uso práctico.`;

    for (let intento = 1; intento <= 2; intento++) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1000 // <--- Aumentado para evitar el corte por límite de tokens
            })
        });

        const data = await response.json();

        if (response.ok) {
            const textOutput = data.choices?.[0]?.message?.content;
            if (textOutput && textOutput.trim().length > 0) {
                return textOutput.trim();
            }
        }

        if (intento < 2) {
            await sleep(1000);
        } else {
            console.error("❌ Error API Groq Detalle:", JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || "La API respondió pero no devolvió texto.");
        }
    }
}

async function buscarProductoConIA(producto) {
    const nombre = typeof producto === 'string' ? producto : (producto?.nombre || producto?.producto);
    
    console.log(`\n==================================================`);
    console.log(`[IA Resumen] Procesando: "${nombre}"`);

    if (!nombre) {
        return {
            exito: false,
            descripcion: "Error: No se recibió un nombre de producto válido."
        };
    }

    try {
        const textoIA = await explicacionProductoIA(nombre);
        console.log(`✅ [IA Resumen Exitoso] Generados ${textoIA.length} caracteres.`);
        return {
            exito: true,
            descripcion: textoIA
        };
    } catch (err) {
        console.error("❌ [Error en Pipeline IA]:", err.message);
        return {
            exito: false,
            descripcion: `No se pudo generar la descripción detallada para "${nombre}". Revisa la conexión o recarga.`
        };
    }
}

module.exports = { buscarProductoConIA };