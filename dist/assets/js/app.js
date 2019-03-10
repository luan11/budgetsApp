document.getElementById('sysDate').innerText = formatDate(new Date());

var generatorData = {
    'container': document.getElementById('generator'),
    'client_name': document.getElementById('nome'),
    'qtd': document.getElementById('qtd'),
    'delivery_date': document.getElementById('entrega'),
    'tot': document.getElementById('tot'),
    'art_value': document.getElementById('valor_arte')
};

var generatedData = {
    'container': document.getElementById('generated'),
    'client_name': document.getElementById('g_nome'),
    'qtd': document.getElementById('g_qtd'),
    'delivery_date': document.getElementById('g_entrega'),
    'tot': document.getElementById('g_total'),
    'validity': document.getElementById('g_validade')
};

var totPercent = 0.05;

document.getElementById('form_generator').addEventListener('submit', (e) => {
    e.preventDefault();
    var totalEnd = calcBudgetTot(sanitizeValue(generatorData.tot.value), sanitizeValue(generatorData.art_value.value), totPercent);
    var deliveryDate = dateHelper(generatorData.delivery_date.value);
    saveToPrint(generatorData.client_name.value, generatorData.qtd.value, deliveryDate, totalEnd, calcValidityDate());
    generatorData.container.classList.remove("d-flex");
    generatorData.container.classList.add("d-none");
})

function calcBudgetTot(printShopTot, artTot, percent){
    return "R$ " + Math.round(parseFloat(printShopTot) + parseFloat(artTot) + (parseFloat(printShopTot) + parseFloat(artTot)) * percent) + ",00";
}

function saveToPrint(cliNome, qtd, dataEntrega, tot, validade){
    document.title = 'Orçamento para ' + cliNome + "_" + qtd +"un";
    generatedData.client_name.value = cliNome;
    generatedData.qtd.value = qtd + "un";
    generatedData.delivery_date.value = dataEntrega;
    generatedData.tot.value = tot;
    generatedData.validity.innerText = validade;
    generatedData.container.classList.remove("d-none");
    generatedData.container.classList.add("d-flex");
    setTimeout(() => {
        window.print();
    }, 100)
}

function dateHelper(date){
    var dateParts = date.split('-');
    var newDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
    return formatDate(newDate);
}

function formatDate(date){
    var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    return date.getDate() + "/" + months[date.getMonth()] + "/" + date.getFullYear();
}

function calcValidityDate(){
    var now = new Date();
    now.setDate(now.getDate() + 1);
    return formatDate(now);
}

function resetGeneratorData(){
    document.title = 'Gerar Orçamento - Cartões de Visita';
    generatorData.client_name.value = "";
    generatorData.qtd.value = "";
    generatorData.delivery_date.value = "";
    generatorData.tot.value = "";
    generatorData.art_value.value = "";
    generatorData.container.classList.remove("d-none");
    generatorData.container.classList.add("d-flex");
    generatedData.container.classList.remove("d-flex");
    generatedData.container.classList.add("d-none");
    generatorData.client_name.focus();
}

function formatValue(input){
    input.value = input.value.replace(/[^0-9]/g, '');
    input.value = input.value.replace(/(\d+?)(\d{2}$)/g, 'R$ $1,$2');
}

function sanitizeValue(input){
    return input.replace('R$ ', '').replace(',', '.');
}