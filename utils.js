
const padChar = '　';

exports.fullWidth = function (text) {
	let full = '';
	for (let i = 0; i < text.length; i++) {
		const code = text.charCodeAt(i);

		if (code === 32) {
			full += padChar;
		} else if (code >= 33 && code <= 126) {
			full += String.fromCharCode(code + 0xfee0); // full width conversion
		}
	}
	return full;
};

exports.paddedFullWidth = function (text, padSize) {
	let padded = exports.fullWidth(text);
	while (padded.length < padSize) {
		padded += padChar;
	}
	return padded;
};

exports.errorWrap = function (func) {
	return function () {
		let r;
		try {
			r = func.apply(this, arguments);
		} catch (e) {
			console.error(e);
		}
		return r;
	};
};
