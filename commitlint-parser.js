module.exports = {
  parserOpts: {
    // The origin parser does not support emoji(using \w to match type)
		headerPattern: /^(.*)(?:\((.*)\))?-(.*)$/,
	}
};