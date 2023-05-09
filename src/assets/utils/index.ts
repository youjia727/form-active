
let _toString = Object.prototype.toString;
var hasOwnAttribute = Object.prototype.hasOwnProperty;

type objProps = {
	[key: string]: any
};

export default {
	// 判断是否是对象
	isPlainObject(obj: any) {
		return _toString.call(obj) === '[object Object]'
	},
	// 判断是否是数组
	isPlainArray(obj: any) {
		return _toString.call(obj) === '[object Array]'
	},
	// 快速对象检查-这主要用于判断,知道原始值时，从原始值获取对象
	isObject(obj: any) {
		return obj !== null && typeof obj === 'object'
	},
	// 判断数据类型 
	isType(type: string) {
		return function <T>(obj: T): boolean {
			return Object.prototype.toString.call(obj) === "[object " + type + "]";
		}
	},
	// 判断是否是正则
	isRegExp(v: any) {
		return _toString.call(v) === '[object RegExp]'
	},
	// 判断是否是视频
	isVideo(path: any) {
		let reg = /\.(mp4|avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv)/;
		return reg.test(path);
	},
	// 判断手机号是否正确
	checkPhone(phone: any) {
		let reg = /^1\d{10}$/;
		return reg.test(phone);
	},
	// 判断图形验证码
	checkImgCode(code: any) {
		let reg = /^\d{4}$/
		return reg.test(code)
	},
	// 判断手机验证码
	checkCode(code: any) {
		let reg = /^\d{6}$/
		return reg.test(code)
	},
	// 判断密码格式（密码由6-20位字母、数字、符号，至少两种组合形式组成）
	checkPassword(value: any) {
		let reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/
		return reg.test(value);
	},
	//验证姓名
	checkName(str: any) {
		let reg = /^[\u4E00-\u9FA5]{1}[\u4E00-\u9FA5\·\.\-]{0,8}[\u4E00-\u9FA5]{1}$/
		return reg.test(str)
	},
	// 验证身份证
	checkIdCard(str: any) {
		let reg =
			/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
		return reg.test(str)
	},
	//验证邮箱
	checkEmail(email: any) {
		let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		return reg.test(email)
	},
	// 验证输入英文
	chatEng(value: any) {
		let reg = /^[a-zA-Z\d]{1}[-_a-zA-Z0-9]{3,20}$/;
		return reg.test(value)
	},
	//验证微信号
	chatCheck(we_chat: any) {
		let reg = /^[a-zA-Z\d]{1}[-_a-zA-Z0-9]{5,19}$/;
		return reg.test(we_chat)
	},
	// 验证内容不允许输入特殊字符
	checkContent(value: any) {
		let reg = /^([\u4e00-\u9fa5\·\(\)\（\）\.\-\—]+|[a-zA-Z0-9]+){2,32}$/;
		return reg.test(value);
	},
	// 检验https
	checkHttps(value: any) {
		let reg = /(https):\/\/(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])\S*/
		return reg.test(value);
	},
	// 将值转换为实际呈现的字符串
	toStr(val: any) {
		return val == null ?
			'' :
			Array.isArray(val) || (this.isPlainObject(val) && val.toString === _toString) ?
				JSON.stringify(val, null, 2) :
				String(val)
	},
	// 转换成数字
	toNumber(val: any) {
		var n = parseFloat(val);
		return isNaN(n) ? val : n;
	},
	// 从数组中删除一个项
	remove<T>(arr: Array<T>, item: T): Array<T> {
		let newArr = this.deepClone(arr);
		if (arr.length) {
			let index = newArr.indexOf(item);
			if (index > -1) {
				newArr.splice(index, 1)
			}
		}
		return newArr;
	},
	// 检查对象是否具有该属性
	hasOwn(obj = {}, key: string) {
		return hasOwnAttribute.call(obj, key);
	},
	// 冒泡排序
	bubbleSort(arr: Array<(string | number)>) {
		for (var i = 0; i < arr.length - 1; i++) {
			for (var j = 0; j < arr.length - i; j++) {
				if (arr[j] > arr[j + 1]) {
					var temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
				}
			}
		}
		return arr;
	},
	// 选择排序
	selectSort(arr: Array<(string | number)>) {
		var min, temp;
		for (var i = 0; i < arr.length - 1; i++) {
			min = i;
			for (var j = i + 1; j < arr.length; j++) {
				if (arr[j] < arr[min]) {
					min = j;
				}
			}
			temp = arr[i];
			arr[i] = arr[min];
			arr[min] = temp;

		}
		return arr;
	},
	// 快速排序
	quickSort<T>(arr: Array<T>): Array<T> {
		if (arr.length < 2) {
			return arr;
		}
		let left: Array<T> = [],
			right: Array<T> = [],
			mid: any = arr.splice(Math.floor(arr.length / 2), 1);
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] < mid) {
				left.push(arr[i]);
			} else {
				right.push(arr[i])
			}
		}
		return this.quickSort(left).concat(mid, this.quickSort(right))
	},
	// 插入排序
	insertSort(arr: Array<(string | number)>) {
		let len: number = arr.length;
		for (let i = 1; i < len; i++) {
			let key = arr[i];
			let j = i - 1;
			while (j >= 0 && arr[j] > key) {
				arr[j + 1] = arr[j];
				j--;
			}
			arr[j + 1] = key;
		}
		return arr;
	},
	// 对象按字母排序
	objKeysSort(obj: objProps) {
		let newKey: Array<any> = Object.keys(obj).sort();
		// 创建一个新对象，用于存放排好序的键值对
		var newObj: { [key: string]: number } = {};
		for (var i = 0; i < newKey.length; i++) {
			// 向新创建的对象中按照排好的顺序依次增加键值对
			newObj[newKey[i]] = obj[newKey[i] as keyof typeof obj];
		}
		// 返回新对象
		return newObj;
	},
	// 拆半查找法查找下标索引值
	binarySearch<T, U>(array: Array<T>, target: U, attr: string = 'index') {
		if (!array.length) return 0;
		let left = 0, right = array.length - 1;
		while (left <= right) {
			let mid = Math.floor((right + left) / 2);
			const value = typeof array[mid] === 'object' ? (array[mid] as objProps)[attr] : array[mid];
			if (value == target) {
				return mid;
			} else if (value < target) {
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		};
		return Math.floor((left + right) / 2 + 1);
	},
	// 查找下标索引
	findIndex<T, U>(array: Array<T>, target: U, attr: string = 'id') {
		let left = 0, right = array.length - 1;
		for (let i = 0; i < array.length; i++) {
			if (left > right) return -1;
			const leftValue = typeof array[left] === 'object' ? (array[left] as objProps)[attr] : array[left];
			const rightValue = typeof array[right] === 'object' ? (array[right] as objProps)[attr] : array[right];
			if (leftValue === target || rightValue === target) {
				return leftValue === target ? left : right;
			}
			left++;
			right--;
		}
		return -1;
	},
	// 查找下标项
	find<T, U>(arr: Array<T>, target: U, attr: string = 'id') {
		let idx = this.findIndex(arr, target, attr);
		return idx > -1 ? arr[idx] : undefined;
	},
	// 将一个类数组对象转换为一个真实的数组
	toArray<T>(list: Array<T>, start: number = 0): Array<T> {
		let i = list.length - start;
		let ret = new Array(i);
		while (i--) {
			ret[i] = list[i + start];
		}
		return ret
	},
	// 锁定滚动条
	lockScroll() {
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		document.body.style.overflow = 'hidden';
		document.body.style.position = 'fixed';
		document.body.style.width = '100%';
		document.body.style.top = -scrollTop + 'px';
		document.body.style.left = -scrollLeft + 'px';
	},
	// 解锁滚动条
	unlockScroll() {
		var scrollTop = parseInt(document.body.style.top || '0');
		var scrollLeft = parseInt(document.body.style.left || '0');
		document.body.style.overflow = '';
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.left = '';
		window.scrollTo(-scrollLeft, -scrollTop);
	},
	// 将一个对象增加到另一个对象中
	extend(to: objProps, _from: objProps) {
		for (let key in _from) {
			to[key] = _from[key];
		}
		return to
	},
	// 将对象数组合并为单个对象
	toObject<T>(arr: Array<T>) {
		let res: objProps = {};
		for (let i = 0; i < arr.length; i++) {
			if (arr[i]) {
				this.extend(res, arr[i] as objProps);
			}
		}
		return res;
	},
	// 去重
	onlyArray<T>(arr: Array<T>): Array<T> {
		var newArr: Array<T> = [];
		for (var i = 0; i < arr.length; i++) {
			if (newArr.indexOf(arr[i]) === -1) {
				newArr.push(arr[i]);
			}
		}
		return newArr
	},
	// 取出两组相同元素
	getArrEqual<T, Y>(arr1: Array<T>, arr2: Array<Y>): Array<T> {
		return arr1.filter((item: any) => {
			return arr2.indexOf(item) != -1
		});
	},
	// 检查字符串是否以$或_开头
	isReserved(str: string) {
		let c = (str + '').charCodeAt(0);
		return c === 0x24 || c === 0x5F
	},
	// 判断访问终端
	browser() {
		let u = navigator.userAgent;
		return {
			trident: u.indexOf('Trident') > -1, // IE内核
			presto: u.indexOf('Presto') > -1, // opera内核
			webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
			iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, // 是否iPad
			webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
			weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
			alipay: u.indexOf('AlipayClient') > -1, // 是否支付宝
			qq: /QQ/i.test(u) // 是否QQ
		}
	},
	// 将图片对象转换成base64地址
	fileToString(file: any) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader(); //读取文件
			reader.readAsDataURL(file);
			reader.onload = () => {
				let data = {
					url: reader.result
				}
				resolve(data)
			}
		})
	},
	//将base64转换为文件对象
	dataURLtoFile(dataurl: string, filename: string) {
		let data = dataurl.split(',');
		const arr = data[0].match(/:(.*?);/) || [];
		let type = arr[1];
		let bstr = window.btoa(data[1]);
		let n = bstr.length;
		let u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		//转换成file对象
		return new File([u8arr], filename, { type });
	},
	// 深拷贝
	deepClone<T>(params: T): T {
		return JSON.parse(JSON.stringify(params));
	},
	//生成唯一的id值
	randomString() {
		return (+new Date() + Math.random()).toString(36).split('.')[0];
	},
	// 输入给文字高亮
	highlighted(arr: string, str: string) {
		if (arr.length == 0 || str.length == 0) {
			return false;
		}
		for (let i = 0; i < arr.length; i++) {
			let reg = new RegExp(arr[i], "ig");
			str = str.replace(reg, "<font color=#1890ff>" + arr[i] + "</font>");
		}
		return str;
	},
	//设置缓存
	setItem(params: objProps) {
		let obj = {
			name: 'STORAGE',
			value: '',
			expires: 7 * 24 * 3600 * 1000, //过期时间 、1 * 24 * 3600 * 1000
			startTime: new Date().getTime() //记录何时将值存入缓存，毫秒级
		}
		let options: objProps = {};
		//将obj和传进来的params合并
		Object.assign(options, obj, params);
		if (options.expires) {
			//如果options.expires设置了的话
			//以options.name为key，options为值放进去
			localStorage.setItem(options.name, JSON.stringify(options));
		} else {
			//如果options.expires没有设置，就判断一下value的类型
			//如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
			if (this.isPlainObject(options.value) || this.isPlainArray(options.value)) {
				options.value = JSON.stringify(options.value);
			}
			localStorage.setItem(options.name, options.value);
		}
	},
	//拿到缓存
	getItem(name: string) {
		let item: any = localStorage.getItem(name);
		//先将拿到的试着进行json转为对象的形式
		try {
			item = JSON.parse(item);
		} catch (error) {
			//如果不行就不是json的字符串，就直接返回
			item = item;
		}
		//如果有startTime的值，说明设置了失效时间
		if (item && item.startTime) {
			let date: number = new Date().getTime();
			//何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
			if (date - item.startTime > item.expires) {
				//缓存过期，清除缓存，返回false
				localStorage.removeItem(name);
				return false;
			} else {
				//缓存未过期，返回值
				return item.value;
			}
		} else {
			//如果没有设置失效时间，直接返回值
			return item;
		}
	},
	//移出缓存
	removeItem(name: string) {
		localStorage.removeItem(name);
	},
	//移出全部缓存
	clear() {
		localStorage.clear();
	},
	// 临时存储
	sessionSetItem(params: objProps) {
		let obj = {
			name: 'SESSION-STORAGE',
			value: ''
		}
		let options: objProps = {};
		//将obj和传进来的params合并
		Object.assign(options, obj, params);
		if (this.isPlainObject(options.value) || this.isPlainArray(options.value)) {
			options.value = JSON.stringify(options.value);
		}
		sessionStorage.setItem(options.name, options.value)
	},
	// 获取临时存储
	sessionGetItem(name: string) {
		let item: any = sessionStorage.getItem(name);
		try {
			item = JSON.parse(item)
		} catch (e) {
			item = item
			//TODO handle the exception
		}
		return item;
	},
	// 临时缓存删除
	sessionRemove(name: string) {
		sessionStorage.removeItem(name)
	},
	// 移除全部临时缓存
	sessionClear() {
		sessionStorage.clear()
	},
	// 设置cookie
	setCookie(name: string, value: string, time?: number) {
		var date = time || 7 * 24 * 3600 * 1000;
		var exp = new Date();
		exp.setTime(exp.getTime() + date);
		document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toUTCString();
	},
	// 获取cookie
	getCookie(name: string): string {
		let search: string = name + '=' // 查询检索的值
		let returnvalue: string = '' // 返回值
		if (document.cookie.length > 0) {
			let sd = document.cookie.indexOf(search)
			if (sd !== -1) {
				sd += search.length
				let end: number = document.cookie.indexOf(';', sd)
				if (end === -1) {
					end = document.cookie.length
				}
				// decodeURIComponent() 函数可对通过 URIComponent() 编码的字符串进行解码。
				returnvalue = decodeURIComponent(document.cookie.substring(sd, end))
				if (!returnvalue) {
					this.delCookie(name)
				}
			}
		}
		return returnvalue
	},
	// 删除cookie
	delCookie(name: string) {
		let exp: Date = new Date();
		exp.setTime(exp.getTime() - 1);
		let cval: string = this.getCookie(name);
		if (cval != null) {
			document.cookie = name + '=' + cval + ';expires=' + exp.toUTCString();
		}
	},
	// 删除所有cookie
	delAllCookie() {
		let cookies: Array<string> = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie: string = cookies[i];
			let eqPos: number = cookie.indexOf('=');
			let name: string = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	},
	//判断开始时间<结束时间
	validTime(startTime: string, endTime: string): boolean {
		let beginDate = startTime;
		let endDate = endTime;
		let d1 = new Date(beginDate.replace(/\-/g, "\/"));
		let d2 = new Date(endDate.replace(/\-/g, "\/"));
		if (beginDate != "" && endDate != "" && d1 >= d2) {
			// 根据使用的组件这里调取提示语
			// Toast({ message: "开始时间必须小于结束时间！", duration: 1500 });
			return false;
		}
		return true
	},
	// 动态加载文件,默认加载js文件
	loadscript(url: string, type: string) {
		if (!url) {
			return
		}
		let script = document.createElement("script");
		script.type = "text/javacript";
		if (type) {
			script.type = type
		}
		script.src = url;
		document.body.appendChild(script);
	},
	// 获取url参数
	getQueryString(search: string) {
		let url: string = search || window.location.search;
		let theRequest: objProps = new Object();
		if (url.indexOf("?") != -1) {
			let str: string = url.slice(1);
			let strs: Array<string> = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},
	//解析时间戳
	timeData(data: string) {
		let date = new Date(parseInt(data) * 1000);
		let Y = date.getFullYear() + '-';
		let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
		let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
		let dateObj = {
			YMDHMS: Y + M + D + h + m + s, //年月日时分秒
			YMDHM: Y + M + D + h + m, //年月日时分
			YMD: Y + M + D, //年月日
			MDHMD: Y + M + D, //月日时分秒
			HMS: h + m + s, //时分秒
			HM: m + s, //时分
		}
		return dateObj
	}
}
