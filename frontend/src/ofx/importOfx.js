const fs = require('fs')
const ofx = require('@wademason/ofx')
module.expors = {
  async create(request, response) {
    debugger;  
    const file = await fs.readFileSync("./bradesco.ofx", 'utf8');

    const obj = ofx.parse(file)
    const str = ofx.serialize(obj)
      
    console.log(str)

    return response.json(str);
  }
}


