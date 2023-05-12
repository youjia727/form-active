import md5 from 'md5';

type objTypes = {
  [key: string]: any
}

type signProps = {
  sign: string
}

type dataProps = {
  time: number,
  random: string
}

// 拼接参数
function _sign(obj: objTypes = {}) {
  let sign: string = '';
  for (var item in obj) {
    sign += '&' + item + '=' + obj[item as keyof typeof obj] + '';
  }
  sign = sign.slice(1);
  sign = md5(sign);
  return sign;
}

export default {
  sign: function(data: objTypes) {
    let timestamp: number = Date.now();
    let _data: dataProps = {
      time: timestamp,
      random: import.meta.env.VITE_RANDOM
    }
    // let company_admin_id = null
    
    // company_admin_id = sessionStorage.getItem('DJS-FAIR-LOGIN-TOKEN')
    
    // if (company_admin_id) {
    //   _data.company_admin_id = company_admin_id
    // }

    const dataAssign = Object.assign(data, _data);

    const keys: Array<any> = Object.keys(dataAssign).sort();

    // 定义一个空对象
    const obj: objTypes = {};

    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = dataAssign[keys[i]];
    };

    const oSign: signProps = {
      sign: ''
    };
    oSign.sign = _sign(obj);

    let add_sign: objTypes = {};

    add_sign = Object.assign(obj, oSign);

    delete add_sign.random;

    return add_sign;
  }
}
