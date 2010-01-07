// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (MapEditorService == null) var MapEditorService = {};
MapEditorService._path = '/dwr';
//p0=>1
//p1=>xml
//p2=>
//p3
//p4
MapEditorService.saveMap = function(p0, p1, p2, p3, p4, p5, callback) {
 console.log("p0:"+p0, "p1: "+p1, "p2: "+p2, "p3: "+ p3, "p4: "+p4, "p5: "+p5, "p6: "+callback);
}
