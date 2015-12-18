
var fs = require('fs');
// ForestCutter - Logging thingy
var sett = require('./settings.json');
function MultiLogger(verbosityFilter){
	var dateStr = new Date().toLocaleDateString();
	var logName = sett.logfileName + sett.logfileSuffix;
	logName = logName.replace('{DATE}', dateStr);
	this.consoleL = new Logger(verbosityFilter, 'console');
	this.fileL = new Logger(verbosityFilter, logName);
}
MultiLogger.prototype.genericLog = ml_genLog;
MultiLogger.prototype.info = info;
MultiLogger.prototype.debug = debug;
MultiLogger.prototype.log = log;
MultiLogger.prototype.important = important;

function ml_genLog(data, v){
	this.consoleL.genericLog(data, v);
	this.fileL.genericLog(data, v);
}



// Logger
function Logger(vfilter, target){
	
	this.verbosity = vfilter;
	this.lFunc;
	this.tgt;
	if(!target || target == 'console'){
		this.lFunc = console.log;
	} else {
		this.tgt = target;
		this.lFunc = fLog;
	}
}
Logger.prototype.genericLog = genLog;
Logger.prototype.info = info;
Logger.prototype.debug = debug;
Logger.prototype.log = log;
Logger.prototype.important = important;

function important(data){
	genLog(data, -1);
}

function fLog(data){
	fs.appendFileSync(this.tgt, data);
}
function logFmt(data, v){
	/*
	var d = new Date();
	var dateStr = d.toLocaleDateString();
	var timeStr = d.toLocaleTimeString();
	var vStr = '';
	switch (v) {
		case 2:
			vStr = '{INFO}: '
			break;
		case 1:
			vStr = '{DEBUG}: '
			break;
		case -1:
			vStr = '{**IMPORTANT**}: '
			break;
	
		default:
			break;
	}
	return (vStr+'['+dateStr+' @ '+timeStr+']: '+data); 
	*/
	var d = new Date();
	var dateStr = d.toLocaleDateString();
	var timeStr = d.toLocaleTimeString();
	var vStr = '';
	for(var i = 0; i < sett.levels.length; i++){
		if(sett.levels[i].level == v){
			vStr = sett.levels[i].prefix;
			break;
		}
	}
	return ('['+dateStr+' @ '+timeStr+'] '+vStr+data);
}

function log(data){
	genLog(data, 0);
}
function debug(data){
	genLog(data, 1);
}
function info(data){
	genLog(data, 2);
}

function genLog(data, v){
	if(this.verbosity >= v){
		this.lFunc(logFmt(data,v));
	}
}
module.exports = {
	ForestCutter: MultiLogger,
	TreeCutter: Logger
};