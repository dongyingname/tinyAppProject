const bcrypt = require('bcrypt');

const hash = bcrypt.hashSync('hahahaahahah', 15);
console.log(hash);
// res == true)
console.log(bcrypt.compareSync('one', hash));
console.log(bcrypt.compareSync('hahahaahahah', hash));