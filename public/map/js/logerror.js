// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (LoggerService == null) var LoggerService = {};
LoggerService._path = '/dwr';
LoggerService.logError = function(p0, p1, callback) {
 console.log(LoggerService._path, 'LoggerService', 'logError', p0, p1, callback);
}
