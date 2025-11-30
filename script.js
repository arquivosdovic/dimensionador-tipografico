document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos do DOM
    const baseSizeInput = document.getElementById('base-size');
    const unitSelect = document.getElementById('unit'); // Novo elemento
    const scaleFactorSelect = document.getElementById('scale-factor');
    const fontFamilySelect = document.getElementById('font-family');
    const scalePreview = document.getElementById('scale-preview');

    // 2. Definição da Estrutura Tipográfica (ordem e tag HTML)
    const typeElements = [
        { name: 'H1 - Título Principal', tag: 'h1', step: 3, example: "H1: O Título Principal" },
        { name: 'H2 - Subtítulo', tag: 'h2', step: 2, example: "H2: O Subtítulo do Conteúdo" },
        { name: 'H3 - Chamada', tag: 'h3', step: 1, example: "H3: Chamada Importante" },
        { name: 'P - Texto de Corpo (Base)', tag: 'p', step: 0, example: "P: Este é o texto base. É fundamental para a leitura de todo o seu site e define o ritmo de toda a escala." },
        { name: 'Small - Legenda/Detalhe', tag: 'small', step: -1, example: "Small: Legendas e textos menores de copyright ou detalhes." }
    ];

    // 3. Função de Conversão de Unidades (pt para px, etc.)
    function convertToBasePx(baseSize, unit) {
        // Conversão padrão (1pt ≈ 1.333px) para uso no cálculo do HTML
        if (unit === 'pt') {
            return baseSize * (96 / 72); // 1.3333...
        }
        // Para px, em, e rem, a unidade base é o próprio valor
        return baseSize;
    }
    
    // 4. Função Principal de Cálculo e Renderização
    function generateTypeScale() {
        // Captura os valores de entrada
        const baseSize = parseFloat(baseSizeInput.value) || 16;
        const unit = unitSelect.value;
        const scaleFactor = parseFloat(scaleFactorSelect.value) || 1.2;
        const fontFamily = fontFamilySelect.value;

        // Converte o tamanho base para PX (apenas para exibição no HTML)
        const basePx = convertToBasePx(baseSize, unit);
        
        let htmlContent = '<h2>Visualização da Escala Tipográfica</h2>';

        // Calcula e renderiza cada elemento
        typeElements.forEach(item => {
            // FÓRMULA DE ESCALA (sempre em PX inicialmente para garantir a proporção visual)
            const calculatedSizePx = basePx * Math.pow(scaleFactor, item.step);
            
            let finalSize;
            
            // CONVERSÃO FINAL para a unidade escolhida
            if (unit === 'px') {
                finalSize = calculatedSizePx.toFixed(2);
            } else if (unit === 'pt') {
                // pt = px * (72/96)
                finalSize = (calculatedSizePx * (72 / 96)).toFixed(2);
            } else if (unit === 'em' || unit === 'rem') {
                // em/rem = tamanho_px / tamanho_base_px
                finalSize = (calculatedSizePx / basePx).toFixed(3);
            }
            
            // Unidade de medida para exibição
            const displayUnit = unit;
            // Unidade para o estilo CSS (sempre PX para garantir a visualização correta)
            const cssUnit = 'px'; 

            // Cria o HTML para o item da escala
            htmlContent += `
                <div class="type-item">
                    <div class="type-details">
                        <span class="type-name">${item.name} (${item.tag})</span>
                        <span class="type-size">${finalSize}${displayUnit}</span>
                    </div>
                    <${item.tag} class="type-example" style="font-size: ${calculatedSizePx.toFixed(2)}${cssUnit}; font-family: ${fontFamily};">${item.example}</${item.tag}>
                </div>
            `;
        });

        // Atualiza a área de visualização
        scalePreview.innerHTML = htmlContent;

        // Atualiza o CSS para a fonte selecionada
        document.body.style.fontFamily = fontFamily;
    }

    // 5. Adiciona Event Listeners para Recalcular Automaticamente
    baseSizeInput.addEventListener('input', generateTypeScale);
    unitSelect.addEventListener('change', generateTypeScale);
    scaleFactorSelect.addEventListener('change', generateTypeScale);
    fontFamilySelect.addEventListener('change', generateTypeScale);

    // 6. Inicializa a escala ao carregar a página
    generateTypeScale();
});