var fs = require('fs'),
	path = require('path'),
	cwd = process.cwd(), //proj directory
	scriptPath = __dirname;
	
var writePath = path.join(cwd, '../../scripts');

console.log(cwd, scriptPath, writePath);

if(!fs.existsSync(writePath)) {
	console.log('Creating directory: ', writePath);
	fs.mkdirSync(writePath);
}	


var buildIncrementPath = path.join(cwd, 'incrementBuildNum.js');

var incrementFile = fs.readFileSync(buildIncrementPath);
//console.log('incrementFile: ', incrementFile)
var incrementFilePath = path.join(writePath, 'incrementBuildNum.js');

console.log('Creating increment hook: ', incrementFilePath);
fs.writeFileSync(incrementFilePath, incrementFile); 