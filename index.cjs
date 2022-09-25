var fs = require('node:fs');
var path = require('path');
var parser = require('xml2json');

async function parseXpath(filePath, XPath) {
	// if no file path or xpath then spit out error message
	if (!filePath) {
		console.log("FilePath is needed, please run again");
		return
	};
	if (!XPath) {
		console.log("XPath is needed, please run again");
		return
	};

	let returnArray = [];
	// if file read only that file
	if (fs.lstatSync(filePath).isFile()) {
		if (verifyXmlFile(filePath)) {
			returnArray.push({
				"path": filePath,
				"value": getXPathObject(filePath, XPath)
			})
		} else {
			console.log(`The file at ${filePath} was not an XML file`);
		}
	} else {
		walk(filePath, function (err, results) {
			if (err) {
				console.log(err);
			}
			results.forEach(filePath => {
				if (verifyXmlFile(filePath)) {
					returnArray.push({
						"path": filePath,
						"value": getXPathObject(filePath, XPath)
					})
				}
			})
		});
	}

	return returnArray;
};

// given an XML file location and a XPath value return an object with that XPath
// This assumes there will only be 1 XPath value per file
// Also assumes there will be a single xpath 'parent' value that the main portion of the XML data lives in, see sample XML doc for example
const getXPathObject = (filePath, XPath) => {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) throw err;
		const json = JSON.parse(parser.toJson(data))
		const result = json[Object.keys(json)[0]][XPath]
		return result
	});
}

// get all files given a directory
// from an 11 year old stack overflow question, however it looks like node-dir may be a better solution here
// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
// https://github.com/fshost/node-dir
const walk = (dir, done) => {
	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function (file) {
			file = path.resolve(dir, file);
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function (err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push(file);
					if (!--pending) done(null, results);
				}
			});
		});
	});
};

// verify a file is an xml file
const verifyXmlFile = (filePath) => {
	return /\.xml$/gmi.test(filePath)
}

exports.parser = parseXpath;