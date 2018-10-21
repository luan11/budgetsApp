var servicesList = $('#bud-service-type');
var serviceBudgetSection = $('.bud-service-fields');
var serviceBudgetSection_status = 0;

// Set vars for validity of budget
var nowDate = new Date();
var setValidityDate = new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate());
setValidityDate.setDate(nowDate.getDate()+2);
var validityOfBudget = setValidityDate.getDate()+"/"+setValidityDate.getMonth()+"/"+setValidityDate.getFullYear();

// Start global functions
function verify_serviceBudgetSectionStatus(){
	if(serviceBudgetSection_status == 1){
		serviceBudgetSection.empty();
		serviceBudgetSection_status = 0;
		return serviceBudgetSection_status;
	}
};

function add_serviceBudgetSectionContent(serviceBudgetSection, cvFields){
	if(serviceBudgetSection_status == 0){
		serviceBudgetSection.prepend(cvFields);
		serviceBudgetSection_status = 1;
		return serviceBudgetSection_status;
	}
};

function createPDF(content,clienteName){
	var win = window.open('', '', 'height=0,width=0');
	win.document.write('<!DOCTYPE html> <html lang="pt-br"> <head> <meta charset="UTF-8"> <title>NovaisINFO Soluções | Orçamento para: '+clienteName+'</title> <!-- Load font by Fonts Google --> <link href="https://fonts.googleapis.com/css?family=Krub:600,700" rel="stylesheet"> <!-- Bootstrap Grid --> <link rel="stylesheet" href="assets/_css/bootstrap.css"> <!-- Default Style --> <link rel="stylesheet" href="assets/_css/style.css"> </head> <body> <header class="bud-header"> <div class="container"> <figure class="bud-header-logo"> <img src="assets/images/novaisinfo-logo.png" alt="" class="img-responsive"> </figure> </div> </header> <main class="bud-content"> <div class="container"> <section class="bud-service-fields">');
	win.document.write(content);
	win.document.write('<figure class="bud-footer-logo"> <img src="assets/images/assinatura_email.png" alt="" class="img-responsive"> </figure></section> </div> </main> </body> </html>');
	win.document.close();

	setTimeout(function() {
		win.print();
	}, 100)
}

servicesList.on('change',function(){
	if($(this).val() == 'cv'){
		var cvFields = '<input type="text" class="field-cli-name" placeholder="Nome do cliente"> <input type="number" class="field-qtd" placeholder="Qtd de cartões"> <input type="number" class="field-value-cv" placeholder="Valor dos cartões + frete (Printi)"> <input type="number" class="field-value-work" placeholder="Valor da arte"> <a href="javascript:void(0);" class="generate-budget">Gerar orçamento</a>';

		verify_serviceBudgetSectionStatus();

		add_serviceBudgetSectionContent(serviceBudgetSection, cvFields);

		// get this service vars to generate budget
		var workPercent = 1.10;
		var btnGenerator = $('.generate-budget');

		btnGenerator.on('click', function(){
			var qtd = $('.field-qtd').val();
			var valueCv = $('.field-value-cv').val();
			var valueWork = $('.field-value-work').val();
			var valueClientName = $('.field-cli-name').val();

			if(valueClientName == "" || qtd == "" || valueCv == "" || valueWork == ""){
				alert("empty fields, fill in all fields to generate the budget");
			}else{
				// verify cv value
				if((valueCv.search(/,/)) == 2){
					valueCv = parseFloat(valueCv.replace(',','.'));
				}else{
					valueCv = parseFloat(valueCv);
				}

				// verify work value
				if((valueWork.search(/,/)) == 2){
					valueWork = parseFloat(valueWork.replace(',','.'));
				}else{
					valueWork = parseFloat(valueWork);
				}
				var servicePrice = (((valueCv + valueWork) * workPercent).toFixed(2)).replace('.',',');

				var budgetData = {
					clientName: valueClientName,
					cvQtd: qtd,
					price: servicePrice,
					validity: validityOfBudget
				};

				var contentForPDF = "<p><b>Nome do Cliente:</b> "+budgetData.clientName+"</p><p><b>Quantidade de Cartões:</b> "+budgetData.cvQtd+"</p><p><b>Preço total(Arte, Produção e Frete): </b>R$"+budgetData.price+"</p><p><b>Validade deste Orçamento:</b> "+budgetData.validity+"</p>";

				createPDF(contentForPDF,budgetData.clientName);
			}
		});
	};

	if($(this).val() == 'logo'){
		verify_serviceBudgetSectionStatus();
	};

	if($(this).val() == 'dev'){
		verify_serviceBudgetSectionStatus();
	};
});