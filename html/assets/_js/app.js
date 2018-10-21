var servicesList = $('#bud-service-type');
var serviceBudgetSection = $('.bud-service-fields');
var serviceBudgetSection_status = 0;

// Set vars for validity of budget
var nowDate = new Date();
var setValidityDate = new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate());
var validityOfBudget = setValidityDate.getDate(setValidityDate.setDate(nowDate.getDate()+2))+"/"+setValidityDate.getMonth()+"/"+setValidityDate.getFullYear();

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

function verifyEmptyFields(variable, value){
	if(value == ""){
		variable.css({
			border: '1px solid red'
		})
	}else{
		variable.css({
				border: 'none'
		})
	}

	variable.focusout(function(){
		value = variable.val();

		if(value == ""){
			variable.css({
				border: '1px solid red'
			})
		}else{
			variable.css({
				border: 'none'
			})
		}
	})
}

function createPDF(content,clienteName){
	var documentToPDF = window.open('', '', 'height=0,width=0');
	documentToPDF.document.write('<!DOCTYPE html> <html lang="pt-br"> <head> <meta charset="UTF-8"> <title>NovaisINFO Soluções | Orçamento para: '+clienteName+'</title> <!-- Load font by Fonts Google --> <link href="https://fonts.googleapis.com/css?family=Krub:600,700" rel="stylesheet"> <!-- Bootstrap Grid --> <link rel="stylesheet" href="assets/_css/bootstrap.css"> <!-- Default Style --> <link rel="stylesheet" href="assets/_css/style.css"> </head> <body> <header class="bud-header"> <div class="container"> <figure class="bud-header-logo"> <img src="assets/images/novaisinfo-logo.png" alt="" class="img-responsive"> </figure> </div> </header> <main class="bud-content"> <div class="container">');
	documentToPDF.document.write(content);
	documentToPDF.document.write('<figure class="bud-footer-logo"> <img src="assets/images/assinatura_email.png" alt="" class="img-responsive"> </figure> </div> </main> </body> </html>');
	documentToPDF.document.close();

	setTimeout(function() {
		documentToPDF.print();
	}, 100)
}

servicesList.on('change',function(){
	if($(this).val() == 'cv'){
		var cvFields = '<input type="text" class="field field-cli-name" placeholder="Nome do cliente"> <input type="number" class="field field-qtd" placeholder="Qtd de cartões"> <input type="text" class="field field-delivery" placeholder="Entrega prevista"> <input type="number" class="field field-value-cv" placeholder="Valor dos cartões + frete (Printi)"> <input type="number" class="field field-value-work" placeholder="Valor da arte"> <a href="javascript:void(0);" class="generate-budget">Gerar orçamento</a>';

		verify_serviceBudgetSectionStatus();

		add_serviceBudgetSectionContent(serviceBudgetSection, cvFields);

		// get this service vars to generate budget
		var workPercent = 1.10;
		var btnGenerator = $('.generate-budget');

		btnGenerator.on('click', function(){
			var valueClientName = $('.field-cli-name').val();
			var qtd = $('.field-qtd').val();
			var valueCv = $('.field-value-cv').val();
			var deliveryDate = $('.field-delivery').val();
			var valueWork = $('.field-value-work').val();

			if(valueClientName == "" || qtd == "" || deliveryDate == "" || valueCv == "" || valueWork == ""){
				verifyEmptyFields($('.field-cli-name'), valueClientName);
				verifyEmptyFields($('.field-qtd'), qtd);
				verifyEmptyFields($('.field-value-cv'), valueCv);
				verifyEmptyFields($('.field-delivery'), deliveryDate);
				verifyEmptyFields($('.field-value-work'), valueWork);
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
					delivery: deliveryDate,
					price: servicePrice,
					validity: validityOfBudget
				};

				var contentForPDF = "<p><b>Nome do Cliente:</b> "+budgetData.clientName+"</p><p><b>Quantidade de Cartões:</b> "+budgetData.cvQtd+" un.</p><p><b>Previsão de entrega:</b> "+budgetData.delivery+"</p><p><b>Preço total: </b>R$"+budgetData.price+"</p><p><b>Validade deste orçamento:</b> "+budgetData.validity+"</p>";

				createPDF(contentForPDF,budgetData.clientName);
			}
		});
	};

	if($(this).val() == 'logo'){
		var cvFields = '<p>Serviço indisponível!</p>';

		verify_serviceBudgetSectionStatus();

		add_serviceBudgetSectionContent(serviceBudgetSection, cvFields);
	};

	if($(this).val() == 'dev'){
		var cvFields = '<p>Serviço indisponível!</p>';

		verify_serviceBudgetSectionStatus();

		add_serviceBudgetSectionContent(serviceBudgetSection, cvFields);
	};
});