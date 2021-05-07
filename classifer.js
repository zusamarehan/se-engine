const { validate: uuidValidate }  = require('uuid');
const store = require('./store');
const classifier = (item) => {
    let validRequest = true;
    for (const [key, value] of Object.entries(item.data)) {
        // console.log(key, value)
        switch (key) {
            case 'slug':
                validRequest = (value.constructor === String)
                // console.log('slug' +"/"+ value + "=>" + validRequest)
                break;
            case 'productId':
                validRequest = uuidValidate(value)
                // console.log('productId' +"/"+ value + "=>" + validRequest)
                break;
            case 'projectId':
                validRequest = uuidValidate(value)
                // console.log('projectId' +"/"+ value + "=>" + validRequest)
                break;
            case 'userEmail':
                const re = /\S+@\S+\.\S+/;
                validRequest = re.test(value);
                // console.log('userEmail' +"/"+ value + "=>" + validRequest)
                break;
            case 'data':
                validRequest = (Object.prototype.toString.call(value) === '[object Object]');
                // console.log('data' +"/"+ value + "=>" + validRequest)
                break;
            default:
                break;
        }
    }
    if(validRequest) {
        store.storeValid(item.data)
    }
    else {
        store.storeInvalid(item.data)
    }
}
exports.classifier = classifier;