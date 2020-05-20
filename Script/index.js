const fs = require('fs'); 
   
async function start(){
  const text   = fs.readFileSync('../sped_fiscal.txt', {encoding:'utf8', flag:'r'}); //pega arquivo formatando em utf8
  const iniPos = text.indexOf('|H010|');
  const endPos = text.indexOf('|H990|');

  const iniArq = text.substring(0, iniPos);
  const endArq = text.substring(endPos, 1000000000);

  let adaptedText = text.substring(iniPos, endPos);

  const line = adaptedText.split("\r\n")
  line.pop();

  const newLine = [];

  for(var i = 0; i < line.length; i++){
    let lineActive =  line[i].split('');
    let pos = 0;
    let iniVal = 0;
    let endVal = 0;
    for(var x = 0; x <lineActive.length; x++){
      if(lineActive[x] == '|'){
        if(pos == 5){
          iniVal = x;      
        }
        if(pos == 6){
          endVal = x;
        }
        pos++;
      }
    }
    newLine.push(line[i]);

    let valueActive = line[i].substring(iniVal + 1, endVal); 
    let lineReplace = line[i + 1];
    let lineReplaceValue = lineReplace.split('');
    pos = 0;
    iniVal = 0;

    for(var y = 0; y < lineReplaceValue.length; y++){
      if(lineReplaceValue[y] == '|'){
        if(pos == 2){
          iniVal = y;  
        }
        pos++;
      }
    }

    let iniLineReplace = lineReplace.substring(0, iniVal + 1);
    let virgReplaceValue = valueActive.replace(',', '.');
    let imposto = parseFloat(virgReplaceValue) *  0.17;
    let impostoFormat = parseFloat(imposto.toFixed(2));    

    let impostoString = impostoFormat + "";
  
    newLine.push(iniLineReplace + valueActive + "|" + impostoString.replace('.', ',') + "|");
    
    i++;
  }

 //console.log(newLine);  

  let relItems = "";
  for(var z = 0; z < newLine.length; z++){
    relItems = relItems + newLine[z] + "\r\n";
  }

  let date = new Date();
  var day   = date.getDate();
  var month = date.getMonth();
  var year  = date.getFullYear();
  var hour  = date.getHours();
  var minutes  = date.getMinutes();
  date = day + '-' + (month++) + '-' + year + '_' + hour + 'h' + minutes + "m";
  
  const ArqName = '../sped_novo_'+ date +'.txt';

  console.log(ArqName, iniArq + relItems + endArq);
  
  fs.writeFileSync(ArqName, iniArq + relItems + endArq);

}

start();