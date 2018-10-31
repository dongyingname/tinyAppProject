function generateRandomString() {
    let str = '';
    for (let i = 0; i < 6; i++){
        str += Math.floor(Math.random()*7);
    }
    return str;
}
console.log(generateRandomString());