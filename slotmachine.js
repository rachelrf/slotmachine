var contraceptives = {
	"Male Condom": 0.0025, 
	"Withdrawl": 0.0031, 
	"Oral Contraceptive": 0.0013,
	"Injection": 0.0008,
	"Implant": 0.0001,
	"Hormone Patch": 0.0013,
	"NuvaRing": 0.0013,
	"Spermicides": 0.0039,
	"Contraceptive Sponge": 0.0017,
	"Diaphram": 0.0017,
	"Female Condom": 0.0029,
	"IUD": 0.0001,
	"Fertility Awareness": 0.0033
};

// Based on number length
var riskDisplayFontSizes = [
	96,
	96,
	96,
	84,
	84,
	72,
	72,
	64,
	64,
	56,
	56
]

var NO_CONTRACEPTION_EFFICACY = 0.0118;
var NO_CONTRACEPTION = "no contraception";
	
if(Meteor.isClient){

	Template.home.helpers({

	  showMainPage: function() {
	  	var goMain = Session.get("mainApp");
	  	return goMain;
	  }

	});

	Template.contraception.helpers({

	  bcTypes: function() {
	  	return Object.keys(contraceptives);
	  }

	});

	function calculatePercentage(numSex, optionsArr) {
		var numSexVar = numSex || 0;
	    var optionsArrVar = optionsArr || [];
	    if (optionsArrVar.length === 0) {
	    	optionsArrVar = [NO_CONTRACEPTION_EFFICACY]; // Odds of pregnancy without contraception
	    }

	    var odds = optionsArrVar.reduce(function(a,b){return a*b});
	    var chance = odds*100*numSexVar;
	    if (chance > 100){chance = 100;};
	    return chance;
	}

	Template.riskDisplay.helpers({

	  chancePercent: function () {
	  	var chance = calculatePercentage(Session.get("numSex"), Session.get("optionsArr"));
	    var chancePercent = chance.toPrecision(3);
   		
	    return chancePercent;
	  },

	  strContraceptives: function() {
	  	var optionsStr = Session.get("optionsStr") || [NO_CONTRACEPTION];
	  	var strContraceptives = optionsStr.join(", ");
	  	return strContraceptives;
	  },

	  textColor: function() {

	  	var chanceColorRed = Math.floor(calculatePercentage(Session.get("numSex"), Session.get("optionsArr"))*2.5);
	  	var chanceColorGreen = 250 - chanceColorRed;

	  	chanceColorRed = chanceColorRed.toString(16);
	  		if (chanceColorRed.length < 2) {
	  			chanceColorRed = "0" + chanceColorRed;
	  		}
	  	chanceColorGreen = chanceColorGreen.toString(16);
	  		if (chanceColorGreen.length < 2) {
	  			chanceColorGreen = "0" + chanceColorGreen;
	  		}
	  	var chanceColor = chanceColorRed+chanceColorGreen+"00";
	  	return chanceColor;
	  },

	  textSize: function() {
	  	var chance = calculatePercentage(Session.get("numSex"), Session.get("optionsArr"));
	    var chancePercent = chance.toPrecision(3);
	  	return riskDisplayFontSizes[String(chancePercent.length)] || 84;
	  }

	});

	Template.mainApp.events({

		'click #goInfo': function (event, template) {
			event.preventDefault();
			Session.set("mainApp", true);
		}

	});


	Template.infoPage.events({

		'click #goHome': function (event, template) {
			Session.set("mainApp", false);
		}

	});

	Template.numSex.events({

		'keyup #numSex': function (event, template) {
			Session.set("numSex", event.target.value);
		}

	});

	Template.contraception.events({

		'change input[type=checkbox]': function (event, template) {
			var selected = template.findAll("input[type=checkbox]:checked");
			var optionsKeys = selected.map(function(item){return item.value})
			var optionsValues = selected.map(function(item){return contraceptives[item.value]})
			Session.set("optionsStr", optionsKeys);
			Session.set("optionsArr", optionsValues);
		}

	});
}



