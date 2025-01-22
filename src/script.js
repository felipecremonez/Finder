function ToggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// EventListener para formulário de busca (opcional)
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const cnpj = document.getElementById('cnpj').value;
    console.log("CNPJ enviado:", cnpj);
});


function formatCNPJ(input) {
    let value = input.value;

    // Remove todos os caracteres que não são números
    value = value.replace(/\D/g, "");

    // Adiciona a formatação do CNPJ
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");

    // Atualiza o valor do input
    input.value = value;
}

// Adiciona o evento de input ao campo CNPJ
document.getElementById("cnpj").addEventListener("input", function () {
    formatCNPJ(this);
});

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const cnpj = document.getElementById('cnpj').value;
    
    // Função para buscar os XMLs utilizando a biblioteca node-mde
    async function buscarXMLs(cnpj) {
        try {
            const response = await fetch('https://github.com/felipecremonez/node-mde?tab=readme-ov-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cnpj }),
            });
            
            if (!response.ok) {
                throw new Error('Erro ao buscar XMLs');
            }
            
            const data = await response.json();
            mostrarResultados(data);
        } catch (error) {
            console.error(error);
            mostrarErro('Erro ao buscar XMLs. Por favor, tente novamente.');
        }
    }
    
    // Função para exibir os resultados na página
    function mostrarResultados(data) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (data.length === 0) {
            resultsDiv.innerHTML = '<p>Nenhum XML encontrado para o CNPJ informado.</p>';
            return;
        }

        const list = document.createElement('ul');
        data.forEach(xml => {
            const listItem = document.createElement('li');
            listItem.textContent = `XML ID: ${xml.id} - Data: ${xml.data}`;
            list.appendChild(listItem);
        });

        resultsDiv.appendChild(list);
    }
    
    // Função para exibir uma mensagem de erro na página
    function mostrarErro(message) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `<p style="color: red;">${message}</p>`;
    }
    
    // Chamar a função de buscar XMLs
    buscarXMLs(cnpj);
});









// Exemplo de servidor em Node.js:
const express = require('express');
const bodyParser = require('body-parser');
const mde = require('node-mde');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/buscar-xmls', async (req, res) => {
    const { cnpj } = req.body;

    try {
        const xmls = await mde.getXmlByCnpj(cnpj);
        res.json(xmls);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar XMLs' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});



