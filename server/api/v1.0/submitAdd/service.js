let UserModel = require("./model");

let utils = require('../../../common/utils');

let create = function (values) {
    if(values.password){
        values.password = utils.encryptPassword(values.password);
    }
    return UserModel.create(values);
}

let findOneByValues = function (values) {
    if(values.password) {
        values.password = utils.encryptPassword(values.password);
    }
    return UserModel.findOne(values).exec();
}

let findAllByValues = function (values,options) {
    if(values.password) {
        values.password = utils.encryptPassword(values.password);
    }
    return UserModel.find(values,[],options).exec();
}

let UpdateOneByValues = function (findByValues,values) {
    if(findByValues.password) {
        findByValues.password = utils.encryptPassword(findByValues.password);
    }
    if(values.password) {
        values.password = utils.encryptPassword(values.password);
    }
    
    return UserModel.update(findByValues,values).exec();
}

module.exports = {
    create,
    findOneByValues,
    UpdateOneByValues,
    findAllByValues
}
