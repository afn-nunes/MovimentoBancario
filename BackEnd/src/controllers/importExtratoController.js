const fs = require('fs')
const ofx = require('@wademason/ofx')
module.exports = {
  async index(request, response){
    const {arquivo} = request.body;
    const file = fs.readFileSync(arquivo, 'utf8')
   
    const obj = ofx.parse(file)
    const dadosBancarios = obj.body["OFX"]["BANKMSGSRSV1"]["STMTTRNRS"]["STMTRS"];
    return response.json(dadosBancarios);
  }
}