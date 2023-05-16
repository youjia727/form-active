interface objProps {
    [key: string]: any
}

export default {
    // 判断数据类型 
	isType(type: string) {
		return function <T>(obj: T): boolean {
			return Object.prototype.toString.call(obj) === "[object " + type + "]";
		}
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
}