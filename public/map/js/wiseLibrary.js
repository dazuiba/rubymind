var MooTools={version:"1.11"};
function $defined(obj){return(obj!=undefined)
}function $type(obj){if(!$defined(obj)){return false
}if(obj.htmlElement){return"element"
}var type=typeof obj;
if(type=="object"&&obj.nodeName){switch(obj.nodeType){case 1:return"element";
case 3:return(/\S/).test(obj.nodeValue)?"textnode":"whitespace"
}}if(type=="object"||type=="function"){switch(obj.constructor){case Array:return"array";
case RegExp:return"regexp";
case Class:return"class"
}if(typeof obj.length=="number"){if(obj.item){return"collection"
}if(obj.callee){return"arguments"
}}}return type
}function $merge(){var mix={};
for(var i=0;
i<arguments.length;
i++){for(var property in arguments[i]){var ap=arguments[i][property];
var mp=mix[property];
if(mp&&$type(ap)=="object"&&$type(mp)=="object"){mix[property]=$merge(mp,ap)
}else{mix[property]=ap
}}}return mix
}var $extend=function(){var args=arguments;
if(!args[1]){args=[this,args[0]]
}for(var property in args[1]){args[0][property]=args[1][property]
}return args[0]
};
var $native=function(){for(var i=0,l=arguments.length;
i<l;
i++){arguments[i].extend=function(props){for(var prop in props){if(!this.prototype[prop]){this.prototype[prop]=props[prop]
}if(!this[prop]){this[prop]=$native.generic(prop)
}}}
}};
$native.generic=function(prop){return function(bind){return this.prototype[prop].apply(bind,Array.prototype.slice.call(arguments,1))
}
};
$native(Function,Array,String,Number);
function $chk(obj){return !!(obj||obj===0)
}function $pick(obj,picked){return $defined(obj)?obj:picked
}function $random(min,max){return Math.floor(Math.random()*(max-min+1)+min)
}function $time(){return new Date().getTime()
}function $clear(timer){clearTimeout(timer);
clearInterval(timer);
return null
}var Abstract=function(obj){obj=obj||{};
obj.extend=$extend;
return obj
};
var Window=new Abstract(window);
var Document=new Abstract(document);
document.head=document.getElementsByTagName("head")[0];
window.xpath=!!(document.evaluate);
if(window.ActiveXObject){window.ie=window[window.XMLHttpRequest?"ie7":"ie6"]=true
}else{if(document.childNodes&&!document.all&&!navigator.taintEnabled){window.webkit=window[window.xpath?"webkit420":"webkit419"]=true
}else{if(document.getBoxObjectFor!=null){window.gecko=true
}}}window.khtml=window.webkit;
Object.extend=$extend;
if(typeof HTMLElement=="undefined"){var HTMLElement=function(){};
if(window.webkit){document.createElement("iframe")
}HTMLElement.prototype=(window.webkit)?window["[[DOMElement.prototype]]"]:{}
}HTMLElement.prototype.htmlElement=function(){};
if(window.ie6){try{document.execCommand("BackgroundImageCache",false,true)
}catch(e){}}var Class=function(properties){var klass=function(){return(arguments[0]!==null&&this.initialize&&$type(this.initialize)=="function")?this.initialize.apply(this,arguments):this
};
$extend(klass,this);
klass.prototype=properties;
klass.constructor=Class;
return klass
};
Class.empty=function(){};
Class.prototype={extend:function(properties){var proto=new this(null);
for(var property in properties){var pp=proto[property];
proto[property]=Class.Merge(pp,properties[property])
}return new Class(proto)
},implement:function(){for(var i=0,l=arguments.length;
i<l;
i++){$extend(this.prototype,arguments[i])
}}};
Class.Merge=function(previous,current){if(previous&&previous!=current){var type=$type(current);
if(type!=$type(previous)){return current
}switch(type){case"function":var merged=function(){this.parent=arguments.callee.parent;
return current.apply(this,arguments)
};
merged.parent=previous;
return merged;
case"object":return $merge(previous,current)
}}return current
};
var Chain=new Class({chain:function(fn){this.chains=this.chains||[];
this.chains.push(fn);
return this
},callChain:function(){if(this.chains&&this.chains.length){this.chains.shift().delay(10,this)
}},clearChain:function(){this.chains=[]
}});
var Events=new Class({addEvent:function(type,fn){if(fn!=Class.empty){this.$events=this.$events||{};
this.$events[type]=this.$events[type]||[];
this.$events[type].include(fn)
}return this
},fireEvent:function(type,args,delay){if(this.$events&&this.$events[type]){this.$events[type].each(function(fn){fn.create({bind:this,delay:delay,"arguments":args})()
},this)
}return this
},removeEvent:function(type,fn){if(this.$events&&this.$events[type]){this.$events[type].remove(fn)
}return this
}});
var Options=new Class({setOptions:function(){this.options=$merge.apply(null,[this.options].extend(arguments));
if(this.addEvent){for(var option in this.options){if($type(this.options[option]=="function")&&(/^on[A-Z]/).test(option)){this.addEvent(option,this.options[option])
}}}return this
}});
Array.extend({forEach:function(fn,bind){for(var i=0,j=this.length;
i<j;
i++){fn.call(bind,this[i],i,this)
}},filter:function(fn,bind){var results=[];
for(var i=0,j=this.length;
i<j;
i++){if(fn.call(bind,this[i],i,this)){results.push(this[i])
}}return results
},map:function(fn,bind){var results=[];
for(var i=0,j=this.length;
i<j;
i++){results[i]=fn.call(bind,this[i],i,this)
}return results
},every:function(fn,bind){for(var i=0,j=this.length;
i<j;
i++){if(!fn.call(bind,this[i],i,this)){return false
}}return true
},some:function(fn,bind){for(var i=0,j=this.length;
i<j;
i++){if(fn.call(bind,this[i],i,this)){return true
}}return false
},indexOf:function(item,from){var len=this.length;
for(var i=(from<0)?Math.max(0,len+from):from||0;
i<len;
i++){if(this[i]===item){return i
}}return -1
},copy:function(start,length){start=start||0;
if(start<0){start=this.length+start
}length=length||(this.length-start);
var newArray=[];
for(var i=0;
i<length;
i++){newArray[i]=this[start++]
}return newArray
},remove:function(item){var i=0;
var len=this.length;
while(i<len){if(this[i]===item){this.splice(i,1);
len--
}else{i++
}}return this
},contains:function(item,from){return this.indexOf(item,from)!=-1
},associate:function(keys){var obj={},length=Math.min(this.length,keys.length);
for(var i=0;
i<length;
i++){obj[keys[i]]=this[i]
}return obj
},extend:function(array){for(var i=0,j=array.length;
i<j;
i++){this.push(array[i])
}return this
},merge:function(array){for(var i=0,l=array.length;
i<l;
i++){this.include(array[i])
}return this
},include:function(item){if(!this.contains(item)){this.push(item)
}return this
},getRandom:function(){return this[$random(0,this.length-1)]||null
},getLast:function(){return this[this.length-1]||null
}});
Array.prototype.each=Array.prototype.forEach;
Array.each=Array.forEach;
function $A(array){return Array.copy(array)
}function $each(iterable,fn,bind){if(iterable&&typeof iterable.length=="number"&&$type(iterable)!="object"){Array.forEach(iterable,fn,bind)
}else{for(var name in iterable){fn.call(bind||iterable,iterable[name],name)
}}}Array.prototype.test=Array.prototype.contains;
String.extend({test:function(regex,params){return(($type(regex)=="string")?new RegExp(regex,params):regex).test(this)
},toInt:function(){return parseInt(this,10)
},toFloat:function(){return parseFloat(this)
},camelCase:function(){return this.replace(/-\D/g,function(match){return match.charAt(1).toUpperCase()
})
},hyphenate:function(){return this.replace(/\w[A-Z]/g,function(match){return(match.charAt(0)+"-"+match.charAt(1).toLowerCase())
})
},capitalize:function(){return this.replace(/\b[a-z]/g,function(match){return match.toUpperCase()
})
},trim:function(){return this.replace(/^\s+|\s+$/g,"")
},clean:function(){return this.replace(/\s{2,}/g," ").trim()
},rgbToHex:function(array){var rgb=this.match(/\d{1,3}/g);
return(rgb)?rgb.rgbToHex(array):false
},hexToRgb:function(array){var hex=this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
return(hex)?hex.slice(1).hexToRgb(array):false
},contains:function(string,s){return(s)?(s+this+s).indexOf(s+string+s)>-1:this.indexOf(string)>-1
},escapeRegExp:function(){return this.replace(/([.*+?^${}()|[\]\/\\])/g,"\\$1")
}});
Array.extend({rgbToHex:function(array){if(this.length<3){return false
}if(this.length==4&&this[3]==0&&!array){return"transparent"
}var hex=[];
for(var i=0;
i<3;
i++){var bit=(this[i]-0).toString(16);
hex.push((bit.length==1)?"0"+bit:bit)
}return array?hex:"#"+hex.join("")
},hexToRgb:function(array){if(this.length!=3){return false
}var rgb=[];
for(var i=0;
i<3;
i++){rgb.push(parseInt((this[i].length==1)?this[i]+this[i]:this[i],16))
}return array?rgb:"rgb("+rgb.join(",")+")"
}});
Function.extend({create:function(options){var fn=this;
options=$merge({bind:fn,event:false,"arguments":null,delay:false,periodical:false,attempt:false},options);
if($chk(options.arguments)&&$type(options.arguments)!="array"){options.arguments=[options.arguments]
}return function(event){var args;
if(options.event){event=event||window.event;
args=[(options.event===true)?event:new options.event(event)];
if(options.arguments){args.extend(options.arguments)
}}else{args=options.arguments||arguments
}var returns=function(){return fn.apply($pick(options.bind,fn),args)
};
if(options.delay){return setTimeout(returns,options.delay)
}if(options.periodical){return setInterval(returns,options.periodical)
}if(options.attempt){try{return returns()
}catch(err){return false
}}return returns()
}
},pass:function(args,bind){return this.create({"arguments":args,bind:bind})
},attempt:function(args,bind){return this.create({"arguments":args,bind:bind,attempt:true})()
},bind:function(bind,args){return this.create({bind:bind,"arguments":args})
},bindAsEventListener:function(bind,args){return this.create({bind:bind,event:true,"arguments":args})
},delay:function(delay,bind,args){return this.create({delay:delay,bind:bind,"arguments":args})()
},periodical:function(interval,bind,args){return this.create({periodical:interval,bind:bind,"arguments":args})()
}});
Number.extend({toInt:function(){return parseInt(this)
},toFloat:function(){return parseFloat(this)
},limit:function(min,max){return Math.min(max,Math.max(min,this))
},round:function(precision){precision=Math.pow(10,precision||0);
return Math.round(this*precision)/precision
},times:function(fn){for(var i=0;
i<this;
i++){fn(i)
}}});
var Element=new Class({initialize:function(el,props){if($type(el)=="string"){if(window.ie&&props&&(props.name||props.type)){var name=(props.name)?' name="'+props.name+'"':"";
var type=(props.type)?' type="'+props.type+'"':"";
delete props.name;
delete props.type;
el="<"+el+name+type+">"
}el=document.createElement(el)
}el=$(el);
return(!props||!el)?el:el.set(props)
}});
var Elements=new Class({initialize:function(elements){return(elements)?$extend(elements,this):this
}});
Elements.extend=function(props){for(var prop in props){this.prototype[prop]=props[prop];
this[prop]=$native.generic(prop)
}};
function $(el){if(!el){return null
}if(el.htmlElement){return Garbage.collect(el)
}if([window,document].contains(el)){return el
}var type=$type(el);
if(type=="string"){el=document.getElementById(el);
type=(el)?"element":false
}if(type!="element"){return null
}if(el.htmlElement){return Garbage.collect(el)
}if(["object","embed"].contains(el.tagName.toLowerCase())){return el
}$extend(el,Element.prototype);
el.htmlElement=function(){};
return Garbage.collect(el)
}document.getElementsBySelector=document.getElementsByTagName;
function $$(){var elements=[];
for(var i=0,j=arguments.length;
i<j;
i++){var selector=arguments[i];
switch($type(selector)){case"element":elements.push(selector);
case"boolean":break;
case false:break;
case"string":selector=document.getElementsBySelector(selector,true);
default:elements.extend(selector)
}}return $$.unique(elements)
}$$.unique=function(array){var elements=[];
for(var i=0,l=array.length;
i<l;
i++){if(array[i].$included){continue
}var element=$(array[i]);
if(element&&!element.$included){element.$included=true;
elements.push(element)
}}for(var n=0,d=elements.length;
n<d;
n++){elements[n].$included=null
}return new Elements(elements)
};
Elements.Multi=function(property){return function(){var args=arguments;
var items=[];
var elements=true;
for(var i=0,j=this.length,returns;
i<j;
i++){returns=this[i][property].apply(this[i],args);
if($type(returns)!="element"){elements=false
}items.push(returns)
}return(elements)?$$.unique(items):items
}
};
Element.extend=function(properties){for(var property in properties){HTMLElement.prototype[property]=properties[property];
Element.prototype[property]=properties[property];
Element[property]=$native.generic(property);
var elementsProperty=(Array.prototype[property])?property+"Elements":property;
Elements.prototype[elementsProperty]=Elements.Multi(property)
}};
Element.extend({set:function(props){for(var prop in props){var val=props[prop];
switch(prop){case"styles":this.setStyles(val);
break;
case"events":if(this.addEvents){this.addEvents(val)
}break;
case"properties":this.setProperties(val);
break;
default:this.setProperty(prop,val)
}}return this
},inject:function(el,where){el=$(el);
switch(where){case"before":el.parentNode.insertBefore(this,el);
break;
case"after":var next=el.getNext();
if(!next){el.parentNode.appendChild(this)
}else{el.parentNode.insertBefore(this,next)
}break;
case"top":var first=el.firstChild;
if(first){el.insertBefore(this,first);
break
}default:el.appendChild(this)
}return this
},injectBefore:function(el){return this.inject(el,"before")
},injectAfter:function(el){return this.inject(el,"after")
},injectInside:function(el){return this.inject(el,"bottom")
},injectTop:function(el){return this.inject(el,"top")
},adopt:function(){var elements=[];
$each(arguments,function(argument){elements=elements.concat(argument)
});
$$(elements).inject(this);
return this
},remove:function(){return this.parentNode.removeChild(this)
},clone:function(contents){var el=$(this.cloneNode(contents!==false));
if(!el.$events){return el
}el.$events={};
for(var type in this.$events){el.$events[type]={keys:$A(this.$events[type].keys),values:$A(this.$events[type].values)}
}return el.removeEvents()
},replaceWith:function(el){el=$(el);
this.parentNode.replaceChild(el,this);
return el
},appendText:function(text){this.appendChild(document.createTextNode(text));
return this
},hasClass:function(className){return this.className.contains(className," ")
},addClass:function(className){if(!this.hasClass(className)){this.className=(this.className+" "+className).clean()
}return this
},removeClass:function(className){this.className=this.className.replace(new RegExp("(^|\\s)"+className+"(?:\\s|$)"),"$1").clean();
return this
},toggleClass:function(className){return this.hasClass(className)?this.removeClass(className):this.addClass(className)
},setStyle:function(property,value){switch(property){case"opacity":return this.setOpacity(parseFloat(value));
case"float":property=(window.ie)?"styleFloat":"cssFloat"
}property=property.camelCase();
switch($type(value)){case"number":if(!["zIndex","zoom"].contains(property)){value+="px"
}break;
case"array":value="rgb("+value.join(",")+")"
}this.style[property]=value;
return this
},setStyles:function(source){switch($type(source)){case"object":Element.setMany(this,"setStyle",source);
break;
case"string":this.style.cssText=source
}return this
},setOpacity:function(opacity){if(opacity==0){if(this.style.visibility!="hidden"){this.style.visibility="hidden"
}}else{if(this.style.visibility!="visible"){this.style.visibility="visible"
}}if(!this.currentStyle||!this.currentStyle.hasLayout){this.style.zoom=1
}if(window.ie){this.style.filter=(opacity==1)?"":"alpha(opacity="+opacity*100+")"
}this.style.opacity=this.$tmp.opacity=opacity;
return this
},getStyle:function(property){property=property.camelCase();
var result=this.style[property];
if(!$chk(result)){if(property=="opacity"){return this.$tmp.opacity
}result=[];
for(var style in Element.Styles){if(property==style){Element.Styles[style].each(function(s){var style=this.getStyle(s);
result.push(parseInt(style)?style:"0px")
},this);
if(property=="border"){var every=result.every(function(bit){return(bit==result[0])
});
return(every)?result[0]:false
}return result.join(" ")
}}if(property.contains("border")){if(Element.Styles.border.contains(property)){return["Width","Style","Color"].map(function(p){return this.getStyle(property+p)
},this).join(" ")
}else{if(Element.borderShort.contains(property)){return["Top","Right","Bottom","Left"].map(function(p){return this.getStyle("border"+p+property.replace("border",""))
},this).join(" ")
}}}if(document.defaultView){result=document.defaultView.getComputedStyle(this,null).getPropertyValue(property.hyphenate())
}else{if(this.currentStyle){result=this.currentStyle[property]
}}}if(window.ie){result=Element.fixStyle(property,result,this)
}if(result&&property.test(/color/i)&&result.contains("rgb")){return result.split("rgb").splice(1,4).map(function(color){return color.rgbToHex()
}).join(" ")
}return result
},getStyles:function(){return Element.getMany(this,"getStyle",arguments)
},walk:function(brother,start){brother+="Sibling";
var el=(start)?this[start]:this[brother];
while(el&&$type(el)!="element"){el=el[brother]
}return $(el)
},getPrevious:function(){return this.walk("previous")
},getNext:function(){return this.walk("next")
},getFirst:function(){return this.walk("next","firstChild")
},getLast:function(){return this.walk("previous","lastChild")
},getParent:function(){return $(this.parentNode)
},getChildren:function(){return $$(this.childNodes)
},hasChild:function(el){return !!$A(this.getElementsByTagName("*")).contains(el)
},getProperty:function(property){var index=Element.Properties[property];
if(index){return this[index]
}var flag=Element.PropertiesIFlag[property]||0;
if(!window.ie||flag){return this.getAttribute(property,flag)
}var node=this.attributes[property];
return(node)?node.nodeValue:null
},removeProperty:function(property){var index=Element.Properties[property];
if(index){this[index]=""
}else{this.removeAttribute(property)
}return this
},getProperties:function(){return Element.getMany(this,"getProperty",arguments)
},setProperty:function(property,value){var index=Element.Properties[property];
if(index){this[index]=value
}else{this.setAttribute(property,value)
}return this
},setProperties:function(source){return Element.setMany(this,"setProperty",source)
},setHTML:function(){this.innerHTML=$A(arguments).join("");
return this
},setText:function(text){var tag=this.getTag();
if(["style","script"].contains(tag)){if(window.ie){if(tag=="style"){this.styleSheet.cssText=text
}else{if(tag=="script"){this.setProperty("text",text)
}}return this
}else{this.removeChild(this.firstChild);
return this.appendText(text)
}}this[$defined(this.innerText)?"innerText":"textContent"]=text;
return this
},getText:function(){var tag=this.getTag();
if(["style","script"].contains(tag)){if(window.ie){if(tag=="style"){return this.styleSheet.cssText
}else{if(tag=="script"){return this.getProperty("text")
}}}else{return this.innerHTML
}}return($pick(this.innerText,this.textContent))
},getTag:function(){return this.tagName.toLowerCase()
},empty:function(){Garbage.trash(this.getElementsByTagName("*"));
return this.setHTML("")
}});
Element.fixStyle=function(property,result,element){if($chk(parseInt(result))){return result
}if(["height","width"].contains(property)){var values=(property=="width")?["left","right"]:["top","bottom"];
var size=0;
values.each(function(value){size+=element.getStyle("border-"+value+"-width").toInt()+element.getStyle("padding-"+value).toInt()
});
return element["offset"+property.capitalize()]-size+"px"
}else{if(property.test(/border(.+)Width|margin|padding/)){return"0px"
}}return result
};
Element.Styles={border:[],padding:[],margin:[]};
["Top","Right","Bottom","Left"].each(function(direction){for(var style in Element.Styles){Element.Styles[style].push(style+direction)
}});
Element.borderShort=["borderWidth","borderStyle","borderColor"];
Element.getMany=function(el,method,keys){var result={};
$each(keys,function(key){result[key]=el[method](key)
});
return result
};
Element.setMany=function(el,method,pairs){for(var key in pairs){el[method](key,pairs[key])
}return el
};
Element.Properties=new Abstract({"class":"className","for":"htmlFor",colspan:"colSpan",rowspan:"rowSpan",accesskey:"accessKey",tabindex:"tabIndex",maxlength:"maxLength",readonly:"readOnly",frameborder:"frameBorder",value:"value",disabled:"disabled",checked:"checked",multiple:"multiple",selected:"selected"});
Element.PropertiesIFlag={href:2,src:2};
Element.Methods={Listeners:{addListener:function(type,fn){if(this.addEventListener){this.addEventListener(type,fn,false)
}else{this.attachEvent("on"+type,fn)
}return this
},removeListener:function(type,fn){if(this.removeEventListener){this.removeEventListener(type,fn,false)
}else{this.detachEvent("on"+type,fn)
}return this
}}};
window.extend(Element.Methods.Listeners);
document.extend(Element.Methods.Listeners);
Element.extend(Element.Methods.Listeners);
var Garbage={elements:[],collect:function(el){if(!el.$tmp){Garbage.elements.push(el);
el.$tmp={opacity:1}
}return el
},trash:function(elements){for(var i=0,j=elements.length,el;
i<j;
i++){if(!(el=elements[i])||!el.$tmp){continue
}if(el.$events){el.fireEvent("trash").removeEvents()
}for(var p in el.$tmp){el.$tmp[p]=null
}for(var d in Element.prototype){el[d]=null
}Garbage.elements[Garbage.elements.indexOf(el)]=null;
el.htmlElement=el.$tmp=el=null
}Garbage.elements.remove(null)
},empty:function(){Garbage.collect(window);
Garbage.collect(document);
Garbage.trash(Garbage.elements)
}};
window.addListener("beforeunload",function(){window.addListener("unload",Garbage.empty);
if(window.ie){window.addListener("unload",CollectGarbage)
}});
var Event=new Class({initialize:function(event){if(event&&event.$extended){return event
}this.$extended=true;
event=event||window.event;
this.event=event;
this.type=event.type;
this.target=event.target||event.srcElement;
if(this.target.nodeType==3){this.target=this.target.parentNode
}this.shift=event.shiftKey;
this.control=event.ctrlKey;
this.alt=event.altKey;
this.meta=event.metaKey;
if(["DOMMouseScroll","mousewheel"].contains(this.type)){this.wheel=(event.wheelDelta)?event.wheelDelta/120:-(event.detail||0)/3
}else{if(this.type.contains("key")){this.code=event.which||event.keyCode;
for(var name in Event.keys){if(Event.keys[name]==this.code){this.key=name;
break
}}if(this.type=="keydown"){var fKey=this.code-111;
if(fKey>0&&fKey<13){this.key="f"+fKey
}}this.key=this.key||String.fromCharCode(this.code).toLowerCase()
}else{if(this.type.test(/(click|mouse|menu)/)){this.page={x:event.pageX||event.clientX+document.documentElement.scrollLeft,y:event.pageY||event.clientY+document.documentElement.scrollTop};
this.client={x:event.pageX?event.pageX-window.pageXOffset:event.clientX,y:event.pageY?event.pageY-window.pageYOffset:event.clientY};
this.rightClick=(event.which==3)||(event.button==2);
switch(this.type){case"mouseover":this.relatedTarget=event.relatedTarget||event.fromElement;
break;
case"mouseout":this.relatedTarget=event.relatedTarget||event.toElement
}this.fixRelatedTarget()
}}}return this
},stop:function(){return this.stopPropagation().preventDefault()
},stopPropagation:function(){if(this.event.stopPropagation){this.event.stopPropagation()
}else{this.event.cancelBubble=true
}return this
},preventDefault:function(){if(this.event.preventDefault){this.event.preventDefault()
}else{this.event.returnValue=false
}return this
}});
Event.fix={relatedTarget:function(){if(this.relatedTarget&&this.relatedTarget.nodeType==3){this.relatedTarget=this.relatedTarget.parentNode
}},relatedTargetGecko:function(){try{Event.fix.relatedTarget.call(this)
}catch(e){this.relatedTarget=this.target
}}};
Event.prototype.fixRelatedTarget=(window.gecko)?Event.fix.relatedTargetGecko:Event.fix.relatedTarget;
Event.keys=new Abstract({enter:13,up:38,down:40,left:37,right:39,esc:27,space:32,backspace:8,tab:9,"delete":46});
Element.Methods.Events={addEvent:function(type,fn){this.$events=this.$events||{};
this.$events[type]=this.$events[type]||{keys:[],values:[]};
if(this.$events[type].keys.contains(fn)){return this
}this.$events[type].keys.push(fn);
var realType=type;
var custom=Element.Events[type];
if(custom){if(custom.add){custom.add.call(this,fn)
}if(custom.map){fn=custom.map
}if(custom.type){realType=custom.type
}}if(!this.addEventListener){fn=fn.create({bind:this,event:true})
}this.$events[type].values.push(fn);
return(Element.NativeEvents.contains(realType))?this.addListener(realType,fn):this
},removeEvent:function(type,fn){if(!this.$events||!this.$events[type]){return this
}var pos=this.$events[type].keys.indexOf(fn);
if(pos==-1){return this
}var key=this.$events[type].keys.splice(pos,1)[0];
var value=this.$events[type].values.splice(pos,1)[0];
var custom=Element.Events[type];
if(custom){if(custom.remove){custom.remove.call(this,fn)
}if(custom.type){type=custom.type
}}return(Element.NativeEvents.contains(type))?this.removeListener(type,value):this
},addEvents:function(source){return Element.setMany(this,"addEvent",source)
},removeEvents:function(type){if(!this.$events){return this
}if(!type){for(var evType in this.$events){this.removeEvents(evType)
}this.$events=null
}else{if(this.$events[type]){this.$events[type].keys.each(function(fn){this.removeEvent(type,fn)
},this);
this.$events[type]=null
}}return this
},fireEvent:function(type,args,delay){if(this.$events&&this.$events[type]){this.$events[type].keys.each(function(fn){fn.create({bind:this,delay:delay,"arguments":args})()
},this)
}return this
},cloneEvents:function(from,type){if(!from.$events){return this
}if(!type){for(var evType in from.$events){this.cloneEvents(from,evType)
}}else{if(from.$events[type]){from.$events[type].keys.each(function(fn){this.addEvent(type,fn)
},this)
}}return this
}};
window.extend(Element.Methods.Events);
document.extend(Element.Methods.Events);
Element.extend(Element.Methods.Events);
Element.Events=new Abstract({mouseenter:{type:"mouseover",map:function(event){event=new Event(event);
if(event.relatedTarget!=this&&!this.hasChild(event.relatedTarget)){this.fireEvent("mouseenter",event)
}}},mouseleave:{type:"mouseout",map:function(event){event=new Event(event);
if(event.relatedTarget!=this&&!this.hasChild(event.relatedTarget)){this.fireEvent("mouseleave",event)
}}},mousewheel:{type:(window.gecko)?"DOMMouseScroll":"mousewheel"}});
Element.NativeEvents=["click","dblclick","mouseup","mousedown","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","keydown","keypress","keyup","load","unload","beforeunload","resize","move","focus","blur","change","submit","reset","select","error","abort","contextmenu","scroll"];
Function.extend({bindWithEvent:function(bind,args){return this.create({bind:bind,"arguments":args,event:Event})
}});
Elements.extend({filterByTag:function(tag){return new Elements(this.filter(function(el){return(Element.getTag(el)==tag)
}))
},filterByClass:function(className,nocash){var elements=this.filter(function(el){return(el.className&&el.className.contains(className," "))
});
return(nocash)?elements:new Elements(elements)
},filterById:function(id,nocash){var elements=this.filter(function(el){return(el.id==id)
});
return(nocash)?elements:new Elements(elements)
},filterByAttribute:function(name,operator,value,nocash){var elements=this.filter(function(el){var current=Element.getProperty(el,name);
if(!current){return false
}if(!operator){return true
}switch(operator){case"=":return(current==value);
case"*=":return(current.contains(value));
case"^=":return(current.substr(0,value.length)==value);
case"$=":return(current.substr(current.length-value.length)==value);
case"!=":return(current!=value);
case"~=":return current.contains(value," ")
}return false
});
return(nocash)?elements:new Elements(elements)
}});
function $E(selector,filter){return($(filter)||document).getElement(selector)
}function $ES(selector,filter){return($(filter)||document).getElementsBySelector(selector)
}$$.shared={regexp:/^(\w*|\*)(?:#([\w-]+)|\.([\w-]+))?(?:\[(\w+)(?:([!*^$]?=)["']?([^"'\]]*)["']?)?])?$/,xpath:{getParam:function(items,context,param,i){var temp=[context.namespaceURI?"xhtml:":"",param[1]];
if(param[2]){temp.push('[@id="',param[2],'"]')
}if(param[3]){temp.push('[contains(concat(" ", @class, " "), " ',param[3],' ")]')
}if(param[4]){if(param[5]&&param[6]){switch(param[5]){case"*=":temp.push("[contains(@",param[4],', "',param[6],'")]');
break;
case"^=":temp.push("[starts-with(@",param[4],', "',param[6],'")]');
break;
case"$=":temp.push("[substring(@",param[4],", string-length(@",param[4],") - ",param[6].length,' + 1) = "',param[6],'"]');
break;
case"=":temp.push("[@",param[4],'="',param[6],'"]');
break;
case"!=":temp.push("[@",param[4],'!="',param[6],'"]')
}}else{temp.push("[@",param[4],"]")
}}items.push(temp.join(""));
return items
},getItems:function(items,context,nocash){var elements=[];
var xpath=document.evaluate(".//"+items.join("//"),context,$$.shared.resolver,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
for(var i=0,j=xpath.snapshotLength;
i<j;
i++){elements.push(xpath.snapshotItem(i))
}return(nocash)?elements:new Elements(elements.map($))
}},normal:{getParam:function(items,context,param,i){if(i==0){if(param[2]){var el=context.getElementById(param[2]);
if(!el||((param[1]!="*")&&(Element.getTag(el)!=param[1]))){return false
}items=[el]
}else{items=$A(context.getElementsByTagName(param[1]))
}}else{items=$$.shared.getElementsByTagName(items,param[1]);
if(param[2]){items=Elements.filterById(items,param[2],true)
}}if(param[3]){items=Elements.filterByClass(items,param[3],true)
}if(param[4]){items=Elements.filterByAttribute(items,param[4],param[5],param[6],true)
}return items
},getItems:function(items,context,nocash){return(nocash)?items:$$.unique(items)
}},resolver:function(prefix){return(prefix=="xhtml")?"http://www.w3.org/1999/xhtml":false
},getElementsByTagName:function(context,tagName){var found=[];
for(var i=0,j=context.length;
i<j;
i++){found.extend(context[i].getElementsByTagName(tagName))
}return found
}};
$$.shared.method=(window.xpath)?"xpath":"normal";
Element.Methods.Dom={getElements:function(selector,nocash){var items=[];
selector=selector.trim().split(" ");
for(var i=0,j=selector.length;
i<j;
i++){var sel=selector[i];
var param=sel.match($$.shared.regexp);
if(!param){break
}param[1]=param[1]||"*";
var temp=$$.shared[$$.shared.method].getParam(items,this,param,i);
if(!temp){break
}items=temp
}return $$.shared[$$.shared.method].getItems(items,this,nocash)
},getElement:function(selector){return $(this.getElements(selector,true)[0]||false)
},getElementsBySelector:function(selector,nocash){var elements=[];
selector=selector.split(",");
for(var i=0,j=selector.length;
i<j;
i++){elements=elements.concat(this.getElements(selector[i],true))
}return(nocash)?elements:$$.unique(elements)
}};
Element.extend({getElementById:function(id){var el=document.getElementById(id);
if(!el){return false
}for(var parent=el.parentNode;
parent!=this;
parent=parent.parentNode){if(!parent){return false
}}return el
},getElementsByClassName:function(className){return this.getElements("."+className)
}});
document.extend(Element.Methods.Dom);
Element.extend(Element.Methods.Dom);
Element.extend({getValue:function(){switch(this.getTag()){case"select":var values=[];
$each(this.options,function(option){if(option.selected){values.push($pick(option.value,option.text))
}});
return(this.multiple)?values:values[0];
case"input":if(!(this.checked&&["checkbox","radio"].contains(this.type))&&!["hidden","text","password"].contains(this.type)){break
}case"textarea":return this.value
}return false
},getFormElements:function(){return $$(this.getElementsByTagName("input"),this.getElementsByTagName("select"),this.getElementsByTagName("textarea"))
},toQueryString:function(){var queryString=[];
this.getFormElements().each(function(el){var name=el.name;
var value=el.getValue();
if(value===false||!name||el.disabled){return 
}var qs=function(val){queryString.push(name+"="+encodeURIComponent(val))
};
if($type(value)=="array"){value.each(qs)
}else{qs(value)
}});
return queryString.join("&")
}});
Element.extend({scrollTo:function(x,y){this.scrollLeft=x;
this.scrollTop=y
},getSize:function(){return{scroll:{x:this.scrollLeft,y:this.scrollTop},size:{x:this.offsetWidth,y:this.offsetHeight},scrollSize:{x:this.scrollWidth,y:this.scrollHeight}}
},getPosition:function(overflown){overflown=overflown||[];
var el=this,left=0,top=0;
do{left+=el.offsetLeft||0;
top+=el.offsetTop||0;
el=el.offsetParent
}while(el);
overflown.each(function(element){left-=element.scrollLeft||0;
top-=element.scrollTop||0
});
return{x:left,y:top}
},getTop:function(overflown){return this.getPosition(overflown).y
},getLeft:function(overflown){return this.getPosition(overflown).x
},getCoordinates:function(overflown){var position=this.getPosition(overflown);
var obj={width:this.offsetWidth,height:this.offsetHeight,left:position.x,top:position.y};
obj.right=obj.left+obj.width;
obj.bottom=obj.top+obj.height;
return obj
}});
Element.Events.domready={add:function(fn){if(window.loaded){fn.call(this);
return 
}var domReady=function(){if(window.loaded){return 
}window.loaded=true;
window.timer=$clear(window.timer);
this.fireEvent("domready")
}.bind(this);
if(document.readyState&&window.webkit){window.timer=function(){if(["loaded","complete"].contains(document.readyState)){domReady()
}}.periodical(50)
}else{if(document.readyState&&window.ie){if(!$("ie_ready")){var src=(window.location.protocol=="https:")?"://0":"javascript:void(0)";
document.write('<script id="ie_ready" defer src="'+src+'"><\/script>');
$("ie_ready").onreadystatechange=function(){if(this.readyState=="complete"){domReady()
}}
}}else{window.addListener("load",domReady);
document.addListener("DOMContentLoaded",domReady)
}}}};
window.onDomReady=function(fn){return this.addEvent("domready",fn)
};
window.extend({getWidth:function(){if(this.webkit419){return this.innerWidth
}if(this.opera){return document.body.clientWidth
}return document.documentElement.clientWidth
},getHeight:function(){if(this.webkit419){return this.innerHeight
}if(this.opera){return document.body.clientHeight
}return document.documentElement.clientHeight
},getScrollWidth:function(){if(this.ie){return Math.max(document.documentElement.offsetWidth,document.documentElement.scrollWidth)
}if(this.webkit){return document.body.scrollWidth
}return document.documentElement.scrollWidth
},getScrollHeight:function(){if(this.ie){return Math.max(document.documentElement.offsetHeight,document.documentElement.scrollHeight)
}if(this.webkit){return document.body.scrollHeight
}return document.documentElement.scrollHeight
},getScrollLeft:function(){return this.pageXOffset||document.documentElement.scrollLeft
},getScrollTop:function(){return this.pageYOffset||document.documentElement.scrollTop
},getSize:function(){return{size:{x:this.getWidth(),y:this.getHeight()},scrollSize:{x:this.getScrollWidth(),y:this.getScrollHeight()},scroll:{x:this.getScrollLeft(),y:this.getScrollTop()}}
},getPosition:function(){return{x:0,y:0}
}});
var Fx={};
Fx.Base=new Class({options:{onStart:Class.empty,onComplete:Class.empty,onCancel:Class.empty,transition:function(p){return -(Math.cos(Math.PI*p)-1)/2
},duration:500,unit:"px",wait:true,fps:50},initialize:function(options){this.element=this.element||null;
this.setOptions(options);
if(this.options.initialize){this.options.initialize.call(this)
}},step:function(){var time=$time();
if(time<this.time+this.options.duration){this.delta=this.options.transition((time-this.time)/this.options.duration);
this.setNow();
this.increase()
}else{this.stop(true);
this.set(this.to);
this.fireEvent("onComplete",this.element,10);
this.callChain()
}},set:function(to){this.now=to;
this.increase();
return this
},setNow:function(){this.now=this.compute(this.from,this.to)
},compute:function(from,to){return(to-from)*this.delta+from
},start:function(from,to){if(!this.options.wait){this.stop()
}else{if(this.timer){return this
}}this.from=from;
this.to=to;
this.change=this.to-this.from;
this.time=$time();
this.timer=this.step.periodical(Math.round(1000/this.options.fps),this);
this.fireEvent("onStart",this.element);
return this
},stop:function(end){if(!this.timer){return this
}this.timer=$clear(this.timer);
if(!end){this.fireEvent("onCancel",this.element)
}return this
},custom:function(from,to){return this.start(from,to)
},clearTimer:function(end){return this.stop(end)
}});
Fx.Base.implement(new Chain,new Events,new Options);
Fx.CSS={select:function(property,to){if(property.test(/color/i)){return this.Color
}var type=$type(to);
if((type=="array")||(type=="string"&&to.contains(" "))){return this.Multi
}return this.Single
},parse:function(el,property,fromTo){if(!fromTo.push){fromTo=[fromTo]
}var from=fromTo[0],to=fromTo[1];
if(!$chk(to)){to=from;
from=el.getStyle(property)
}var css=this.select(property,to);
return{from:css.parse(from),to:css.parse(to),css:css}
}};
Fx.CSS.Single={parse:function(value){return parseFloat(value)
},getNow:function(from,to,fx){return fx.compute(from,to)
},getValue:function(value,unit,property){if(unit=="px"&&property!="opacity"){value=Math.round(value)
}return value+unit
}};
Fx.CSS.Multi={parse:function(value){return value.push?value:value.split(" ").map(function(v){return parseFloat(v)
})
},getNow:function(from,to,fx){var now=[];
for(var i=0;
i<from.length;
i++){now[i]=fx.compute(from[i],to[i])
}return now
},getValue:function(value,unit,property){if(unit=="px"&&property!="opacity"){value=value.map(Math.round)
}return value.join(unit+" ")+unit
}};
Fx.CSS.Color={parse:function(value){return value.push?value:value.hexToRgb(true)
},getNow:function(from,to,fx){var now=[];
for(var i=0;
i<from.length;
i++){now[i]=Math.round(fx.compute(from[i],to[i]))
}return now
},getValue:function(value){return"rgb("+value.join(",")+")"
}};
Fx.Style=Fx.Base.extend({initialize:function(el,property,options){this.element=$(el);
this.property=property;
this.parent(options)
},hide:function(){return this.set(0)
},setNow:function(){this.now=this.css.getNow(this.from,this.to,this)
},set:function(to){this.css=Fx.CSS.select(this.property,to);
return this.parent(this.css.parse(to))
},start:function(from,to){if(this.timer&&this.options.wait){return this
}var parsed=Fx.CSS.parse(this.element,this.property,[from,to]);
this.css=parsed.css;
return this.parent(parsed.from,parsed.to)
},increase:function(){this.element.setStyle(this.property,this.css.getValue(this.now,this.options.unit,this.property))
}});
Element.extend({effect:function(property,options){return new Fx.Style(this,property,options)
}});
Fx.Styles=Fx.Base.extend({initialize:function(el,options){this.element=$(el);
this.parent(options)
},setNow:function(){for(var p in this.from){this.now[p]=this.css[p].getNow(this.from[p],this.to[p],this)
}},set:function(to){var parsed={};
this.css={};
for(var p in to){this.css[p]=Fx.CSS.select(p,to[p]);
parsed[p]=this.css[p].parse(to[p])
}return this.parent(parsed)
},start:function(obj){if(this.timer&&this.options.wait){return this
}this.now={};
this.css={};
var from={},to={};
for(var p in obj){var parsed=Fx.CSS.parse(this.element,p,obj[p]);
from[p]=parsed.from;
to[p]=parsed.to;
this.css[p]=parsed.css
}return this.parent(from,to)
},increase:function(){for(var p in this.now){this.element.setStyle(p,this.css[p].getValue(this.now[p],this.options.unit,p))
}}});
Element.extend({effects:function(options){return new Fx.Styles(this,options)
}});
Fx.Elements=Fx.Base.extend({initialize:function(elements,options){this.elements=$$(elements);
this.parent(options)
},setNow:function(){for(var i in this.from){var iFrom=this.from[i],iTo=this.to[i],iCss=this.css[i],iNow=this.now[i]={};
for(var p in iFrom){iNow[p]=iCss[p].getNow(iFrom[p],iTo[p],this)
}}},set:function(to){var parsed={};
this.css={};
for(var i in to){var iTo=to[i],iCss=this.css[i]={},iParsed=parsed[i]={};
for(var p in iTo){iCss[p]=Fx.CSS.select(p,iTo[p]);
iParsed[p]=iCss[p].parse(iTo[p])
}}return this.parent(parsed)
},start:function(obj){if(this.timer&&this.options.wait){return this
}this.now={};
this.css={};
var from={},to={};
for(var i in obj){var iProps=obj[i],iFrom=from[i]={},iTo=to[i]={},iCss=this.css[i]={};
for(var p in iProps){var parsed=Fx.CSS.parse(this.elements[i],p,iProps[p]);
iFrom[p]=parsed.from;
iTo[p]=parsed.to;
iCss[p]=parsed.css
}}return this.parent(from,to)
},increase:function(){for(var i in this.now){var iNow=this.now[i],iCss=this.css[i];
for(var p in iNow){this.elements[i].setStyle(p,iCss[p].getValue(iNow[p],this.options.unit,p))
}}}});
Fx.Scroll=Fx.Base.extend({options:{overflown:[],offset:{x:0,y:0},wheelStops:true},initialize:function(element,options){this.now=[];
this.element=$(element);
this.bound={stop:this.stop.bind(this,false)};
this.parent(options);
if(this.options.wheelStops){this.addEvent("onStart",function(){document.addEvent("mousewheel",this.bound.stop)
}.bind(this));
this.addEvent("onComplete",function(){document.removeEvent("mousewheel",this.bound.stop)
}.bind(this))
}},setNow:function(){for(var i=0;
i<2;
i++){this.now[i]=this.compute(this.from[i],this.to[i])
}},scrollTo:function(x,y){if(this.timer&&this.options.wait){return this
}var el=this.element.getSize();
var values={x:x,y:y};
for(var z in el.size){var max=el.scrollSize[z]-el.size[z];
if($chk(values[z])){values[z]=($type(values[z])=="number")?values[z].limit(0,max):max
}else{values[z]=el.scroll[z]
}values[z]+=this.options.offset[z]
}return this.start([el.scroll.x,el.scroll.y],[values.x,values.y])
},toTop:function(){return this.scrollTo(false,0)
},toBottom:function(){return this.scrollTo(false,"full")
},toLeft:function(){return this.scrollTo(0,false)
},toRight:function(){return this.scrollTo("full",false)
},toElement:function(el){var parent=this.element.getPosition(this.options.overflown);
var target=$(el).getPosition(this.options.overflown);
return this.scrollTo(target.x-parent.x,target.y-parent.y)
},increase:function(){this.element.scrollTo(this.now[0],this.now[1])
}});
Fx.Slide=Fx.Base.extend({options:{mode:"vertical"},initialize:function(el,options){this.element=$(el);
this.wrapper=new Element("div",{styles:$extend(this.element.getStyles("margin"),{overflow:"hidden"})}).injectAfter(this.element).adopt(this.element);
this.element.setStyle("margin",0);
this.setOptions(options);
this.now=[];
this.parent(this.options);
this.open=true;
this.addEvent("onComplete",function(){this.open=(this.now[0]===0)
});
if(window.webkit419){this.addEvent("onComplete",function(){if(this.open){this.element.remove().inject(this.wrapper)
}})
}},setNow:function(){for(var i=0;
i<2;
i++){this.now[i]=this.compute(this.from[i],this.to[i])
}},vertical:function(){this.margin="margin-top";
this.layout="height";
this.offset=this.element.offsetHeight
},horizontal:function(){this.margin="margin-left";
this.layout="width";
this.offset=this.element.offsetWidth
},slideIn:function(mode){this[mode||this.options.mode]();
return this.start([this.element.getStyle(this.margin).toInt(),this.wrapper.getStyle(this.layout).toInt()],[0,this.offset])
},slideOut:function(mode){this[mode||this.options.mode]();
return this.start([this.element.getStyle(this.margin).toInt(),this.wrapper.getStyle(this.layout).toInt()],[-this.offset,0])
},hide:function(mode){this[mode||this.options.mode]();
this.open=false;
return this.set([-this.offset,0])
},show:function(mode){this[mode||this.options.mode]();
this.open=true;
return this.set([0,this.offset])
},toggle:function(mode){if(this.wrapper.offsetHeight==0||this.wrapper.offsetWidth==0){return this.slideIn(mode)
}return this.slideOut(mode)
},increase:function(){this.element.setStyle(this.margin,this.now[0]+this.options.unit);
this.wrapper.setStyle(this.layout,this.now[1]+this.options.unit)
}});
Fx.Transition=function(transition,params){params=params||[];
if($type(params)!="array"){params=[params]
}return $extend(transition,{easeIn:function(pos){return transition(pos,params)
},easeOut:function(pos){return 1-transition(1-pos,params)
},easeInOut:function(pos){return(pos<=0.5)?transition(2*pos,params)/2:(2-transition(2*(1-pos),params))/2
}})
};
Fx.Transitions=new Abstract({linear:function(p){return p
}});
Fx.Transitions.extend=function(transitions){for(var transition in transitions){Fx.Transitions[transition]=new Fx.Transition(transitions[transition]);
Fx.Transitions.compat(transition)
}};
Fx.Transitions.compat=function(transition){["In","Out","InOut"].each(function(easeType){Fx.Transitions[transition.toLowerCase()+easeType]=Fx.Transitions[transition]["ease"+easeType]
})
};
Fx.Transitions.extend({Pow:function(p,x){return Math.pow(p,x[0]||6)
},Expo:function(p){return Math.pow(2,8*(p-1))
},Circ:function(p){return 1-Math.sin(Math.acos(p))
},Sine:function(p){return 1-Math.sin((1-p)*Math.PI/2)
},Back:function(p,x){x=x[0]||1.618;
return Math.pow(p,2)*((x+1)*p-x)
},Bounce:function(p){var value;
for(var a=0,b=1;
1;
a+=b,b/=2){if(p>=(7-4*a)/11){value=-Math.pow((11-6*a-11*p)/4,2)+b*b;
break
}}return value
},Elastic:function(p,x){return Math.pow(2,10*--p)*Math.cos(20*p*Math.PI*(x[0]||1)/3)
}});
["Quad","Cubic","Quart","Quint"].each(function(transition,i){Fx.Transitions[transition]=new Fx.Transition(function(p){return Math.pow(p,[i+2])
});
Fx.Transitions.compat(transition)
});
var Drag={};
Drag.Base=new Class({options:{handle:false,unit:"px",onStart:Class.empty,onBeforeStart:Class.empty,onComplete:Class.empty,onSnap:Class.empty,onDrag:Class.empty,limit:false,modifiers:{x:"left",y:"top"},grid:false,snap:6},initialize:function(el,options){this.setOptions(options);
this.element=$(el);
this.handle=$(this.options.handle)||this.element;
this.mouse={now:{},pos:{}};
this.value={start:{},now:{}};
this.bound={start:this.start.bindWithEvent(this),check:this.check.bindWithEvent(this),drag:this.drag.bindWithEvent(this),stop:this.stop.bind(this)};
this.attach();
if(this.options.initialize){this.options.initialize.call(this)
}},attach:function(){this.handle.addEvent("mousedown",this.bound.start);
return this
},detach:function(){this.handle.removeEvent("mousedown",this.bound.start);
return this
},start:function(event){this.fireEvent("onBeforeStart",this.element);
this.mouse.start=event.page;
var limit=this.options.limit;
this.limit={x:[],y:[]};
for(var z in this.options.modifiers){if(!this.options.modifiers[z]){continue
}this.value.now[z]=this.element.getStyle(this.options.modifiers[z]).toInt();
this.mouse.pos[z]=event.page[z]-this.value.now[z];
if(limit&&limit[z]){for(var i=0;
i<2;
i++){if($chk(limit[z][i])){this.limit[z][i]=($type(limit[z][i])=="function")?limit[z][i]():limit[z][i]
}}}}if($type(this.options.grid)=="number"){this.options.grid={x:this.options.grid,y:this.options.grid}
}document.addListener("mousemove",this.bound.check);
document.addListener("mouseup",this.bound.stop);
this.fireEvent("onStart",this.element);
event.stop()
},check:function(event){var distance=Math.round(Math.sqrt(Math.pow(event.page.x-this.mouse.start.x,2)+Math.pow(event.page.y-this.mouse.start.y,2)));
if(distance>this.options.snap){document.removeListener("mousemove",this.bound.check);
document.addListener("mousemove",this.bound.drag);
this.drag(event);
this.fireEvent("onSnap",this.element)
}event.stop()
},drag:function(event){this.out=false;
this.mouse.now=event.page;
for(var z in this.options.modifiers){if(!this.options.modifiers[z]){continue
}this.value.now[z]=this.mouse.now[z]-this.mouse.pos[z];
if(this.limit[z]){if($chk(this.limit[z][1])&&(this.value.now[z]>this.limit[z][1])){this.value.now[z]=this.limit[z][1];
this.out=true
}else{if($chk(this.limit[z][0])&&(this.value.now[z]<this.limit[z][0])){this.value.now[z]=this.limit[z][0];
this.out=true
}}}if(this.options.grid[z]){this.value.now[z]-=(this.value.now[z]%this.options.grid[z])
}this.element.setStyle(this.options.modifiers[z],this.value.now[z]+this.options.unit)
}this.fireEvent("onDrag",this.element);
event.stop()
},stop:function(){document.removeListener("mousemove",this.bound.check);
document.removeListener("mousemove",this.bound.drag);
document.removeListener("mouseup",this.bound.stop);
this.fireEvent("onComplete",this.element)
}});
Drag.Base.implement(new Events,new Options);
Element.extend({makeResizable:function(options){return new Drag.Base(this,$merge({modifiers:{x:"width",y:"height"}},options))
}});
Drag.Move=Drag.Base.extend({options:{droppables:[],container:false,overflown:[]},initialize:function(el,options){this.setOptions(options);
this.element=$(el);
this.droppables=$$(this.options.droppables);
this.container=$(this.options.container);
this.position={element:this.element.getStyle("position"),container:false};
if(this.container){this.position.container=this.container.getStyle("position")
}if(!["relative","absolute","fixed"].contains(this.position.element)){this.position.element="absolute"
}var top=this.element.getStyle("top").toInt();
var left=this.element.getStyle("left").toInt();
if(this.position.element=="absolute"&&!["relative","absolute","fixed"].contains(this.position.container)){top=$chk(top)?top:this.element.getTop(this.options.overflown);
left=$chk(left)?left:this.element.getLeft(this.options.overflown)
}else{top=$chk(top)?top:0;
left=$chk(left)?left:0
}this.element.setStyles({top:top,left:left,position:this.position.element});
this.parent(this.element)
},start:function(event){this.overed=null;
if(this.container){var cont=this.container.getCoordinates();
var el=this.element.getCoordinates();
if(this.position.element=="absolute"&&!["relative","absolute","fixed"].contains(this.position.container)){this.options.limit={x:[cont.left,cont.right-el.width],y:[cont.top,cont.bottom-el.height]}
}else{this.options.limit={y:[0,cont.height-el.height],x:[0,cont.width-el.width]}
}}this.parent(event)
},drag:function(event){this.parent(event);
var overed=this.out?false:this.droppables.filter(this.checkAgainst,this).getLast();
if(this.overed!=overed){if(this.overed){this.overed.fireEvent("leave",[this.element,this])
}this.overed=overed?overed.fireEvent("over",[this.element,this]):null
}return this
},checkAgainst:function(el){el=el.getCoordinates(this.options.overflown);
var now=this.mouse.now;
return(now.x>el.left&&now.x<el.right&&now.y<el.bottom&&now.y>el.top)
},stop:function(){if(this.overed&&!this.out){this.overed.fireEvent("drop",[this.element,this])
}else{this.element.fireEvent("emptydrop",this)
}this.parent();
return this
}});
Element.extend({makeDraggable:function(options){return new Drag.Move(this,options)
}});
var XHR=new Class({options:{method:"post",async:true,onRequest:Class.empty,onSuccess:Class.empty,onFailure:Class.empty,urlEncoded:true,encoding:"utf-8",autoCancel:false,headers:{}},setTransport:function(){this.transport=(window.XMLHttpRequest)?new XMLHttpRequest():(window.ie?new ActiveXObject("Microsoft.XMLHTTP"):false);
return this
},initialize:function(options){this.setTransport().setOptions(options);
this.options.isSuccess=this.options.isSuccess||this.isSuccess;
this.headers={};
if(this.options.urlEncoded&&this.options.method=="post"){var encoding=(this.options.encoding)?"; charset="+this.options.encoding:"";
this.setHeader("Content-type","application/x-www-form-urlencoded"+encoding)
}if(this.options.initialize){this.options.initialize.call(this)
}},onStateChange:function(){if(this.transport.readyState!=4||!this.running){return 
}this.running=false;
var status=0;
try{status=this.transport.status
}catch(e){}if(this.options.isSuccess.call(this,status)){this.onSuccess()
}else{this.onFailure()
}this.transport.onreadystatechange=Class.empty
},isSuccess:function(status){return((status>=200)&&(status<300))
},onSuccess:function(){this.response={text:this.transport.responseText,xml:this.transport.responseXML};
this.fireEvent("onSuccess",[this.response.text,this.response.xml]);
this.callChain()
},onFailure:function(){this.fireEvent("onFailure",this.transport)
},setHeader:function(name,value){this.headers[name]=value;
return this
},send:function(url,data){if(this.options.autoCancel){this.cancel()
}else{if(this.running){return this
}}this.running=true;
if(data&&this.options.method=="get"){url=url+(url.contains("?")?"&":"?")+data;
data=null
}this.transport.open(this.options.method.toUpperCase(),url,this.options.async);
this.transport.onreadystatechange=this.onStateChange.bind(this);
if((this.options.method=="post")&&this.transport.overrideMimeType){this.setHeader("Connection","close")
}$extend(this.headers,this.options.headers);
for(var type in this.headers){try{this.transport.setRequestHeader(type,this.headers[type])
}catch(e){}}this.fireEvent("onRequest");
this.transport.send($pick(data,null));
return this
},cancel:function(){if(!this.running){return this
}this.running=false;
this.transport.abort();
this.transport.onreadystatechange=Class.empty;
this.setTransport();
this.fireEvent("onCancel");
return this
}});
XHR.implement(new Chain,new Events,new Options);
var Ajax=XHR.extend({options:{data:null,update:null,onComplete:Class.empty,evalScripts:false,evalResponse:false},initialize:function(url,options){this.addEvent("onSuccess",this.onComplete);
this.setOptions(options);
this.options.data=this.options.data||this.options.postBody;
if(!["post","get"].contains(this.options.method)){this._method="_method="+this.options.method;
this.options.method="post"
}this.parent();
this.setHeader("X-Requested-With","XMLHttpRequest");
this.setHeader("Accept","text/javascript, text/html, application/xml, text/xml, */*");
this.url=url
},onComplete:function(){if(this.options.update){$(this.options.update).empty().setHTML(this.response.text)
}if(this.options.evalScripts||this.options.evalResponse){this.evalScripts()
}this.fireEvent("onComplete",[this.response.text,this.response.xml],20)
},request:function(data){data=data||this.options.data;
switch($type(data)){case"element":data=$(data).toQueryString();
break;
case"object":data=Object.toQueryString(data)
}if(this._method){data=(data)?[this._method,data].join("&"):this._method
}return this.send(this.url,data)
},evalScripts:function(){var script,scripts;
if(this.options.evalResponse||(/(ecma|java)script/).test(this.getHeader("Content-type"))){scripts=this.response.text
}else{scripts=[];
var regexp=/<script[^>]*>([\s\S]*?)<\/script>/gi;
while((script=regexp.exec(this.response.text))){scripts.push(script[1])
}scripts=scripts.join("\n")
}if(scripts){(window.execScript)?window.execScript(scripts):window.setTimeout(scripts,0)
}},getHeader:function(name){try{return this.transport.getResponseHeader(name)
}catch(e){}return null
}});
Object.toQueryString=function(source){var queryString=[];
for(var property in source){queryString.push(encodeURIComponent(property)+"="+encodeURIComponent(source[property]))
}return queryString.join("&")
};
Element.extend({send:function(options){return new Ajax(this.getProperty("action"),$merge({data:this.toQueryString()},options,{method:"post"})).request()
}});
var Cookie=new Abstract({options:{domain:false,path:false,duration:false,secure:false},set:function(key,value,options){options=$merge(this.options,options);
value=encodeURIComponent(value);
if(options.domain){value+="; domain="+options.domain
}if(options.path){value+="; path="+options.path
}if(options.duration){var date=new Date();
date.setTime(date.getTime()+options.duration*24*60*60*1000);
value+="; expires="+date.toGMTString()
}if(options.secure){value+="; secure"
}document.cookie=key+"="+value;
return $extend(options,{key:key,value:value})
},get:function(key){var value=document.cookie.match("(?:^|;)\\s*"+key.escapeRegExp()+"=([^;]*)");
return value?decodeURIComponent(value[1]):false
},remove:function(cookie,options){if($type(cookie)=="object"){this.set(cookie.key,"",$merge(cookie,{duration:-1}))
}else{this.set(cookie,"",$merge(options,{duration:-1}))
}}});
var Json={toString:function(obj){switch($type(obj)){case"string":return'"'+obj.replace(/(["\\])/g,"\\$1")+'"';
case"array":return"["+obj.map(Json.toString).join(",")+"]";
case"object":var string=[];
for(var property in obj){string.push(Json.toString(property)+":"+Json.toString(obj[property]))
}return"{"+string.join(",")+"}";
case"number":if(isFinite(obj)){break
}case false:return"null"
}return String(obj)
},evaluate:function(str,secure){return(($type(str)!="string")||(secure&&!str.test(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/)))?null:eval("("+str+")")
}};
Json.Remote=XHR.extend({initialize:function(url,options){this.url=url;
this.addEvent("onSuccess",this.onComplete);
this.parent(options);
this.setHeader("X-Request","JSON")
},send:function(obj){return this.parent(this.url,"json="+Json.toString(obj))
},onComplete:function(){this.fireEvent("onComplete",[Json.evaluate(this.response.text,this.options.secure)])
}});
var Asset=new Abstract({javascript:function(source,properties){properties=$merge({onload:Class.empty},properties);
var script=new Element("script",{src:source}).addEvents({load:properties.onload,readystatechange:function(){if(this.readyState=="complete"){this.fireEvent("load")
}}});
delete properties.onload;
return script.setProperties(properties).inject(document.head)
},css:function(source,properties){return new Element("link",$merge({rel:"stylesheet",media:"screen",type:"text/css",href:source},properties)).inject(document.head)
},image:function(source,properties){properties=$merge({onload:Class.empty,onabort:Class.empty,onerror:Class.empty},properties);
var image=new Image();
image.src=source;
var element=new Element("img",{src:source});
["load","abort","error"].each(function(type){var event=properties["on"+type];
delete properties["on"+type];
element.addEvent(type,function(){this.removeEvent(type,arguments.callee);
event.call(this)
})
});
if(image.width&&image.height){element.fireEvent("load",element,1)
}return element.setProperties(properties)
},images:function(sources,options){options=$merge({onComplete:Class.empty,onProgress:Class.empty},options);
if(!sources.push){sources=[sources]
}var images=[];
var counter=0;
sources.each(function(source){var img=new Asset.image(source,{onload:function(){options.onProgress.call(this,counter);
counter++;
if(counter==sources.length){options.onComplete()
}}});
images.push(img)
});
return new Elements(images)
}});
var Hash=new Class({length:0,initialize:function(object){this.obj=object||{};
this.setLength()
},get:function(key){return(this.hasKey(key))?this.obj[key]:null
},hasKey:function(key){return(key in this.obj)
},set:function(key,value){if(!this.hasKey(key)){this.length++
}this.obj[key]=value;
return this
},setLength:function(){this.length=0;
for(var p in this.obj){this.length++
}return this
},remove:function(key){if(this.hasKey(key)){delete this.obj[key];
this.length--
}return this
},each:function(fn,bind){$each(this.obj,fn,bind)
},extend:function(obj){$extend(this.obj,obj);
return this.setLength()
},merge:function(){this.obj=$merge.apply(null,[this.obj].extend(arguments));
return this.setLength()
},empty:function(){this.obj={};
this.length=0;
return this
},keys:function(){var keys=[];
for(var property in this.obj){keys.push(property)
}return keys
},values:function(){var values=[];
for(var property in this.obj){values.push(this.obj[property])
}return values
}});
function $H(obj){return new Hash(obj)
}Hash.Cookie=Hash.extend({initialize:function(name,options){this.name=name;
this.options=$extend({autoSave:true},options||{});
this.load()
},save:function(){if(this.length==0){Cookie.remove(this.name,this.options);
return true
}var str=Json.toString(this.obj);
if(str.length>4096){return false
}Cookie.set(this.name,str,this.options);
return true
},load:function(){this.obj=Json.evaluate(Cookie.get(this.name),true)||{};
this.setLength()
}});
Hash.Cookie.Methods={};
["extend","set","merge","empty","remove"].each(function(method){Hash.Cookie.Methods[method]=function(){Hash.prototype[method].apply(this,arguments);
if(this.options.autoSave){this.save()
}return this
}
});
Hash.Cookie.implement(Hash.Cookie.Methods);
var Color=new Class({initialize:function(color,type){type=type||(color.push?"rgb":"hex");
var rgb,hsb;
switch(type){case"rgb":rgb=color;
hsb=rgb.rgbToHsb();
break;
case"hsb":rgb=color.hsbToRgb();
hsb=color;
break;
default:rgb=color.hexToRgb(true);
hsb=rgb.rgbToHsb()
}rgb.hsb=hsb;
rgb.hex=rgb.rgbToHex();
return $extend(rgb,Color.prototype)
},mix:function(){var colors=$A(arguments);
var alpha=($type(colors[colors.length-1])=="number")?colors.pop():50;
var rgb=this.copy();
colors.each(function(color){color=new Color(color);
for(var i=0;
i<3;
i++){rgb[i]=Math.round((rgb[i]/100*(100-alpha))+(color[i]/100*alpha))
}});
return new Color(rgb,"rgb")
},invert:function(){return new Color(this.map(function(value){return 255-value
}))
},setHue:function(value){return new Color([value,this.hsb[1],this.hsb[2]],"hsb")
},setSaturation:function(percent){return new Color([this.hsb[0],percent,this.hsb[2]],"hsb")
},setBrightness:function(percent){return new Color([this.hsb[0],this.hsb[1],percent],"hsb")
}});
function $RGB(r,g,b){return new Color([r,g,b],"rgb")
}function $HSB(h,s,b){return new Color([h,s,b],"hsb")
}Array.extend({rgbToHsb:function(){var red=this[0],green=this[1],blue=this[2];
var hue,saturation,brightness;
var max=Math.max(red,green,blue),min=Math.min(red,green,blue);
var delta=max-min;
brightness=max/255;
saturation=(max!=0)?delta/max:0;
if(saturation==0){hue=0
}else{var rr=(max-red)/delta;
var gr=(max-green)/delta;
var br=(max-blue)/delta;
if(red==max){hue=br-gr
}else{if(green==max){hue=2+rr-br
}else{hue=4+gr-rr
}}hue/=6;
if(hue<0){hue++
}}return[Math.round(hue*360),Math.round(saturation*100),Math.round(brightness*100)]
},hsbToRgb:function(){var br=Math.round(this[2]/100*255);
if(this[1]==0){return[br,br,br]
}else{var hue=this[0]%360;
var f=hue%60;
var p=Math.round((this[2]*(100-this[1]))/10000*255);
var q=Math.round((this[2]*(6000-this[1]*f))/600000*255);
var t=Math.round((this[2]*(6000-this[1]*(60-f)))/600000*255);
switch(Math.floor(hue/60)){case 0:return[br,t,p];
case 1:return[q,br,p];
case 2:return[p,br,t];
case 3:return[p,q,br];
case 4:return[t,p,br];
case 5:return[br,p,q]
}}return false
}});
var Scroller=new Class({options:{area:20,velocity:1,onChange:function(x,y){this.element.scrollTo(x,y)
}},initialize:function(element,options){this.setOptions(options);
this.element=$(element);
this.mousemover=([window,document].contains(element))?$(document.body):this.element
},start:function(){this.coord=this.getCoords.bindWithEvent(this);
this.mousemover.addListener("mousemove",this.coord)
},stop:function(){this.mousemover.removeListener("mousemove",this.coord);
this.timer=$clear(this.timer)
},getCoords:function(event){this.page=(this.element==window)?event.client:event.page;
if(!this.timer){this.timer=this.scroll.periodical(50,this)
}},scroll:function(){var el=this.element.getSize();
var pos=this.element.getPosition();
var change={x:0,y:0};
for(var z in this.page){if(this.page[z]<(this.options.area+pos[z])&&el.scroll[z]!=0){change[z]=(this.page[z]-this.options.area-pos[z])*this.options.velocity
}else{if(this.page[z]+this.options.area>(el.size[z]+pos[z])&&el.scroll[z]+el.size[z]!=el.scrollSize[z]){change[z]=(this.page[z]-el.size[z]+this.options.area-pos[z])*this.options.velocity
}}}if(change.y||change.x){this.fireEvent("onChange",[el.scroll.x+change.x,el.scroll.y+change.y])
}}});
Scroller.implement(new Events,new Options);
var Slider=new Class({options:{onChange:Class.empty,onComplete:Class.empty,onTick:function(pos){this.knob.setStyle(this.p,pos)
},mode:"horizontal",steps:100,offset:0},initialize:function(el,knob,options){this.element=$(el);
this.knob=$(knob);
this.setOptions(options);
this.previousChange=-1;
this.previousEnd=-1;
this.step=-1;
this.element.addEvent("mousedown",this.clickedElement.bindWithEvent(this));
var mod,offset;
switch(this.options.mode){case"horizontal":this.z="x";
this.p="left";
mod={x:"left",y:false};
offset="offsetWidth";
break;
case"vertical":this.z="y";
this.p="top";
mod={x:false,y:"top"};
offset="offsetHeight"
}this.max=this.element[offset]-this.knob[offset]+(this.options.offset*2);
this.half=this.knob[offset]/2;
this.getPos=this.element["get"+this.p.capitalize()].bind(this.element);
this.knob.setStyle("position","relative").setStyle(this.p,-this.options.offset);
var lim={};
lim[this.z]=[-this.options.offset,this.max-this.options.offset];
this.drag=new Drag.Base(this.knob,{limit:lim,modifiers:mod,snap:0,onStart:function(){this.draggedKnob()
}.bind(this),onDrag:function(){this.draggedKnob()
}.bind(this),onComplete:function(){this.draggedKnob();
this.end()
}.bind(this)});
if(this.options.initialize){this.options.initialize.call(this)
}},set:function(step){this.step=step.limit(0,this.options.steps);
this.checkStep();
this.end();
this.fireEvent("onTick",this.toPosition(this.step));
return this
},clickedElement:function(event){var position=event.page[this.z]-this.getPos()-this.half;
position=position.limit(-this.options.offset,this.max-this.options.offset);
this.step=this.toStep(position);
this.checkStep();
this.end();
this.fireEvent("onTick",position)
},draggedKnob:function(){this.step=this.toStep(this.drag.value.now[this.z]);
this.checkStep()
},checkStep:function(){if(this.previousChange!=this.step){this.previousChange=this.step;
this.fireEvent("onChange",this.step)
}},end:function(){if(this.previousEnd!==this.step){this.previousEnd=this.step;
this.fireEvent("onComplete",this.step+"")
}},toStep:function(position){return Math.round((position+this.options.offset)/this.max*this.options.steps)
},toPosition:function(step){return this.max*step/this.options.steps
}});
Slider.implement(new Events);
Slider.implement(new Options);
var SmoothScroll=Fx.Scroll.extend({initialize:function(options){this.parent(window,options);
this.links=(this.options.links)?$$(this.options.links):$$(document.links);
var location=window.location.href.match(/^[^#]*/)[0]+"#";
this.links.each(function(link){if(link.href.indexOf(location)!=0){return 
}var anchor=link.href.substr(location.length);
if(anchor&&$(anchor)){this.useLink(link,anchor)
}},this);
if(!window.webkit419){this.addEvent("onComplete",function(){window.location.hash=this.anchor
})
}},useLink:function(link,anchor){link.addEvent("click",function(event){this.anchor=anchor;
this.toElement(anchor);
event.stop()
}.bindWithEvent(this))
}});
var Sortables=new Class({options:{handles:false,onStart:Class.empty,onComplete:Class.empty,ghost:true,snap:3,onDragStart:function(element,ghost){ghost.setStyle("opacity",0.7);
element.setStyle("opacity",0.7)
},onDragComplete:function(element,ghost){element.setStyle("opacity",1);
ghost.remove();
this.trash.remove()
}},initialize:function(list,options){this.setOptions(options);
this.list=$(list);
this.elements=this.list.getChildren();
this.handles=(this.options.handles)?$$(this.options.handles):this.elements;
this.bound={start:[],moveGhost:this.moveGhost.bindWithEvent(this)};
for(var i=0,l=this.handles.length;
i<l;
i++){this.bound.start[i]=this.start.bindWithEvent(this,this.elements[i])
}this.attach();
if(this.options.initialize){this.options.initialize.call(this)
}this.bound.move=this.move.bindWithEvent(this);
this.bound.end=this.end.bind(this)
},attach:function(){this.handles.each(function(handle,i){handle.addEvent("mousedown",this.bound.start[i])
},this)
},detach:function(){this.handles.each(function(handle,i){handle.removeEvent("mousedown",this.bound.start[i])
},this)
},start:function(event,el){this.active=el;
this.coordinates=this.list.getCoordinates();
if(this.options.ghost){var position=el.getPosition();
this.offset=event.page.y-position.y;
this.trash=new Element("div").inject(document.body);
this.ghost=el.clone().inject(this.trash).setStyles({position:"absolute",left:position.x,top:event.page.y-this.offset});
document.addListener("mousemove",this.bound.moveGhost);
this.fireEvent("onDragStart",[el,this.ghost])
}document.addListener("mousemove",this.bound.move);
document.addListener("mouseup",this.bound.end);
this.fireEvent("onStart",el);
event.stop()
},moveGhost:function(event){var value=event.page.y-this.offset;
value=value.limit(this.coordinates.top,this.coordinates.bottom-this.ghost.offsetHeight);
this.ghost.setStyle("top",value);
event.stop()
},move:function(event){var now=event.page.y;
this.previous=this.previous||now;
var up=((this.previous-now)>0);
var prev=this.active.getPrevious();
var next=this.active.getNext();
if(prev&&up&&now<prev.getCoordinates().bottom){this.active.injectBefore(prev)
}if(next&&!up&&now>next.getCoordinates().top){this.active.injectAfter(next)
}this.previous=now
},serialize:function(converter){return this.list.getChildren().map(converter||function(el){return this.elements.indexOf(el)
},this)
},end:function(){this.previous=null;
document.removeListener("mousemove",this.bound.move);
document.removeListener("mouseup",this.bound.end);
if(this.options.ghost){document.removeListener("mousemove",this.bound.moveGhost);
this.fireEvent("onDragComplete",[this.active,this.ghost])
}this.fireEvent("onComplete",this.active)
}});
Sortables.implement(new Events,new Options);
var Tips=new Class({options:{onShow:function(tip){tip.setStyle("visibility","visible")
},onHide:function(tip){tip.setStyle("visibility","hidden")
},maxTitleChars:30,showDelay:100,hideDelay:100,className:"tool",offsets:{x:16,y:16},fixed:false},initialize:function(elements,options){this.setOptions(options);
this.toolTip=new Element("div",{"class":this.options.className+"-tip",styles:{position:"absolute",top:"0",left:"0",visibility:"hidden"}}).inject(document.body);
this.wrapper=new Element("div").inject(this.toolTip);
$$(elements).each(this.build,this);
if(this.options.initialize){this.options.initialize.call(this)
}},build:function(el){el.$tmp.myTitle=(el.href&&el.getTag()=="a")?el.href.replace("http://",""):(el.rel||false);
if(el.title){var dual=el.title.split("::");
if(dual.length>1){el.$tmp.myTitle=dual[0].trim();
el.$tmp.myText=dual[1].trim()
}else{el.$tmp.myText=el.title
}el.removeAttribute("title")
}else{el.$tmp.myText=false
}if(el.$tmp.myTitle&&el.$tmp.myTitle.length>this.options.maxTitleChars){el.$tmp.myTitle=el.$tmp.myTitle.substr(0,this.options.maxTitleChars-1)+"&hellip;"
}el.addEvent("mouseenter",function(event){this.start(el);
if(!this.options.fixed){this.locate(event)
}else{this.position(el)
}}.bind(this));
if(!this.options.fixed){el.addEvent("mousemove",this.locate.bindWithEvent(this))
}var end=this.end.bind(this);
el.addEvent("mouseleave",end);
el.addEvent("trash",end)
},start:function(el){this.wrapper.empty();
if(el.$tmp.myTitle){this.title=new Element("span").inject(new Element("div",{"class":this.options.className+"-title"}).inject(this.wrapper)).setHTML(el.$tmp.myTitle)
}if(el.$tmp.myText){this.text=new Element("span").inject(new Element("div",{"class":this.options.className+"-text"}).inject(this.wrapper)).setHTML(el.$tmp.myText)
}$clear(this.timer);
this.timer=this.show.delay(this.options.showDelay,this)
},end:function(event){$clear(this.timer);
this.timer=this.hide.delay(this.options.hideDelay,this)
},position:function(element){var pos=element.getPosition();
this.toolTip.setStyles({left:pos.x+this.options.offsets.x,top:pos.y+this.options.offsets.y})
},locate:function(event){var win={x:window.getWidth(),y:window.getHeight()};
var scroll={x:window.getScrollLeft(),y:window.getScrollTop()};
var tip={x:this.toolTip.offsetWidth,y:this.toolTip.offsetHeight};
var prop={x:"left",y:"top"};
for(var z in prop){var pos=event.page[z]+this.options.offsets[z];
if((pos+tip[z]-scroll[z])>win[z]){pos=event.page[z]-this.options.offsets[z]-tip[z]
}this.toolTip.setStyle(prop[z],pos)
}},show:function(){if(this.options.timeout){this.timer=this.hide.delay(this.options.timeout,this)
}this.fireEvent("onShow",[this.toolTip])
},hide:function(){this.fireEvent("onHide",[this.toolTip])
}});
Tips.implement(new Events,new Options);
var Group=new Class({initialize:function(){this.instances=$A(arguments);
this.events={};
this.checker={}
},addEvent:function(type,fn){this.checker[type]=this.checker[type]||{};
this.events[type]=this.events[type]||[];
if(this.events[type].contains(fn)){return false
}else{this.events[type].push(fn)
}this.instances.each(function(instance,i){instance.addEvent(type,this.check.bind(this,[type,instance,i]))
},this);
return this
},check:function(type,instance,i){this.checker[type][i]=true;
var every=this.instances.every(function(current,j){return this.checker[type][j]||false
},this);
if(!every){return 
}this.checker[type]={};
this.events[type].each(function(event){event.call(this,this.instances,instance)
},this)
}});
var Accordion=Fx.Elements.extend({options:{onActive:Class.empty,onBackground:Class.empty,display:0,show:false,height:true,width:false,opacity:true,fixedHeight:false,fixedWidth:false,wait:false,alwaysHide:false},initialize:function(){var options,togglers,elements,container;
$each(arguments,function(argument,i){switch($type(argument)){case"object":options=argument;
break;
case"element":container=$(argument);
break;
default:var temp=$$(argument);
if(!togglers){togglers=temp
}else{elements=temp
}}});
this.togglers=togglers||[];
this.elements=elements||[];
this.container=$(container);
this.setOptions(options);
this.previous=-1;
if(this.options.alwaysHide){this.options.wait=true
}if($chk(this.options.show)){this.options.display=false;
this.previous=this.options.show
}if(this.options.start){this.options.display=false;
this.options.show=false
}this.effects={};
if(this.options.opacity){this.effects.opacity="fullOpacity"
}if(this.options.width){this.effects.width=this.options.fixedWidth?"fullWidth":"offsetWidth"
}if(this.options.height){this.effects.height=this.options.fixedHeight?"fullHeight":"scrollHeight"
}for(var i=0,l=this.togglers.length;
i<l;
i++){this.addSection(this.togglers[i],this.elements[i])
}this.elements.each(function(el,i){if(this.options.show===i){this.fireEvent("onActive",[this.togglers[i],el])
}else{for(var fx in this.effects){el.setStyle(fx,0)
}}},this);
this.parent(this.elements);
if($chk(this.options.display)){this.display(this.options.display)
}},addSection:function(toggler,element,pos){toggler=$(toggler);
element=$(element);
var test=this.togglers.contains(toggler);
var len=this.togglers.length;
this.togglers.include(toggler);
this.elements.include(element);
if(len&&(!test||pos)){pos=$pick(pos,len-1);
toggler.injectBefore(this.togglers[pos]);
element.injectAfter(toggler)
}else{if(this.container&&!test){toggler.inject(this.container);
element.inject(this.container)
}}var idx=this.togglers.indexOf(toggler);
toggler.addEvent("click",this.display.bind(this,idx));
if(this.options.height){element.setStyles({"padding-top":0,"border-top":"none","padding-bottom":0,"border-bottom":"none"})
}if(this.options.width){element.setStyles({"padding-left":0,"border-left":"none","padding-right":0,"border-right":"none"})
}element.fullOpacity=1;
if(this.options.fixedWidth){element.fullWidth=this.options.fixedWidth
}if(this.options.fixedHeight){element.fullHeight=this.options.fixedHeight
}element.setStyle("overflow","hidden");
if(!test){for(var fx in this.effects){element.setStyle(fx,0)
}}return this
},display:function(index){index=($type(index)=="element")?this.elements.indexOf(index):index;
if((this.timer&&this.options.wait)||(index===this.previous&&!this.options.alwaysHide)){return this
}this.previous=index;
var obj={};
this.elements.each(function(el,i){obj[i]={};
var hide=(i!=index)||(this.options.alwaysHide&&(el.offsetHeight>0));
this.fireEvent(hide?"onBackground":"onActive",[this.togglers[i],el]);
for(var fx in this.effects){obj[i][fx]=hide?0:el[this.effects[fx]]
}},this);
return this.start(obj)
},showThisHideOpen:function(index){return this.display(index)
}});
Fx.Accordion=Accordion;var _ERROR_MESSAGE="Oops.. there was a problem with your request.<br /><br />Please try again.<br /><br /><em>Click anywhere to close.</em>";
var _RESIZE_DURATION=400;
var _INITIAL_WIDTH=250;
var _INITIAL_HEIGHT=250;
var _CONTENTS_WIDTH=500;
var _CONTENTS_HEIGHT=400;
var _DEF_CONTENTS_WIDTH=500;
var _DEF_CONTENTS_HEIGHT=400;
var _DEF_FULLSCREEN_WIDTH=0.95;
var _DEF_FULLSCREEN_HEIGHT=0.8;
var _ANIMATE_CAPTION=true;
var _EVAL_SCRIPTS=true;
var _EVAL_RESPONSE=false;
var MOOdalBox={init:function(options){this.options=Object.extend({resizeDuration:_RESIZE_DURATION,initialWidth:_INITIAL_WIDTH,initialHeight:_INITIAL_HEIGHT,contentsWidth:_CONTENTS_WIDTH,contentsHeight:_CONTENTS_HEIGHT,defContentsWidth:_DEF_CONTENTS_WIDTH,defContentsHeight:_DEF_CONTENTS_HEIGHT,defFullscreenWidth:_DEF_FULLSCREEN_WIDTH,defFullscreenHeight:_DEF_FULLSCREEN_HEIGHT,animateCaption:_ANIMATE_CAPTION,evalScripts:_EVAL_SCRIPTS,evalResponse:_EVAL_RESPONSE},options||{});
this.anchors=[];
this.scanAnchors(document.body,false);
this.forms=[];
this.scanForms(document.body,false);
this.eventKeyDown=this.keyboardListener.bindWithEvent(this);
this.eventPosition=this.position.bind(this);
this.overlay=new Element("div").setProperty("id","mb_overlay").injectInside(document.body);
this.overlayDiv=new Element("div").setOpacity(0).setStyles({position:"absolute",border:0,width:"100%",backgroundColor:"black",zIndex:98}).injectInside(document.body);
this.center=new Element("div").setProperty("id","mb_center").setStyles({width:this.options.initialWidth+"px",height:this.options.initialHeight+"px",marginLeft:"-"+(this.options.initialWidth/2)+"px",display:"none"}).injectInside(document.body);
this.contents=new Element("div").setProperty("id","mb_contents").injectInside(this.center);
this.bottom=new Element("div").setProperty("id","mb_bottom").setStyle("display","none").injectInside(document.body);
this.closelink=new Element("a").setProperties({id:"mb_close_link",href:"#"}).injectInside(this.bottom);
this.caption=new Element("div").setProperty("id","mb_caption").injectInside(this.bottom);
new Element("div").setStyle("clear","both").injectInside(this.bottom);
this.error=new Element("div").setProperty("id","mb_error").setHTML(_ERROR_MESSAGE);
this.closelink.onclick=this.overlay.onclick=this.close.bind(this);
var nextEffect=this.nextEffect.bind(this);
this.fx={overlay:this.overlay.effect("opacity",{duration:500}).hide(),resize:this.center.effects({onComplete:nextEffect}),contents:this.contents.effect("opacity",{duration:500,onComplete:nextEffect}),bottom:this.bottom.effects({duration:400,onComplete:nextEffect})};
var ajaxFailure=this.ajaxFailure.bind(this);
this.ajaxOptions={update:this.contents,evalScripts:this.options.evalScripts,evalResponse:this.options.evalResponse,onComplete:nextEffect,onFailure:ajaxFailure,encoding:"utf-8"};
this.ajaxRequest=Class.empty
},click:function(link){return this.open(link.href,link.title,link.rel,false)
},open:function(sLinkHref,sLinkTitle,sLinkRel,oForm){this.eventContainer=new Element("div");
this.eventContainer.cloneEvents($(document),"keydown");
$(document).removeEvents("keydown");
this.href=sLinkHref;
this.title=sLinkTitle;
this.rel=sLinkRel;
if(oForm){if(oForm.method=="get"){this.href+="?"+oForm.toQueryString();
this.ajaxOptions=Object.extend(this.ajaxOptions,{method:"get",postBody:""})
}else{this.ajaxOptions=Object.extend(this.ajaxOptions,{method:"post",postBody:oForm})
}}else{this.ajaxOptions=Object.extend(this.ajaxOptions,{method:"get",postBody:""})
}this.ajaxOptions.encoding="utf-8";
this.position();
this.setup(true);
this.top=Window.getScrollTop()+(Window.getHeight()/15);
this.center.setStyles({top:this.top+"px",display:""});
this.fx.overlay.custom(0.8);
return this.loadContents(sLinkHref)
},position:function(){this.overlay.setStyles({top:Window.getScrollTop()+"px",height:Window.getHeight()+"px"});
this.overlayDiv.setStyles({top:Window.getScrollTop()+"px",height:Window.getHeight()+"px"})
},scanAnchors:function(oWhere,bForce){$$($(oWhere).getElements("a")).each(function(el){if(el.href&&((el.rel&&el.rel.test("^moodalbox","i"))||(bForce&&!el.onclick))){if(bForce&&!el.rel){el.rel="moodalbox "+this.options.contentsWidth+"px "+this.options.contentsHeight+"px";
if(this.wizardMode){el.rel+=" wizard"
}}el.onclick=this.click.pass(el,this);
this.anchors.push(el)
}},this)
},scanForms:function(oWhere,bForce){$$($(oWhere).getElements("form")).each(function(el){el.rel=el.getProperty("rel");
if((el.rel&&el.rel.test("^moodalbox","i"))||bForce){if(bForce&&!el.rel){el.rel="moodalbox "+this.options.contentsWidth+"px "+this.options.contentsHeight+"px";
if(this.wizardMode){el.rel+=" wizard"
}}el.onsubmit=this.open.pass([el.action,el.title,el.rel,el],this);
this.forms.push(el)
}},this)
},setup:function(open){var fn=open?"addEvent":"removeEvent";
window[fn]("scroll",this.eventPosition)[fn]("resize",this.eventPosition);
document[fn]("keydown",this.eventKeyDown);
this.step=0
},loadContents:function(){if(this.step){return false
}this.step=1;
if(this.rel.test("fullscreen")){this.options.contentsWidth=this.options.defFullscreenWidth*window.getWidth();
this.options.contentsHeight=this.options.defFullscreenHeight*window.getHeight()
}else{var aDim=this.rel.match(/[0-9.]+(px|%)/g);
if(aDim&&aDim[0]){var w=aDim[0].toInt();
if(aDim[0].test("%")){this.options.contentsWidth=(w>0)?0.01*w*window.getWidth():this.options.defFullscreenWidth*window.getWidth()
}else{this.options.contentsWidth=(w>0)?w:this.options.defContentsWidth
}}else{this.options.contentsWidth=this.options.defContentsWidth;
this.options.contentsHeight=this.options.defContentsHeight
}if(aDim&&aDim[1]){var h=aDim[1].toInt();
if(aDim[1].test("%")){this.options.contentsHeight=(h>0)?0.01*h*window.getHeight():this.options.defFullscreenHeight*window.getHeight()
}else{this.options.contentsHeight=(h>0)?h:this.options.defContentsHeight
}}else{if(aDim&&aDim[0]){if(aDim[0].test("%")){this.options.contentsHeight=(w>0)?0.01*w*window.getHeight():this.options.defFullscreenHeight*window.getHeight()
}else{this.options.contentsHeight=(w>0)?w:this.options.defContentsHeight
}}}this.options.contentsWidth=Math.floor(this.options.contentsWidth);
this.options.contentsHeight=Math.floor(this.options.contentsHeight)
}this.wizardMode=this.rel.test("wizard");
this.bottom.setStyles({opacity:"0",height:"0px",display:"none"});
this.center.className="mb_loading";
this.fx.contents.hide();
this.ajaxRequest=new Ajax(this.href,this.ajaxOptions).request();
return false
},ajaxFailure:function(){this.contents.setHTML("");
this.error.clone().injectInside(this.contents);
this.nextEffect();
this.center.setStyle("cursor","pointer");
this.bottom.setStyle("cursor","pointer");
this.center.onclick=this.bottom.onclick=this.close.bind(this)
},nextEffect:function(){switch(this.step++){case 1:this.center.className="";
this.center.setStyle("cursor","default");
this.bottom.setStyle("cursor","default");
this.center.onclick=this.bottom.onclick="";
this.caption.setHTML(this.title);
this.contents.setStyles({width:this.options.contentsWidth+"px",height:this.options.contentsHeight+"px"});
if(this.center.clientHeight!=this.contents.offsetHeight){this.fx.resize.options.duration=this.options.resizeDuration;
this.fx.resize.custom({height:[this.center.clientHeight,this.contents.offsetHeight]});
break
}this.step++;
case 2:if(this.center.clientWidth!=this.contents.offsetWidth){this.fx.resize.custom({width:[this.center.clientWidth,this.contents.offsetWidth],marginLeft:[-this.center.clientWidth/2,-this.contents.offsetWidth/2]});
break
}this.step++;
case 3:this.bottom.setStyles({top:(this.top+this.center.clientHeight)+"px",width:this.contents.style.width,marginLeft:this.center.style.marginLeft,display:""});
if(this.wizardMode){this.scanAnchors(this.contents,true)
}if(this.wizardMode){this.scanForms(this.contents,true)
}this.fx.contents.custom(0,1);
break;
case 4:if(this.options.animateCaption){this.fx.bottom.custom({opacity:[0,1],height:[0,this.bottom.scrollHeight]});
break
}this.bottom.setStyles({opacity:"1",height:this.bottom.scrollHeight+"px"});
case 5:this.step=0
}},keyboardListener:function(event){if((event.control&&event.key=="w")||(event.control&&event.key=="x")||(event.key=="esc")){this.close();
event.stop()
}},close:function(){$(document).cloneEvents(this.eventContainer,"keydown");
this.eventContainer.removeEvents("keydown");
if(this.step<0){return 
}this.step=-1;
for(var f in this.fx){this.fx[f].clearTimer()
}this.center.style.display=this.bottom.style.display="none";
this.center.className="mb_loading";
this.fx.overlay.chain(this.setup.pass(false,this)).custom(0);
this.overlayDiv.style.display="none";
return false
},config:function(options){this.options=Object.extend(this.options,options||{});
return false
}};
Window.onDomReady(MOOdalBox.init.bind(MOOdalBox));
function displayLoading(){$("headerLoading").style.visibility="visible"
};var RUZEE=window.RUZEE||{};
RUZEE.ShadedBorder={create:function(opts){var isie=/msie/i.test(navigator.userAgent)&&!window.opera;
function sty(el,h){for(k in h){if(/ie_/.test(k)){if(isie){el.style[k.substr(3)]=h[k]
}}else{el.style[k]=h[k]
}}}function crdiv(h){var el=document.createElement("div");
el.className="sb-gen";
sty(el,h);
return el
}function op(v){v=v<0?0:v;
v=v>0.99999?0.99999:v;
if(isie){return" filter:alpha(opacity="+(v*100)+");"
}else{return" opacity:"+v+";"
}}var sr=opts.shadow||0;
var r=opts.corner||0;
var bor=0;
var bow=opts.border||0;
var shadow=sr!=0;
var lw=r>sr?r:sr;
var rw=lw;
var th=lw;
var bh=lw;
if(bow>0){bor=r;
r=r-bow
}var cx=r!=0&&shadow?Math.round(lw/3):0;
var cy=cx;
var cs=Math.round(cx/2);
var iclass=r>0?"sb-inner":"sb-shadow";
var sclass="sb-shadow";
var bclass="sb-border";
var edges=opts.edges||"trlb";
if(!/t/i.test(edges)){th=0
}if(!/b/i.test(edges)){bh=0
}if(!/l/i.test(edges)){lw=0
}if(!/r/i.test(edges)){rw=0
}var p={position:"absolute",left:"0",top:"0",width:lw+"px",height:th+"px",ie_fontSize:"1px",overflow:"hidden"};
var tl=crdiv(p);
delete p.left;
p.right="0";
p.width=rw+"px";
var tr=crdiv(p);
delete p.top;
p.bottom="0";
p.height=bh+"px";
var br=crdiv(p);
delete p.right;
p.left="0";
p.width=lw+"px";
var bl=crdiv(p);
var tw=crdiv({position:"absolute",width:"100%",height:th+"px",ie_fontSize:"1px",top:"0",left:"0",overflow:"hidden"});
var t=crdiv({position:"relative",height:th+"px",ie_fontSize:"1px",marginLeft:lw+"px",marginRight:rw+"px",overflow:"hidden"});
tw.appendChild(t);
var bw=crdiv({position:"absolute",left:"0",bottom:"0",width:"100%",height:bh+"px",ie_fontSize:"1px",overflow:"hidden"});
var b=crdiv({position:"relative",height:bh+"px",ie_fontSize:"1px",marginLeft:lw+"px",marginRight:rw+"px",overflow:"hidden"});
bw.appendChild(b);
var mw=crdiv({position:"absolute",top:(-bh)+"px",left:"0",width:"100%",height:"100%",overflow:"hidden",ie_fontSize:"1px"});
function corner(el,t,l){var w=l?lw:rw;
var h=t?th:bh;
var s=t?cs:-cs;
var dsb=[];
var dsi=[];
var dss=[];
var xp=0;
var xd=1;
if(l){xp=w-1;
xd=-1
}for(var x=0;
x<w;
++x){var yp=0;
var yd=1;
if(t){yp=h-1;
yd=-1
}for(var y=0;
y<h;
++y){var div='<div style="position:absolute; top:'+yp+"px; left:"+xp+"px; width:1px; height:1px; overflow:hidden;";
var xc=x-cx;
var yc=y-cy-s;
var d=Math.sqrt(xc*xc+yc*yc);
var doShadow=false;
if(r>0){if(xc<0&&yc<bor&&yc>=r||yc<0&&xc<bor&&xc>=r){dsb.push(div+'" class="'+bclass+'"></div>')
}else{if(d<bor&&d>=r-1&&xc>=0&&yc>=0){var dd=div;
if(d>=bor-1){dd+=op(bor-d);
doShadow=true
}dsb.push(dd+'" class="'+bclass+'"></div>')
}}var dd=div+" z-index:2;";
if(xc<0&&yc<r||yc<0&&xc<r){dsi.push(dd+'" class="'+iclass+'"></div>')
}else{if(d<r&&xc>=0&&yc>=0){if(d>=r-1){dd+=op(r-d);
doShadow=true
}dsi.push(dd+'" class="'+iclass+'"></div>')
}else{doShadow=true
}}}else{doShadow=true
}if(sr>0&&doShadow){d=Math.sqrt(x*x+y*y);
if(d<sr){dss.push(div+" z-index:0; "+op(1-(d/sr))+'" class="'+sclass+'"></div>')
}}yp+=yd
}xp+=xd
}el.innerHTML=dss.concat(dsb.concat(dsi)).join("")
}function mid(mw){var ds=[];
ds.push('<div style="position:relative; top:'+(th+bh)+"px; height:10000px; margin-left:"+(lw-r-cx)+"px; margin-right:"+(rw-r-cx)+'px; overflow:hidden;" class="'+iclass+'"></div>');
var dd='<div style="position:absolute; width:1px; top:'+(th+bh)+"px; height:10000px;";
for(var x=0;
x<lw-r-cx;
++x){ds.push(dd+" left:"+x+"px;"+op((x+1)/lw)+'" class="'+sclass+'"></div>')
}for(var x=0;
x<rw-r-cx;
++x){ds.push(dd+" right:"+x+"px;"+op((x+1)/rw)+'" class="'+sclass+'"></div>')
}if(bow>0){var su=" width:"+bow+'px;" class="'+bclass+'"></div>';
ds.push(dd+" left:"+(lw-bor-cx)+"px;"+su);
ds.push(dd+" right:"+(rw-bor-cx)+"px;"+su)
}mw.innerHTML=ds.join("")
}function tb(el,t){var ds=[];
var h=t?th:bh;
var dd='<div style="height:1px; overflow:hidden; position:absolute; width:100%; left:0px; ';
var s=t?cs:-cs;
for(var y=0;
y<h-s-cy-r;
++y){ds.push(dd+(t?"top:":"bottom:")+y+"px;"+op((y+1)*1/h)+'" class="'+sclass+'"></div>')
}if(y>=bow){ds.push(dd+(t?"top:":"bottom:")+(y-bow)+"px; height:"+bow+'px;" class="'+bclass+'"></div>')
}ds.push(dd+(t?"top:":"bottom:")+y+"px; height:"+(r+cy+s)+'px;" class="'+iclass+'"></div>');
el.innerHTML=ds.join("")
}corner(tl,true,true);
corner(tr,true,false);
corner(bl,false,true);
corner(br,false,false);
mid(mw);
tb(t,true);
tb(b,false);
return{render:function(el){if(typeof el=="string"){el=document.getElementById(el)
}if(el.length!=undefined){for(var i=0;
i<el.length;
++i){this.render(el[i])
}return 
}var node=el.firstChild;
while(node){var nextNode=node.nextSibling;
if(node.nodeType==1&&node.className=="sb-gen"){el.removeChild(node)
}node=nextNode
}var iel=el.firstChild;
var twc=tw.cloneNode(true);
var mwc=mw.cloneNode(true);
var bwc=bw.cloneNode(true);
el.insertBefore(tl.cloneNode(true),iel);
el.insertBefore(tr.cloneNode(true),iel);
el.insertBefore(bl.cloneNode(true),iel);
el.insertBefore(br.cloneNode(true),iel);
el.insertBefore(twc,iel);
el.insertBefore(mwc,iel);
el.insertBefore(bwc,iel);
if(isie){function resize(){twc.style.width=bwc.style.width=mwc.style.width=el.offsetWidth+"px";
mwc.firstChild.style.height=el.offsetHeight+"px"
}el.onresize=resize;
resize()
}}}
}};
document.write('<style type="text/css">.sb, .sbi, .sb *, .sbi * { position:relative;}* html .sb, * html .sbi { height:1%; }.sbi { display:inline-block; }.sb-inner { background:#ddd; }.sb-shadow { background:#000; }.sb-border { background:#bbb; }</style>');var Transcorner=new Class({setOptions:function(options){this.options=Object.extend({radius:10,borderColor:null,backgroundColor:this.el.getStyle("background-color"),transition:this.fx,onComplete:Class.empty},options||{})
},initialize:function(el,sides,options){this.el=$(el);
if(!sides||$type(sides)=="object"){options=sides||false;
sides="top, bottom"
}this.setOptions(options);
sides.split(",").each(function(side){side=side.clean().test(" ")?side.clean().split(" "):[side.trim()];
this.assemble(side[0],side[1])
},this)
},fx:function(pos){return -(Math.sqrt(1-Math.pow(pos,2))-1)
},assemble:function(vertical,horizontal){var corner;
var el=this.el;
while((el=el.getParent())&&el.getTag()!="html"&&[false,"transparent"].test(corner=el.getStyle("background-color"))){}var s=function(property,dontParse){return !dontParse?(parseInt(this.el.getStyle(property))||0):this.el.getStyle(property)
}.bind(this);
var sides={left:"right",right:"left"};
var styles={display:"block",backgroundColor:corner,zIndex:1,position:"relative",zoom:1};
for(side in sides){styles["margin-"+side]="-"+(s("padding-"+side)+s("border-"+side+"-width"))+"px"
}for(side in {top:1,bottom:1}){styles["margin-"+side]=vertical==side?"0":(s("padding-"+vertical)-this.options.radius)+"px"
}var handler=new Element("b").setStyles(styles).addClass("corner-container");
this.options.borderColor=this.options.borderColor||(s("border-"+vertical+"-width")>0?s("border-"+vertical+"-color",1):this.options.backgroundColor);
this.el.setStyle("border-"+vertical,"0").setStyle("padding-"+vertical,"0");
var stripes=[];
var borders={};
var exMargin=0;
for(side in sides){borders[side]=s("border-"+side+"-width",1)+" "+s("border-"+side+"-style",1)+" "+s("border-"+side+"-color",1)
}for(var i=1;
i<this.options.radius;
i++){margin=Math.round(this.options.transition((this.options.radius-i)/this.options.radius)*this.options.radius);
var styles={background:i==1?this.options.borderColor:this.options.backgroundColor,display:"block",height:"1px",overflow:"hidden",zoom:1};
for(side in sides){var check=horizontal==sides[side];
styles["border-"+side]=check?borders[side]:(((exMargin||margin)-margin)||1)+"px solid "+this.options.borderColor;
styles["margin-"+side]=check?0:margin+"px"
}exMargin=margin;
stripes.push(new Element("b").setStyles(styles).addClass("corner"))
}if(vertical=="top"){this.el.insertBefore(handler,this.el.firstChild)
}else{handler.injectInside(this.el);
stripes=stripes.reverse()
}stripes.each(function(stripe){stripe.injectInside(handler)
});
this.options.onComplete()
}});
Element.extend({makeRounded:function(side,options){return new Transcorner(this,side,options)
}});Fx.Overlay=new Class({options:{styles:{position:"absolute",top:0,left:0}},initialize:function(element,props,tag){this.element=$(element);
this.setOptions(props);
if([window,$(document.body)].contains(this.element)){this.padding=Fx.Overlay.windowPadding;
this.container=$(document.body);
this.element=window
}else{this.padding={x:0,y:0};
this.container=this.element
}this.overlay=new Element($pick(tag,"div"),{styles:{display:"none"}}).inject(this.container);
this.update()
},show:function(){this.overlay.setStyle("display","block");
return this
},update:function(props){this.overlay.set($merge(this.options,{styles:{width:this.element.getScrollWidth()-this.padding.x,height:this.element.getScrollHeight()-this.padding.y}},props));
return this
},hide:function(){this.overlay.setStyle("display","none");
return this
},destroy:function(){this.overlay.remove(true);
return this
}});
Fx.Overlay.implement(new Options);
Fx.Overlay.windowPadding=(window.ie6)?{x:21,y:4}:{x:0,y:0};
Element.$overlay=function(hide,deltaZ){deltaZ=$pick(deltaZ,1);
if(!this.fixOverlayElement){this.fixOverlayElement=new Element("iframe",{properties:{frameborder:"0",scrolling:"no",src:"javascript:void(0);"},styles:{position:this.getStyle("position"),border:"none",filter:"progid:DXImageTransform.Microsoft.Alpha(opacity=0)"}}).injectBefore(this)
}if(hide){return this.fixOverlayElement.setStyle("display","none")
}var z=this.getStyle("z-index").toInt()||0;
if(z<deltaZ){this.setStyle("z-index",""+(z=deltaZ+1))
}var pos=this.getCoordinates();
return this.fixOverlayElement.setStyles({display:"","z-index":""+(z-deltaZ),left:pos.left+"px",top:pos.top+"px",width:pos.width+"px",height:pos.height+"px"})
};
Element.extend({fixOverlay:window.ie6?Element.$overlay:function(){return false
},remove:function(trash){if(this.fixOverlayElement){this.fixOverlayElement.remove();
if(trash){Garbage.trash([this.fixOverlayElement])
}}this.parentNode.removeChild(this);
if(trash){Garbage.trash([this.empty()]);
return false
}return this
}});
Drag.Transition={linear:{step:function(start,current,direction){return direction*current-start
},inverse:function(start,current,direction){return(start+current)/direction
}}};
Drag.Multi=Drag.Base.extend({options:{handle:false,onStart:Class.empty,onBeforeStart:Class.empty,onComplete:Class.empty,onDrag:Class.empty,snap:6},elementOptions:{unit:"px",direction:1,limit:false,grid:false,bind:false,fn:Drag.Transition.linear},initialize:function(options){this.setOptions(options);
this.handle=$(this.options.handle);
this.element=[];
this.mouse={start:{},now:{}};
this.modifiers={};
this.bound={start:this.start.bindWithEvent(this),check:this.check.bindWithEvent(this),drag:this.drag.bindWithEvent(this),stop:this.stop.bind(this)};
this.attach();
if(this.options.initialize){this.options.initialize.call(this)
}},add:function(el,options,bind){el=$(el);
if(!$defined(bind)){bind={}
}var result={};
for(var z in options){if($type(options[z])!="object"||!$defined(options[z].style)){continue
}if(!$defined(this.modifiers[z])){this.modifiers[z]=[]
}var mod=$merge(this.elementOptions,options[z],{modifier:z,element:el,bind:false,binded:false});
if(bind[z]){mod.bind=bind[z];
mod.bind.binded=true
}var sign=mod.style.slice(0,1);
if(sign=="-"||sign=="+"){mod.direction=(sign+1).toInt();
mod.style=mod.style.slice(1)
}this.modifiers[z].push(mod);
result[z]=mod
}if(!this.element.contains(el)){this.element.push(el)
}return result
},remove:function(el){el=$(el);
for(var z in this.modifiers){this.modifiers[z]=this.modifiers[z].filter(function(e){return el!=e.element
})
}this.element.remove(el);
return this
},detach:function(mod){for(var z in mod){if($type(mod[z])=="object"&&!mod[z].binded){this.modifiers[z].remove(mod[z])
}}return this
},start:function(event){this.fireEvent("onBeforeStart",this.element);
this.mouse.start=event.page;
for(var z in this.modifiers){var mouse=this.mouse.start[z];
this.modifiers[z].each(function(mod){mod.now=mod.element.getStyle(mod.style).toInt();
mod.start=mod.fn.step(mod.now,mouse,mod.direction,true);
mod.$limit=[];
var limit=mod.limit;
if(limit){for(var i=0;
i<2;
i++){if($chk(limit[i])){mod.$limit[i]=($type(limit[i])=="function")?limit[i](mod):limit[i]
}}}},this)
}document.addListener("mousemove",this.bound.check);
document.addListener("mouseup",this.bound.stop);
this.fireEvent("onStart",this.element);
event.stop()
},modifierUpdate:function(mod){var z=mod.modifier,mouse=this.mouse.now[z];
mod.out=false;
mod.now=mod.fn.step(mod.start,mod.bind?mod.bind.inverse:mouse,mod.direction);
if(mod.$limit&&$chk(mod.$limit[1])&&(mod.now>mod.$limit[1])){mod.now=mod.$limit[1];
mod.out=true
}else{if(mod.$limit&&$chk(mod.$limit[0])&&(mod.now<mod.$limit[0])){mod.now=mod.$limit[0];
mod.out=true
}}if(mod.grid){mod.now-=((mod.now+mod.grid/2)%mod.grid)-mod.grid/2
}if(mod.binded){mod.inverse=mod.fn.inverse(mod.start,mod.now,mod.direction)
}mod.element.setStyle(mod.style,mod.now+mod.unit)
},drag:function(event){this.mouse.now=event.page;
for(var z in this.modifiers){this.modifiers[z].each(this.modifierUpdate,this)
}this.fireEvent("onDrag",this.element);
event.stop()
}});
Drag.Multi.$direction={east:{x:1},west:{x:-1},north:{y:-1},south:{y:1},nw:{x:-1,y:-1},ne:{x:1,y:-1},sw:{x:-1,y:1},se:{x:1,y:1}};
Drag.Resize=new Class({options:{zIndex:10000,moveLimit:false,resizeLimit:{x:[0],y:[0]},grid:false,modifiers:{x:"left",y:"top",width:"width",height:"height"},container:null,preserveRatio:false,ghost:false,snap:6,direction:Drag.Multi.$direction,limiter:{x:{"-1":["left","right"],"1":["right","left"]},y:{"-1":["top","bottom"],"1":["bottom","top"]}},moveLimiter:{x:["left","right"],y:["top","bottom"]},ghostClass:"ghost-sizer sizer-visible",classPrefix:"sizer sizer-",hoverClass:"sizer-visible",shadeBackground:"transparent url(s.gif)",onBuild:Class.empty,onBeforeStart:Class.empty,onStart:Class.empty,onSnap:Class.empty,onResize:Class.empty,onComplete:Class.empty},initialize:function(el,options){var self=this;
this.element=this.el=$(el);
this.fx={};
this.binds={};
this.bound={};
this.setOptions(options);
this.options.container=this.options.container===null?this.el.getParent():$(this.options.container);
if($type(this.options.direction)=="string"){if(dir=="all"){this.options.direction=Drag.Multi.$direction
}else{var dir=this.options.direction.split(/\s+/);
this.options.direction={};
dir.each(function(d){this[d]=Drag.Multi.$direction[d]
},this.options.direction)
}}var ce=this.el.getCoordinates(),positionStyle=this.el.getStyle("position");
this.el.setStyles({width:ce.width,height:ce.height});
if(this.options.container){if(!(["relative","fixed"].contains(positionStyle))){var cc=this.options.container.getCoordinates();
this.el.setStyles({left:ce.left-cc.left,top:ce.top-cc.top})
}this.options.moveLimit=$merge({x:[0],y:[0]},this.options.moveLimit)
}if(this.options.preserveRatio){var R=ce.width/ce.height;
var rlim=self.options.resizeLimit;
var fix=function(z1,z2,op,no,coeff){if(rlim&&rlim[z1]&&rlim[z2]&&rlim[z1][no]&&rlim[z2][no]){rlim[z1][no]=Math[op](rlim[z1][no],coeff*rlim[z2][no])
}};
fix("x","y","max",0,R);
fix("y","x","max",0,1/R);
fix("x","y","min",1,R);
fix("y","x","min",1,1/R);
this.aspectStep={x:{step:function(s,c,d){return d*c/R-s
}},y:{step:function(s,c,d){return d*c*R-s
}}};
this.options.direction=$merge(this.options.direction);
["nw","ne","sw","se"].each(function(z){delete this[z]
},this.options.direction)
}if(this.options.ghost){this.ghost=new Element("div",{"class":this.options.ghostClass,styles:{display:"none"}}).injectAfter(this.el);
for(var d in this.options.direction){this.ghost.adopt(new Element("div",{"class":this.options.classPrefix+d}))
}}var rOpts={snap:this.options.snap,onBeforeStart:function(){self.fireEvent("onBeforeStart",this);
self.started=true;
this.shade=new Fx.Overlay(window,{styles:{position:positionStyle,cursor:this.options.handle.getStyle("cursor"),background:self.options.shadeBackground,"z-index":self.options.zIndex+1}}).show();
if(self.ghost){var ce=self.el.getCoordinates();
self.ghost.setStyles({display:"block","z-index":self.options.zIndex,left:self.el.getStyle("left"),top:self.el.getStyle("top"),width:ce.width,height:ce.height});
for(var z in this.modifiers){this.modifiers[z].each(function(mod){if(mod.element===self.ghost){mod.element.setStyle(mod.style,self.el.getStyle(mod.style))
}})
}if(self.options.hoverClass){self.el.removeClass(self.options.hoverClass)
}}},onSnap:function(){self.fireEvent("onSnap",this)
},onStart:function(){self.fireEvent("onStart",this)
},onDrag:function(){self.fireEvent("onResize",this)
},onComplete:function(){self.started=false;
if(self.options.hoverClass){self.el.removeClass(self.options.hoverClass)
}this.shade.destroy();
if(self.ghost){for(var z in this.modifiers){this.modifiers[z].each(function(mod){if(mod.element===self.ghost){self.el.setStyle(mod.style,mod.now+mod.unit)
}})
}self.ghost.setStyle("display","none")
}self.fireEvent("onComplete",this)
}};
var rlimitFcn=function(sign,props,limit){if(!self.options.container){return limit
}if(!limit){limit=[0]
}var generator=function(lim){return function(mod){var cc=self.options.container.getCoordinates(),ec=mod.element.getCoordinates();
var value=sign*(cc[props[0]]-ec[props[1]]);
switch($type(lim)){case"number":return Math.min(value,lim);
case"function":return Math.min(value,lim(mod));
default:return value
}}
};
return[limit[0],generator(limit[1])]
};
var mlimitFcn=function(props,limit,rlimit){var container=self.options.container;
var generator=function(lim,rlim,op,rdef){if(!$type(rlim)){rlim=rdef
}var lim_type=$type(lim);
if(rlim===null){return lim_type=="function"?lim:function(){return lim
}
}return function(mod){var cc=container.getCoordinates(),ec=mod.element.getCoordinates();
var value=ec[props[1]]-cc[props[0]]-rlim;
switch(lim_type){case"number":return Math[op](value,lim);
case"function":return Math[op](value,lim(mod));
default:return value
}}
};
if(!container){if(!limit){limit=false
}container=self.el.getParent()
}else{if(!limit){limit=[0]
}}return[generator(limit[0],rlimit[1],"max",null),generator(limit[1],rlimit[0],"min",limit[1])]
};
var opt=this.options,el=this.ghost?this.ghost:this.el;
if($type(opt.grid)=="number"){opt.grid={x:opt.grid,y:opt.grid}
}for(var d in opt.direction){var mod=opt.direction[d];
rOpts.handle=new Element("div",{"class":opt.classPrefix+d});
var drag=this.fx[d]=new Drag.Multi(rOpts);
var resizeLimit={x:rlimitFcn(mod.x,opt.limiter.x[""+mod.x],opt.resizeLimit.x),y:rlimitFcn(mod.y,opt.limiter.y[""+mod.y],opt.resizeLimit.y)};
var moveOpts={};
for(var z in mod){if(mod[z]<0){moveOpts[z]={limit:mlimitFcn(opt.moveLimiter[z],opt.moveLimit[z],opt.resizeLimit[z]),style:opt.modifiers[z],grid:opt.grid.x}
}}var binds={move:drag.add(el,moveOpts)},resize={opts:{},bind:{}};
this.binds[d]=binds;
if($defined(mod.x)){resize.opts.x={limit:mod.x<0?false:resizeLimit.x,grid:mod.x<0?false:opt.grid.x,style:opt.modifiers.width,direction:mod.x};
if(mod.x<0){resize.bind.x=binds.move.x
}}if($defined(mod.y)){resize.opts.y={limit:mod.y<0?false:resizeLimit.y,grid:mod.y<0?false:opt.grid.y,style:opt.modifiers.height,direction:mod.y};
if(mod.y<0){resize.bind.y=binds.move.y
}}binds.resize=drag.add(el,resize.opts,resize.bind);
if(opt.preserveRatio){var aspect={x:{fn:this.aspectStep.x,style:($defined(mod.x))?opt.modifiers.height:null,direction:mod.x},y:{fn:this.aspectStep.y,style:($defined(mod.y))?opt.modifiers.width:null,direction:mod.y}};
binds.aspect=drag.add(el,aspect,binds.resize)
}this.fireEvent("onBuild",[d,binds])
}this.bound=(!this.options.hoverClass)?{}:{mouseenter:function(ev){this.addClass(self.options.hoverClass)
},mouseleave:function(ev){if(!self.started){this.removeClass(self.options.hoverClass)
}}};
this.attach();
if(this.options.initialize){this.options.initialize()
}},add:function(callback){for(var d in this.options.direction){callback.call(this,d,this.binds[d])
}},attach:function(){$each(this.bound,function(fn,ev){this.addEvent(ev,fn)
},this.el);
for(var z in this.fx){this.element.adopt(this.fx[z].handle)
}return this
},detach:function(){$each(this.bound,function(fn,ev){this.removeEvent(ev,fn)
},this.el);
for(var z in this.fx){this.fx[z].handle.remove()
}return this
},stop:function(){this.detach();
var garbage=[this.ghost];
for(var z in this.fx){garbage.push(this.fx[z].handle)
}Garbage.trash(garbage);
this.fx=this.bound=this.binds={}
}});
Drag.Resize.implement(new Events,new Options);
Element.extend({makeResizable:function(options){options=options||{};
if(options.handle){return new Drag.Base(this,$merge({modifiers:{x:"width",y:"height"}},options))
}return new Drag.Resize(this,options)
}});
Drag.ResizeImage=new Class({initialize:function(el,options){this.image=$(el);
this.styles=this.image.getStyles("position","top","left","right","bottom","z-index","margin");
if(!["absolute","fixed","relative"].contains(this.styles.position)){this.styles.position="relative"
}this.wrapper=new Element("div",{styles:$merge(this.styles,{width:this.image.offsetWidth,height:this.image.offsetHeight})}).injectBefore(this.image).adopt(this.image.remove().setStyles({position:"absolute",top:"0",left:"0",margin:"0",width:"100%",height:"100%",zIndex:"0"}));
this.fx=new Drag.Resize(this.wrapper,$merge({preserveRatio:true},options))
},stop:function(){this.image.setStyles($merge(this.styles,{width:this.wrapper.getStyle("width"),height:this.wrapper.getStyle("height")})).remove().injectBefore(this.wrapper);
this.fx=null;
this.wrapper.remove(true)
}});
var Windoo=new Class({options:{type:"dom",url:false,title:"Windoo!",width:300,height:200,position:"center",top:0,left:0,resizable:true,draggable:true,positionStyle:"absolute",resizeLimit:{x:[0],y:[0]},padding:{top:0,right:0,bottom:0,left:0},ghost:{resize:false,move:false},snap:{resize:6,move:6},destroyOnClose:true,container:null,restrict:true,theme:"alphacube",shadow:true,modal:false,buttons:{menu:false,close:true,minimize:true,roll:false,maximize:true},"class":"",wm:false,effects:{show:{options:{duration:600},styles:{opacity:[0,1]}},close:{options:{duration:600},styles:{opacity:[1,0]}},hide:{options:{duration:600},styles:{opacity:[1,0]}}},onFocus:Class.empty,onBlur:Class.empty,onClose:Class.empty,onDestroy:Class.empty,onHide:Class.empty,onShow:Class.empty,onMaximize:Class.empty,onMinimize:Class.empty,onRestore:Class.empty,onBeforeDrag:Class.empty,onStartDrag:Class.empty,onDrag:Class.empty,onDragComplete:Class.empty,onBeforeResize:Class.empty,onStartResize:Class.empty,onResize:Class.empty,onResizeComplete:Class.empty},makeResizable:Class.empty,makeDraggable:Class.empty,initialize:function(options){var self=this;
this.fx={};
this.bound={};
this.padding={};
this.panels=[];
this.zIndex=0;
this.visible=false;
this.options.id="windoo-"+(new Date().getTime());
this.setOptions(options);
var theme=this.theme=$type(this.options.theme)=="string"?Windoo.Themes[this.options.theme]:this.options.theme;
this.options.container=$(this.options.container||document.body);
for(var side in theme.padding){this.padding[side]=theme.padding[side]+this.options.padding[side]
}["x","y"].each(function(z){var lim=this.options.resizeLimit;
if($type(lim[z][0])=="number"){lim[z][0]=Math.max(lim[z][0],theme.resizeLimit[z][0])
}},this);
this.buildDOM().setSize(this.options.width,this.options.height).setTitle(this.options.title).fix();
if(this.options.position=="center"){this.positionAtCenter()
}this.minimized=false;
if(this.options.draggable){this.makeDraggable()
}if(this.options.resizable){this.makeResizable()
}this.wm=this.options.wm||Windoo.$wm;
this.wm.register(this)
},buildDOM:function(){var theme=this.theme,_p=theme.classPrefix;
this.el=new Element("div",{id:this.options.id,"class":theme.className,styles:{position:this.options.positionStyle,overflow:"hidden",visibility:"hidden",top:this.options.top,left:this.options.left},events:{mousedown:this.focus.bind(this)}});
if(this.options["class"]){this.el.addClass(this.options["class"])
}var $row=function(prefix,contentClass){return'<div class="'+prefix+"-left "+_p+'-drag"><div class="'+prefix+'-right"><div class="'+contentClass+'"></div></div></div>'
};
var iefix=window.ie&&this.options.type!="iframe",innerContent='<div class="'+_p+'-frame">'+$row("top","title")+$row("bot","strut")+'</div><div class="'+_p+'-body">'+(iefix?Windoo.ieTableCell:"")+"</div>";
this.el.setHTML(innerContent).inject(this.options.container);
if(window.ie){this.el.addClass(_p+"-"+theme.name+"-ie")
}var frame=this.el.getFirst(),body=this.el.getLast(),title=frame.getElement(".title"),titleText=new Element("div",{"class":"title-text"}).inject(title);
this.dom={frame:frame,body:body,title:titleText,strut:frame.getElement(".strut").setHTML("&nbsp;"),content:iefix?body.getElement("td"):body};
this.dom.title.addEvent("dblclick",this.maximize.bind(this));
if(this.options.type=="iframe"){this.dom.iframe=new Element("iframe",{frameborder:"0","class":_p+"-body",styles:{width:"100%",height:"100%"}});
this.dom.body.setStyle("overflow","hidden");
this.adopt(this.dom.iframe).setURL(this.options.url)
}return this.buildShadow().buildButtons()
},buildButtons:function(){var self=this,buttons=this.options.buttons,_p=this.theme.classPrefix;
var action=function(name,bind){return function(ev){new Event(ev).stop();
(bind[name])()
}
};
this.bound.noaction=function(ev){new Event(ev).stop()
};
var makeButton=function(opt,name,title,action){self.bound[name]=action;
if(opt){var klass=_p+"-button "+_p+"-"+name+(opt=="disabled"?" "+_p+"-"+name+"-disabled":"");
self.dom[name]=new Element("a",{"class":klass,href:"#",title:title}).setHTML("x").inject(self.el);
self.dom[name].addEvent("click",opt=="disabled"?self.bound.noaction:action)
}};
makeButton(buttons.close,"close","Close",action("close",this));
makeButton(buttons.maximize,"maximize","Maximize",action("maximize",this));
makeButton(buttons.minimize,"minimize","Minimize",action(buttons.roll?"roll":"minimize",this));
makeButton(buttons.minimize,"restore","Restore",action("minimize",this));
makeButton(buttons.menu,"menu","Menu",action("openmenu",this));
return this
},buildShadow:function(){var theme=this.theme;
if(this.options.modal){this.modalOverlay=new Fx.Overlay(this.el.getParent(),{"class":this.classPrefix("modal-overlay")})
}if(!theme.shadow||!this.options.shadow){return this
}this.shadow=new Element("div",{styles:{position:this.options.positionStyle,display:"none"},"class":theme.classPrefix+"-shadow-"+theme.shadow}).injectAfter(this.el);
if(theme.complexShadow){var $row=function(name){var els=["l","r","m"].map(function(e){return new Element("div",{"class":e})
});
var el=new Element("div",{"class":name});
return el.adopt.apply(el,els)
};
this.shadow.adopt($row("top"),this.dom.shm=$row("mid"),$row("bot"))
}else{this.shadow.adopt(new Element("div",{"class":"c"}))
}return this
},setHTML:function(content){if(!this.dom.iframe){this.dom.content.empty().setHTML(content)
}return this
},adopt:function(){this.dom.content.empty().adopt.apply(this.dom.content,arguments);
return this
},wrap:function(el,options){var styles={margin:"0",position:"static"};
el=$(el);
options=options||{};
var size=el.getSize().size,pos=el.getPosition(),coeff=options.ignorePadding?0:1,pad=this.padding;
this.setSize(size.x+coeff*(pad.right+pad.left),size.y+coeff*(pad.top+pad.bottom));
if(options.resetWidth){styles.width="auto"
}if(options.position){this.setPosition(pos.x-coeff*pad.left,pos.y-coeff*pad.top)
}this.dom.content.empty().adopt(el.remove().setStyles(styles));
return this
},empty:function(){if(this.dom.iframe){this.dom.iframe.src="about:blank"
}else{this.dom.content.empty()
}return this
},setURL:function(url){if(this.dom.iframe){this.dom.iframe.src=url||"about:blank"
}return this
},getContent:function(){return this.dom.content
},setTitle:function(title){this.dom.title.setHTML(title||"&nbsp;");
return this
},effect:function(name,noeffect,onComplete){opts={onComplete:onComplete};
if(noeffect){opts.duration=0
}var fx=this.options.effects[name];
new Fx.Styles(fx.el||this.el,$merge(fx.options,opts)).start(fx.styles);
if(this.shadow){new Fx.Styles(this.shadow,fx.options).start(fx.styles)
}return this
},hide:function(noeffect){if(!this.visible){return this
}this.visible=false;
return this.effect("hide",noeffect,function(){this.el.setStyle("display","none");
if(this.modalOverlay){this.modalOverlay.hide()
}this.fix(true).fireEvent("onHide")
}.bind(this))
},show:function(noeffect){if(this.visible){return this
}this.visible=true;
if(this.modalOverlay){this.modalOverlay.show()
}this.el.setStyle("display","");
this.bringTop().fix();
if(this.shadow){this.shadow.setStyle("visibility","hidden")
}return this.effect("show",noeffect,function(){this.el.setStyle("visibility","visible");
this.fireEvent("onShow").fix()
}.bind(this))
},fix:function(hide){this.el.fixOverlay(hide||!this.visible);
return this.fixShadow(hide)
},fixShadow:function(hide){if(this.shadow){this.shadow[(this.maximized?"add":"remove")+"Class"]("windoo-shadow-"+this.theme.name+"-maximized");
if(hide||!this.visible){this.shadow.setStyle("display","none")
}else{var pos=this.el.getCoordinates(),pad=this.theme.shadowDisplace;
this.shadow.setStyles({display:"",zIndex:this.zIndex-1,left:this.el.offsetLeft+pad.left,top:this.el.offsetTop+pad.top,width:pos.width+pad.width,height:pos.height+pad.height});
if(this.dom.shm){this.dom.shm.setStyle("height",pos.height-pad.delta)
}}}return this
},getState:function(){var outer=this.el.getCoordinates(),container=this.options.container,cont=container===$(document.body)?{top:0,left:0}:container.getCoordinates();
outer.top-=cont.top;
outer.right-=cont.left;
outer.bottom-=cont.top;
outer.left-=cont.left;
return{outer:outer,inner:this.dom.content.getSize()}
},setSize:function(width,height){var pad=this.padding;
this.el.setStyles({width:width,height:height});
this.dom.strut.setStyle("height",Math.max(0,height-pad.top));
this.dom.body.setStyle("height",Math.max(0,height-pad.top-pad.bottom));
return this.fix().fireEvent("onResizeComplete",this.fx.resize)
},positionAtCenter:function(offset){offset=$merge({x:0,y:0},offset);
var container=this.options.container;
if(container===document.body){container=window
}var s=container.getSize(),esize=this.el.getSize().size,fn=function(z){return Math.max(0,offset[z]+s.scroll[z]+(s.size[z]-esize[z])/2)
};
this.el.setStyles({left:fn("x"),top:fn("y")});
return this.fix()
},setPosition:function(x,y){this.el.setStyles({left:x,top:y});
return this.fix()
},preventClose:function(prevent){this.$preventClose=$defined(prevent)?prevent:true;
return this
},close:function(noeffect){this.$preventClose=false;
this.fireEvent("onBeforeClose");
if(this.$preventClose){return this
}if(!this.visible){return this
}this.visible=false;
return this.effect("close",noeffect,function(){this.el.setStyle("display","none");
if(this.modalOverlay){this.modalOverlay.hide()
}this.fix(true).fireEvent("onClose");
if(this.options.destroyOnClose){this.destroy()
}}.bind(this))
},destroy:function(){this.fireEvent("onDestroy");
this.wm.unregister(this);
if(this.modalOverlay){this.modalOverlay.destroy()
}if(this.shadow){this.shadow.remove(true)
}this.el.remove(true);
for(var z in this){this[z]=null
}this.destroyed=true
},classPrefix:function(klass){return[this.theme.classPrefix,this.theme.name,klass+" "+this.theme.classPrefix,klass].join("-")
},maximize:function(noeffect){if(this.minimized){return this.minimize()
}if(this.rolled){this.roll(true)
}var bound=function(value,limit){if(!limit){return value
}if(value<limit[0]){return limit[0]
}if(limit.length>1&&value>limit[1]){return limit[1]
}return value
};
var klass=this.classPrefix("maximized");
this.maximized=!this.maximized;
this.minimized=false;
if(this.maximized){this.$restoreMaxi=this.getState();
var container=this.options.container;
if(container===document.body){container=window
}var s=container.getSize(),limit=this.options.resizeLimit;
if(limit){for(var z in limit){s.size[z]=bound(s.size[z],limit[z])
}}this.el.addClass(klass);
this.setSize(s.size.x,s.size.y).setPosition(s.scroll.x,s.scroll.y).fireEvent("onMaximize")
}else{this.el.removeClass(klass);
this.restoreState(this.$restoreMaxi).fireEvent("onRestore","maximize")
}return this.fix()
},minimize:function(noeffect){var klass=this.classPrefix("minimized");
this.minimized=!this.minimized;
if(this.minimized){this.$restoreMini=this.getState();
var container=this.options.container;
if(container===document.body){container=window
}var s=container.getSize(),height=this.theme.padding.top+this.theme.padding.bottom;
this.el.addClass(klass);
this.setSize("auto",height).setPosition(s.scroll.x+10,s.scroll.y+s.size.y-height-10).fireEvent("onMinimize")
}else{this.el.removeClass(klass);
this.restoreState(this.$restoreMini).fireEvent("onRestore","minimize")
}return this.fix()
},restoreState:function(state){state=state.outer;
return this.setSize(state.width,state.height).setPosition(state.left,state.top)
},roll:function(noeffect){var klass=this.classPrefix("rolled");
this.rolled=!this.rolled;
if(this.rolled){this.$restoreRoll=this.getState().outer;
var pad=this.theme.padding;
this.setSize(this.$restoreRoll.width,pad.top+pad.bottom);
this.el.addClass(klass);
this.fireEvent("onRoll")
}else{this.el.removeClass(klass);
var state=this.$restoreRoll;
this.setSize(state.width,state.height).fireEvent("onRestore","roll")
}return this.fix()
},openmenu:function(){this.fireEvent("onMenu");
return this
},setZIndex:function(z){this.zIndex=z;
this.el.setStyle("zIndex",z);
if(this.el.fixOverlayElement){this.el.fixOverlayElement.setStyle("zIndex",z-1)
}if(this.shadow){this.shadow.setStyle("zIndex",z-1)
}if(this.fx.resize){this.fx.resize.options.zIndex=z+1
}if(this.modalOverlay){this.modalOverlay.overlay.setStyle("zIndex",z-2)
}return this
},focus:function(){this.el.removeClass(this.theme.classPrefix+"-blur");
this.wm.focus(this);
return this
},blur:function(){this.el.addClass(this.theme.classPrefix+"-blur");
if(this.wm.blur(this)){this.fireEvent("onBlur")
}return this
},bringTop:function(){return this.setZIndex(this.wm.maxZIndex())
}});
Windoo.implement(new Events,new Options);
Windoo.ieTableCell='<table style="position:absolute;top:0;left:0;border:none;border-collapse:collapse;padding:0;"><tr><td style="border:none;overflow:auto;position:relative;padding:0;"></td></tr></table>';
Windoo.Themes={cssFirefoxMac:".windoo-blur * {overflow: hidden !important;}",alphacube:{name:"alphacube",padding:{top:22,right:10,bottom:15,left:10},resizeLimit:{x:[275],y:[37]},className:"windoo windoo-alphacube",sizerClass:"sizer",classPrefix:"windoo",ghostClass:"windoo-ghost windoo-alphacube-ghost windoo-hover",hoverClass:"windoo-hover",shadow:"simple window-shadow-alphacube-simple",shadeBackground:"transparent url(windoo/s.gif)",shadowDisplace:{left:3,top:3,width:0,height:0}}};
if(window.gecko&&navigator.appVersion.indexOf("acintosh")>=0){window.addEvent("domready",function(){new Element("style",{type:"text/css",media:"all"}).inject(document.head).appendText(Windoo.Themes.cssFirefoxMac)
})
}Windoo.Manager=new Class({focused:false,options:{zIndex:100,onRegister:Class.empty,onUnregister:Class.empty,onFocus:Class.empty,onBlur:Class.empty},initialize:function(options){this.hash=[];
this.setOptions(options)
},maxZIndex:function(){var windows=this.hash;
if(!windows.length){return this.options.zIndex
}var zindex=[];
windows.each(function(item){this.push(item.zIndex)
},zindex);
zindex.sort(function(a,b){return a-b
});
return zindex.getLast()+3
},register:function(win){win.setZIndex(this.maxZIndex());
this.hash.push(win);
return this.fireEvent("onRegister",win)
},unregister:function(win){this.hash.remove(win);
if(this.focused===win){this.focused=false
}return this.fireEvent("onUnregister",win)
},focus:function(win){var idx=this.hash.indexOf(win);
if(idx===this.focused){return this
}if(this.focused){this.focused.blur()
}this.focused=win;
win.bringTop(this.maxZIndex());
return this.fireEvent("onFocus",win)
},blur:function(win){if(this.focused===win){this.focused=false;
this.fireEvent("onBlur",win);
return true
}return false
}});
Windoo.Manager.implement(new Events,new Options);
Windoo.$wm=new Windoo.Manager();
Windoo.implement({makeResizable:function(){var self=this,theme=this.theme,opt=this.options,inbody=opt.container===$(document.body);
this.fx.resize=this.el.makeResizable({ghostClass:theme.ghostClass,hoverClass:theme.hoverClass,classPrefix:theme.classPrefix+"-sizer "+theme.classPrefix+"-",shadeBackground:theme.shadeBackground,container:(opt.restrict&&!inbody)?opt.container:false,resizeLimit:opt.resizeLimit,ghost:opt.ghost.resize,snap:opt.snap.resize,onBeforeStart:function(){self.fireEvent("onBeforeResize",this).focus()
},onStart:function(fx){if(self.maximized){fx.stop()
}else{if(!this.ghost&&window.gecko){Element.$overlay.call(fx.shade.overlay)
}self.fireEvent("onStartResize",this)
}},onResize:function(){self.fireEvent("onResize",this)
},onComplete:function(){if(this.ghost){var size=self.getState().outer;
self.setSize(size.width,size.height)
}else{self.fix().fireEvent("onResizeComplete",this)
}},onBuild:function(dir,binds){if(!this.ghost){var fx=this.fx[dir],nolimit={x:{limit:false},y:{limit:false}};
if(binds.resize.y){["strut","body","shm"].each(function(name){if(this[name]){fx.add(this[name],{y:{direction:binds.resize.y.direction,style:"height"}},binds.resize)
}},self.dom)
}[self.shadow,self.el.fixOverlayElement].each(function(el){if(el){fx.add(el,$merge(binds.resize,nolimit),binds.resize);
if(binds.move){fx.add(el,$merge(binds.move,nolimit),binds.move)
}}},self)
}}})
},makeDraggable:function(){var self=this,fx=this.fx.drag=[],inbody=this.options.container===$(document.body);
var xLimit=function(){return 2-self.el.offsetWidth
};
var opts={container:(this.options.restrict&&!inbody?this.options.container:null),limit:(inbody?{x:[xLimit],y:[0]}:{}),snap:this.options.snap.move,onBeforeStart:function(){self.focus();
this.shade=new Fx.Overlay(window,{styles:{cursor:this.options.handle.getStyle("cursor"),background:self.theme.shadeBackground,zIndex:self.zIndex+3}}).show();
if(self.ghost){var ce=self.el.getSize().size;
this.element.setStyles({zIndex:self.zIndex+3,left:self.el.getStyle("left"),top:self.el.getStyle("top"),width:ce.x,height:ce.y})
}else{if(window.gecko){Element.$overlay.call(this.shade.overlay,false,2)
}}self.fireEvent("onBeforeDrag",this)
},onStart:function(){if(self.maximized&&!self.minimized){this.stop()
}else{self.fireEvent("onStartDrag",this)
}},onSnap:function(){if(self.ghost){this.element.setStyle("display","block")
}},onDrag:function(){self.fix().fireEvent("onDrag",this)
},onComplete:function(){this.shade.destroy();
if(self.ghost){for(var z in this.options.modifiers){var style=this.options.modifiers[z];
self.el.setStyle(style,this.element.getStyle(style))
}this.element.setStyle("display","none")
}self.fix().fireEvent("onDragComplete",this)
}};
if(this.options.ghost.move){this.ghost=new Element("div",{"class":this.theme.ghostClass,styles:{display:"none"}}).injectAfter(this.el)
}this.el.getElements("."+this.theme.classPrefix+"-drag").each(function(d){opts.handle=d;
d.setStyle("cursor","move");
fx.push((this.ghost||this.el).makeDraggable(opts))
},this)
}});
Windoo.Themes.aero={name:"aero",padding:{top:28,right:10,bottom:15,left:10},resizeLimit:{x:[175],y:[58]},className:"windoo windoo-aero",sizerClass:"sizer",classPrefix:"windoo",ghostClass:"windoo-ghost windoo-aero-ghost windoo-hover",hoverClass:"windoo-hover",shadow:"simple window-shadow-aero-simple",shadeBackground:"transparent url(windoo/s.gif)",shadowDisplace:{left:3,top:3,width:0,height:0}};
Windoo.Themes.wise={name:"wise",padding:{top:28,right:10,bottom:15,left:10},resizeLimit:{x:[175],y:[58]},className:"windoo windoo-wise",sizerClass:"sizer",classPrefix:"windoo",ghostClass:"windoo-ghost windoo-wise-ghost windoo-hover",hoverClass:"windoo-hover"};
Windoo.Themes.aqua={name:"aqua",padding:{top:23,right:0,bottom:15,left:0},resizeLimit:{x:[275],y:[37]},className:"windoo windoo-aqua",sizerClass:"sizer",classPrefix:"windoo",ghostClass:"windoo-ghost windoo-aqua-ghost windoo-hover",hoverClass:"windoo-hover",shadeBackground:"transparent url(themes/windoo/s.gif)",shadow:"aqua",complexShadow:true,shadowDisplace:{left:-13,top:-8,width:26,height:31,delta:23}};
Windoo.Ajax=Ajax.extend({onComplete:function(){if(this.options.window){this.options.window.setHTML(this.response.text)
}this.parent()
}});
Windoo.implement({addPanel:function(element,position){position=$pick(position,"bottom");
var dim,ndim,size=this.el.getSize().size,styles={position:"absolute"},panel={element:$(element),position:position,fx:[]};
switch(position){case"top":case"bottom":dim="x";
ndim="y";
break;
case"left":case"right":dim="y";
ndim="x";
break;
default:return this
}var options=Windoo.panelOptions[dim];
styles[position]=this.padding[position];
styles[options.deltaP]=this.padding[options.deltaP];
element=panel.element.addClass(this.classPrefix("pane")).setStyles(styles).inject(this.el);
panel.padding=element.getSize().size[ndim];
this.padding[position]+=panel.padding;
if(this.options.resizable&&!this.options.ghost.resize){this.fx.resize.add(function(dir,binds){if(binds.resize[dim]){var fx=this.fx[dir],mod={};
mod[dim]=$merge(binds.resize[dim]);
mod[dim].limit=null;
panel.fx.push({fx:fx,bind:fx.add(panel.element,mod,binds.resize)})
}})
}this.addEvent("onResizeComplete",function(){panel.element.setStyle(options.style,this.el.getSize().size[dim]-this.padding[options.deltaM]-this.padding[options.deltaP]-1)
});
this.panels.push(panel);
return this.setSize(size.x,size.y)
},removePanel:function(element){var panel,size;
element=$(element);
for(var i=0,len=this.panels.length;
i<len;
i++){panel=this.panels[i];
if(panel.element===element){this.padding[panel.position]-=panel.padding;
panel.element.remove();
panel.fx.each(function(pfx){pfx.fx.detach(pfx.bind)
},this);
this.panels.splice(i,1);
size=this.el.getSize().size;
this.setSize(size.x,size.y);
break
}}return this
}});
Windoo.panelOptions={x:{style:"width",deltaP:"left",deltaM:"right"},y:{style:"height",deltaP:"top",deltaM:"bottom"}};
Windoo.Dialog=Windoo.extend({initialize:function(message,options){var self=this,dialog=this.dialog={dom:{},buttons:{},options:$merge(Windoo.Dialog.options,options),message:message};
this.parent($merge({onShow:function(){if(dialog.buttons.ok){dialog.buttons.ok.focus()
}}},dialog.options.window));
dialog.bound=function(ev){ev=new Event(ev);
if(["enter","esc"].contains(ev.key)){dialog.result=(ev.key=="enter")?!dialog.cancelFocused:false;
self.close();
ev.stop()
}};
document.addEvent("keydown",dialog.bound);
this.addEvent("onClose",function(){document.removeEvent("keydown",dialog.bound);
dialog.options[(dialog.result)?"onConfirm":"onCancel"].call(this)
})
},buildDialog:function(klass,buttons){var self=this,dialog=this.dialog;
if("ok" in buttons){dialog.buttons.ok=new Element("input",$merge({events:{click:function(){dialog.result=true;
self.close()
}}},dialog.options.buttons.ok))
}if("cancel" in buttons){dialog.buttons.cancel=new Element("input",$merge({events:{click:function(){dialog.result=false;
self.close()
}}},dialog.options.buttons.cancel)).addEvents({focus:function(){dialog.cancelFocused=true
},blur:function(){dialog.cancelFocused=false
}})
}dialog.dom.panel=new Element("div",$merge({"class":this.classPrefix(klass+"-pane")},dialog.options.panel));
for(var btn in buttons){if(buttons[btn]){dialog.dom.panel.adopt(dialog.buttons[btn])
}}dialog.dom.message=new Element("div",$merge({"class":this.classPrefix(klass+"-message")},dialog.options.message));
return this.addPanel(dialog.dom.panel).adopt(dialog.dom.message.setHTML(dialog.message))
}});
Windoo.Dialog.options={window:{modal:true,resizable:false,buttons:{minimize:false,maximize:false}},buttons:{ok:{properties:{type:"button",value:"OK"}},cancel:{properties:{type:"button",value:"Cancel"}}},panel:null,message:null,onConfirm:Class.empty,onCancel:Class.empty};
Windoo.Alert=Windoo.Dialog.extend({initialize:function(message,options){this.parent(message,options);
this.buildDialog("alert",{ok:true}).show()
}});
Windoo.Confirm=Windoo.Dialog.extend({initialize:function(message,options){this.parent(message,options);
this.buildDialog("confirm",{ok:true,cancel:true}).show()
}});var Menu={init:function(){$ES(".subMenu2",$("mydocs")).each(function(el){var parent=el.getParent();
var button=$E(".button",parent);
if(button.getTag()=="div"){el.setStyle("top","25px");
el.setStyle("left","7px")
}button.addEvent("click",this.updateSubMenu.bindWithEvent(this,[button,el]));
button.state="closed"
},this);
this.currentElement=null;
this.currentItem=null;
$(document).addEvent("click",this.hide.bindWithEvent(this))
},updateSubMenu:function(event,src,el){if(src.state=="open"){el.setStyle("visibility","hidden");
src.state="closed";
this.currentElement=null;
this.currentItem=null
}else{if(this.currentElement!=null){this.hide.attempt(null,this)
}this.currentElement=el;
this.currentItem=src;
el.setStyle("visibility","visible");
src.state="open"
}if(event!=null){var evt=new Event(event);
evt.stopPropagation()
}},hide:function(event){if(this.currentElement!=null){this.updateSubMenu.attempt([event,this.currentItem,this.currentElement],this)
}}};
Window.onDomReady(Menu.init.bind(Menu));var SlideShow=new Class({options:{id:"SlideShow",startTransitionTime:2000,waitingPeriod:6000,transitionTime:800},initialize:function(el,options){this.setOptions(options);
this.container=el;
this.buildScreen();
var nextEffect=this.nextEffect.bind(this);
this.imgEffect=this.container.effect("opacity",{duration:this.options.startTransitionTime,onComplete:nextEffect}).hide();
this.steps=0;
this.nextEffect()
},buildScreen:function(){this.container.rel=this.container.getProperty("rel");
this.container.srcs=this.container.getProperty("srcs");
if(this.container.rel.test("^slideShow","i")){var aDim=this.container.rel.match(/[0-9.]+(px|%)/g);
var width="500px";
var height="200px";
if(aDim&&aDim[0]){var w=aDim[0].toInt();
if(w>0){width=w
}}if(aDim&&aDim[1]){var h=aDim[1].toInt();
if(h>0){height=h
}}this.container.setProperties({width:width,height:height});
if(this.container.srcs){this.srcs=this.container.srcs.split(",")
}}},nextEffect:function(){switch(this.steps++){case 0:if(this.showing){this.imgEffect.options.duration=this.options.transitionTime
}if(!$defined(this.index)){this.index=0
}else{this.index++;
if(this.index>=this.srcs.length){this.index=0
}var firstElem=this.container.getFirst();
firstElem.remove();
firstElem.setStyle("display","none");
firstElem.injectInside(this.slidesContainer)
}var nextElem=$(this.srcs[this.index]);
if(!$defined(this.slidesContainer)){this.slidesContainer=nextElem.getParent()
}nextElem.injectInside(this.container);
nextElem.setStyle("display","block");
this.showing=true;
this.imgEffect.start(0,1);
break;
case 1:this.nextEffect.delay(this.options.waitingPeriod,this);
break;
case 2:this.steps=0;
this.imgEffect.start(1,0);
break
}}});
SlideShow.implement(new Options);var MooRainbow=new Class({options:{id:"mooRainbow",prefix:"moor-",imgPath:"images/",startColor:[255,0,0],wheel:false,onComplete:Class.empty,onChange:Class.empty},initialize:function(el,options){this.element=$(el);
if(!this.element){return 
}this.setOptions(options);
this.sliderPos=0;
this.pickerPos={x:0,y:0};
this.backupColor=this.options.startColor;
this.currentColor=this.options.startColor;
this.sets={rgb:[],hsb:[],hex:[]};
this.pickerClick=this.sliderClick=false;
if(!this.layout){this.doLayout()
}this.OverlayEvents();
this.sliderEvents();
this.backupEvent();
if(this.options.wheel){this.wheelEvents()
}this.element.addEvent("click",function(e){this.toggle(e)
}.bind(this));
this.layout.overlay.setStyle("background-color",this.options.startColor.rgbToHex());
this.layout.backup.setStyle("background-color",this.backupColor.rgbToHex());
this.pickerPos.x=this.snippet("curPos").l+this.snippet("curSize","int").w;
this.pickerPos.y=this.snippet("curPos").t+this.snippet("curSize","int").h;
this.manualSet(this.options.startColor);
this.pickerPos.x=this.snippet("curPos").l+this.snippet("curSize","int").w;
this.pickerPos.y=this.snippet("curPos").t+this.snippet("curSize","int").h;
this.sliderPos=this.snippet("arrPos")-this.snippet("arrSize","int");
if(window.khtml){this.hide()
}},toggle:function(){this[this.visible?"hide":"show"]()
},show:function(){this.fireEvent("onInit",[this.sets,this]);
this.rePosition();
this.layout.setStyle("display","block");
this.visible=true
},hide:function(){this.layout.setStyles({display:"none"});
this.visible=false
},manualSet:function(color,type){if(!type||(type!="hsb"&&type!="hex")){type="rgb"
}var rgb,hsb,hex;
if(type=="rgb"){rgb=color;
hsb=color.rgbToHsb();
hex=color.rgbToHex()
}else{if(type=="hsb"){hsb=color;
rgb=color.hsbToRgb();
hex=rgb.rgbToHex()
}else{hex=color;
rgb=color.hexToRgb();
hsb=rgb.rgbToHsb()
}}this.setMooRainbow(rgb);
this.autoSet(hsb)
},autoSet:function(hsb){var curH=this.snippet("curSize","int").h;
var curW=this.snippet("curSize","int").w;
var oveH=this.layout.overlay.height;
var oveW=this.layout.overlay.width;
var sliH=this.layout.slider.height;
var arwH=this.snippet("arrSize","int");
var hue;
var posx=Math.round(((oveW*hsb[1])/100)-curW);
var posy=Math.round(-((oveH*hsb[2])/100)+oveH-curH);
var c=Math.round(((sliH*hsb[0])/360));
c=(c==360)?0:c;
var position=sliH-c+this.snippet("slider")-arwH;
hue=[this.sets.hsb[0],100,100].hsbToRgb().rgbToHex();
this.layout.cursor.setStyles({top:posy,left:posx});
this.layout.arrows.setStyle("top",position);
this.layout.overlay.setStyle("background-color",hue);
this.sliderPos=this.snippet("arrPos")-arwH;
this.pickerPos.x=this.snippet("curPos").l+curW;
this.pickerPos.y=this.snippet("curPos").t+curH
},setMooRainbow:function(color,type){if(!type||(type!="hsb"&&type!="hex")){type="rgb"
}var rgb,hsb,hex;
if(type=="rgb"){rgb=color;
hsb=color.rgbToHsb();
hex=color.rgbToHex()
}else{if(type=="hsb"){hsb=color;
rgb=color.hsbToRgb();
hex=rgb.rgbToHex()
}else{hex=color;
rgb=color.hexToRgb();
hsb=rgb.rgbToHsb()
}}this.sets={rgb:rgb,hsb:hsb,hex:hex};
if(!$chk(this.pickerPos.x)){this.autoSet(hsb)
}this.RedInput.value=rgb[0];
this.GreenInput.value=rgb[1];
this.BlueInput.value=rgb[2];
this.HueInput.value=hsb[0];
this.SatuInput.value=hsb[1];
this.BrighInput.value=hsb[2];
this.hexInput.value=hex;
this.currentColor=rgb;
this.chooseColor.setStyle("background-color",rgb.rgbToHex())
},parseColors:function(x,y,z){var s=Math.round((x*100)/this.layout.overlay.width);
var b=100-Math.round((y*100)/this.layout.overlay.height);
var h=360-Math.round((z*360)/this.layout.slider.height)+this.snippet("slider")-this.snippet("arrSize","int");
h-=this.snippet("arrSize","int");
h=(h>=360)?0:(h<0)?0:h;
s=(s>100)?100:(s<0)?0:s;
b=(b>100)?100:(b<0)?0:b;
return[h,s,b]
},OverlayEvents:function(){var lim,curH,curW,inputs;
curH=this.snippet("curSize","int").h;
curW=this.snippet("curSize","int").w;
inputs=this.arrRGB.copy().concat(this.arrHSB,this.hexInput);
document.addEvent("click",function(){if(this.visible){this.hide(this.layout)
}}.bind(this));
inputs.each(function(el){el.addEvent("keydown",this.eventKeydown.bindWithEvent(this,el));
el.addEvent("keyup",this.eventKeyup.bindWithEvent(this,el))
},this);
[this.element,this.layout].each(function(el){el.addEvents({click:function(e){new Event(e).stop()
},keyup:function(e){e=new Event(e);
if(e.key=="esc"&&this.visible){this.hide(this.layout)
}}.bind(this)},this)
},this);
lim={x:[0-curW,(this.layout.overlay.width-curW)],y:[0-curH,(this.layout.overlay.height-curH)]};
this.layout.drag=new Drag.Base(this.layout.cursor,{limit:lim,onStart:this.overlayDrag.bind(this),onDrag:this.overlayDrag.bind(this),snap:0});
this.layout.overlay2.addEvent("mousedown",function(e){e=new Event(e);
this.layout.cursor.setStyles({top:e.page.y-this.layout.overlay.getTop()-curH,left:e.page.x-this.layout.overlay.getLeft()-curW});
this.layout.drag.start(e)
}.bind(this));
this.okButton.addEvent("click",function(){if(this.currentColor==this.options.startColor){this.hide();
this.fireEvent("onComplete",[this.sets,this])
}else{this.backupColor=this.currentColor;
this.layout.backup.setStyle("background-color",this.backupColor.rgbToHex());
this.hide();
this.fireEvent("onComplete",[this.sets,this])
}}.bind(this))
},overlayDrag:function(){var curH=this.snippet("curSize","int").h;
var curW=this.snippet("curSize","int").w;
this.pickerPos.x=this.snippet("curPos").l+curW;
this.pickerPos.y=this.snippet("curPos").t+curH;
this.setMooRainbow(this.parseColors(this.pickerPos.x,this.pickerPos.y,this.sliderPos),"hsb");
this.fireEvent("onChange",[this.sets,this])
},sliderEvents:function(){var arwH=this.snippet("arrSize","int"),lim;
lim=[0+this.snippet("slider")-arwH,this.layout.slider.height-arwH+this.snippet("slider")];
this.layout.sliderDrag=new Drag.Base(this.layout.arrows,{limit:{y:lim},modifiers:{x:false},onStart:this.sliderDrag.bind(this),onDrag:this.sliderDrag.bind(this),snap:0});
this.layout.slider.addEvent("mousedown",function(e){e=new Event(e);
this.layout.arrows.setStyle("top",e.page.y-this.layout.slider.getTop()+this.snippet("slider")-arwH);
this.layout.sliderDrag.start(e)
}.bind(this))
},sliderDrag:function(){var arwH=this.snippet("arrSize","int"),hue;
this.sliderPos=this.snippet("arrPos")-arwH;
this.setMooRainbow(this.parseColors(this.pickerPos.x,this.pickerPos.y,this.sliderPos),"hsb");
hue=[this.sets.hsb[0],100,100].hsbToRgb().rgbToHex();
this.layout.overlay.setStyle("background-color",hue);
this.fireEvent("onChange",[this.sets,this])
},backupEvent:function(){this.layout.backup.addEvent("click",function(){this.manualSet(this.backupColor);
this.fireEvent("onChange",[this.sets,this])
}.bind(this))
},wheelEvents:function(){var arrColors=this.arrRGB.copy().extend(this.arrHSB);
arrColors.each(function(el){el.addEvents({mousewheel:this.eventKeys.bindWithEvent(this,el),keydown:this.eventKeys.bindWithEvent(this,el)})
},this);
[this.layout.arrows,this.layout.slider].each(function(el){el.addEvents({mousewheel:this.eventKeys.bindWithEvent(this,[this.arrHSB[0],"slider"]),keydown:this.eventKeys.bindWithEvent(this,[this.arrHSB[0],"slider"])})
},this)
},eventKeys:function(e,el,id){var wheel,type;
id=(!id)?el.id:this.arrHSB[0];
if(e.type=="keydown"){if(e.key=="up"){wheel=1
}else{if(e.key=="down"){wheel=-1
}else{return 
}}}else{if(e.type==Element.Events.mousewheel.type){wheel=(e.wheel>0)?1:-1
}}if(this.arrRGB.test(el)){type="rgb"
}else{if(this.arrHSB.test(el)){type="hsb"
}else{type="hsb"
}}if(type=="rgb"){var rgb=this.sets.rgb,hsb=this.sets.hsb,prefix=this.options.prefix,pass;
var value=el.value.toInt()+wheel;
value=(value>255)?255:(value<0)?0:value;
switch(el.className){case prefix+"rInput":pass=[value,rgb[1],rgb[2]];
break;
case prefix+"gInput":pass=[rgb[0],value,rgb[2]];
break;
case prefix+"bInput":pass=[rgb[0],rgb[1],value];
break;
default:pass=rgb
}this.manualSet(pass);
this.fireEvent("onChange",[this.sets,this])
}else{var rgb=this.sets.rgb,hsb=this.sets.hsb,prefix=this.options.prefix,pass;
var value=el.value.toInt()+wheel;
if(el.className.test(/(HueInput)/)){value=(value>359)?0:(value<0)?0:value
}else{value=(value>100)?100:(value<0)?0:value
}switch(el.className){case prefix+"HueInput":pass=[value,hsb[1],hsb[2]];
break;
case prefix+"SatuInput":pass=[hsb[0],value,hsb[2]];
break;
case prefix+"BrighInput":pass=[hsb[0],hsb[1],value];
break;
default:pass=hsb
}this.manualSet(pass,"hsb");
this.fireEvent("onChange",[this.sets,this])
}e.stop()
},eventKeydown:function(e,el){var n=e.code,k=e.key;
if((!el.className.test(/hexInput/)&&!(n>=48&&n<=57))&&(k!="backspace"&&k!="tab"&&k!="delete"&&k!="left"&&k!="right")){e.stop()
}},eventKeyup:function(e,el){var n=e.code,k=e.key,pass,prefix,chr=el.value.charAt(0);
if(!$chk(el.value)){return 
}if(el.className.test(/hexInput/)){if(chr!="#"&&el.value.length!=6){return 
}if(chr=="#"&&el.value.length!=7){return 
}}else{if(!(n>=48&&n<=57)&&(!["backspace","tab","delete","left","right"].test(k))&&el.value.length>3){return 
}}prefix=this.options.prefix;
if(el.className.test(/(rInput|gInput|bInput)/)){if(el.value<0||el.value>255){return 
}switch(el.className){case prefix+"rInput":pass=[el.value,this.sets.rgb[1],this.sets.rgb[2]];
break;
case prefix+"gInput":pass=[this.sets.rgb[0],el.value,this.sets.rgb[2]];
break;
case prefix+"bInput":pass=[this.sets.rgb[0],this.sets.rgb[1],el.value];
break;
default:pass=this.sets.rgb
}this.manualSet(pass);
this.fireEvent("onChange",[this.sets,this])
}else{if(!el.className.test(/hexInput/)){if(el.className.test(/HueInput/)&&el.value<0||el.value>360){return 
}else{if(el.className.test(/HueInput/)&&el.value==360){el.value=0
}else{if(el.className.test(/(SatuInput|BrighInput)/)&&el.value<0||el.value>100){return 
}}}switch(el.className){case prefix+"HueInput":pass=[el.value,this.sets.hsb[1],this.sets.hsb[2]];
break;
case prefix+"SatuInput":pass=[this.sets.hsb[0],el.value,this.sets.hsb[2]];
break;
case prefix+"BrighInput":pass=[this.sets.hsb[0],this.sets.hsb[1],el.value];
break;
default:pass=this.sets.hsb
}this.manualSet(pass,"hsb");
this.fireEvent("onChange",[this.sets,this])
}else{pass=el.value.hexToRgb(true);
if(isNaN(pass[0])||isNaN(pass[1])||isNaN(pass[2])){return 
}if($chk(pass)){this.manualSet(pass);
this.fireEvent("onChange",[this.sets,this])
}}}},doLayout:function(){var id=this.options.id,prefix=this.options.prefix;
var idPrefix=id+" ."+prefix;
this.layout=new Element("div",{styles:{display:"block",position:"absolute"},id:id}).inject(document.body);
var box=new Element("div",{styles:{position:"relative"},"class":prefix+"box"}).inject(this.layout);
var div=new Element("div",{styles:{position:"absolute",overflow:"hidden"},"class":prefix+"overlayBox"}).inject(box);
var ar=new Element("div",{styles:{position:"absolute",zIndex:1},"class":prefix+"arrows"}).inject(box);
ar.width=ar.getStyle("width").toInt();
ar.height=ar.getStyle("height").toInt();
var ov=new Element("img",{styles:{"background-color":"#fff",position:"relative",zIndex:2},src:this.options.imgPath+"moor_woverlay.png","class":prefix+"overlay"}).inject(div);
var ov2=new Element("img",{styles:{position:"absolute",top:0,left:0,zIndex:2},src:this.options.imgPath+"moor_boverlay.png","class":prefix+"overlay"}).inject(div);
if(window.ie6){div.setStyle("overflow","");
var src=ov.src;
ov.src=this.options.imgPath+"blank.gif";
ov.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='scale')";
src=ov2.src;
ov2.src=this.options.imgPath+"blank.gif";
ov2.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='scale')"
}ov.width=ov2.width=div.getStyle("width").toInt();
ov.height=ov2.height=div.getStyle("height").toInt();
var cr=new Element("div",{styles:{overflow:"hidden",position:"absolute",zIndex:2},"class":prefix+"cursor"}).inject(div);
cr.width=cr.getStyle("width").toInt();
cr.height=cr.getStyle("height").toInt();
var sl=new Element("img",{styles:{position:"absolute","z-index":2},src:this.options.imgPath+"moor_slider.png","class":prefix+"slider"}).inject(box);
this.layout.slider=sl;
sl.width=sl.getStyle("width").toInt();
sl.height=sl.getStyle("height").toInt();
new Element("div",{styles:{position:"absolute"},"class":prefix+"colorBox"}).inject(box);
var chooseColor=new Element("div",{styles:{zIndex:2,position:"absolute"},"class":prefix+"chooseColor"}).inject(box);
this.layout.backup=new Element("div",{styles:{zIndex:2,position:"absolute",cursor:"pointer"},"class":prefix+"currentColor"}).inject(box);
var R=new Element("label").inject(box).setStyle("position","absolute");
var G=R.clone().inject(box).addClass(prefix+"gLabel").appendText("G: ");
var B=R.clone().inject(box).addClass(prefix+"bLabel").appendText("B: ");
R.appendText("R: ").addClass(prefix+"rLabel");
var inputR=new Element("input");
var inputG=inputR.clone().inject(G).addClass(prefix+"gInput");
var inputB=inputR.clone().inject(B).addClass(prefix+"bInput");
inputR.inject(R).addClass(prefix+"rInput");
var HU=new Element("label").inject(box).setStyle("position","absolute");
var SA=HU.clone().inject(box).addClass(prefix+"SatuLabel").appendText("S: ");
var BR=HU.clone().inject(box).addClass(prefix+"BrighLabel").appendText("B: ");
HU.appendText("H: ").addClass(prefix+"HueLabel");
var inputHU=new Element("input");
var inputSA=inputHU.clone().inject(SA).addClass(prefix+"SatuInput");
var inputBR=inputHU.clone().inject(BR).addClass(prefix+"BrighInput");
inputHU.inject(HU).addClass(prefix+"HueInput");
SA.appendText(" %");
BR.appendText(" %");
new Element("span",{styles:{position:"absolute"},"class":prefix+"ballino"}).setHTML(" &deg;").injectAfter(HU);
var inputHex=new Element("input").addClass(prefix+"hexInput");
var hex=new Element("label").inject(box).setStyle("position","absolute").addClass(prefix+"hexLabel").appendText("#hex: ").adopt(inputHex);
var ok=new Element("input",{styles:{position:"absolute"},type:"button",value:"Select","class":prefix+"okButton"}).inject(box);
this.rePosition();
var overlays=$$("#"+idPrefix+"overlay");
this.layout.overlay=ov;
this.layout.overlay2=ov2;
this.layout.cursor=cr;
this.layout.arrows=ar;
this.chooseColor=chooseColor;
this.RedInput=inputR;
this.GreenInput=inputG;
this.BlueInput=inputB;
this.HueInput=inputHU;
this.SatuInput=inputSA;
this.BrighInput=inputBR;
this.hexInput=inputHex;
this.arrRGB=[this.RedInput,this.GreenInput,this.BlueInput];
this.arrHSB=[this.HueInput,this.SatuInput,this.BrighInput];
this.okButton=ok;
if(!window.khtml){this.hide()
}},rePosition:function(){var coords=this.element.getCoordinates();
this.layout.setStyles({left:coords.left,top:coords.top+coords.height+1})
},snippet:function(mode,type){var size;
type=(type)?type:"none";
switch(mode){case"arrPos":var t=this.layout.arrows.getStyle("top").toInt();
size=t;
break;
case"arrSize":var h=this.layout.arrows.height;
h=(type=="int")?(h/2).toInt():h;
size=h;
break;
case"curPos":var l=this.layout.cursor.getStyle("left").toInt();
var t=this.layout.cursor.getStyle("top").toInt();
size={l:l,t:t};
break;
case"slider":var t=this.layout.slider.getStyle("marginTop").toInt();
size=t;
break;
default:var h=this.layout.cursor.height;
var w=this.layout.cursor.width;
h=(type=="int")?(h/2).toInt():h;
w=(type=="int")?(w/2).toInt():w;
size={w:w,h:h}
}return size
}});
MooRainbow.implement(new Options);
MooRainbow.implement(new Events);var Help={buildHelp:function(panel){var container=new Element("div");
container.setStyles({width:"100%",textAlign:"center"});
var content1=Help.buildContentIcon("../images/black-keyboard.png","Keyboard Shortcuts",function(){MOOdalBox.open("keyboard.htm","KeyBoard Shortcuts","500px 400px",false);
panel.hidePanel()
});
var content2=Help.buildContentIcon("../images/firstSteps.png","Editor First Steps",function(){var wOpen;
var sOptions;
sOptions="status=yes,menubar=yes,scrollbars=yes,resizable=yes,toolbar=yes";
sOptions=sOptions+",width="+(screen.availWidth-10).toString();
sOptions=sOptions+",height="+(screen.availHeight-122).toString();
sOptions=sOptions+",screenX=0,screenY=0,left=0,top=0";
wOpen=window.open("firststeps.htm","WiseMapping","width=100px, height=100px");
wOpen.focus();
wOpen.moveTo(0,0);
wOpen.resizeTo(screen.availWidth,screen.availHeight);
panel.hidePanel()
});
container.addEvent("show",function(){content1.effect("opacity",{duration:800}).start(0,100);
var eff=function(){content2.effect("opacity",{duration:800}).start(0,100)
};
eff.delay(150)
});
container.addEvent("hide",function(){content1.effect("opacity").set(0);
content2.effect("opacity").set(0)
});
content1.inject(container);
content2.inject(container);
return container
},buildContentIcon:function(image,text,onClickFn){var container=new Element("div").setStyles({margin:"15px 0px 0px 0px",opacity:0,padding:"5px 0px",border:"1px solid transparent",cursor:"pointer"});
var icon=new Element("div");
icon.addEvent("click",onClickFn);
var img=new Element("img");
img.setProperty("src",image);
img.inject(icon);
icon.inject(container);
var textContainer=new Element("div").setStyles({width:"100%",color:"white"});
textContainer.innerHTML=text;
textContainer.inject(container);
container.addEvent("mouseover",function(event){$(this).setStyle("border-top","1px solid #BBB4D6");
$(this).setStyle("border-bottom","1px solid #BBB4D6")
}.bindWithEvent(container));
container.addEvent("mouseout",function(event){$(this).setStyle("border-top","1px solid transparent");
$(this).setStyle("border-bottom","1px solid transparent")
}.bindWithEvent(container));
return container
}};var Panel=new Class({options:{width:"140px",height:250,opacity:0.9,panelButton:null,content:null,frame:null,onStart:Class.empty,onComplete:Class.empty},initialize:function(options){this.setOptions(options);
this.buildBody();
this.options.panelButton.addEvent("click",this.openPanel.bindWithEvent(this))
},buildBody:function(){var opts=this.options;
opts.frame=new Element("div");
if($chk(opts.content)){this.setContent(opts.content)
}},setContent:function(content){this.options.content=content;
this.options.content.inject(this.options.frame);
this.setInitialStyles();
this.options.frame.injectBefore(this.options.panelButton)
},setInitialStyles:function(){var opts=this.options;
var buttonTop=opts.panelButton.getTop();
var buttonLeft=opts.panelButton.getLeft();
var bodyHeight=parseInt(opts.panelButton.getParent().getStyle("height"));
var coordinates=opts.panelButton.getCoordinates();
var width=opts.width||coordinates.width;
var elemCoords={top:"0px",left:coordinates.left,width:width,height:"0px",zIndex:"10",overflow:"hidden"};
var elemStyles={backgroundColor:opts.backgroundColor||"blue",opacity:opts.opacity,position:"absolute"};
opts.frame.setStyles(elemCoords).setStyles(elemStyles)
},openPanel:function(){this.fireEvent("onStart");
var button=this.options.panelButton;
button.removeEvents("click");
button.addEvent("click",this.hidePanel.bindWithEvent(this));
var top=parseInt(this.options.frame.getStyle("top"));
var fx=this.options.frame.effects({duration:500,onComplete:function(){this.options.content.fireEvent("show")
}.bind(this)});
fx.start({height:[0,this.options.height],top:[top,top-this.options.height]});
this.fireEvent("onComplete")
},hidePanel:function(){this.fireEvent("onStart");
var button=this.options.panelButton;
button.removeEvents("click");
button.addEvent("click",this.openPanel.bindWithEvent(this));
var top=parseInt(this.options.frame.getStyle("top"));
this.options.content.fireEvent("hide");
var fx=this.options.frame.effects({duration:500});
fx.start({height:[this.options.height,0],top:[top,top+this.options.height]});
this.fireEvent("onComplete")
}});
Panel.implement(new Events,new Options);var IconPanel=new Class({options:{width:190,initialWidth:0,height:145,content:null,panel:null,button:null,onStart:Class.empty,state:"close"},initialize:function(options){this.setOptions(options);
if($chk(this.options.button)){this.init()
}},setButton:function(button){this.options.button=button
},init:function(){var panel=new Element("div");
var coord=this.options.button.getCoordinates();
var top=this.options.button.getTop()+coord.height+2;
var left=this.options.button.getLeft();
panel.setStyles({width:this.options.initialWidth,height:0,position:"absolute",top:top,left:left,background:"#e5e5e5",border:"1px solid #BBB4D6",zIndex:20,overflow:"hidden"});
this.options.panel=panel;
this.options.content.inject(panel);
this.options.content.addEvent("click",function(event){this.close()
}.bind(this));
panel.setStyle("opacity",0);
panel.inject($(document.body));
this.registerOpenPanel()
},open:function(){if(this.options.state=="close"){if(!$chk(this.options.panel)){this.init()
}var panel=this.options.panel;
var options=this.options;
panel.setStyles({border:"1px solid #636163",opacity:100});
this.fireEvent("onStart");
var fx=panel.effects({duration:500,onComplete:function(){this.registerClosePanel()
}.bind(this)});
fx.start({height:[0,this.options.height],width:[this.options.initialWidth,this.options.width]});
this.options.state="open"
}},close:function(){if(this.options.state=="open"){var fx=this.options.panel.effects({duration:500,onComplete:function(){this.options.panel.setStyles({border:"1px solid transparent",opacity:0});
this.registerOpenPanel()
}.bind(this)});
fx.start({height:[this.options.height,0],width:[this.options.width,this.options.initialWidth]});
this.options.state="close"
}},registerOpenPanel:function(){this.options.button.removeEvents("click");
this.options.button.addEvent("click",function(event){this.open()
}.bindWithEvent(this))
},registerClosePanel:function(){this.options.button.removeEvents("click");
this.options.button.addEvent("click",function(event){this.close()
}.bindWithEvent(this))
}});
IconPanel.implement(new Events,new Options);