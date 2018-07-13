
'use strict';

let  crypto  = require('crypto');
let util = require('util');

(function () {
  var i;
  function logsalt(err, salt) {
    if (!err) {
      console.log('salt is ' + salt);
    }
  }
  if (require.main === module) {
    var enc = crypt.encrypt('One97');
    for (i = 0; i < 5; i++) {
      crypt.gen_salt(4, logsalt);
    }
  }
}());

const crypt = {
  iv: '@@@@&&&&####$$$$',

  encrypt: function (data,custom_key) {
    var iv = this.iv;
    var key = custom_key;
    var algo = '256';
    switch (key.length) {
    case 16:
      algo = '128';
      break;
    case 24:
      algo = '192';
      break;
    case 32:
      algo = '256';
      break;

    }
    var cipher = crypto.createCipheriv('AES-' + algo + '-CBC', key, iv);
    //var cipher = crypto.createCipher('aes256',key);
    var encrypted = cipher.update(data, 'binary', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  },

  decrypt: function (data,custom_key) {
    var iv = this.iv;
    var key = custom_key;
    var algo = '256';
    switch (key.length) {
    case 16:
      algo = '128';
      break;
    case 24:
      algo = '192';
      break;
    case 32:
      algo = '256';
      break;
    }
    var decipher = crypto.createDecipheriv('AES-' + algo + '-CBC', key, iv);
    var decrypted = decipher.update(data, 'base64', 'binary');
    try {
      decrypted += decipher.final('binary');
    } catch (e) {
      util.log(util.inspect(e));
    }
    return decrypted;
  },

  gen_salt: function (length, cb) {
    crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
      var salt;
      if (!err) {
        salt = buf.toString("base64");
      }
      //salt=Math.floor(Math.random()*8999)+1000;
      cb(err, salt);
    });
  },

  /* one way md5 hash with salt */
  md5sum: function (salt, data) {
    return crypto.createHash('md5').update(salt + data).digest('hex');
  },
  sha256sum: function (salt, data) {
    return crypto.createHash('sha256').update(data + salt).digest('hex');
  }
};

function paramsToString(params, mandatoryflag) {
  var data = '';
  var flag = params.refund ? true : false;
  var value = "";
  delete params.refund;
  var tempKeys = Object.keys(params);
  if (!flag) tempKeys.sort();
  tempKeys.forEach(function (key) {
    value = params[key];
    if (value.indexOf("REFUND") > -1 || value.indexOf("|") > -1) {
    }
    if (key !== 'CHECKSUMHASH' ) {
      if (params[key] === 'null') params[key] = '';
      if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
        data += (params[key] + '|');
      }
    }
  });
  return data;
}

const genchecksum = (params, key, cb) => {
  console.log(params, key);
	var flag = params.refund ? true : false;
  var data = paramsToString(params);
	crypt.gen_salt(4, function (err, salt) {
    var sha256 = crypto.createHash('sha256').update(data + salt).digest('hex');
    var check_sum = sha256 + salt;
    var encrypted = crypt.encrypt(check_sum, key);
    if (flag) {
      params.CHECKSUM = (encrypted);
      params.CHECKSUM = encrypted;
    } else {
      params.CHECKSUMHASH = (encrypted);
		}
    cb(undefined, params);
  });
}

const verifychecksum = (params, key) => {

  if (!params) console.log("params are null");

  var data = paramsToString(params, false);
  //TODO: after PG fix on thier side remove below two lines
  if (params.CHECKSUMHASH) {
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\n', '');
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\r', '');

    var temp = decodeURIComponent(params.CHECKSUMHASH);
    var checksum = crypt.decrypt(temp, key);
    var salt = checksum.substr(checksum.length - 4);
    var sha256 = checksum.substr(0, checksum.length - 4);
    var hash = crypto.createHash('sha256').update(data + salt).digest('hex');
    if (hash === sha256) {
      return true;
    } else {
      util.log("checksum is wrong");
      return false;
    }
  } else {
    util.log("checksum not found");
    return false;
  }
}

module.exports =  {
    crypt,
    genchecksum,
    verifychecksum
}