var web2d={};
web2d.peer={svg:{},vml:{}};
web2d.peer.utils={};web2d.peer.utils.EventUtils={broadcastChangeEvent:function(elementPeer,type){var listeners=elementPeer.getChangeEventListeners(type);
if(listeners){for(var i=0;
i<listeners.length;
i++){var listener=listeners[i];
listener.call(elementPeer,null)
}}var children=elementPeer.getChildren();
for(var i=0;
i<children.length;
i++){var child=children[i];
web2d.peer.utils.EventUtils.broadcastChangeEvent(child,type)
}}};web2d.peer.utils.TransformUtil={workoutScale:function(elementPeer){var current=elementPeer.getParent();
var width=1;
var height=1;
while(current){var coordSize=current.getCoordSize();
var size=current.getSize();
width=width*(parseInt(size.width)/coordSize.width);
height=height*(parseInt(size.height)/coordSize.height);
current=current.getParent()
}return{width:width,height:height}
}};web2d.peer.svg.ElementPeer=function(svgElement){this._native=svgElement;
this._dblClickListeners=new Hash();
this._size={width:1,height:1};
this._changeListeners={}
};
web2d.peer.svg.ElementPeer.prototype.svgNamespace="http://www.w3.org/2000/svg";
web2d.peer.svg.ElementPeer.prototype.linkNamespace="http://www.w3.org/1999/xlink";
web2d.peer.svg.ElementPeer.prototype.setChildren=function(children){this._children=children
};
web2d.peer.svg.ElementPeer.prototype.getChildren=function(){var result=this._children;
if(!result){result=[];
this._children=result
}return result
};
web2d.peer.svg.ElementPeer.prototype.getParent=function(){return this._parent
};
web2d.peer.svg.ElementPeer.prototype.setParent=function(parent){this._parent=parent
};
web2d.peer.svg.ElementPeer.prototype.appendChild=function(elementPeer){elementPeer.setParent(this);
var children=this.getChildren();
children.include(elementPeer);
this._native.appendChild(elementPeer._native);
web2d.peer.utils.EventUtils.broadcastChangeEvent(this,"strokeStyle")
};
web2d.peer.svg.ElementPeer.prototype.removeChild=function(elementPeer){elementPeer.setParent(null);
var children=this.getChildren();
var length=children.length;
children.remove(elementPeer);
var newLength=children.length;
if(newLength>=length){throw"Could not remove the element."
}this._native.removeChild(elementPeer._native)
};
web2d.peer.svg.ElementPeer.prototype.addEventListener=function(type,listener){if(type=="dblclick"){var dblListener=function(e){if(e.detail>=2){listener.call(this,e)
}};
this._dblClickListeners[listener]=dblListener;
this._native.addEventListener(type,dblListener,false)
}else{this._native.addEventListener(type,listener,false)
}};
web2d.peer.svg.ElementPeer.prototype.removeEventListener=function(type,listener){if(type=="dblclick"){var dblClickListener=this._dblClickListeners[listener];
if(dblClickListener==null){throw"Could not find listener to remove"
}type="click";
this._native.removeEventListener(type,dblClickListener,false);
delete this._dblClickListeners[listener]
}else{this._native.removeEventListener(type,listener,false)
}};
web2d.peer.svg.ElementPeer.prototype.setSize=function(width,height){if(core.Utils.isDefined(width)){this._size.width=parseInt(width);
this._native.setAttribute("width",parseInt(width))
}if(core.Utils.isDefined(height)){this._size.height=parseInt(height);
this._native.setAttribute("height",parseInt(height))
}web2d.peer.utils.EventUtils.broadcastChangeEvent(this,"strokeStyle")
};
web2d.peer.svg.ElementPeer.prototype.getSize=function(){return{width:this._size.width,height:this._size.height}
};
web2d.peer.svg.ElementPeer.prototype.setFill=function(color,opacity){if(core.Utils.isDefined(color)){this._native.setAttribute("fill",color)
}if(core.Utils.isDefined(opacity)){this._native.setAttribute("fill-opacity",opacity)
}};
web2d.peer.svg.ElementPeer.prototype.getFill=function(){var color=this._native.getAttribute("fill");
var opacity=this._native.getAttribute("fill-opacity");
return{color:color,opacity:Number(opacity)}
};
web2d.peer.svg.ElementPeer.prototype.getStroke=function(){var vmlStroke=this._native;
var color=vmlStroke.getAttribute("stroke");
var dashstyle=this._stokeStyle;
var opacity=vmlStroke.getAttribute("stroke-opacity");
var width=vmlStroke.getAttribute("stroke-width");
return{color:color,style:dashstyle,opacity:opacity,width:width}
};
web2d.peer.svg.ElementPeer.prototype.__stokeStyleToStrokDasharray={solid:[],dot:[1,3],dash:[4,3],longdash:[10,2],dashdot:[5,3,1,3]};
web2d.peer.svg.ElementPeer.prototype.setStroke=function(width,style,color,opacity){if(core.Utils.isDefined(width)){this._native.setAttribute("stroke-width",width+"px")
}if(core.Utils.isDefined(color)){this._native.setAttribute("stroke",color)
}if(core.Utils.isDefined(style)){var dashArrayPoints=this.__stokeStyleToStrokDasharray[style];
var scale=1/web2d.peer.utils.TransformUtil.workoutScale(this).width;
var strokeWidth=this._native.getAttribute("stroke-width");
strokeWidth=parseFloat(strokeWidth);
var scaledPoints=[];
for(var i=0;
i<dashArrayPoints.length;
i++){scaledPoints[i]=dashArrayPoints[i]*strokeWidth;
scaledPoints[i]=(scaledPoints[i]*scale)+"px"
}this._stokeStyle=style
}if(core.Utils.isDefined(opacity)){this._native.setAttribute("stroke-opacity",opacity)
}};
web2d.peer.svg.ElementPeer.prototype.setVisibility=function(isVisible){this._native.setAttribute("visibility",(isVisible)?"visible":"hidden")
};
web2d.peer.svg.ElementPeer.prototype.isVisible=function(){var visibility=this._native.getAttribute("visibility");
return !(visibility=="hidden")
};
web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle=function(){var strokeStyle=this._stokeStyle;
if(this.getParent()){if(strokeStyle&&strokeStyle!="solid"){this.setStroke(null,strokeStyle)
}}};
web2d.peer.svg.ElementPeer.prototype.attachChangeEventListener=function(type,listener){var listeners=this.getChangeEventListeners(type);
if(!listener){throw"Listener can not be null"
}listeners.push(listener)
};
web2d.peer.svg.ElementPeer.prototype.getChangeEventListeners=function(type){var listeners=this._changeListeners[type];
if(!listeners){listeners=[];
this._changeListeners[type]=listeners
}return listeners
};
web2d.peer.svg.ElementPeer.prototype.moveToFront=function(){this._native.parentNode.appendChild(this._native)
};
web2d.peer.svg.ElementPeer.prototype.moveToBack=function(){this._native.parentNode.insertBefore(this._native,this._native.parentNode.firstChild)
};
web2d.peer.svg.ElementPeer.prototype.setCursor=function(type){this._native.style.cursor=type
};web2d.peer.svg.ElipsePeer=function(){var svgElement=window.document.createElementNS(this.svgNamespace,"ellipse");
web2d.peer.svg.ElementPeer.call(this,svgElement);
this.attachChangeEventListener("strokeStyle",web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle);
this._position={x:0,y:0}
};
objects.extend(web2d.peer.svg.ElipsePeer,web2d.peer.svg.ElementPeer);
web2d.peer.svg.ElipsePeer.prototype.setSize=function(width,height){web2d.peer.svg.ElipsePeer.superClass.setSize.call(this,width,height);
if(core.Utils.isDefined(width)){this._native.setAttribute("rx",width/2)
}if(core.Utils.isDefined(height)){this._native.setAttribute("ry",height/2)
}var pos=this.getPosition();
this.setPosition(pos.x,pos.y)
};
web2d.peer.svg.ElipsePeer.prototype.setPosition=function(cx,cy){var size=this.getSize();
cx=cx+size.width/2;
cy=cy+size.height/2;
if(core.Utils.isDefined(cx)){this._native.setAttribute("cx",cx)
}if(core.Utils.isDefined(cy)){this._native.setAttribute("cy",cy)
}};
web2d.peer.svg.ElipsePeer.prototype.getPosition=function(){return this._position
};web2d.peer.svg.Font=function(){this._size=10;
this._style="normal";
this._weight="normal"
};
web2d.peer.svg.Font.prototype.init=function(args){if(core.Utils.isDefined(args.size)){this._size=parseInt(args.size)
}if(core.Utils.isDefined(args.style)){this._style=args.style
}if(core.Utils.isDefined(args.weight)){this._weight=args.weight
}};
web2d.peer.svg.Font.prototype.getHtmlSize=function(scale){var result=0;
if(this._size==6){result=this._size*scale.height*43/32
}if(this._size==8){result=this._size*scale.height*42/32
}else{if(this._size==10){result=this._size*scale.height*42/32
}else{if(this._size==15){result=this._size*scale.height*42/32
}}}return result
};
web2d.peer.svg.Font.prototype.getGraphSize=function(scale){return this._size*43/32
};
web2d.peer.svg.Font.prototype.getSize=function(){return parseInt(this._size)
};
web2d.peer.svg.Font.prototype.getStyle=function(){return this._style
};
web2d.peer.svg.Font.prototype.getWeight=function(){return this._weight
};
web2d.peer.svg.Font.prototype.setSize=function(size){this._size=size
};
web2d.peer.svg.Font.prototype.setStyle=function(style){this._style=style
};
web2d.peer.svg.Font.prototype.setWeight=function(weight){this._weight=weight
};
web2d.peer.svg.Font.prototype.getWidthMargin=function(){var result=0;
if(this._size==10||this._size==6){result=4
}return result
};web2d.peer.svg.ArialFont=function(){web2d.peer.svg.Font.call(this);
this._fontFamily="Arial"
};
objects.extend(web2d.peer.svg.ArialFont,web2d.peer.svg.Font);
web2d.peer.svg.ArialFont.prototype.getFontFamily=function(){return this._fontFamily
};
web2d.peer.svg.ArialFont.prototype.getFont=function(){return web2d.Font.ARIAL
};web2d.peer.svg.PolyLinePeer=function(){var svgElement=window.document.createElementNS(this.svgNamespace,"polyline");
web2d.peer.svg.ElementPeer.call(this,svgElement);
this.setFill("none");
this.breakDistance=10
};
objects.extend(web2d.peer.svg.PolyLinePeer,web2d.peer.svg.ElementPeer);
web2d.peer.svg.PolyLinePeer.prototype.setFrom=function(x1,y1){this._x1=x1;
this._y1=y1;
this._updatePath()
};
web2d.peer.svg.PolyLinePeer.prototype.setTo=function(x2,y2){this._x2=x2;
this._y2=y2;
this._updatePath()
};
web2d.peer.svg.PolyLinePeer.prototype.setStrokeWidth=function(width){this._native.setAttribute("stroke-width",width)
};
web2d.peer.svg.PolyLinePeer.prototype.setColor=function(color){this._native.setAttribute("stroke",color)
};
web2d.peer.svg.PolyLinePeer.prototype.setStyle=function(style){this._style=style;
this._updatePath()
};
web2d.peer.svg.PolyLinePeer.prototype.getStyle=function(){return this._style
};
web2d.peer.svg.PolyLinePeer.prototype._updatePath=function(){if(this._style=="Curved"){this._updateMiddleCurvePath()
}else{if(this._style=="Straight"){this._updateStraightPath()
}else{this._updateCurvePath()
}}};
web2d.peer.svg.PolyLinePeer.prototype._updateStraightPath=function(){if(core.Utils.isDefined(this._x1)&&core.Utils.isDefined(this._x2)&&core.Utils.isDefined(this._y1)&&core.Utils.isDefined(this._y2)){this.buildStraightPath(this.breakDistance,this._x1,this._y1,this._x2,this._y2);
this._native.setAttribute("points",path)
}};
web2d.peer.svg.PolyLinePeer.prototype._updateMiddleCurvePath=function(){var x1=this._x1;
var y1=this._y1;
var x2=this._x2;
var y2=this._y2;
if(core.Utils.isDefined(x1)&&core.Utils.isDefined(x2)&&core.Utils.isDefined(y1)&&core.Utils.isDefined(y2)){var diff=x2-x1;
var middlex=(diff/2)+x1;
var signx=1;
var signy=1;
if(diff<0){signx=-1
}if(y2<y1){signy=-1
}var path=x1+", "+y1+" "+(middlex-10*signx)+", "+y1+" "+middlex+", "+(y1+10*signy)+" "+middlex+", "+(y2-10*signy)+" "+(middlex+10*signx)+", "+y2+" "+x2+", "+y2;
this._native.setAttribute("points",path)
}};
web2d.peer.svg.PolyLinePeer.prototype._updateCurvePath=function(){if(core.Utils.isDefined(this._x1)&&core.Utils.isDefined(this._x2)&&core.Utils.isDefined(this._y1)&&core.Utils.isDefined(this._y2)){var path=web2d.PolyLine.buildCurvedPath(this.breakDistance,this._x1,this._y1,this._x2,this._y2);
this._native.setAttribute("points",path)
}};web2d.peer.svg.TextPeer=function(){var svgElement=window.document.createElementNS(this.svgNamespace,"text");
web2d.peer.svg.ElementPeer.call(this,svgElement);
this._native.setAttribute("focusable","true");
this._position={x:0,y:0};
this._font=new web2d.Font("Arial",this)
};
objects.extend(web2d.peer.svg.TextPeer,web2d.peer.svg.ElementPeer);
web2d.peer.svg.TextPeer.prototype.appendChild=function(element){this._native.appendChild(element._native)
};
web2d.peer.svg.TextPeer.prototype.setText=function(text){text=core.Utils.escapeInvalidTags(text);
var child=this._native.firstChild;
if(child){this._native.removeChild(child)
}this._text=text;
var textNode=window.document.createTextNode(text);
this._native.appendChild(textNode)
};
web2d.peer.svg.TextPeer.prototype.getText=function(){return this._text
};
web2d.peer.svg.TextPeer.prototype.setPosition=function(x,y){this._position={x:x,y:y};
var size=parseInt(this._font.getSize());
this._native.setAttribute("y",y+size);
this._native.setAttribute("x",x)
};
web2d.peer.svg.TextPeer.prototype.getPosition=function(){return this._position
};
web2d.peer.svg.TextPeer.prototype.setFont=function(font,size,style,weight){if(core.Utils.isDefined(font)){this._font=new web2d.Font(font,this)
}if(core.Utils.isDefined(style)){this._font.setStyle(style)
}if(core.Utils.isDefined(weight)){this._font.setWeight(weight)
}if(core.Utils.isDefined(size)){this._font.setSize(size)
}this._updateFontStyle()
};
web2d.peer.svg.TextPeer.prototype._updateFontStyle=function(){this._native.setAttribute("font-family",this._font.getFontFamily());
this._native.setAttribute("font-size",this._font.getGraphSize());
this._native.setAttribute("font-style",this._font.getStyle());
this._native.setAttribute("font-weight",this._font.getWeight());
var scale=this._font.getFontScale();
this._native.xFontScale=scale.toFixed(1)
};
web2d.peer.svg.TextPeer.prototype.setColor=function(color){this._native.setAttribute("fill",color)
};
web2d.peer.svg.TextPeer.prototype.getColor=function(){return this._native.getAttribute("fill")
};
web2d.peer.svg.TextPeer.prototype.setTextSize=function(size){this._font.setSize(size);
this._updateFontStyle()
};
web2d.peer.svg.TextPeer.prototype.setContentSize=function(width,height){this._native.xTextSize=width.toFixed(1)+","+height.toFixed(1)
};
web2d.peer.svg.TextPeer.prototype.setStyle=function(style){this._font.setStyle(style);
this._updateFontStyle()
};
web2d.peer.svg.TextPeer.prototype.setWeight=function(weight){this._font.setWeight(weight);
this._updateFontStyle()
};
web2d.peer.svg.TextPeer.prototype.setFontFamily=function(family){var oldFont=this._font;
this._font=new web2d.Font(family,this);
this._font.setSize(oldFont.getSize());
this._font.setStyle(oldFont.getStyle());
this._font.setWeight(oldFont.getWeight());
this._updateFontStyle()
};
web2d.peer.svg.TextPeer.prototype.getFont=function(){return{font:this._font.getFont(),size:parseInt(this._font.getSize()),style:this._font.getStyle(),weight:this._font.getWeight()}
};
web2d.peer.svg.TextPeer.prototype.setSize=function(size){this._font.setSize(size);
this._updateFontStyle()
};
web2d.peer.svg.TextPeer.prototype.getWidth=function(){var width=parseInt(this._native.getComputedTextLength());
width=width+this._font.getWidthMargin();
return width
};
web2d.peer.svg.TextPeer.prototype.getHeight=function(){return this._font.getGraphSize()
};
web2d.peer.svg.TextPeer.prototype.getHtmlFontSize=function(){return this._font.getHtmlSize()
};web2d.peer.svg.WorkspacePeer=function(element){this._element=element;
var svgElement=window.document.createElementNS(this.svgNamespace,"svg");
web2d.peer.svg.ElementPeer.call(this,svgElement);
this._native.setAttribute("focusable","true");
this._native.setAttribute("id","workspace")
};
objects.extend(web2d.peer.svg.WorkspacePeer,web2d.peer.svg.ElementPeer);
web2d.peer.svg.WorkspacePeer.prototype.setCoordSize=function(width,height){var viewBox=this._native.getAttribute("viewBox");
var coords=[0,0,0,0];
if(viewBox!=null){coords=viewBox.split(/ /)
}if(core.Utils.isDefined(width)){coords[2]=width
}if(core.Utils.isDefined(height)){coords[3]=height
}this._native.setAttribute("viewBox",coords.join(" "));
this._native.setAttribute("preserveAspectRatio","none");
web2d.peer.utils.EventUtils.broadcastChangeEvent(this,"strokeStyle")
};
web2d.peer.svg.WorkspacePeer.prototype.getCoordSize=function(){var viewBox=this._native.getAttribute("viewBox");
var coords=[1,1,1,1];
if(viewBox!=null){coords=viewBox.split(/ /)
}return{width:coords[2],height:coords[3]}
};
web2d.peer.svg.WorkspacePeer.prototype.setCoordOrigin=function(x,y){var viewBox=this._native.getAttribute("viewBox");
var coords=[0,0,0,0];
if(viewBox!=null){coords=viewBox.split(/ /)
}if(core.Utils.isDefined(x)){coords[0]=x
}if(core.Utils.isDefined(y)){coords[1]=y
}this._native.setAttribute("viewBox",coords.join(" "))
};
web2d.peer.svg.WorkspacePeer.prototype.appendChild=function(child){web2d.peer.svg.WorkspacePeer.superClass.appendChild.call(this,child);
web2d.peer.utils.EventUtils.broadcastChangeEvent(child,"onChangeCoordSize")
};
web2d.peer.svg.WorkspacePeer.prototype.getCoordOrigin=function(child){var viewBox=this._native.getAttribute("viewBox");
var coords=[1,1,1,1];
if(viewBox!=null){coords=viewBox.split(/ /)
}var x=parseFloat(coords[0]);
var y=parseFloat(coords[1]);
return{x:x,y:y}
};
web2d.peer.svg.WorkspacePeer.prototype.getPosition=function(){return{x:0,y:0}
};web2d.peer.svg.GroupPeer=function(){var svgElement=window.document.createElementNS(this.svgNamespace,"g");
web2d.peer.svg.ElementPeer.call(this,svgElement);
this._native.setAttribute("preserveAspectRatio","none");
this._coordSize={width:1,height:1};
this._native.setAttribute("focusable","true");
this._position={x:0,y:0};
this._coordOrigin={x:0,y:0}
};
objects.extend(web2d.peer.svg.GroupPeer,web2d.peer.svg.ElementPeer);
web2d.peer.svg.GroupPeer.prototype.setCoordSize=function(width,height){this._coordSize.width=width;
this._coordSize.height=height;
this.updateTransform();
web2d.peer.utils.EventUtils.broadcastChangeEvent(this,"strokeStyle")
};
web2d.peer.svg.GroupPeer.prototype.getCoordSize=function(){return{width:this._coordSize.width,height:this._coordSize.height}
};
web2d.peer.svg.GroupPeer.prototype.updateTransform=function(){var sx=this._size.width/this._coordSize.width;
var sy=this._size.height/this._coordSize.height;
var cx=this._position.x-this._coordOrigin.x*sx;
var cy=this._position.y-this._coordOrigin.y*sy;
this._native.setAttribute("transform","translate("+cx+","+cy+") scale("+sx+","+sy+")")
};
web2d.peer.svg.GroupPeer.prototype.setCoordOrigin=function(x,y){if(core.Utils.isDefined(x)){this._coordOrigin.x=x
}if(core.Utils.isDefined(y)){this._coordOrigin.y=y
}this.updateTransform()
};
web2d.peer.svg.GroupPeer.prototype.setSize=function(width,height){web2d.peer.svg.GroupPeer.superClass.setSize.call(this,width,height);
this.updateTransform()
};
web2d.peer.svg.GroupPeer.prototype.setPosition=function(x,y){if(core.Utils.isDefined(x)){this._position.x=parseInt(x)
}if(core.Utils.isDefined(y)){this._position.y=parseInt(y)
}this.updateTransform()
};
web2d.peer.svg.GroupPeer.prototype.getPosition=function(){return{x:this._position.x,y:this._position.y}
};
web2d.peer.svg.GroupPeer.prototype.appendChild=function(child){web2d.peer.svg.GroupPeer.superClass.appendChild.call(this,child);
web2d.peer.utils.EventUtils.broadcastChangeEvent(child,"onChangeCoordSize")
};
web2d.peer.svg.GroupPeer.prototype.getCoordOrigin=function(){return{x:this._coordOrigin.x,y:this._coordOrigin.y}
};web2d.peer.svg.RectPeer=function(arc){var svgElement=window.document.createElementNS(this.svgNamespace,"rect");
web2d.peer.svg.ElementPeer.call(this,svgElement);
this._arc=arc;
this.attachChangeEventListener("strokeStyle",web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle)
};
objects.extend(web2d.peer.svg.RectPeer,web2d.peer.svg.ElementPeer);
web2d.peer.svg.RectPeer.prototype.setPosition=function(x,y){if(core.Utils.isDefined(x)){this._native.setAttribute("x",parseInt(x))
}if(core.Utils.isDefined(y)){this._native.setAttribute("y",parseInt(y))
}};
web2d.peer.svg.RectPeer.prototype.getPosition=function(){var x=this._native.getAttribute("x");
var y=this._native.getAttribute("y");
return{x:parseInt(x),y:parseInt(y)}
};
web2d.peer.svg.RectPeer.prototype.setSize=function(width,height){web2d.peer.svg.RectPeer.superClass.setSize.call(this,width,height);
var min=width<height?width:height;
if(this._arc){var arc=(min/2)*this._arc;
this._native.setAttribute("rx",arc);
this._native.setAttribute("ry",arc)
}};web2d.peer.svg.ImagePeer=function(){var svgElement=window.document.createElementNS(this.svgNamespace,"image");
web2d.peer.svg.ElementPeer.call(this,svgElement);
this._position={x:0,y:0};
this._href=""
};
objects.extend(web2d.peer.svg.ImagePeer,web2d.peer.svg.ElementPeer);
web2d.peer.svg.ImagePeer.prototype.setPosition=function(x,y){this._position={x:x,y:y};
this._native.setAttribute("y",y);
this._native.setAttribute("x",x)
};
web2d.peer.svg.ImagePeer.prototype.getPosition=function(){return this._position
};
web2d.peer.svg.ImagePeer.prototype.setHref=function(url){this._native.setAttributeNS(this.linkNamespace,"href",url);
this._href=url
};
web2d.peer.svg.ImagePeer.prototype.getHref=function(){return this._href
};web2d.peer.svg.TimesFont=function(){web2d.peer.svg.Font.call(this);
this._fontFamily="times"
};
objects.extend(web2d.peer.svg.TimesFont,web2d.peer.svg.Font);
web2d.peer.svg.TimesFont.prototype.getFontFamily=function(){return this._fontFamily
};
web2d.peer.svg.TimesFont.prototype.getFont=function(){return web2d.Font.TIMES
};web2d.peer.svg.LinePeer=function(){var svgElement=window.document.createElementNS(this.svgNamespace,"line");
web2d.peer.svg.ElementPeer.call(this,svgElement);
this.attachChangeEventListener("strokeStyle",web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle)
};
objects.extend(web2d.peer.svg.LinePeer,web2d.peer.svg.ElementPeer);
web2d.peer.svg.LinePeer.prototype.setFrom=function(x1,y1){this._native.setAttribute("x1",x1);
this._native.setAttribute("y1",y1)
};
web2d.peer.svg.LinePeer.prototype.setTo=function(x2,y2){this._native.setAttribute("x2",x2);
this._native.setAttribute("y2",y2)
};
web2d.peer.svg.LinePeer.prototype.setArrowStyle=function(startStyle,endStyle){if(core.Utils.isDefined(startStyle)){}if(core.Utils.isDefined(endStyle)){}};web2d.peer.svg.TahomaFont=function(){web2d.peer.svg.Font.call(this);
this._fontFamily="tahoma"
};
objects.extend(web2d.peer.svg.TahomaFont,web2d.peer.svg.Font);
web2d.peer.svg.TahomaFont.prototype.getFontFamily=function(){return this._fontFamily
};
web2d.peer.svg.TahomaFont.prototype.getFont=function(){return web2d.Font.TAHOMA
};web2d.peer.svg.VerdanaFont=function(){web2d.peer.svg.Font.call(this);
this._fontFamily="verdana"
};
objects.extend(web2d.peer.svg.VerdanaFont,web2d.peer.svg.Font);
web2d.peer.svg.VerdanaFont.prototype.getFontFamily=function(){return this._fontFamily
};
web2d.peer.svg.VerdanaFont.prototype.getFont=function(){return web2d.Font.VERDANA
};web2d.Element=function(peer,attributes){this._peer=peer;
if(peer==null){throw"Element peer can not be null"
}this._dispatcherByEventType=new Hash({});
if(core.Utils.isDefined(attributes)){this._initialize(attributes)
}};
web2d.Element.prototype._SIGNATURE_MULTIPLE_ARGUMENTS=-1;
web2d.Element.prototype._initialize=function(attributes){var batchExecute={};
for(var key in attributes){var funcName=this._attributeNameToFuncName(key,"set");
var funcArgs=batchExecute[funcName];
if(!funcArgs){funcArgs=[]
}var signature=this._propertyNameToSignature[key];
var argPositions=signature[1];
if(argPositions!=this._SIGNATURE_MULTIPLE_ARGUMENTS){funcArgs[argPositions]=attributes[key]
}else{funcArgs=attributes[key].split(" ")
}batchExecute[funcName]=funcArgs
}for(var key in batchExecute){var func=this[key];
if(!func){throw"Could not find function: "+key
}func.apply(this,batchExecute[key])
}};
web2d.Element.prototype.setSize=function(width,height){this._peer.setSize(width,height)
};
web2d.Element.prototype.setPosition=function(cx,cy){this._peer.setPosition(cx,cy)
};
web2d.Element.prototype._supportedEvents=["click","dblclick","mousemove","mouseout","mouseover","mousedown","mouseup"];
web2d.Element.prototype.addEventListener=function(type,listener){if(!this._supportedEvents.include(type)){throw"Unsupported event type: "+type
}if(!this._dispatcherByEventType[type]){this._dispatcherByEventType[type]=new web2d.EventDispatcher(this);
var eventListener=this._dispatcherByEventType[type].eventListener;
this._peer.addEventListener(type,eventListener)
}this._dispatcherByEventType[type].addListener(type,listener)
};
web2d.Element.prototype.removeEventListener=function(type,listener){var dispatcher=this._dispatcherByEventType[type];
if(dispatcher==null){throw"There is no listener previously registered"
}var result=dispatcher.removeListener(type,listener);
if(dispatcher.getListenersCount()<=0){this._peer.removeEventListener(type,dispatcher.eventListener);
this._dispatcherByEventType[type]=null
}};
web2d.Element.prototype.getType=function(){throw"Not implemeneted yet. This method must be implemented by all the inherited objects."
};
web2d.Element.prototype.getFill=function(){return this._peer.getFill()
};
web2d.Element.prototype.setFill=function(color,opacity){this._peer.setFill(color,opacity)
};
web2d.Element.prototype.getPosition=function(){return this._peer.getPosition()
};
web2d.Element.prototype.setStroke=function(width,style,color,opacity){if(style!=null&&style!=undefined&&style!="dash"&&style!="dot"&&style!="solid"&&style!="longdash"&&style!="dashdot"){throw"Unsupported stroke style: '"+style+"'"
}this._peer.setStroke(width,style,color,opacity)
};
web2d.Element.prototype._propertyNameToSignature={size:["size",-1],width:["size",0,"width"],height:["size",1,"height"],position:["position",-1],x:["position",0,"x"],y:["position",1,"y"],stroke:["stroke",-1],strokeWidth:["stroke",0,"width"],strokeStyle:["stroke",1,"style"],strokeColor:["stroke",2,"color"],strokeOpacity:["stroke",3,"opacity"],fill:["fill",-1],fillColor:["fill",0,"color"],fillOpacity:["fill",1,"opacity"],coordSize:["coordSize",-1],coordSizeWidth:["coordSize",0,"width"],coordSizeHeight:["coordSize",1,"height"],coordOrigin:["coordOrigin",-1],coordOriginX:["coordOrigin",0,"x"],coordOriginY:["coordOrigin",1,"y"],visibility:["visibility",0],opacity:["opacity",0]};
web2d.Element.prototype._attributeNameToFuncName=function(attributeKey,prefix){var signature=this._propertyNameToSignature[attributeKey];
if(!signature){throw"Unsupported attribute: "+attributeKey
}var firstLetter=signature[0].charAt(0);
return prefix+firstLetter.toUpperCase()+signature[0].substring(1)
};
web2d.Element.prototype.setAttribute=function(key,value){var funcName=this._attributeNameToFuncName(key,"set");
var signature=this._propertyNameToSignature[key];
if(signature==null){throw"Could not find the signature for:"+key
}var argPositions=signature[1];
var args=[];
if(argPositions!==this._SIGNATURE_MULTIPLE_ARGUMENTS){args[argPositions]=value
}else{if(typeof value=="array"){args=value
}else{var strValue=String(value);
args=strValue.split(" ")
}}var setter=this[funcName];
if(setter==null){throw"Could not find the function name:"+funcName
}setter.apply(this,args)
};
web2d.Element.prototype.getAttribute=function(key){var funcName=this._attributeNameToFuncName(key,"get");
var signature=this._propertyNameToSignature[key];
if(signature==null){throw"Could not find the signature for:"+key
}var getter=this[funcName];
if(getter==null){throw"Could not find the function name:"+funcName
}var getterResult=getter.apply(this,[]);
var attibuteName=signature[2];
if(!attibuteName){throw"Could not find attribute mapping for:"+key
}var result=getterResult[attibuteName];
if(!result){throw"Could not find attribute with name:"+attibuteName
}return result
};
web2d.Element.prototype.setOpacity=function(opacity){this._peer.setStroke(null,null,null,opacity);
this._peer.setFill(null,opacity)
};
web2d.Element.prototype.setVisibility=function(isVisible){this._peer.setVisibility(isVisible)
};
web2d.Element.prototype.isVisible=function(){return this._peer.isVisible()
};
web2d.Element.prototype.moveToFront=function(){this._peer.moveToFront()
};
web2d.Element.prototype.moveToBack=function(){this._peer.moveToBack()
};
web2d.Element.prototype.getStroke=function(){return this._peer.getStroke()
};
web2d.Element.prototype.setCursor=function(type){this._peer.setCursor(type)
};
web2d.Element.prototype.getParent=function(){return this._peer.getParent()
};web2d.Elipse=function(attributes){var peer=web2d.peer.Toolkit.createElipse();
var defaultAttributes={width:40,height:40,x:5,y:5,stroke:"1 solid black",fillColor:"blue"};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}web2d.Element.call(this,peer,defaultAttributes)
};
objects.extend(web2d.Elipse,web2d.Element);
web2d.Elipse.prototype.getType=function(){return"Elipse"
};
web2d.Elipse.prototype.getSize=function(){return this._peer.getSize()
};web2d.EventDispatcher=function(element){this._listeners=[];
var dispatcher=this;
this.eventListener=function(event){for(var i=0;
i<dispatcher._listeners.length;
i++){if(dispatcher._listeners[i]!=null){dispatcher._listeners[i].call(element,event||window.event)
}}}
};
web2d.EventDispatcher.prototype.addListener=function(type,listener){if(!listener){throw"Listener can not be null."
}this._listeners.include(listener)
};
web2d.EventDispatcher.prototype.removeListener=function(type,listener){if(!listener){throw"Listener can not be null."
}var length=this._listeners.length;
this._listeners.remove(listener);
var newLength=this._listeners.length;
if(newLength>=length){throw"There is not listener to remove"
}};
web2d.EventDispatcher.prototype.getListenersCount=function(){return this._listeners.length
};web2d.Font=function(fontFamily,textPeer){var font="web2d.peer.Toolkit.create"+fontFamily+"Font();";
this._peer=eval(font);
this._textPeer=textPeer
};
web2d.Font.prototype.getHtmlSize=function(){var scale=web2d.peer.utils.TransformUtil.workoutScale(this._textPeer);
return this._peer.getHtmlSize(scale)
};
web2d.Font.prototype.getGraphSize=function(){var scale=web2d.peer.utils.TransformUtil.workoutScale(this._textPeer);
return this._peer.getGraphSize(scale)
};
web2d.Font.prototype.getFontScale=function(){return web2d.peer.utils.TransformUtil.workoutScale(this._textPeer).height
};
web2d.Font.prototype.getSize=function(){return this._peer.getSize()
};
web2d.Font.prototype.getStyle=function(){return this._peer.getStyle()
};
web2d.Font.prototype.getWeight=function(){return this._peer.getWeight()
};
web2d.Font.prototype.getFontFamily=function(){return this._peer.getFontFamily()
};
web2d.Font.prototype.setSize=function(size){return this._peer.setSize(size)
};
web2d.Font.prototype.setStyle=function(style){return this._peer.setStyle(style)
};
web2d.Font.prototype.setWeight=function(weight){return this._peer.setWeight(weight)
};
web2d.Font.prototype.getFont=function(){return this._peer.getFont()
};
web2d.Font.prototype.getWidthMargin=function(){return this._peer.getWidthMargin()
};
web2d.Font.ARIAL="Arial";
web2d.Font.TIMES="Times";
web2d.Font.TAHOMA="Tahoma";
web2d.Font.VERDANA="Verdana";web2d.Group=function(attributes){var peer=web2d.peer.Toolkit.createGroup();
var defaultAttributes={width:50,height:50,x:50,y:50,coordOrigin:"0 0",coordSize:"50 50"};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}web2d.Element.call(this,peer,defaultAttributes)
};
objects.extend(web2d.Group,web2d.Element);
web2d.Group.prototype.removeChild=function(element){if(!element){throw"Child element can not be null"
}if(element==this){throw"It's not posible to add the group as a child of itself"
}var elementType=element.getType();
if(elementType==null){throw"It seems not to be an element ->"+element
}this._peer.removeChild(element._peer)
};
web2d.Group.prototype.appendChild=function(element){if(!element){throw"Child element can not be null"
}if(element==this){throw"It's not posible to add the group as a child of itself"
}var elementType=element.getType();
if(elementType==null){throw"It seems not to be an element ->"+element
}if(elementType=="Workspace"){throw"A group can not have a workspace as a child"
}this._peer.appendChild(element._peer)
};
web2d.Group.prototype.getType=function(){return"Group"
};
web2d.Group.prototype.setCoordSize=function(width,height){this._peer.setCoordSize(width,height)
};
web2d.Group.prototype.getCoordSize=function(){return this.peer.getCoordSize()
};
web2d.Group.prototype.setCoordOrigin=function(x,y){this._peer.setCoordOrigin(x,y)
};
web2d.Group.prototype.getCoordOrigin=function(){return this._peer.getCoordOrigin()
};
web2d.Group.prototype.getSize=function(){return this._peer.getSize()
};
web2d.Group.prototype.setFill=function(color,opacity){throw"Unsupported operation. Fill can not be set to a group"
};
web2d.Group.prototype.setStroke=function(width,style,color,opacity){throw"Unsupported operation. Stroke can not be set to a group"
};
web2d.Group.prototype.getCoordSize=function(){return this._peer.getCoordSize()
};
web2d.Group.prototype.appendDomChild=function(DomElement){if(!DomElement){throw"Child element can not be null"
}if(DomElement==this){throw"It's not posible to add the group as a child of itself"
}this._peer._native.appendChild(DomElement)
};web2d.Image=function(attributes){var peer=web2d.peer.Toolkit.createImage();
web2d.Element.call(this,peer,attributes)
};
objects.extend(web2d.Image,web2d.Element);
web2d.Image.prototype.getType=function(){return"Image"
};
web2d.Image.prototype.setHref=function(href){this._peer.setHref(href)
};
web2d.Image.prototype.getHref=function(){return this._peer.getHref()
};
web2d.Image.prototype.getSize=function(){return this._peer.getSize()
};web2d.Line=function(attributes){var peer=web2d.peer.Toolkit.createLine();
var defaultAttributes={strokeColor:"#495879",strokeWidth:1};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}web2d.Element.call(this,peer,defaultAttributes)
};
objects.extend(web2d.Line,web2d.Element);
web2d.Line.prototype.getType=function(){return"Line"
};
web2d.Line.prototype.setFrom=function(x,y){this._peer.setFrom(x,y)
};
web2d.Line.prototype.setTo=function(x,y){this._peer.setTo(x,y)
};
web2d.Line.prototype.setArrowStyle=function(startStyle,endStyle){this._peer.setArrowStyle(startStyle,endStyle)
};
web2d.Line.prototype.setPosition=function(cx,cy){throw"Unsupported operation"
};
web2d.Line.prototype.setSize=function(width,height){throw"Unsupported operation"
};
web2d.Line.prototype.setFill=function(color,opacity){throw"Unsupported operation"
};web2d.PolyLine=function(attributes){var peer=web2d.peer.Toolkit.createPolyLine();
var defaultAttributes={strokeColor:"blue",strokeWidth:1,strokeStyle:"solid",strokeOpacity:1};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}web2d.Element.call(this,peer,defaultAttributes)
};
objects.extend(web2d.PolyLine,web2d.Element);
web2d.PolyLine.prototype.getType=function(){return"PolyLine"
};
web2d.PolyLine.prototype.setFrom=function(x,y){this._peer.setFrom(x,y)
};
web2d.PolyLine.prototype.setTo=function(x,y){this._peer.setTo(x,y)
};
web2d.PolyLine.prototype.setStyle=function(style){this._peer.setStyle(style)
};
web2d.PolyLine.prototype.getStyle=function(){return this._peer.getStyle()
};
web2d.PolyLine.buildCurvedPath=function(dist,x1,y1,x2,y2){var signx=1;
var signy=1;
if(x2<x1){signx=-1
}if(y2<y1){signy=-1
}var path;
if(Math.abs(y1-y2)>2){var middlex=x1+((x2-x1>0)?dist:-dist);
path=x1.toFixed(1)+", "+y1.toFixed(1)+" "+middlex.toFixed(1)+", "+y1.toFixed(1)+" "+middlex.toFixed(1)+", "+(y2-5*signy).toFixed(1)+" "+(middlex+5*signx).toFixed(1)+", "+y2.toFixed(1)+" "+x2.toFixed(1)+", "+y2.toFixed(1)
}else{path=x1.toFixed(1)+", "+y1.toFixed(1)+" "+x2.toFixed(1)+", "+y2.toFixed(1)
}return path
};
web2d.PolyLine.buildStraightPath=function(dist,x1,y1,x2,y2){var middlex=x1+((x2-x1>0)?dist:-dist);
return x1+", "+y1+" "+middlex+", "+y1+" "+middlex+", "+y2+" "+x2+", "+y2
};web2d.Rect=function(arc,attributes){if(arc&&arc>1){throw"Arc must be 0<=arc<=1"
}if(arguments.length<=0){var rx=0;
var ry=0
}var peer=web2d.peer.Toolkit.createRect(arc);
var defaultAttributes={width:40,height:40,x:5,y:5,stroke:"1 solid black",fillColor:"green"};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}web2d.Element.call(this,peer,defaultAttributes)
};
objects.extend(web2d.Rect,web2d.Element);
web2d.Rect.prototype.getType=function(){return"Rect"
};
web2d.Rect.prototype.getSize=function(){return this._peer.getSize()
};web2d.Text=function(attributes){var peer=web2d.peer.Toolkit.createText();
web2d.Element.call(this,peer,attributes)
};
objects.extend(web2d.Text,web2d.Element);
web2d.Text.prototype.getType=function(){return"Text"
};
web2d.Text.prototype.setText=function(text){this._peer.setText(text)
};
web2d.Text.prototype.setTextSize=function(width,height){this._peer.setContentSize(width,height)
};
web2d.Text.prototype.getText=function(){return this._peer.getText()
};
web2d.Text.prototype.setFont=function(font,size,style,weight){this._peer.setFont(font,size,style,weight)
};
web2d.Text.prototype.setColor=function(color){this._peer.setColor(color)
};
web2d.Text.prototype.getColor=function(){return this._peer.getColor()
};
web2d.Text.prototype.setStyle=function(style){this._peer.setStyle(style)
};
web2d.Text.prototype.setWeight=function(weight){this._peer.setWeight(weight)
};
web2d.Text.prototype.setFontFamily=function(family){this._peer.setFontFamily(family)
};
web2d.Text.prototype.getFont=function(){return this._peer.getFont()
};
web2d.Text.prototype.setSize=function(size){this._peer.setSize(size)
};
web2d.Text.prototype.getHtmlFontSize=function(){return this._peer.getHtmlFontSize()
};
web2d.Text.prototype.getWidth=function(){return this._peer.getWidth()
};
web2d.Text.prototype.getHeight=function(){return parseInt(this._peer.getHeight())
};web2d.peer.ToolkitVML={init:function(){var domDocument=window.document;
var style=domDocument.createStyleSheet();
try{domDocument.namespaces.add("v","urn:schemas-microsoft-com:vml")
}catch(j){try{domDocument.namespaces.add("v","urn:schemas-microsoft-com:vml","#default#VML")
}catch(k){}}try{style.addRule("v\\:*","behavior:url(#default#VML);  display:inline-block")
}catch(e){style.addRule("v\\:polyline","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:fill","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:stroke","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:oval","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:group","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:image","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:line","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:rect","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:roundrect","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:shape","behavior: url(#default#VML);display:inline-block");
style.addRule("v\\:textbox","behavior: url(#default#VML);display:inline-block")
}},createWorkspace:function(element){return new web2d.peer.vml.WorkspacePeer(element)
},createGroup:function(){return new web2d.peer.vml.GroupPeer()
},createElipse:function(){return new web2d.peer.vml.ElipsePeer()
},createLine:function(){return new web2d.peer.vml.LinePeer()
},createPolyLine:function(){return new web2d.peer.vml.PolyLinePeer()
},createImage:function(){return new web2d.peer.vml.ImagePeer()
},createText:function(){return new web2d.peer.vml.TextBoxPeer()
},createRect:function(arc){return new web2d.peer.vml.RectPeer(arc)
},createArialFont:function(){return new web2d.peer.vml.ArialFont()
},createTimesFont:function(){return new web2d.peer.vml.TimesFont()
},createVerdanaFont:function(){return new web2d.peer.vml.VerdanaFont()
},createTahomaFont:function(){return new web2d.peer.vml.TahomaFont()
}};
web2d.peer.ToolkitSVG={init:function(){},createWorkspace:function(element){return new web2d.peer.svg.WorkspacePeer(element)
},createGroup:function(element){return new web2d.peer.svg.GroupPeer()
},createElipse:function(){return new web2d.peer.svg.ElipsePeer()
},createLine:function(){return new web2d.peer.svg.LinePeer()
},createPolyLine:function(){return new web2d.peer.svg.PolyLinePeer()
},createText:function(){return new web2d.peer.svg.TextPeer()
},createImage:function(){return new web2d.peer.svg.ImagePeer()
},createRect:function(arc){return new web2d.peer.svg.RectPeer(arc)
},createArialFont:function(){return new web2d.peer.svg.ArialFont()
},createTimesFont:function(){return new web2d.peer.svg.TimesFont()
},createVerdanaFont:function(){return new web2d.peer.svg.VerdanaFont()
},createTahomaFont:function(){return new web2d.peer.svg.TahomaFont()
}};
if(core.UserAgent.isSVGSupported()){web2d.peer.Toolkit=web2d.peer.ToolkitSVG
}else{web2d.peer.Toolkit=web2d.peer.ToolkitVML
};web2d.Workspace=function(attributes){this._htmlContainer=this._createDivContainer();
var peer=web2d.peer.Toolkit.createWorkspace(this._htmlContainer);
var defaultAttributes={width:"200px",height:"200px",stroke:"1px solid #edf1be",fillColor:"white",coordOrigin:"0 0",coordSize:"200 200"};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}web2d.Element.call(this,peer,defaultAttributes);
this._htmlContainer.appendChild(this._peer._native);
this._disableTextSelection()
};
objects.extend(web2d.Workspace,web2d.Element);
web2d.Workspace.prototype._disableTextSelection=function(){var contaier=this._htmlContainer;
function disabletext(e){return false
}function reEnable(){return true
}contaier.onselectstart=new Function("return false");
if(window.sidebar){contaier.onmousedown=disabletext;
contaier.onclick=reEnable
}};
web2d.Workspace.prototype.getType=function(){return"Workspace"
};
web2d.Workspace.prototype.appendChild=function(element){if(!element){throw"Child element can not be null"
}var elementType=element.getType();
if(elementType==null){throw"It seems not to be an element ->"+element
}if(elementType=="Workspace"){throw"A workspace can not have a workspace as a child"
}this._peer.appendChild(element._peer)
};
web2d.Workspace.prototype.addItAsChildTo=function(element){if(!element){throw"Workspace div container can not be null"
}element.appendChild(this._htmlContainer)
};
web2d.Workspace.prototype._createDivContainer=function(domElement){var container=window.document.createElement("div");
container.id="workspaceContainer";
container.style.overflow="hidden";
container.style.position="relative";
container.style.top="0px";
container.style.left="0px";
container.style.height="688px";
container.style.border="1px solid red";
return container
};
web2d.Workspace.prototype.setSize=function(width,height){if(core.Utils.isDefined(width)){this._htmlContainer.style.width=width
}if(core.Utils.isDefined(height)){this._htmlContainer.style.height=height
}this._peer.setSize(width,height)
};
web2d.Workspace.prototype.setCoordSize=function(width,height){this._peer.setCoordSize(width,height)
};
web2d.Workspace.prototype.setCoordOrigin=function(x,y){this._peer.setCoordOrigin(x,y)
};
web2d.Workspace.prototype.getCoordOrigin=function(){return this._peer.getCoordOrigin()
};
web2d.Workspace.prototype._getHtmlContainer=function(){return this._htmlContainer
};
web2d.Workspace.prototype.setFill=function(color,opacity){this._htmlContainer.style.backgroundColor=color;
if(opacity||opacity===0){throw"Unsupported operation. Opacity not supported."
}};
web2d.Workspace.prototype.getFill=function(){var color=this._htmlContainer.style.backgroundColor;
return{color:color}
};
web2d.Workspace.prototype.getSize=function(){var width=this._htmlContainer.style.width;
var height=this._htmlContainer.style.height;
return{width:width,height:height}
};
web2d.Workspace.prototype.setStroke=function(width,style,color,opacity){if(style!="solid"){throw"Not supported style stroke style:"+style
}this._htmlContainer.style.border=width+" "+style+" "+color;
if(opacity||opacity===0){throw"Unsupported operation. Opacity not supported."
}};
web2d.Workspace.prototype.getCoordSize=function(){return this._peer.getCoordSize()
};
web2d.Workspace.prototype.removeChild=function(element){if(!element){throw"Child element can not be null"
}if(element==this){throw"It's not posible to add the group as a child of itself"
}var elementType=element.getType();
if(elementType==null){throw"It seems not to be an element ->"+element
}this._peer.removeChild(element._peer)
};
web2d.Workspace.prototype.dumpNativeChart=function(){var elem=this._htmlContainer;
return elem.innerHTML
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

// (C) Copyright 2007 WiseMapping.com. All Rights Reserved
// THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF WiseMapping.com
// The copyright notice above does not evidence any actual or intended
// publication of such source code.
// ....................................................................

var mindplot = {};
mindplot.util = {};
mindplot.commands = {};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.Mindmap = function()
{
    this._branches = [];
    this._name = null;
    this._description = null;
};

mindplot.Mindmap.prototype.getCentralTopic = function()
{
    return this._branches[0];
};

mindplot.Mindmap.prototype.getDescription = function()
{
    return this._description;
};

mindplot.Mindmap.prototype.getId = function()
{
    return this._iconType;
};


mindplot.Mindmap.prototype.setId = function(id)
{
    this._iconType = id;
};

mindplot.Mindmap.prototype.addBranch = function(nodeModel)
{
    core.assert(nodeModel && nodeModel.isNodeModel(), 'Add node must be invoked with model objects');
    if (this._branches.length == 0)
    {
        core.assert(nodeModel.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE, "First element must be the central topic");
        nodeModel.setPosition(0, 0);
    } else
    {
        core.assert(nodeModel.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE, "Mindmaps only have one cental topic");
    }

    this._branches.push(nodeModel);
};

mindplot.Mindmap.prototype.getBranches = function()
{
    return this._branches;
};

mindplot.Mindmap.prototype.connect = function(parent, child)
{
    // Child already has a parent ?
    var branches = this.getBranches();
    core.assert(!child.getParent(), 'Child model seems to be already connected');

    //  Connect node...
    parent._appendChild(child);

    // Remove from the branch ...
    branches.remove(child);
};

mindplot.Mindmap.prototype.disconnect = function(child)
{
    var parent = child.getParent();
    core.assert(child, 'Child can not be null.');
    core.assert(parent, 'Child model seems to be already connected');

    parent._removeChild(child);

    var branches = this.getBranches();
    branches.push(child);

};

mindplot.Mindmap.prototype.hasAlreadyAdded = function(node)
{
    var result = false;

    // Check in not connected nodes.
    var branches = this._branches;
    for (var i = 0; i < branches.length; i++)
    {
        result = branches[i]._isChildNode(node);
        if (result)
        {
            break;
        }
    }
};

mindplot.Mindmap.prototype.createNode = function(type)
{
    core.assert(type, "node type can not be null");
    return this._createNode(type);
};

mindplot.Mindmap.prototype._createNode = function(type)
{
    core.assert(type, 'Node type must be specified.');
    var result = new mindplot.NodeModel(type, this);
    return result;
};

mindplot.Mindmap.prototype.inspect = function()
{
    var result = '';
    result = '{ ';

    var branches = this.getBranches();
    for (var i = 0; i < branches.length; i++)
    {
        var node = branches[i];
        if (i != 0)
        {
            result = result + ', ';
        }

        result = result + this._toString(node);
    }

    result = result + ' } ';

    return result;
};

mindplot.Mindmap.prototype._toString = function(node)
{
    var result = node.inspect();
    var children = node.getChildren();

    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];

        if (i == 0)
        {
            result = result + '-> {';
        } else
        {
            result = result + ', ';
        }

        result = result + this._toString(child);

        if (i == children.length - 1)
        {
            result = result + '}';
        }
    }

    return result;
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.NodeModel = function(type, mindmap)
{
    core.assert(type, 'Node type can not be null');
    core.assert(mindmap, 'mindmap can not be null');

    this._order = null;
    this._type = type;
    this._children = [];
    this._icons = [];
    this._links = [];
    this._notes = [];
    this._size = {width:50,height:20};
    this._position = null;
    this._id = mindplot.NodeModel._nextUUID();
    this._mindmap = mindmap;
    this._text = null;
    this._shapeType = null;
    this._fontFamily = null;
    this._fontSize = null;
    this._fontStyle = null;
    this._fontWeight = null;
    this._fontColor = null;
    this._borderColor = null;
    this._backgroundColor = null;
    this._areChildrenShrinked = false;
};

mindplot.NodeModel.prototype.clone = function()
{
    var result = new mindplot.NodeModel(this._type, this._mindmap);
    result._order = this._order;
    result._type = this._type;
    result._children = this._children.map(function(item,index)
    {
        var model = item.clone();
        model._parent = result;
        return model;
    });


    result._icons = this._icons;
    result._links = this._links;
    result._notes = this._notes;
    result._size = this._size;
    result._position = this._position;
    result._id = this._id;
    result._mindmap = this._mindmap;
    result._text = this._text;
    result._shapeType = this._shapeType;
    result._fontFamily = this._fontFamily;
    result._fontSize = this._fontSize;
    result._fontStyle = this._fontStyle;
    result._fontWeight = this._fontWeight;
    result._fontColor = this._fontColor;
    result._borderColor = this._borderColor;
    result._backgroundColor = this._backgroundColor;
    result._areChildrenShrinked = this._areChildrenShrinked;
    return result;
};

mindplot.NodeModel.prototype.areChildrenShrinked = function()
{
    return this._areChildrenShrinked;
};

mindplot.NodeModel.prototype.setChildrenShrinked = function(value)
{
    this._areChildrenShrinked = value;
};

mindplot.NodeModel.prototype.getId = function()
{
    return this._id;
};


mindplot.NodeModel.prototype.setId = function(id)
{
    this._id = id;
};

mindplot.NodeModel.prototype.getType = function()
{
    return this._type;
};

mindplot.NodeModel.prototype.setText = function(text)
{
    this._text = text;
};

mindplot.NodeModel.prototype.getText = function()
{
    return this._text;
};

mindplot.NodeModel.prototype.isNodeModel = function()
{
    return true;
};

mindplot.NodeModel.prototype.isConnected = function()
{
    return this._parent != null;
};

mindplot.NodeModel.prototype.createLink = function(url)
{
    core.assert(url, 'Link URL must be specified.');
    return new mindplot.LinkModel(url, this);
};

mindplot.NodeModel.prototype.addLink = function(link)
{
    core.assert(link && link.isLinkModel(), 'Only LinkModel can be appended to Mindmap object as links');
    this._links.push(link);
};

mindplot.NodeModel.prototype._removeLink = function(link)
{
    core.assert(link && link.isLinkModel(), 'Only LinkModel can be appended to Mindmap object as links');
    this._links.remove(link);
};

mindplot.NodeModel.prototype.createNote = function(text)
{
    core.assert(text, 'note text must be specified.');
    return new mindplot.NoteModel(text, this);
};

mindplot.NodeModel.prototype.addNote = function(note)
{
    core.assert(note && note.isNoteModel(), 'Only NoteModel can be appended to Mindmap object as links');
    this._notes.push(note);
};

mindplot.NodeModel.prototype._removeNote = function(note)
{
    core.assert(note && note.isNoteModel(), 'Only NoteModel can be appended to Mindmap object as links');
    this._notes.remove(note);
};

mindplot.NodeModel.prototype.createIcon = function(iconType)
{
    core.assert(iconType, 'IconType must be specified.');
    return new mindplot.IconModel(iconType, this);
};

mindplot.NodeModel.prototype.addIcon = function(icon)
{
    core.assert(icon && icon.isIconModel(), 'Only IconModel can be appended to Mindmap object as icons');
    this._icons.push(icon);
};

mindplot.NodeModel.prototype._removeIcon = function(icon)
{
    core.assert(icon && icon.isIconModel(), 'Only IconModel can be appended to Mindmap object as icons');
    this._icons.remove(icon);
};

mindplot.NodeModel.prototype.removeLastIcon = function()
{
    this._icons.pop();
};

mindplot.NodeModel.prototype._appendChild = function(child)
{
    core.assert(child && child.isNodeModel(), 'Only NodeModel can be appended to Mindmap object');
    this._children.push(child);
    child._parent = this;
};

mindplot.NodeModel.prototype._removeChild = function(child)
{
    core.assert(child && child.isNodeModel(), 'Only NodeModel can be appended to Mindmap object.');
    this._children.remove(child);
    child._parent = null;
};

mindplot.NodeModel.prototype.setPosition = function(x, y)
{
    core.assert(core.Utils.isDefined(x), "x coordinate must be defined");
    core.assert(core.Utils.isDefined(y), "y coordinate must be defined");

    if (!core.Utils.isDefined(this._position))
    {
        this._position = new core.Point();
    }
    this._position.x = parseInt(x);
    this._position.y = parseInt(y);
};

mindplot.NodeModel.prototype.getPosition = function()
{
    return this._position;
};

mindplot.NodeModel.prototype.setSize = function(width, height)
{
    this._size.width = width;
    this._size.height = height;
};

mindplot.NodeModel.prototype.getSize = function()
{
    return {width:this._size.width,height:this._size.height};
};

mindplot.NodeModel.prototype.getChildren = function()
{
    return this._children;
};

mindplot.NodeModel.prototype.getIcons = function()
{
    return this._icons;
};

mindplot.NodeModel.prototype.getLinks = function()
{
    return this._links;
};

mindplot.NodeModel.prototype.getNotes = function()
{
    return this._notes;
};

mindplot.NodeModel.prototype.getParent = function()
{
    return this._parent;
};

mindplot.NodeModel.prototype.getMindmap = function()
{
    return this._mindmap;
};

mindplot.NodeModel.prototype.setParent = function(parent)
{
    core.assert(parent != this, 'The same node can not be parent and child if itself.');
    this._parent = parent;
};

mindplot.NodeModel.prototype.canBeConnected = function(sourceModel, sourcePosition, targetTopicHeight)
{
    core.assert(sourceModel != this, 'The same node can not be parent and child if itself.');
    core.assert(sourcePosition, 'childPosition can not be null.');
    core.assert(core.Utils.isDefined(targetTopicHeight), 'childrenWidth can not be null.');

    // Only can be connected if the node is in the left or rigth.
    var targetModel = this;
    var mindmap = targetModel.getMindmap();
    var targetPosition = targetModel.getPosition();
    var result = false;

    if (sourceModel.getType() == mindplot.NodeModel.MAIN_TOPIC_TYPE)
    {
        // Finally, check current node ubication.
        var targetTopicSize = targetModel.getSize();
        var yDistance = Math.abs(sourcePosition.y - targetPosition.y);

        if (yDistance <= targetTopicHeight / 2)
        {
            // Circular connection ?
            if (!sourceModel._isChildNode(this))
            {
                var toleranceDistance = (targetTopicSize.width / 2) + targetTopicHeight;

                var xDistance = sourcePosition.x - targetPosition.x;
                var isTargetAtRightFromCentral = targetPosition.x >= 0;

                if (isTargetAtRightFromCentral)
                {
                    if (xDistance >= 0 && xDistance <= mindplot.NodeModel.MAIN_TOPIC_TO_MAIN_TOPIC_DISTANCE + (targetTopicSize.width / 2))
                    {
                        result = true;
                    }

                } else
                {
                    if (xDistance <= 0 && Math.abs(xDistance) <= mindplot.NodeModel.MAIN_TOPIC_TO_MAIN_TOPIC_DISTANCE + (targetTopicSize.width / 2))
                    {
                        result = true;
                    }
                }
            }
        }
    } else
    {
        throw "No implemented yet";
    }
    return result;
};

mindplot.NodeModel.MAIN_TOPIC_TO_MAIN_TOPIC_DISTANCE = 60;

mindplot.NodeModel.prototype._isChildNode = function(node)
{
    var result = false;
    if (node == this)
    {
        result = true;
    } else
    {
        var children = this.getChildren();
        for (var i = 0; i < children.length; i++)
        {
            var child = children[i];
            result = child._isChildNode(node);
            if (result)
            {
                break;
            }
        }
    }
    return result;

};

mindplot.NodeModel.prototype.connectTo = function(parent)
{
    var mindmap = this.getMindmap();
    mindmap.connect(parent, this);
    this._parent = parent;
};

mindplot.NodeModel.prototype.disconnect = function()
{
    var mindmap = this.getMindmap();
    mindmap.disconnect(this);
};

mindplot.NodeModel.prototype.getOrder = function()
{
    return this._order;
};

mindplot.NodeModel.prototype.getShapeType = function()
{
    return this._shapeType;
};

mindplot.NodeModel.prototype.setShapeType = function(type)
{
    this._shapeType = type;
};

mindplot.NodeModel.prototype.setOrder = function(value)
{
    this._order = value;
};

mindplot.NodeModel.prototype.setFontFamily = function(value)
{
    this._fontFamily = value;
};

mindplot.NodeModel.prototype.getOrder = function()
{
    return this._order;
};

mindplot.NodeModel.prototype.setFontFamily = function(value)
{
    this._fontFamily = value;
};

mindplot.NodeModel.prototype.getFontFamily = function()
{
    return this._fontFamily;
};

mindplot.NodeModel.prototype.setFontStyle = function(value)
{
    this._fontStyle = value;
};

mindplot.NodeModel.prototype.getFontStyle = function()
{
    return this._fontStyle;
};

mindplot.NodeModel.prototype.setFontWeight = function(value)
{
    this._fontWeight = value;
};

mindplot.NodeModel.prototype.getFontWeight = function()
{
    return this._fontWeight;
};

mindplot.NodeModel.prototype.setFontColor = function(value)
{
    this._fontColor = value;
};

mindplot.NodeModel.prototype.getFontColor = function()
{
    return this._fontColor;
};

mindplot.NodeModel.prototype.setFontSize = function(value)
{
    this._fontSize = value;
};

mindplot.NodeModel.prototype.getFontSize = function()
{
    return this._fontSize;
};

mindplot.NodeModel.prototype.getBorderColor = function()
{
    return this._borderColor;
};

mindplot.NodeModel.prototype.setBorderColor = function(color)
{
    this._borderColor = color;
};

mindplot.NodeModel.prototype.getBackgroundColor = function()
{
    return this._backgroundColor;
};

mindplot.NodeModel.prototype.setBackgroundColor = function(color)
{
    this._backgroundColor = color;
};

mindplot.NodeModel.prototype.deleteNode = function()
{
    var mindmap = this._mindmap;

    // if it has children nodes, Their must be disconnected.
    var lenght = this._children;
    for (var i = 0; i < lenght; i++)
    {
        var child = this._children[i];
        mindmap.disconnect(child);
    }

    var parent = this._parent;
    if (parent)
    {
        // if it is connected, I must remove it from the parent..
        mindmap.disconnect(this);
    }

    // It's an isolated node. It must be a hole branch ...
    var branches = mindmap.getBranches();
    branches.remove(this);

};

/**
 * @todo: This method must be implemented.
 */
mindplot.NodeModel._nextUUID = function()
{
    if (!this._uuid)
    {
        this._uuid = 0;
    }

    this._uuid = this._uuid + 1;
    return this._uuid;
};


mindplot.NodeModel.prototype.inspect = function()
{
    return '(type:' + this.getType() + ' , id: ' + this.getId() + ')';
};

mindplot.NodeModel.CENTRAL_TOPIC_TYPE = 'CentralTopic';
mindplot.NodeModel.MAIN_TOPIC_TYPE = 'MainTopic';
mindplot.NodeModel.DRAGGED_TOPIC_TYPE = 'DraggedTopic';

mindplot.NodeModel.SHAPE_TYPE_RECT = 'rectagle';
mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT = 'rounded rectagle';
mindplot.NodeModel.SHAPE_TYPE_ELIPSE = 'elipse';
mindplot.NodeModel.SHAPE_TYPE_LINE = 'line';


/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.MindmapDesigner = function(profile, divElement, persistanManager)
{
    core.assert(persistanManager, "Persistant manager must be defined");
    core.assert(core.Utils.isDefined(profile.zoom), "zoom must be defined");

    // Undo manager ...
    this._actionRunner = new mindplot.DesignerActionRunner(this);
    mindplot.DesignerActionRunner.setInstance(this._actionRunner);

    // Initial Zoom
    this._zoom = profile.zoom;
    this._viewMode = profile.viewMode;

    // Init Screen manager..
    var screenManager = new mindplot.ScreenManager(profile.width, profile.height, divElement);

    //create editor
    this._editor = new mindplot.TextEditor(screenManager, this._actionRunner);

    var workspace = new mindplot.Workspace(profile, screenManager, this._zoom);
    this._workspace = workspace;


    // Init layout managers ...
    this._topics = [];
    this._dragTopicPositioner = new mindplot.DragTopicPositioner(this._workspace, this._topics);

    // Register handlers..
    this._registerEvents();

    // Selected node
    this._nodeOnFocus = null;

    // Init dragger manager.
    this._dragger = this._buildDragManager(workspace);

    this._persistantManager = persistanManager;

    // Add shapes to speed up the loading process ...
    mindplot.DragTopic.initialize(workspace);

    this._events = {};
};


mindplot.MindmapDesigner.prototype.getDragTopicPositioner = function()
{
    return this._dragTopicPositioner;
};

mindplot.MindmapDesigner.prototype._getTopics = function()
{
    return this._topics;
};

mindplot.MindmapDesigner.prototype.getCentralTopic = function()
{
    var topics = this._getTopics();
    return topics[0];
};


mindplot.MindmapDesigner.prototype.addEventListener = function(eventType, listener)
{

    this._events[eventType] = listener;

}

mindplot.MindmapDesigner.prototype._fireEvent = function(eventType, event)
{
    var listener = this._events[eventType];
    if (listener != null)
    {
        listener(event);
    }
}

mindplot.MindmapDesigner.prototype._buildDragManager = function(workspace)
{
    // Init dragger manager.
    var dragger = new mindplot.DragManager(workspace);
    var screen = workspace.getScreenManager();
    var topics = this._getTopics();

    var dragTopicPositioner = this.getDragTopicPositioner();
    var mindmapDesigner = this;
    var elem = this;

    dragger.addEventListener('startdragging', function(event, node)
    {
        // Enable all mouse events.
        for (var i = 0; i < topics.length; i++)
        {
            topics[i].setMouseEventsEnabled(false);
        }
    });

    dragger.addEventListener('dragging', function(event, dragTopic)
    {
        // Update the state and connections of the topic ...
        dragTopicPositioner.positionateDragTopic(dragTopic);
    });

    dragger.addEventListener('enddragging', function(event, dragTopic)
    {
        // Enable all mouse events.
        for (var i = 0; i < topics.length; i++)
        {
            topics[i].setMouseEventsEnabled(true);
        }
        // Topic must be positioned in the real board postion.
        if (dragTopic._isInTheWorkspace)
        {
            var draggedTopic = dragTopic.getDraggedTopic();

            // Hide topic during draw ...
            draggedTopic.setBranchVisibility(false);
            var parentNode = draggedTopic.getParent();
            dragTopic.updateDraggedTopic(workspace);


            // Make all node visible ...
            draggedTopic.setVisibility(true);
            if (parentNode != null)
            {
                parentNode.setBranchVisibility(true);
            }
        }
    });

    return dragger;
};

mindplot.MindmapDesigner.prototype._registerEvents = function()
{
    var mindmapDesigner = this;
    var workspace = this._workspace;
    var screenManager = workspace.getScreenManager();

    if (!this._viewMode)
    {

        // Initialize workspace event listeners.
        // Create nodes on double click...
        workspace.addEventListener('click', function(event)
        {
            mindmapDesigner.getEditor().lostFocus();
            // @todo: Puaj hack...
            mindmapDesigner._cleanScreen();
        });

        workspace.addEventListener('dblclick', function(event)
        {
            mindmapDesigner.getEditor().lostFocus();
            // Get mouse position
            var pos = screenManager.getWorkspaceMousePosition(event);

            // Create a new topic model ...
            var mindmap = mindmapDesigner.getMindmap();
            var model = mindmap.createNode(mindplot.NodeModel.MAIN_TOPIC_TYPE);
            model.setPosition(pos.x, pos.y);

            // Get central topic ...
            var centralTopic = mindmapDesigner.getCentralTopic();
            var centralTopicId = centralTopic.getId();

            // Execute action ...
            var command = new mindplot.commands.AddTopicCommand(model, centralTopicId);
            this._actionRunner.execute(command);
        }.bind(this));
    }
    ;
};

mindplot.MindmapDesigner.prototype._buildNodeGraph = function(model)
{
    var workspace = this._workspace;
    var elem = this;

    // Create node graph ...
    var topic = mindplot.NodeGraph.create(model);

    // Append it to the workspace ...
    var topics = this._topics;
    topics.push(topic);

    // Add Topic events ...
    this._registerListenersOnNode(topic);

    // Connect Topic ...
    var isConnected = model.isConnected();
    if (isConnected)
    {
        // Improve this ...
        var targetTopicModel = model.getParent();
        var targetTopicId = targetTopicModel.getId();
        var targetTopic = null;

        for (var i = 0; i < topics.length; i++)
        {
            var t = topics[i];
            if (t.getModel() == targetTopicModel)
            {
                targetTopic = t;
                // Disconnect the node. It will be connected again later ...
                model.disconnect();
                break;
            }
        }
        core.assert(targetTopic, "Could not find a topic to connect");
        topic.connectTo(targetTopic, workspace);
    }

    return  topic;
};

mindplot.MindmapDesigner.prototype.onNodeFocusEvent = function(topicGraph, event)
{
    this.getEditor().lostFocus();
    var topics = this._topics;
    // Disable all nodes on focus but not the current if Ctrl key isn't being pressed
    if (!core.Utils.isDefined(event) || event.ctrlKey == false)
    {
        for (var i = 0; i < topics.length; i++)
        {
            var node = topics[i];
            if (node.isOnFocus() && node != topicGraph)
            {
                node.setOnFocus(false);
            }
        }
    }
};

mindplot.MindmapDesigner.prototype._registerListenersOnNode = function(topic)
{
    // Register node listeners ...
    var elem = this;
    var topics = this._topics;
    topic.addEventListener('onfocus', function(event)
    {
        elem.onNodeFocusEvent.attempt([topic, event], elem);
    });

    // Add drag behaviour ...
    if (topic.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {

        // Central Topic doesn't support to be dragged
        var dragger = this._dragger;
        dragger.add(topic);
    }

    // Register editor events ...
    if (!this._viewMode)
    {
        this._editor.listenEventOnNode(topic, 'dblclick', true);
    }

};
mindplot.MindmapDesigner.prototype.zoomOut = function()
{
    var scale = this._zoom * 1.2;
    if (scale <= 4)
    {
        this._zoom = scale;
        this._workspace.setZoom(this._zoom);
    }
    else
    {
        core.Monitor.getInstance().logMessage('Sorry, no more zoom can be applied. \n Why do you need more?');
    }

};

mindplot.MindmapDesigner.prototype.zoomIn = function()
{
    var scale = this._zoom / 1.2;
    if (scale >= 0.3)
    {
        this._zoom = scale;
        this._workspace.setZoom(this._zoom);
    }
    else
    {
        core.Monitor.getInstance().logMessage('Sorry, no more zoom can be applied. \n Why do you need more?');
    }
};

mindplot.MindmapDesigner.prototype.createChildForSelectedNode = function()
{

    var nodes = this._getSelectedNodes();
    if (nodes.length <= 0)
    {
        // If there are more than one node selected,
        core.Monitor.getInstance().logMessage('Could not create a topic. Only one node must be selected.');
        return;

    }
    if (nodes.length > 1)
    {

        // If there are more than one node selected,
        core.Monitor.getInstance().logMessage('Could not create a topic. One topic must be selected.');
        return;
    }

    // Add new node ...
    var centalTopic = nodes[0];
    var parentTopicId = centalTopic.getId();
    var childModel = centalTopic.createChildModel();

    var command = new mindplot.commands.AddTopicCommand(childModel, parentTopicId);
    this._actionRunner.execute(command);
};

mindplot.MindmapDesigner.prototype.createSiblingForSelectedNode = function()
{
    var nodes = this._getSelectedNodes();
    if (nodes.length <= 0)
    {
        // If there are more than one node selected,
        core.Monitor.getInstance().logMessage('Could not create a topic. Only one node must be selected.');
        return;

    }
    if (nodes.length > 1)
    {
        // If there are more than one node selected,
        core.Monitor.getInstance().logMessage('Could not create a topic. One topic must be selected.');
        return;
    }

    var topic = nodes[0];
    if (topic.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        // Central topic doesn't have siblings ...
        this.createChildForSelectedNode();

    } else
    {
        var parentTopic = topic.getOutgoingConnectedTopic();
        var siblingModel = topic.createSiblingModel();
        var parentTopicId = parentTopic.getId();
        var command = new mindplot.commands.AddTopicCommand(siblingModel, parentTopicId);

        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.needsSave = function()
{
    return this._actionRunner.hasBeenChanged();
}

mindplot.MindmapDesigner.prototype.autoSaveEnabled = function(value)
{
    if (value)
    {
        var autosave = function() {

            if (this.needsSave())
            {
                this.save(null, false);
            }
        };
        autosave.bind(this).periodical(30000);
    }
}

mindplot.MindmapDesigner.prototype.save = function(onSavedHandler, saveHistory)
{
    var persistantManager = this._persistantManager;
    var mindmap = this._mindmap;

    var xmlChart = this._workspace.dumpNativeChart();
    var chatType = core.UserAgent.isVMLSupported() ? "VML" : "SVG";
    if (core.UserAgent.isVMLSupported())
    {
        // Remove first line: "<?xml:namespace prefix = v ns = "urn:schemas-microsoft-com:vml" />"
        xmlChart = xmlChart.replace('<?xml:namespace prefix = v ns = "urn:schemas-microsoft-com:vml" />', "");
    }

    var properties = {zoom:this._zoom};
    persistantManager.save(mindmap, chatType, xmlChart, properties, onSavedHandler, saveHistory);
    this._fireEvent("save", {type:saveHistory});

    // Refresh undo state...
    this._actionRunner.markAsChangeBase();
};

mindplot.MindmapDesigner.prototype.loadFromXML = function(mapId, xmlContent)
{
    core.assert(xmlContent, 'mindmapId can not be null');
    core.assert(xmlContent, 'xmlContent can not be null');

    // Explorer Hack with local files ...
    var domDocument = core.Utils.createDocumentFromText(xmlContent);

    var serializer = new mindplot.XMLMindmapSerializer();
    var mindmap = serializer.loadFromDom(domDocument);

    this._loadMap(mapId, mindmap);

    // Place the focus on the Central Topic
    var centralTopic = this.getCentralTopic();
    this._goToNode.attempt(centralTopic, this);

    this._fireEvent("loadsuccess");

};

mindplot.MindmapDesigner.prototype.load = function(mapId)
{
    core.assert(mapId, 'mapName can not be null');

    // Build load function ...
    var persistantManager = this._persistantManager;

    // Loading mindmap ...
    var mindmap = persistantManager.load(mapId);

    // Finally, load the map in the editor ...
    this._loadMap(mapId, mindmap);

    // Place the focus on the Central Topic
    var centralTopic = this.getCentralTopic();
    this._goToNode.attempt(centralTopic, this);

    this._fireEvent("loadsuccess");
};

mindplot.MindmapDesigner.prototype._loadMap = function(mapId, mindmapModel)
{
    var designer = this;
    if (mindmapModel != null)
    {
        mindmapModel.setId(mapId);
        designer._mindmap = mindmapModel;

        // Building node graph ...
        var branches = mindmapModel.getBranches();
        for (var i = 0; i < branches.length; i++)
        {
            // NodeModel -> NodeGraph ...
            var nodeModel = branches[i];
            var nodeGraph = this._nodeModelToNodeGraph(nodeModel);

            // Update shrink render state...
            nodeGraph.setBranchVisibility(true);
        }
    }
    this._fireEvent("loadsuccess");

};


mindplot.MindmapDesigner.prototype.getMindmap = function()
{
    return this._mindmap;
};

mindplot.MindmapDesigner.prototype.undo = function()
{
    this._actionRunner.undo();
};

mindplot.MindmapDesigner.prototype.redo = function()
{
    this._actionRunner.redo();
};

mindplot.MindmapDesigner.prototype._nodeModelToNodeGraph = function(nodeModel)
{
    core.assert(nodeModel, "Node model can not be null");
    var nodeGraph = this._buildNodeGraph(nodeModel);

    var children = nodeModel.getChildren().slice();

    // Sort children by order to solve adding order ...
    if (children.length > 0)
    {
        var oldChildren = children;
        children = [];
        for (var i = 0; i < oldChildren.length; i++)
        {
            var child = oldChildren[i];
            var order = child.getOrder();
            if (order != null)
            {
                children[order] = child;
            } else
            {
                children.push(child);
            }
        }
    }

    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];
        this._nodeModelToNodeGraph(children[i]);
    }

    var workspace = this._workspace;
    workspace.appendChild(nodeGraph);
    return nodeGraph;
};

mindplot.MindmapDesigner.prototype.getEditor = function()
{
    return this._editor;
};

mindplot.MindmapDesigner.prototype._removeNode = function(node)
{
    if (node.getTopicType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        var parent = node._parent;
        node.disconnect(this._workspace);

        //remove children
        while (node._getChildren().length > 0)
        {
            this._removeNode(node._getChildren()[0]);
        }

        this._workspace.removeChild(node);
        this._topics.remove(node);

        // Delete this node from the model...
        var model = node.getModel();
        model.deleteNode();

        if (parent)
        {
            this._goToNode(parent);
        }
    }
};

mindplot.MindmapDesigner.prototype.deleteCurrentNode = function()
{

    var validateFunc = function(topic) {
        return topic.getTopicType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE
    };
    var validateError = 'Central topic can not be deleted.';
    var topicsIds = this._setValidSelectedTopicsIds(validateFunc, validateError);
    if (topicsIds.length > 0)
    {
        var command = new mindplot.commands.DeleteTopicCommand(topicsIds);
        this._actionRunner.execute(command);
    }

};

mindplot.MindmapDesigner.prototype.setFont2SelectedNode = function(font)
{
    var topicsIds = this._setValidSelectedTopicsIds();
    if (topicsIds.length > 0)
    {
        var commandFunc = function(topic, font)
        {
            var result = topic.getFontFamily();
            topic.setFontFamily(font, true);

            var updated = function() {
                topic.updateNode();
            };
            updated.delay(0);
            return result;
        }
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, font, topicsIds);
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.setStyle2SelectedNode = function()
{
    var topicsIds = this._setValidSelectedTopicsIds();
    if (topicsIds.length > 0)
    {
        var commandFunc = function(topic)
        {
            var result = topic.getFontStyle();
            var style = (result == "italic") ? "normal" : "italic";
            topic.setFontStyle(style, true);
            return result;
        }
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, "", topicsIds);
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.setFontColor2SelectedNode = function(color)
{
    var topicsIds = this._setValidSelectedTopicsIds();
    if (topicsIds.length > 0)
    {
        var commandFunc = function(topic, color)
        {
            var result = topic.getFontColor();
            topic.setFontColor(color, true);
            return result;
        }
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, color, topicsIds);
        command.discartDuplicated = "fontColorCommandId";
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.setBackColor2SelectedNode = function(color)
{

    var validateFunc = function(topic) {
        return topic.getShapeType() != mindplot.NodeModel.SHAPE_TYPE_LINE
    };
    var validateError = 'Color can not be setted to line topics.';
    var topicsIds = this._setValidSelectedTopicsIds(validateFunc, validateError);

    if (topicsIds.length > 0)
    {
        var commandFunc = function(topic, color)
        {
            var result = topic.getBackgroundColor();
            topic.setBackgroundColor(color);
            return result;
        }
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, color, topicsIds);
        command.discartDuplicated = "backColor";
        this._actionRunner.execute(command);
    }
};


mindplot.MindmapDesigner.prototype._setValidSelectedTopicsIds = function(validate, errorMsg)
{
    var result = [];
    var selectedNodes = this._getSelectedNodes();
    if (selectedNodes.length == 0)
    {
        core.Monitor.getInstance().logMessage('At least one topic must be selected to execute this operation.');
    } else
    {
        for (var i = 0; i < selectedNodes.length; i++)
        {
            var selectedNode = selectedNodes[i];
            var isValid = true;
            if (validate)
            {
                isValid = validate(selectedNode);
            }

            // Add node only if it's valid.
            if (isValid)
            {
                result.push(selectedNode.getId());
            } else
            {
                core.Monitor.getInstance().logMessage(errorMsg);
            }
        }
    }
    return result;
}

mindplot.MindmapDesigner.prototype.setBorderColor2SelectedNode = function(color)
{
    var validateFunc = function(topic) {
        return topic.getShapeType() != mindplot.NodeModel.SHAPE_TYPE_LINE
    };
    var validateError = 'Color can not be setted to line topics.';
    var topicsIds = this._setValidSelectedTopicsIds(validateFunc, validateError);

    if (topicsIds.length > 0)
    {
        var commandFunc = function(topic, color)
        {
            var result = topic.getBorderColor();
            topic.setBorderColor(color);
            return result;
        }
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, color, topicsIds);
        command.discartDuplicated = "borderColorCommandId";
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.setFontSize2SelectedNode = function(size)
{
    var topicsIds = this._setValidSelectedTopicsIds();
    if (topicsIds.length > 0)
    {
        var commandFunc = function(topic, size)
        {
            var result = topic.getFontSize();
            topic.setFontSize(size, true);

            var updated = function() {
                topic.updateNode();
            };
            updated.delay(0);
            return result;
        }
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, size, topicsIds);
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.setShape2SelectedNode = function(shape)
{
    var validateFunc = function(topic) {
        return !(topic.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE && shape == mindplot.NodeModel.SHAPE_TYPE_LINE)
    };
    var validateError = 'Central Topic shape can not be changed to line figure.';
    var topicsIds = this._setValidSelectedTopicsIds(validateFunc, validateError);

    if (topicsIds.length > 0)
    {
        var commandFunc = function(topic, size)
        {
            var result = topic.getShapeType();
            topic.setShapeType(size, true);
            return result;
        }
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, shape, topicsIds);
        this._actionRunner.execute(command);
    }
};


mindplot.MindmapDesigner.prototype.setWeight2SelectedNode = function()
{
    var topicsIds = this._setValidSelectedTopicsIds();
    if (topicsIds.length > 0)
    {
        var commandFunc = function(topic)
        {
            var result = topic.getFontWeight();
            var weight = (result == "bold") ? "normal" : "bold";
            topic.setFontWeight(weight, true);

            var updated = function() {
                topic.updateNode();
            };
            updated.delay(0);
            return result;
        }
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, "", topicsIds);
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.addImage2SelectedNode = function(iconType)
{

    var topicsIds = this._setValidSelectedTopicsIds();
    if (topicsIds.length > 0)
    {

        var command = new mindplot.commands.AddIconToTopicCommand(topicsIds[0], iconType);
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.addLink2Node = function(url)
{
    var topicsIds = this._setValidSelectedTopicsIds();
    if (topicsIds.length > 0)
    {
        var command = new mindplot.commands.AddLinkToTopicCommand(topicsIds[0], url);
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.addLink2SelectedNode = function()
{
    var selectedTopics = this.getSelectedNodes();
        var topic = null;
        if (selectedTopics.length > 0)
        {
            topic = selectedTopics[0];
            if (!$chk(topic._hasLink)) {
                var msg = new Element('div');
                var urlText = new Element('div').inject(msg);
                urlText.innerHTML = "URL:"
                var formElem = new Element('form', {'action': 'none', 'id':'linkFormId'});
                var urlInput = new Element('input', {'type': 'text', 'size':30});
                urlInput.inject(formElem);
                formElem.inject(msg)

                var okButtonId = "linkOkButtonId";
                formElem.addEvent('submit', function(e)
                {
                    $(okButtonId).fireEvent('click', e);
                    e = new Event(e);
                    e.stop();
                });


                var okFunction = function() {
                    var url = urlInput.value;
                    var result = false;
                    if ("" != url.trim())
                    {
                        this.addLink2Node(url);
                        result = true;
                    }
                    return result;
                }.bind(this);
                var dialog = mindplot.LinkIcon.buildDialog(this, okFunction, okButtonId);
                dialog.adopt(msg).show();

                // IE doesn't like too much this focus action...
                if(!core.UserAgent.isIE())
                {
                    urlInput.focus();
                }
            }
        } else
        {
            core.Monitor.getInstance().logMessage('At least one topic must be selected to execute this operation.');
        }
};

mindplot.MindmapDesigner.prototype.addNote2Node = function(text)
{
    var topicsIds = this._setValidSelectedTopicsIds();
    if (topicsIds.length > 0)
    {
        var command = new mindplot.commands.AddNoteToTopicCommand(topicsIds[0], text);
        this._actionRunner.execute(command);
    }
};

mindplot.MindmapDesigner.prototype.addNote2SelectedNode = function()
{
    var selectedTopics = this.getSelectedNodes();
        var topic = null;
        if (selectedTopics.length > 0)
        {
            topic = selectedTopics[0];
            if (!$chk(topic._hasNote)) {
                var msg = new Element('div');
                var text = new Element('div').inject(msg);
                var formElem = new Element('form', {'action': 'none', 'id':'noteFormId'});
                var textInput = new Element('textarea').setStyles({'width':280, 'height':50});
                textInput.inject(formElem);
                formElem.inject(msg);

                var okButtonId = "noteOkButtonId";
                formElem.addEvent('submit', function(e)
                {
                    $(okButtonId).fireEvent('click', e);
                    e = new Event(e);
                    e.stop();
                });


                var okFunction = function() {
                    var text = textInput.value;
                    var result = false;
                    if ("" != text.trim())
                    {
                        this.addNote2Node(text);
                        result = true;
                    }
                    return result;
                }.bind(this);
                var dialog = mindplot.Note.buildDialog(this, okFunction, okButtonId);
                dialog.adopt(msg).show();

                // IE doesn't like too much this focus action...
                if(!core.UserAgent.isIE())
                {
                    textInput.focus();
                }
            }
        } else
        {
            core.Monitor.getInstance().logMessage('At least one topic must be selected to execute this operation.');
        }
};

mindplot.MindmapDesigner.prototype.removeLastImageFromSelectedNode = function()
{
    var nodes = this._getSelectedNodes();
    if (nodes.length == 0)
    {
        core.Monitor.getInstance().logMessage('A topic must be selected in order to execute this operation.');
    } else
    {
        var elem = nodes[0];
        elem.removeLastIcon(this);
        var executor = function(editor)
        {
            return function()
            {
                elem.updateNode();
            };
        };

        setTimeout(executor(this), 0);
    }
};


mindplot.MindmapDesigner.prototype._getSelectedNodes = function()
{
    var result = new Array();
    for (var i = 0; i < this._topics.length; i++)
    {
        if (this._topics[i].isOnFocus())
        {
            result.push(this._topics[i]);
        }
    }
    return result;
};

mindplot.MindmapDesigner.prototype.getSelectedNodes = function()
{
    return this._getSelectedNodes();
};


mindplot.MindmapDesigner.prototype.keyEventHandler = function(event)
{
    var evt = (event) ? event : window.event;

    if (evt.keyCode == 8)
    {
        if (event)
        {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
            new Event(event).stop();
        }
        else
            evt.returnValue = false;
    }
    else
    {
        evt = new Event(event);
        var key = evt.key;
        if (!this._editor._isVisible())
        {
            if (((evt.code >= 65 && evt.code <= 90) || (evt.code >= 48 && evt.code <= 57)) && !(evt.control || evt.meta))
            {
                if($chk(evt.shift)){
                    key = key.toUpperCase();
                }
                this._showEditor(key);
            }
            else
            {
                switch (key)
                        {
                    case 'delete':
                        this.deleteCurrentNode();
                        break;
                    case 'enter':
                        if (!evt.meta)
                        {
                            this.createSiblingForSelectedNode();
                            break;
                        }
                    case 'insert':
                        this.createChildForSelectedNode();
                        break;
                    case 'right':
                        var nodes = this._getSelectedNodes();
                        if (nodes.length > 0)
                        {
                            var node = nodes[0];
                            if (node.getTopicType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
                            {
                                this._goToSideChild(node, 'RIGHT');
                            }
                            else
                            {
                                if (node.getPosition().x < 0)
                                {
                                    this._goToParent(node);
                                }
                                else if (!node.areChildrenShrinked())
                                {
                                    this._goToChild(node);
                                }
                            }
                        }
                        break;
                    case 'left':
                        var nodes = this._getSelectedNodes();
                        if (nodes.length > 0)
                        {
                            var node = nodes[0];
                            if (node.getTopicType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
                            {
                                this._goToSideChild(node, 'LEFT');
                            }
                            else
                            {
                                if (node.getPosition().x > 0)
                                {
                                    this._goToParent(node);
                                }
                                else if (!node.areChildrenShrinked())
                                {
                                    this._goToChild(node);
                                }
                            }
                        }
                        break;
                    case'up':
                        var nodes = this._getSelectedNodes();
                        if (nodes.length > 0)
                        {
                            var node = nodes[0];
                            if (node.getTopicType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
                            {
                                this._goToBrother(node, 'UP');
                            }
                        }
                        break;
                    case 'down':
                        var nodes = this._getSelectedNodes();
                        if (nodes.length > 0)
                        {
                            var node = nodes[0];
                            if (node.getTopicType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
                            {
                                this._goToBrother(node, 'DOWN');
                            }
                        }
                        break;
                    case 'f2':
                        this._showEditor();
                        break;
                    case 'space':

                        var nodes = this._getSelectedNodes();
                        if (nodes.length > 0)
                        {
                            var topic = nodes[0];

                            var model = topic.getModel();
                            var isShrink = !model.areChildrenShrinked();
                            topic.setChildrenShrinked(isShrink);
                        }
                        break;
                    case 'backspace':
                        evt.preventDefault();
                        break;
                    case 'esc':
                        var nodes = this._getSelectedNodes();
                        for (var i = 0; i < nodes.length; i++)
                        {
                            var node = nodes[i];
                            node.setOnFocus(false);
                        }
                        break;
                    case 'z':
                        if (evt.control || evt.meta)
                        {
                            if (evt.shift)
                            {
                                this.redo();
                            }
                            else
                            {
                                this.undo();
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            evt.stop();
        }
    }
};

mindplot.MindmapDesigner.prototype._showEditor = function(key)
{
    var nodes = this._getSelectedNodes();
    if (nodes.length == 1)
    {
        var node = nodes[0];
        if (key && key != "")
        {
            this._editor.setInitialText(key);
        }
        this._editor.getFocusEvent.attempt(node, this._editor);
    }
};

mindplot.MindmapDesigner.prototype._goToBrother = function(node, direction)
{
    var brothers = node._parent._getChildren();
    var target = node;
    var y = node.getPosition().y;
    var x = node.getPosition().x;
    var dist = null;
    for (var i = 0; i < brothers.length; i++)
    {
        var sameSide = (x * brothers[i].getPosition().x) >= 0;
        if (brothers[i] != node && sameSide)
        {
            var brother = brothers[i];
            var brotherY = brother.getPosition().y;
            if (direction == "DOWN" && brotherY > y)
            {
                var distancia = y - brotherY;
                if (distancia < 0)
                {
                    distancia = distancia * (-1);
                }
                if (dist == null || dist > distancia)
                {
                    dist = distancia;
                    target = brothers[i];
                }
            }
            else if (direction == "UP" && brotherY < y)
            {
                var distancia = y - brotherY;
                if (distancia < 0)
                {
                    distancia = distancia * (-1);
                }
                if (dist == null || dist > distancia)
                {
                    dist = distancia;
                    target = brothers[i];
                }
            }
        }
    }
    this._goToNode(target);
};

mindplot.MindmapDesigner.prototype._goToNode = function(node)
{
    node.setOnFocus(true);
    this.onNodeFocusEvent.attempt(node, this);
};

mindplot.MindmapDesigner.prototype._goToSideChild = function(node, side)
{
    var children = node._getChildren();
    if (children.length > 0)
    {
        var target = children[0];
        var top = null;
        for (var i = 0; i < children.length; i++)
        {
            var child = children[i];
            var childY = child.getPosition().y;
            if (side == 'LEFT' && child.getPosition().x < 0)
            {
                if (top == null || childY < top)
                {
                    target = child;
                    top = childY;
                }
            }
            if (side == 'RIGHT' && child.getPosition().x > 0)
            {
                if (top == null || childY < top)
                {
                    target = child;
                    top = childY;
                }
            }
        }

        this._goToNode(target);
    }
};

mindplot.MindmapDesigner.prototype._goToParent = function(node)
{
    var parent = node._parent;
    this._goToNode(parent);
};

mindplot.MindmapDesigner.prototype._goToChild = function(node)
{
    var children = node._getChildren();
    if (children.length > 0)
    {
        var target = children[0];
        var top = target.getPosition().y;
        for (var i = 0; i < children.length; i++)
        {
            var child = children[i];
            if (child.getPosition().y < top)
            {
                top = child.getPosition().y;
                target = child;
            }
        }
        this._goToNode(target);
    }
};

mindplot.MindmapDesigner.prototype.getWorkSpace = function()
{
    return this._workspace;
};
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.ScreenManager = function(width, height, divElement)
{
    this._divContainer = divElement;
    this._offset = {x:0,y:0};
};

mindplot.ScreenManager.prototype.setScale = function(scale)
{
    core.assert(core.Utils.isDefined(scale), 'Screen scale can not be null');
    this._workspaceScale = scale;
};

mindplot.ScreenManager.prototype.getWorkspaceElementPosition = function(e)
{
    // Retrive current element position.
    var elementPosition = e.getPosition();
    var x = elementPosition.x;
    var y = elementPosition.y;

    // Add workspace offset.
    x = x - this._offset.x;
    y = y - this._offset.y;

    // Scale coordinate in order to be relative to the workspace. That's coordSize/size;
    x = x / this._workspaceScale;
    y = y / this._workspaceScale;

    // Subtract div position.
    /*    var containerElem = this.getContainer();
var containerPosition = core.Utils.workOutDivElementPosition(containerElem);
x = x + containerPosition.x;
y = y + containerPosition.y;*/

    // Remove decimal part..
    return {x:x,y:y};
};

mindplot.ScreenManager.prototype.getWorkspaceIconPosition = function(e)
{
    // Retrive current icon position.
    var image = e.getImage();
    var elementPosition = image.getPosition();
    var imageSize = e.getSize();

    //Add group offset
    var iconGroup = e.getGroup();
    var group = iconGroup.getNativeElement();
    var coordOrigin=group.getCoordOrigin();
    var groupSize = group.getSize();
    var coordSize = group.getCoordSize();

    var scale={x:coordSize.width/parseInt(groupSize.width), y:coordSize.height/parseInt(groupSize.height)};

    var x = (elementPosition.x - coordOrigin.x-(parseInt(imageSize.width)/2))/scale.x;
    var y = (elementPosition.y - coordOrigin.y-(parseInt(imageSize.height)/2))/scale.y;

    //Retrieve iconGroup Position
    var groupPosition = iconGroup.getPosition();
    x = x + groupPosition.x;
    y = y + groupPosition.y;

    //Retrieve topic Position
    var topic = iconGroup.getTopic();
    var topicPosition = this.getWorkspaceElementPosition(topic);
    topicPosition.x = topicPosition.x - (parseInt(topic.getSize().width)/2);


    // Remove decimal part..
    return {x:x+topicPosition.x,y:y+topicPosition.y};
};

mindplot.ScreenManager.prototype.getWorkspaceMousePosition = function(e)
{
    // Retrive current mouse position.
    var mousePosition = this._getMousePosition(e);
    var x = mousePosition.x;
    var y = mousePosition.y;

    // Subtract div position.
    var containerElem = this.getContainer();
    var containerPosition = core.Utils.workOutDivElementPosition(containerElem);
    x = x - containerPosition.x;
    y = y - containerPosition.y;

    // Scale coordinate in order to be relative to the workspace. That's coordSize/size;
    x = x * this._workspaceScale;
    y = y * this._workspaceScale;

    // Add workspace offset.
    x = x + this._offset.x;
    y = y + this._offset.y;

    // Remove decimal part..
    return new core.Point(x, y);
};

/**
 * http://www.howtocreate.co.uk/tutorials/javascript/eventinfo
 */
mindplot.ScreenManager.prototype._getMousePosition = function(event)
{
    return core.Utils.getMousePosition(event);
};

mindplot.ScreenManager.prototype.getContainer = function()
{
    return this._divContainer;
};

mindplot.ScreenManager.prototype.setOffset = function(x, y)
{
    this._offset.x = x;
    this._offset.y = y;
};
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.Workspace = function(profile, screenManager, zoom)
{
    // Create a suitable container ...
    core.assert(screenManager, 'Div container can not be null');
    this._zoom = zoom;
    this._screenManager = screenManager;
    this._screenWidth = profile.width;
    this._screenHeight = profile.height;

    // Initalize web2d workspace.
    var workspace = this._createWorkspace(profile);
    this._workspace = workspace;

    var screenContainer = screenManager.getContainer();
    // Fix the height of the container ....
    screenContainer.style.height = this._screenHeight + "px";

    // Append to the workspace...
    workspace.addItAsChildTo(screenContainer);
    this.setZoom(zoom, true);

    // Register drag events ...
    this._registerDragEvents();

    this._eventsEnabled = true;

};

mindplot.Workspace.prototype._updateScreenManager = function()
{
    var zoom = this._zoom;
    this._screenManager.setScale(zoom);

    var coordOriginX = -((this._screenWidth * this._zoom) / 2);
    var coordOriginY = -((this._screenHeight * this._zoom) / 2);
    this._screenManager.setOffset(coordOriginX, coordOriginY);
};

mindplot.Workspace.prototype._createWorkspace = function(profile)
{
    // Initialize workspace ...
    var coordOriginX = -(this._screenWidth / 2);
    var coordOriginY = -(this._screenHeight / 2);

    var workspaceProfile = {
        width: this._screenWidth + "px",
        height: this._screenHeight + "px",
        coordSizeWidth:this._screenWidth,
        coordSizeHeight:this._screenHeight,
        coordOriginX:coordOriginX,
        coordOriginY:coordOriginY,
        fillColor:'transparent',
        strokeWidth:0};

    web2d.peer.Toolkit.init();
    return  new web2d.Workspace(workspaceProfile);
};

mindplot.Workspace.prototype.appendChild = function(shape)
{
    if (shape.addToWorkspace)
    {
        shape.addToWorkspace(this);
    } else
    {
        this._workspace.appendChild(shape);
    }
};

mindplot.Workspace.prototype.removeChild = function(shape)
{
    // Element is a node, not a web2d element?
    if (shape.removeFromWorkspace)
    {
        shape.removeFromWorkspace(this);
    } else
    {
        this._workspace.removeChild(shape);
    }
};

mindplot.Workspace.prototype.addEventListener = function(type, listener)
{
    this._workspace.addEventListener(type, listener);
};

mindplot.Workspace.prototype.removeEventListener = function(type, listener)
{
    this._workspace.removeEventListener(type, listener);
};

mindplot.Workspace.prototype.getSize = function()
{
    return this._workspace.getCoordSize();
};

mindplot.Workspace.prototype.setZoom = function(zoom, center)
{
    this._zoom = zoom;
    var workspace = this._workspace;

    // Update coord scale...
    var coordWidth = zoom * this._screenWidth;
    var coordHeight = zoom * this._screenHeight;
    workspace.setCoordSize(coordWidth, coordHeight);

    // Center topic....
    var coordOriginX;
    var coordOriginY;
    if (center)
    {
        coordOriginX = -(coordWidth / 2);
        coordOriginY = -(coordHeight / 2);
    } else
    {
        var coordOrigin = workspace.getCoordOrigin();
        coordOriginX = coordOrigin.x;
        coordOriginY = coordOrigin.y;
    }

    workspace.setCoordOrigin(coordOriginX, coordOriginY);

    // Update screen.
    this._screenManager.setOffset(coordOriginX, coordOriginY);
    this._screenManager.setScale(zoom);
};

mindplot.Workspace.prototype.getScreenManager = function()
{
    return this._screenManager;
};


mindplot.Workspace.prototype.enableWorkspaceEvents = function(value)
{
    this._eventsEnabled = value;
};

mindplot.Workspace.prototype.isWorkspaceEventsEnabled = function()
{
    return this._eventsEnabled;
};

mindplot.Workspace.prototype.dumpNativeChart = function()
{
    var workspace = this._workspace;
    return workspace.dumpNativeChart();
};

mindplot.Workspace.prototype._registerDragEvents = function()
{
    var workspace = this._workspace;
    var screenManager = this._screenManager;
    this._dragging = true;
    var mWorkspace = this;
    var mouseDownListener = function(event)
    {
        if (!workspace.mouseMoveListener)
        {
            if (mWorkspace.isWorkspaceEventsEnabled())
            {
                mWorkspace.enableWorkspaceEvents(false);

                var mouseDownPosition = screenManager.getWorkspaceMousePosition(event);
                var originalCoordOrigin = workspace.getCoordOrigin();
                var periodicalFunction = function() {
                    mWorkspace._processMouseMoveEvent = true;
                };
                // Start precision timer updater ...
                mWorkspace._precitionUpdater = periodicalFunction.periodical(mindplot.Workspace.DRAG_PRECISION_IN_SEG);

                workspace.mouseMoveListener = function(event)
                {
                    if (mWorkspace._processMouseMoveEvent)
                    {
                        // Disable mouse move rendering ...
                        mWorkspace._processMouseMoveEvent = false;

                        var currentMousePosition = screenManager.getWorkspaceMousePosition(event);

                        var offsetX = currentMousePosition.x - mouseDownPosition.x;
                        var coordOriginX = -offsetX + originalCoordOrigin.x;

                        var offsetY = currentMousePosition.y - mouseDownPosition.y;
                        var coordOriginY = -offsetY + originalCoordOrigin.y;

                        workspace.setCoordOrigin(coordOriginX, coordOriginY);

                        // Change cursor.
                        if (core.UserAgent.isMozillaFamily())
                        {
                            window.document.body.style.cursor = "-moz-grabbing";
                        } else
                        {
                            window.document.body.style.cursor = "move";
                        }
                    }
                };
                workspace.addEventListener('mousemove', workspace.mouseMoveListener);

                // Register mouse up listeners ...
                workspace.mouseUpListener = function(event)
                {
                    // Stop presition updater listener ...
                    $clear(mWorkspace._precitionUpdater);
                    mWorkspace._precitionUpdater = null;

                    workspace.removeEventListener('mousemove', workspace.mouseMoveListener);
                    workspace.removeEventListener('mouseup', workspace.mouseUpListener);
                    workspace.mouseUpListener = null;
                    workspace.mouseMoveListener = null;
                    window.document.body.style.cursor = 'default';

                    // Update screen manager offset.
                    var coordOrigin = workspace.getCoordOrigin();
                    screenManager.setOffset(coordOrigin.x, coordOrigin.y);
                    mWorkspace.enableWorkspaceEvents(true);
                };
                workspace.addEventListener('mouseup', workspace.mouseUpListener);
            }
        } else
        {
            workspace.mouseUpListener();
        }
    };

    workspace.addEventListener('mousedown', mouseDownListener);
};

mindplot.Workspace.DRAG_PRECISION_IN_SEG = 50;
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.ShirinkConnector = function(topic)
{
    var elipse = new web2d.Elipse(mindplot.Topic.prototype.INNER_RECT_ATTRIBUTES);
    this._elipse = elipse;
    elipse.setFill('#f7f7f7');

    elipse.setSize(mindplot.Topic.CONNECTOR_WIDTH, mindplot.Topic.CONNECTOR_WIDTH);
    var shrinkConnector = this;
    elipse.addEventListener('click', function(event)
    {
        var model = topic.getModel();
        var isShrink = !model.areChildrenShrinked();

        var actionRunner = mindplot.DesignerActionRunner.getInstance();
        var topicId = topic.getId();

        var commandFunc = function(topic, isShrink)
        {
            topic.setChildrenShrinked(isShrink);
            return !isShrink;
        }

        var command = new mindplot.commands.GenericFunctionCommand(commandFunc, isShrink, [topicId]);
        actionRunner.execute(command)

        new Event(event).stop();

    });

    elipse.addEventListener('click', function(event)
    {
        // Avoid node creation ...
        new Event(event).stop();
    });

    elipse.addEventListener('dblclick', function(event)
    {
        // Avoid node creation ...
        new Event(event).stop();

    });

    elipse.addEventListener('mouseover', function(event)
    {
        this.setFill('#009900');
    });

    elipse.addEventListener('mouseout', function(event)
    {
        var color = topic.getBackgroundColor();
        this.setFill(color);
    });

    elipse.setCursor('default');
    this._fillColor = '#f7f7f7';
    var model = topic.getModel();
    this.changeRender(model.areChildrenShrinked());

};

mindplot.ShirinkConnector.prototype.changeRender = function(isShrink)
{
    var elipse = this._elipse;
    if (isShrink)
    {
        elipse.setStroke('2', 'solid');
    } else
    {
        elipse.setStroke('1', 'solid');
    }
}


mindplot.ShirinkConnector.prototype.setVisibility = function(value)
{
    this._elipse.setVisibility(value);
}

mindplot.ShirinkConnector.prototype.setFill = function(color)
{
    this._fillColor = color;
    this._elipse.setFill(color);
}

mindplot.ShirinkConnector.prototype.setAttribute = function(name, value)
{
    this._elipse.setAttribute(name, value);
}

mindplot.ShirinkConnector.prototype.addToWorkspace = function(group)
{
    group.appendChild(this._elipse);
}


mindplot.ShirinkConnector.prototype.setPosition = function(x, y)
{
    this._elipse.setPosition(x, y);
}
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.NodeGraph = function(nodeModel)
{
    this._mouseEvents = true;
    this.setModel(nodeModel);
    this._onFocus = false;
};


mindplot.NodeGraph.prototype.getType = function()
{
    var model = this.getModel();
    return model.getType();
};

mindplot.NodeGraph.prototype.getId = function()
{
    return this.getModel().getId();
};

mindplot.NodeGraph.prototype.setId = function(id)
{
    this.getModel().setId(id);
};

mindplot.NodeGraph.prototype._set2DElement = function(elem2d)
{
    this._elem2d = elem2d;
};

mindplot.NodeGraph.prototype.get2DElement = function()
{
    core.assert(this._elem2d, 'NodeGraph has not been initialized propertly');
    return this._elem2d;
};

mindplot.NodeGraph.prototype.setPosition = function(point)
{
    // Elements are positioned in the center.
    var size = this._model.getSize();
    this._elem2d.setPosition(point.x - (size.width / 2), point.y - (size.height / 2));
    this._model.setPosition(point.x, point.y);
};

mindplot.NodeGraph.prototype.addEventListener = function(type, listener)
{
    var elem = this.get2DElement();
    elem.addEventListener(type, listener);
};

mindplot.NodeGraph.prototype.isNodeGraph = function()
{
    return true;
};

mindplot.NodeGraph.prototype.setMouseEventsEnabled = function(isEnabled)
{
    this._mouseEvents = isEnabled;
};

mindplot.NodeGraph.prototype.isMouseEventsEnabled = function()
{
    return this._mouseEvents;
};

mindplot.NodeGraph.prototype.getSize = function()
{
    return this._model.getSize();
};

mindplot.NodeGraph.prototype.setSize = function(size)
{
    this._model.setSize(size.width, size.height);
};

mindplot.NodeGraph.create = function(nodeModel)
{
    core.assert(nodeModel, 'Model can not be null');

    var type = nodeModel.getType();
    core.assert(type, 'Node model type can not be null');

    var result;
    if (type == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        result = new mindplot.CentralTopic(nodeModel);
    } else
        if (type == mindplot.NodeModel.MAIN_TOPIC_TYPE)
        {
            result = new mindplot.MainTopic(nodeModel);
        } else
        {
            assert(false, "unsupported node type:" + type);
        }

    return result;
};

mindplot.NodeGraph.prototype.getModel = function()
{
    core.assert(this._model, 'Model has not been initialized yet');
    return  this._model;
};

mindplot.NodeGraph.prototype.setModel = function(model)
{
    core.assert(model, 'Model can not be null');
    this._model = model;
};

mindplot.NodeGraph.prototype.getId = function()
{
    return this._model.getId();
};

mindplot.NodeGraph.prototype.setOnFocus = function(focus)
{
    this._onFocus = focus;
    var outerShape = this.getOuterShape();
    if (focus)
    {
        outerShape.setFill('#c7d8ff');
        outerShape.setOpacity(1);

    } else
    {
        // @todo: node must not know about the topic.

        outerShape.setFill(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES.fillColor);
        outerShape.setOpacity(0);
    }
    this.setCursor('move');
};

mindplot.NodeGraph.prototype.isOnFocus = function()
{
    return this._onFocus;
};

mindplot.NodeGraph.prototype.dispose = function(workspace)
{
    workspace.removeChild(this);
};

mindplot.NodeGraph.prototype.createDragNode = function()
{
    var dragShape = this._buildDragShape();
    return  new mindplot.DragTopic(dragShape, this);
};

mindplot.NodeGraph.prototype._buildDragShape = function()
{
    core.assert(false, '_buildDragShape must be implemented by all nodes.');
};

mindplot.NodeGraph.prototype.getPosition = function()
{
    var model = this.getModel();
    return model.getPosition();
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.Topic = function()
{
    mindplot.Topic.superClass.initialize.call(this);
};

objects.extend(mindplot.Topic, mindplot.NodeGraph);

mindplot.Topic.prototype.initialize = function(topicBoard)
{
    core.assert(core.Utils.isDefined(topicBoard), 'topic board can not be null.');

    this._children = [];
    this._parent = null;
    this._lastIconId = -1;

    this._topicBoard = topicBoard;
    this._buildShape();
    this.setMouseEventsEnabled(true);

    // Positionate topic ....
    var model = this.getModel();
    var pos = model.getPosition();
    if (pos != null)
    {
        this.setPosition(pos);
    }
};

mindplot.Topic.prototype.setShapeType = function(type)
{
    this._setShapeType(type, true);

};

mindplot.Topic.prototype.getParent = function()
{
    return this._parent;
};

mindplot.Topic.prototype._setShapeType = function(type, updateModel)
{
    // Remove inner shape figure ...
    var model = this.getModel();
    if (updateModel)
    {
        model.setShapeType(type);
    }

    var innerShape = this.getInnerShape();
    if (innerShape != null)
    {
        var dispatcherByEventType = innerShape._dispatcherByEventType;
        // Remove old shape ...
        this._removeInnerShape();

        // Create a new one ...
        innerShape = this.getInnerShape();

        //Let's register all the events. The first one is the default one. The others will be copied.
        this._registerDefaultListenersToElement(innerShape, this);

        var dispatcher = dispatcherByEventType['mousedown'];
        if(dispatcher)
        {
            for(var i = 1; i<dispatcher._listeners.length; i++)
            {
                innerShape.addEventListener('mousedown', dispatcher._listeners[i]);
            }
        }
        if (!this.isConnectedToCentralTopic() && type == mindplot.NodeModel.SHAPE_TYPE_LINE)
        {
            // In this case, The normal connection line is not used.
            innerShape.setVisibility(false);
        }

        // Update figure size ...
        var size = model.getSize();
        this.setSize(size, true);

        var group = this.get2DElement();
        group.appendChild(innerShape);

        // Move text to the front ...
        var text = this.getTextShape();
        text.moveToFront();

        //Move iconGroup to front ...
        var iconGroup = this.getIconGroup();
        if($chk(iconGroup)){
            iconGroup.moveToFront();
        }
    }

};

mindplot.Topic.prototype.getShapeType = function()
{
    var model = this.getModel();
    var result = model.getShapeType();
    if (!result)
    {
        result = this._defaultShapeType();
    }
    return result;
};

mindplot.Topic.prototype._removeInnerShape = function()
{
    var group = this.get2DElement();
    var innerShape = this.getInnerShape();
    group.removeChild(innerShape);
    this._innerShape = null;
};

mindplot.Topic.prototype.INNER_RECT_ATTRIBUTES = {stroke:'0.5 solid'};
mindplot.Topic.prototype.getInnerShape = function()
{
    if (!this._innerShape)
    {
        // Create inner box.
        this._innerShape = this.buildShape(this.INNER_RECT_ATTRIBUTES);

        // Update bgcolor ...
        var bgColor = this.getBackgroundColor();
        this._setBackgroundColor(bgColor, false);

        // Update border color ...
        var brColor = this.getBorderColor();
        this._setBorderColor(brColor, false);

        // Define the pointer ...
        if (this.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            this._innerShape.setCursor('move');
        } else
        {
            this._innerShape.setCursor('default');
        }

    }
    return this._innerShape;
};


mindplot.Topic.prototype.buildShape = function(attributes, type)
{
    var result;
    if (!core.Utils.isDefined(type))
    {
        type = this.getShapeType();
    }

    if (type == mindplot.NodeModel.SHAPE_TYPE_RECT)
    {
        result = new web2d.Rect(0, attributes);
    }
    else if (type == mindplot.NodeModel.SHAPE_TYPE_ELIPSE)
    {
        result = new web2d.Elipse(attributes);
    }
    else if (type == mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT)
    {
        result = new web2d.Rect(0.3, attributes);
    }
    else if (type == mindplot.NodeModel.SHAPE_TYPE_LINE)
    {
        result = new web2d.Line();
        result.setSize = function(width, height)
        {
            this.size = {width:width, height:height};
            result.setFrom(-1, height);
            result.setTo(width + 1, height);

            // Lines will have the same color of the default connection lines...
            var stokeColor = mindplot.ConnectionLine.getStrokeColor();
            result.setStroke(1, 'solid', stokeColor);
        };

        result.getSize = function()
        {
            return this.size;
        };

        result.setPosition = function()
        {
        };

        var setStrokeFunction = result.setStroke;
        result.setFill = function(color)
        {

        };

        result.setStroke = function(color)
        {

        };
    }
    else
    {
        core.assert(false, "Unsupported figure type:" + type);
    }

    result.setPosition(0, 0);
    return result;
};


mindplot.Topic.prototype.setCursor = function(type)
{
    var innerShape = this.getInnerShape();
    innerShape.setCursor(type);

    var outerShape = this.getOuterShape();
    outerShape.setCursor(type);

    var textShape = this.getTextShape();
    textShape.setCursor(type);
};

mindplot.Topic.OUTER_SHAPE_ATTRIBUTES = {fillColor:'#dbe2e6',stroke:'1 solid #77555a',x:0,y:0};

mindplot.Topic.prototype.getOuterShape = function()
{
    if (!this._outerShape)
    {
        var rect = this.buildShape(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES, mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT);
        rect.setPosition(-2, -3);
        rect.setOpacity(0);
        this._outerShape = rect;
    }

    return this._outerShape;
};

mindplot.Topic.prototype.getTextShape = function()
{
    if (!this._text)
    {
        var model = this.getModel();
        this._text = this._buildTextShape();

        // Set Text ...
        var text = this.getText();
        this._setText(text, false);
    }
    return this._text;
};

mindplot.Topic.prototype.getOrBuildIconGroup = function()
{
    if (!this._icon)
    {
        this._icon = this._buildIconGroup();
        var group = this.get2DElement();
        group.appendChild(this._icon.getNativeElement());
        this._icon.moveToFront();
    }
    return this._icon;
};

mindplot.Topic.prototype.getIconGroup = function()
{
    return this._icon;
};

mindplot.Topic.prototype._buildIconGroup = function(disableEventsListeners)
{
    var result = new mindplot.IconGroup(this);
    var model = this.getModel();

    //Icons
    var icons = model.getIcons();
    for(var i=0;i<icons.length;i++)
    {
        // Update model identifier ...
        var iconModel = icons[i];
        var icon = new mindplot.ImageIcon(iconModel, this, designer);
        result.addIcon(icon);
    }

    //Links
    var links = model.getLinks();
    for(var i=0;i<links.length;i++)
    {
        this._hasLink=true;
        this._link = new mindplot.LinkIcon(links[i], this, designer);
        result.addIcon(this._link);
    }

    //Notes
    var notes = model.getNotes();
    for(var i=0;i<notes.length;i++)
    {
        this._hasNote=true;
        this._note = new mindplot.Note(notes[i], this, designer);
        result.addIcon(this._note);
    }

    return result;
};

mindplot.Topic.prototype.addLink = function(url, designer){
    var iconGroup = this.getOrBuildIconGroup();
    var model = this.getModel();
    var linkModel = model.createLink(url);
    model.addLink(linkModel);
    this._link = new mindplot.LinkIcon(linkModel, this, designer);
    iconGroup.addIcon(this._link);
    this._hasLink=true;
};

mindplot.Topic.prototype.addNote = function(text, designer){
    var iconGroup = this.getOrBuildIconGroup();
    var model = this.getModel();
    text = escape(text);
    var noteModel = model.createNote(text)
    model.addNote(noteModel);
    this._note = new mindplot.Note(noteModel, this, designer);
    iconGroup.addIcon(this._note);
    this._hasNote=true;
};

mindplot.Topic.prototype.addIcon = function(iconType, designer){
    var iconGroup = this.getOrBuildIconGroup();
    var model = this.getModel();

    // Update model ...
    var iconModel = model.createIcon(iconType);
    model.addIcon(iconModel);

    var imageIcon = new mindplot.ImageIcon(iconModel, this, designer);
    iconGroup.addIcon(imageIcon);

    return imageIcon;
};

mindplot.Topic.prototype.removeIcon = function(iconModel){

    //Removing the icon from MODEL
    var model = this.getModel();
    model._removeIcon(iconModel);

    //Removing the icon from UI
    var iconGroup = this.getIconGroup();
    if($chk(iconGroup))
    {
        var imgIcon = iconGroup.findIconFromModel(iconModel);
        iconGroup.removeImageIcon(imgIcon);
        if(iconGroup.getIcons().length==0){
            this.get2DElement().removeChild(iconGroup.getNativeElement());
            this._icon=null;
        }
        this.updateNode();
    }
};

mindplot.Topic.prototype.removeLink = function(){
    var model = this.getModel();
    var links = model.getLinks();
    model._removeLink(links[0]);
    var iconGroup = this.getIconGroup();
    if($chk(iconGroup))
    {
        iconGroup.removeIcon(mindplot.LinkIcon.IMAGE_URL);
        if(iconGroup.getIcons().length==0){
            this.get2DElement().removeChild(iconGroup.getNativeElement());
            this._icon=null;
        }
        this.updateNode.delay(0,this);
    }
    this._link=null;
    this._hasLink=false;
}

mindplot.Topic.prototype.removeNote = function(){
    var model = this.getModel();
    var notes = model.getNotes();
    model._removeNote(notes[0]);
    var iconGroup = this.getIconGroup();
    if($chk(iconGroup))
    {
        iconGroup.removeIcon(mindplot.Note.IMAGE_URL);
        if(iconGroup.getIcons().length==0){
            this.get2DElement().removeChild(iconGroup.getNativeElement());
            this._icon=null;
        }
    }
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);
    this._note=null;
    this._hasNote=false;
}

mindplot.Topic.prototype._buildTextShape = function(disableEventsListeners)
{
    var result = new web2d.Text();
    var font = {};

    var family = this.getFontFamily();
    var size = this.getFontSize();
    var weight = this.getFontWeight();
    var style = this.getFontStyle();
    result.setFont(family, size, style, weight);

    var color = this.getFontColor();
    result.setColor(color);

    if (!disableEventsListeners)
    {
        // Propagate mouse events ...
        var topic = this;
        result.addEventListener('mousedown', function(event)
        {
            var eventDispatcher = topic.getInnerShape()._dispatcherByEventType['mousedown'];
            if (eventDispatcher)
            {
                eventDispatcher.eventListener(event);
            }
        });

        if (this.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            result.setCursor('move');
        } else
        {
            result.setCursor('default');
        }
    }

    // Positionate node ...
    this._offset = this.getOffset();
    var iconOffset = this.getIconOffset();
    result.setPosition(iconOffset + this._offset, this._offset / 2);
    return result;
};

mindplot.Topic.prototype.getIconOffset = function(){
    var iconGroup = this.getIconGroup();
    var size = 0;
    if($chk(iconGroup))
    {
        size = iconGroup.getSize().width;
    }
    return size;
};

mindplot.Topic.prototype.getOffset = function(value, updateModel)
{
    var offset = 18;

    if (mindplot.NodeModel.MAIN_TOPIC_TYPE == this.getType())
    {
        var parent = this.getModel().getParent();
        if (parent && mindplot.NodeModel.MAIN_TOPIC_TYPE == parent.getType())
        {
            offset = 6;
        }
        else
        {
            offset = 8;
        }
    }
    return offset;
};

mindplot.Topic.prototype.setFontFamily = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setFontFamily(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontFamily(value);
    }
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);
};

mindplot.Topic.prototype.setFontSize = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setSize(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontSize(value);
    }
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);

};

mindplot.Topic.prototype.setFontStyle = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setStyle(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontStyle(value);
    }
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);
};

mindplot.Topic.prototype.setFontWeight = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setWeight(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontWeight(value);
    }
};

mindplot.Topic.prototype.getFontWeight = function()
{
    var model = this.getModel();
    var result = model.getFontWeight();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.weight;
    }
    return result;
};

mindplot.Topic.prototype.getFontFamily = function()
{
    var model = this.getModel();
    var result = model.getFontFamily();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.font;
    }
    return result;
};

mindplot.Topic.prototype.getFontColor = function()
{
    var model = this.getModel();
    var result = model.getFontColor();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.color;
    }
    return result;
};

mindplot.Topic.prototype.getFontStyle = function()
{
    var model = this.getModel();
    var result = model.getFontStyle();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.style;
    }
    return result;
};

mindplot.Topic.prototype.getFontSize = function()
{
    var model = this.getModel();
    var result = model.getFontSize();
    if (!result)
    {
        var font = this._defaultFontStyle();
        result = font.size;
    }
    return result;
};

mindplot.Topic.prototype.setFontColor = function(value, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setColor(value);
    if (updateModel)
    {
        var model = this.getModel();
        model.setFontColor(value);
    }
};

mindplot.Topic.prototype._setText = function(text, updateModel)
{
    var textShape = this.getTextShape();
    textShape.setText(text);
    var elem = this;
    var executor = function(editor)
    {
        return function()
        {
            elem.updateNode();
        };
    };

    setTimeout(executor(this), 0);

    if (updateModel)
    {
        var model = this.getModel();
        model.setText(text);
    }
};

mindplot.Topic.prototype.setText = function(text)
{
    this._setText(text, true);
};

mindplot.Topic.prototype.getText = function()
{
    var model = this.getModel();
    var result = model.getText();
    if (!result)
    {
        result = this._defaultText();
    }
    return result;
};

mindplot.Topic.prototype.setBackgroundColor = function(color)
{
    this._setBackgroundColor(color, true);
};

mindplot.Topic.prototype._setBackgroundColor = function(color, updateModel)
{
    var innerShape = this.getInnerShape();
    innerShape.setFill(color);

    var connector = this.getShrinkConnector();
    connector.setFill(color);
    if (updateModel)
    {
        var model = this.getModel();
        model.setBackgroundColor(color);
    }
};

mindplot.Topic.prototype.getBackgroundColor = function()
{
    var model = this.getModel();
    var result = model.getBackgroundColor();
    if (!result)
    {
        result = this._defaultBackgroundColor();
    }
    return result;
};

mindplot.Topic.prototype.setBorderColor = function(color)
{
    this._setBorderColor(color, true);
};

mindplot.Topic.prototype._setBorderColor = function(color, updateModel)
{
    var innerShape = this.getInnerShape();
    innerShape.setAttribute('strokeColor', color);

    var connector = this.getShrinkConnector();
    connector.setAttribute('strokeColor', color);


    if (updateModel)
    {
        var model = this.getModel();
        model.setBorderColor(color);
    }
};

mindplot.Topic.prototype.getBorderColor = function()
{
    var model = this.getModel();
    var result = model.getBorderColor();
    if (!result)
    {
        result = this._defaultBorderColor();
    }
    return result;
};

mindplot.Topic.prototype._buildShape = function()
{
    var groupAttributes = {width: 100, height:100,coordSizeWidth:100,coordSizeHeight:100};
    var group = new web2d.Group(groupAttributes);
    this._set2DElement(group);

    // Shape must be build based on the model width ...
    var outerShape = this.getOuterShape();
    var innerShape = this.getInnerShape();
    var textShape = this.getTextShape();
    var shrinkConnector = this.getShrinkConnector();

    // Update figure size ...
    var model = this.getModel();
    var size = model.getSize();
    this._setSize(size);

    // Add to the group ...
    group.appendChild(outerShape);
    group.appendChild(innerShape);
    group.appendChild(textShape);

    if(model.getLinks().length!=0 || model.getNotes().length!=0 || model.getIcons().length!=0)
    {
        iconGroup = this.getOrBuildIconGroup();
    }

    if (this.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        shrinkConnector.addToWorkspace(group);
    }

    // Register listeners ...
    this._registerDefaultListenersToElement(outerShape, this);
    this._registerDefaultListenersToElement(innerShape, this);
    this._registerDefaultListenersToElement(textShape, this);

};

mindplot.Topic.prototype._registerDefaultListenersToElement=function(elem, topic)
{
    var mouseOver = function(event)
    {
        if (topic.isMouseEventsEnabled())
        {
            topic.handleMouseOver(event);
        }
    };
    elem.addEventListener('mouseover', mouseOver);

    var outout = function(event)
    {
        if (topic.isMouseEventsEnabled())
        {
            topic.handleMouseOut(event);
        }
    };
    elem.addEventListener('mouseout', outout);

    // Focus events ...
    var mouseDown = function(event)
    {
        topic.setOnFocus(true);
    };
    elem.addEventListener('mousedown', mouseDown);
};

mindplot.Topic.prototype.areChildrenShrinked = function()
{
    var model = this.getModel();
    return model.areChildrenShrinked();
};

mindplot.Topic.prototype.isCollapsed = function()
{
    var model = this.getModel();
    var result = false;

    var current = this.getParent();
    while(current && !result)
    {
        result = current.areChildrenShrinked();
        current = current.getParent();
    }
    return result;
};

mindplot.Topic.prototype.setChildrenShrinked = function(value)
{
    // Update Model ...
    var model = this.getModel();
    model.setChildrenShrinked(value);

    // Change render base on the state.
    var shrinkConnector = this.getShrinkConnector();
    shrinkConnector.changeRender(value);

    //  Hide branch in order to avoid flickering...
    this._setChildrenVisibility(false);

    // Update topic position based on the state ...
    var targetTopicBoard = this.getTopicBoard();
    targetTopicBoard.repositionate();

    // Hide children ...
    this._setChildrenVisibility(!value);
};

mindplot.Topic.prototype.getShrinkConnector = function()
{
    var result = this._connector;
    if (this._connector == null)
    {
        this._connector = new mindplot.ShirinkConnector(this);
        this._connector.setVisibility(false);
        result = this._connector;

    }
    return result;
};

mindplot.Topic.prototype.handleMouseOver = function(event)
{
    var outerShape = this.getOuterShape();
    outerShape.setOpacity(1);
};

mindplot.Topic.prototype.handleMouseOut = function(event)
{
    var outerShape = this.getOuterShape();
    if (!this.isOnFocus())
    {
        outerShape.setOpacity(0);
    }
};

/**
 * Point: references the center of the rect shape.!!!
 */
mindplot.Topic.prototype.setPosition = function(point)
{
    // Elements are positioned in the center.
    // All topic element must be positioned based on the innerShape.
    var size = this.getSize();

    var cx = Math.round(point.x - (size.width / 2));
    var cy = Math.round(point.y - (size.height / 2));

    // Update visual position.
    this._elem2d.setPosition(cx, cy);

    // Update model's position ...
    var model = this.getModel();
    model.setPosition(point.x, point.y);

    // Update connection lines ...
    this._updateConnectionLines();

    // Check object state.
    this.invariant();
};

mindplot.Topic.CONNECTOR_WIDTH = 6;

mindplot.Topic.prototype.getOutgoingLine = function()
{
    return this._outgoingLine;
};

mindplot.Topic.prototype.getIncomingLines = function()
{
    var result = [];
    var children = this._getChildren();
    for (var i = 0; i < children.length; i++)
    {
        var node = children[i];
        var line = node.getOutgoingLine();
        if (line)
        {
            result.push(line);
        }
    }
    return result;
};

mindplot.Topic.prototype.getOutgoingConnectedTopic = function()
{
    var result = null;
    var line = this.getOutgoingLine();
    if (line)
    {
        result = line.getTargetTopic();
    }
    return result;
};


mindplot.Topic.prototype._updateConnectionLines = function()
{
    // Update this to parent line ...
    var outgoingLine = this.getOutgoingLine();
    if (outgoingLine)
    {
        outgoingLine.redraw();
    }

    // Update all the incoming lines ...
    var incomingLines = this.getIncomingLines();
    for (var i = 0; i < incomingLines.length; i++)
    {
        incomingLines[i].redraw();
    }
};

mindplot.Topic.prototype.setBranchVisibility = function(value)
{
    var current = this;
    var parent = this;
    while (parent != null && parent.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        current = parent;
        parent = current.getParent();
    }
    current.setVisibility(value);
};


mindplot.Topic.prototype.setVisibility = function(value)
{
    this._setTopicVisibility(value);

    // Hide all children...
    this._setChildrenVisibility(value);
};

mindplot.Topic.prototype._setTopicVisibility = function(value)
{
    var elem = this.get2DElement();
    elem.setVisibility(value);

    if (this.getIncomingLines().length > 0)
    {
        var connector = this.getShrinkConnector();
        connector.setVisibility(value);
    }

    var textShape = this.getTextShape();
    textShape.setVisibility(value);

};

mindplot.Topic.prototype._setChildrenVisibility = function(isVisible)
{

    // Hide all children.
    var children = this._getChildren();
    var model = this.getModel();

    isVisible = isVisible ? !model.areChildrenShrinked() : isVisible;
    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];
        child._setChildrenVisibility(isVisible);

        child._setTopicVisibility(isVisible);

        var outgoingLine = child.getOutgoingLine();
        outgoingLine.setVisibility(isVisible);
    }

}

mindplot.Topic.prototype.invariant = function()
{
    var line = this._outgoingLine;
    var model = this.getModel();
    var isConnected = model.isConnected();

    // Check consitency...
    if ((isConnected && !line) || (!isConnected && line))
    {
        // core.assert(false,'Illegal state exception.');
    }
};

/**
 * type:
 *    onfocus
 */
mindplot.Topic.prototype.addEventListener = function(type, listener)
{
    // Translate to web 2d events ...
    if (type == 'onfocus')
    {
        type = 'mousedown';
    }

    var textShape = this.getTextShape();
    textShape.addEventListener(type, listener);

    var outerShape = this.getOuterShape();
    outerShape.addEventListener(type, listener);

    var innerShape = this.getInnerShape();
    innerShape.addEventListener(type, listener);
};


mindplot.Topic.prototype._setSize = function(size)
{
    core.assert(size, "size can not be null");
    core.assert(core.Utils.isDefined(size.width), "size seem not to be a valid element");

    mindplot.Topic.superClass.setSize.call(this, size);

    var outerShape = this.getOuterShape();
    var innerShape = this.getInnerShape();
    var connector = this.getShrinkConnector();

    outerShape.setSize(size.width + 4, size.height + 6);
    innerShape.setSize(size.width, size.height);
};

mindplot.Topic.prototype.setSize = function(size, force)
{
    var oldSize = this.getSize();
    if (oldSize.width != size.width || oldSize.height != size.height || force)
    {
        this._setSize(size);

        // Update the figure position(ej: central topic must be centered) and children position.
        this._updatePositionOnChangeSize(oldSize, size);
    }
};

mindplot.Topic.prototype._updatePositionOnChangeSize = function(oldSize, newSize) {
    core.assert(false, "this method must be overided");
};

mindplot.Topic.prototype.disconnect = function(workspace)
{
    var outgoingLine = this.getOutgoingLine();
    if (outgoingLine)
    {
        core.assert(workspace, 'workspace can not be null');

        this._outgoingLine = null;

        // Disconnect nodes ...
        var targetTopic = outgoingLine.getTargetTopic();
        targetTopic._removeChild(this);

        // Update model ...
        var childModel = this.getModel();
        childModel.disconnect();

        // Remove graphical element from the workspace...
        outgoingLine.removeFromWorkspace(workspace);

        // Remove from workspace.
        var topicBoard = targetTopic.getTopicBoard();
        topicBoard.removeTopicFromBoard(this);

        // Change text based on the current connection ...
        var model = this.getModel();
        if (!model.getText())
        {
            var text = this.getText();
            this._setText(text, false);
        }
        if (!model.getFontSize())
        {
            var size = this.getFontSize();
            this.setFontSize(size, false);
        }

        // Hide connection line?.
        if (targetTopic._getChildren().length == 0)
        {
            var connector = targetTopic.getShrinkConnector();
            connector.setVisibility(false);
        }

    }
};

mindplot.Topic.prototype.getOrder = function()
{
    var model = this.getModel();
    return model.getOrder();
};

mindplot.Topic.prototype.moveToFront = function()
{
    var elem2d = this.get2DElement();
    elem2d.moveToFront();
};
mindplot.Topic.prototype.setOrder = function(value)
{
    var model = this.getModel();
    model.setOrder(value);
};

mindplot.Topic.prototype.connectTo = function(targetTopic, workspace)
{
    core.assert(!this._outgoingLine, 'Could not connect an already connected node');
    core.assert(targetTopic != this, 'Cilcular connection are not allowed');
    core.assert(targetTopic, 'Parent Graph can not be null');
    core.assert(workspace, 'Workspace can not be null');

    // Create a connection line ...
    var outgoingLine = new mindplot.ConnectionLine(this, targetTopic);
    this._outgoingLine = outgoingLine;
    workspace.appendChild(outgoingLine);

    // Connect Graphical Nodes ...
    targetTopic._appendChild(this);
    this._parent = targetTopic;

    // Update model ...
    var targetModel = targetTopic.getModel();
    var childModel = this.getModel();
    childModel.connectTo(targetModel);

    // Update figure is necessary.
    this.updateTopicShape(targetTopic);

    // Change text based on the current connection ...
    var model = this.getModel();
    if (!model.getText())
    {
        var text = this.getText();
        this._setText(text, false);
    }
    if (!model.getFontSize())
    {
        var size = this.getFontSize();
        this.setFontSize(size, false);
    }
    var textShape = this.getTextShape();

    // Update topic position based on the state ...
    var targetTopicBoard = targetTopic.getTopicBoard();
    targetTopicBoard.addBranch(this);

    // Display connection node...
    var connector = targetTopic.getShrinkConnector();
    connector.setVisibility(true);

    // Redraw line ...
    outgoingLine.redraw();
};

mindplot.Topic.prototype._appendChild = function(child)
{
    var children = this._getChildren();
    children.push(child);
};

mindplot.Topic.prototype._removeChild = function(child)
{
    var children = this._getChildren();
    children.remove(child);
};

mindplot.Topic.prototype._getChildren = function()
{
    var result = this._children;
    if (!result)
    {
        this._children = [];
        result = this._children;
    }
    return result;
};

mindplot.Topic.prototype.removeFromWorkspace = function(workspace)
{
    var elem2d = this.get2DElement();
    workspace.removeChild(elem2d);
    var line = this.getOutgoingLine();
    if (line)
    {
        workspace.removeChild(line);
    }
};

mindplot.Topic.prototype.addToWorkspace = function(workspace)
{
    var elem = this.get2DElement();
    workspace.appendChild(elem);
};

mindplot.Topic.prototype.getTopicBoard = function()
{
    return this._topicBoard;
};

mindplot.Topic.prototype.createDragNode = function()
{
    var dragNode = mindplot.Topic.superClass.createDragNode.call(this);

    // Is the node already connected ?
    var targetTopic = this.getOutgoingConnectedTopic();
    if (targetTopic)
    {
        dragNode.connectTo(targetTopic);
    }
    return dragNode;
};

mindplot.Topic.prototype.updateNode = function()
{
    var textShape = this.getTextShape();
    var sizeWidth = textShape.getWidth();
    var sizeHeight = textShape.getHeight();
    var font = textShape.getFont();
    var iconOffset = this.getIconOffset();

    var newSize = {width:sizeWidth + this._offset*2 + iconOffset,height:sizeHeight + this._offset};
    this.setSize(newSize);

    // Positionate node ...
    textShape.setPosition(iconOffset+this._offset, this._offset / 2);
    textShape.setTextSize(sizeWidth, sizeHeight);
};
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.CentralTopic = function(model)
{
    core.assert(model, "Model can not be null");
    this.setModel(model);
    var topicBoard = new mindplot.CentralTopicBoard(this);
    mindplot.CentralTopic.superClass.initialize.call(this, topicBoard);
    this.__onLoad = true;
};

objects.extend(mindplot.CentralTopic, mindplot.Topic);


mindplot.CentralTopic.prototype.workoutIncomingConnectionPoint = function(sourcePosition)
{
    return this.getPosition();
};

mindplot.CentralTopic.prototype.getTopicType = function()
{
    return mindplot.NodeModel.CENTRAL_TOPIC_TYPE;
};

mindplot.CentralTopic.prototype.setCursor = function(type)
{
    type = (type == 'move') ? 'default' : type;
    mindplot.CentralTopic.superClass.setCursor.call(this, type);
};

mindplot.CentralTopic.prototype.isConnectedToCentralTopic = function()
{
    return false;
};

mindplot.CentralTopic.prototype.createChildModel = function()
{
    // Create a new node ...
    var model = this.getModel();
    var mindmap = model.getMindmap();
    var childModel = mindmap.createNode(mindplot.NodeModel.MAIN_TOPIC_TYPE);

    if (!core.Utils.isDefined(this.___siblingDirection))
    {
        this.___siblingDirection = 1;
    }

    // Positionate following taking into account this internal flag ...
    if (this.___siblingDirection == 1)
    {

        childModel.setPosition(100, 0);
    } else
    {
        childModel.setPosition(-100, 0);
    }
    this.___siblingDirection = -this.___siblingDirection;

    // Create a new node ...
    childModel.setOrder(0);

    return childModel;
};

mindplot.CentralTopic.prototype._defaultShapeType = function()
{
    return  mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT;
};


mindplot.CentralTopic.prototype.updateTopicShape = function()
{

};
mindplot.CentralTopic.prototype._updatePositionOnChangeSize = function(oldSize, newSize) {

    // Center main topic ...
    var zeroPoint = new core.Point(0, 0);
    this.setPosition(zeroPoint);

    // Update children position based on the new figure size ...
    var xOffset = newSize.width - oldSize.width;
    xOffset = Math.round(xOffset / 2);

    if (!this.__onLoad)
    {
        // HACK: on load ignore changes of position in order to avoid adding
        // several times the central topic distance to all the child nodes...

        var topicBoard = this.getTopicBoard();
        topicBoard.updateChildrenPosition(this, xOffset);
        this.__onLoad = false;
    }
};

mindplot.CentralTopic.prototype._defaultText = function()
{
    return "Central Topic";
};

mindplot.CentralTopic.prototype._defaultBackgroundColor = function()
{
    return "#f7f7f7";
};

mindplot.CentralTopic.prototype._defaultBorderColor = function()
{
    return "#023BB9";
};

mindplot.CentralTopic.prototype._defaultFontStyle = function()
{
    return {
        font:"Verdana",
        size: 10,
        style:"normal",
        weight:"bold",
        color:"#023BB9"
    };
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.MainTopic = function(model)
{
    core.assert(model, "Model can not be null");
    this.setModel(model);
    var topicBoard = new mindplot.MainTopicBoard(this);
    mindplot.MainTopic.superClass.initialize.call(this, topicBoard);
};

objects.extend(mindplot.MainTopic, mindplot.Topic);

mindplot.MainTopic.prototype.INNER_RECT_ATTRIBUTES = {stroke:'0.5 solid #009900'};

mindplot.MainTopic.prototype.createSiblingModel = function()
{
    var siblingModel = null;
    var parentTopic = this.getOutgoingConnectedTopic();
    if (parentTopic != null)
    {
        // Create a new node ...
        var model = this.getModel();
        var mindmap = model.getMindmap();
        siblingModel = mindmap.createNode(mindplot.NodeModel.MAIN_TOPIC_TYPE);

        // Positionate following taking into account the sibling positon.
        if (parentTopic.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            var pos = this.getPosition();
            siblingModel.setPosition(pos.x, pos.y);
        }

        // Create a new node ...
        var order = this.getOrder() + 1;
        siblingModel.setOrder(order);
    }
    return siblingModel;
};

mindplot.MainTopic.prototype.createChildModel = function()
{
    // Create a new node ...
    var model = this.getModel();
    var mindmap = model.getMindmap();
    var childModel = mindmap.createNode(mindplot.NodeModel.MAIN_TOPIC_TYPE);

    // Get the hights model order position ...
    var children = this._getChildren();
    var order = -1;
    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];
        if (child.getOrder() > order)
        {
            order = child.getOrder();
        }
    }
    // Create a new node ...
    childModel.setOrder(order + 1);
    return childModel;
};


mindplot.MainTopic.prototype._buildDragShape = function()
{
    var innerShape = this.buildShape(this.INNER_RECT_ATTRIBUTES);
    var size = this.getSize();
    innerShape.setSize(size.width, size.height);
    innerShape.setPosition(0, 0);
    innerShape.setOpacity(0.5);
    innerShape.setCursor('default');
    innerShape.setVisibility(true);

    var brColor = this.getBorderColor();
    innerShape.setAttribute("strokeColor", brColor);

    var bgColor = this.getBackgroundColor();
    innerShape.setAttribute("fillColor", bgColor);

    //  Create group ...
    var groupAttributes = {width: 100, height:100,coordSizeWidth:100,coordSizeHeight:100};
    var group = new web2d.Group(groupAttributes);
    group.appendChild(innerShape);

    // Add Text ...
    var textShape = this._buildTextShape(true);
    var text = this.getText();
    textShape.setText(text);
    textShape.setOpacity(0.5);
    group.appendChild(textShape);

    return group;
};


mindplot.MainTopic.prototype._defaultShapeType = function()
{
    var targetTopic = this.getOutgoingConnectedTopic();
    var result;
    if (targetTopic)
    {
        if (targetTopic.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            result = mindplot.NodeModel.SHAPE_TYPE_LINE;

        } else
        {
            result = mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT;
        }
    } else
    {
        result = mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT;
    }
    return result;
};

mindplot.MainTopic.prototype.updateTopicShape = function(targetTopic, workspace)
{
    // Change figure based on the connected topic ...
    if (targetTopic.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        var model = this.getModel();
        var shapeType = model.getShapeType();
        if (!shapeType)
        {
            // Get the real shape type ...
            shapeType = this.getShapeType();
            this._setShapeType(mindplot.NodeModel.SHAPE_TYPE_LINE, false);
        }
    }
};

mindplot.MainTopic.prototype.disconnect = function(workspace)
{
    mindplot.MainTopic.superClass.disconnect.call(this, workspace);
    var size = this.getSize();

    var model = this.getModel();
    var shapeType = model.getShapeType();
    if (!shapeType)
    {
        // Change figure ...
        shapeType = this.getShapeType();
        this._setShapeType(mindplot.NodeModel.SHAPE_TYPE_ROUNDED_RECT, false);
    }
};

mindplot.MainTopic.prototype.getTopicType = function()
{
    return "MainTopic";
};


mindplot.MainTopic.prototype._updatePositionOnChangeSize = function(oldSize, newSize) {

    var xOffset = (newSize.width - oldSize.width) / 2;
    var pos = this.getPosition();
    if (core.Utils.isDefined(pos))
    {
        if (pos.x > 0)
        {
            pos.x = pos.x + xOffset;
        } else
        {
            pos.x = pos.x - xOffset;
        }
        this.setPosition(pos);

        // If height has changed, I must repositionate all elements ...
        if (oldSize.height != newSize.height)
        {
            var topicBoard = this.getTopicBoard();
            // topicBoard.repositionate();
        }
    }
};

mindplot.MainTopic.prototype.setPosition = function(point)
{
    mindplot.MainTopic.superClass.setPosition.call(this, point);

    // Update board zero entry position...
    var topicBoard = this.getTopicBoard();
    topicBoard.updateChildrenPosition(this);
};

mindplot.MainTopic.prototype.workoutIncomingConnectionPoint = function(sourcePosition)
{
    core.assert(sourcePosition, 'sourcePoint can not be null');
    var pos = this.getPosition();
    var size = this.getSize();

    var isAtRight = mindplot.util.Shape.isAtRight(sourcePosition, pos);
    var result = mindplot.util.Shape.calculateRectConnectionPoint(pos, size, isAtRight);
    if (this.getShapeType() == mindplot.NodeModel.SHAPE_TYPE_LINE)
    {
        result.y = result.y + (this.getSize().height / 2);
    }

    // Move a little the position...
    var offset = mindplot.Topic.CONNECTOR_WIDTH / 2;
    if (this.getPosition().x > 0)
    {
        result.x = result.x + offset;
    } else
    {
        result.x = result.x - offset;
    }
    return result;

};

mindplot.MainTopic.prototype.workoutOutgoingConnectionPoint = function(targetPosition)
{
    core.assert(targetPosition, 'targetPoint can not be null');
    var pos = this.getPosition();
    var size = this.getSize();

    var isAtRight = mindplot.util.Shape.isAtRight(targetPosition, pos);
    var result;
    if (this.getShapeType() == mindplot.NodeModel.SHAPE_TYPE_LINE)
    {
        if (!this.isConnectedToCentralTopic())
        {
            result = new core.Point();
            if (!isAtRight)
            {
                result.x = pos.x - (size.width / 2);
            } else
            {
                result.x = pos.x + (size.width / 2);
            }
            result.y = pos.y + (size.height / 2);
        } else
        {
            // In this case, connetion line is not used as shape figure.
            result = mindplot.util.Shape.calculateRectConnectionPoint(pos, size, isAtRight, true);
            result.y = pos.y + (size.height / 2);

            // Correction factor ...
            if (!isAtRight)
            {
                result.x = result.x + 2;
            } else
            {
                result.x = result.x - 2;
            }

        }
    } else
    {
        result = mindplot.util.Shape.calculateRectConnectionPoint(pos, size, isAtRight, true);
    }
    return result;
};


mindplot.MainTopic.prototype.isConnectedToCentralTopic = function()
{
    var model = this.getModel();
    var parent = model.getParent();

    return parent && parent.getType() === mindplot.NodeModel.CENTRAL_TOPIC_TYPE;
};

mindplot.MainTopic.prototype._defaultText = function()
{
    var targetTopic = this.getOutgoingConnectedTopic();
    var result = "";
    if (targetTopic)
    {
        if (targetTopic.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            result = "Main Topic";
        } else
        {
            result = "Sub Topic";
        }
    } else
    {
        result = "Isolated Topic";
    }
    return result;
};

mindplot.MainTopic.prototype._defaultFontStyle = function()
{
    var targetTopic = this.getOutgoingConnectedTopic();
    var result;
    if (targetTopic)
    {
        if (targetTopic.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            result = {
                font:"Arial",
                size: 8,
                style:"normal",
                weight:"normal",
                color:"#525c61"
            };
        } else
        {
            result = {
                font:"Arial",
                size: 6,
                style:"normal",
                weight:"normal",
                color:"#525c61"
            };
        }
    } else
    {
        result = {
            font:"Verdana",
            size: 8,
            style:"normal",
            weight:"normal",
            color:"#525c61"
        };
    }
    return result;
};

mindplot.MainTopic.prototype._defaultBackgroundColor = function()
{
    return "#E0E5EF";
};

mindplot.MainTopic.prototype._defaultBorderColor = function()
{
    return '#023BB9';
};
mindplot.MainTopic.prototype.addSibling = function()
{
    var order = this.getOrder();


};
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.DragTopic = function(dragShape, draggedNode)
{
    core.assert(core.Utils.isDefined(dragShape), 'Rect can not be null.');
    core.assert(core.Utils.isDefined(draggedNode), 'draggedNode can not be null.');

    this._elem2d = dragShape;
    this._order = null;
    this._draggedNode = draggedNode;
    this._position = new core.Point();
};

mindplot.DragTopic.initialize = function(workspace)
{
    var pivot = mindplot.DragTopic.__getDragPivot();
    workspace.appendChild(pivot);
};

mindplot.DragTopic.prototype.setOrder = function(order)
{
    this._order = order;
};

mindplot.DragTopic.prototype.setPosition = function(x, y)
{
    this._position.setValue(x, y);

    // Elements are positioned in the center.
    // All topic element must be positioned based on the innerShape.
    var draggedNode = this._draggedNode;
    var size = draggedNode.getSize();

    var cx = x - (size.width / 2);
    var cy = y - (size.height / 2);

    // Update visual position.
    this._elem2d.setPosition(cx, cy);
};

mindplot.DragTopic.prototype.getInnerShape = function()
{
    return this._elem2d;
};

mindplot.DragTopic.prototype.disconnect = function(workspace)
{
    // Clear connection line ...
    var dragPivot = this._getDragPivot();
    dragPivot.disconnect(workspace);
};

mindplot.DragTopic.prototype.canBeConnectedTo = function(targetTopic)
{
    core.assert(core.Utils.isDefined(targetTopic), 'parent can not be null');

    var result = true;
    if (!targetTopic.areChildrenShrinked() && !targetTopic.isCollapsed())
    {
        // Dragged node can not be connected to himself.
        if (targetTopic == this._draggedNode)
        {
            result = false;
        } else
        {
            var draggedNode = this.getDraggedTopic();
            var topicPosition = this.getPosition();

            var targetTopicModel = targetTopic.getModel();
            var childTopicModel = draggedNode.getModel();

            var targetTopicBoard = targetTopic.getTopicBoard();
            var height = targetTopicBoard.getHeight();
            result = targetTopicModel.canBeConnected(childTopicModel, topicPosition, height);
        }
    } else
    {
        result = false;
    }
    return result;
};

mindplot.DragTopic.prototype.connectTo = function(parent)
{
    core.assert(parent, 'Parent connection node can not be null.');

    var dragPivot = this._getDragPivot();
    dragPivot.connectTo(parent);
};

mindplot.DragTopic.prototype.getDraggedTopic = function()
{
    return  this._draggedNode;
};


mindplot.DragTopic.prototype.removeFromWorkspace = function(workspace)
{
    // Remove drag shadow.
    workspace.removeChild(this._elem2d);

    // Remove pivot shape. To improve performace it will not be removed. Only the visilility will be changed.
    var dragPivot = this._getDragPivot();
    dragPivot.setVisibility(false);
};

mindplot.DragTopic.prototype.addToWorkspace = function(workspace)
{
    workspace.appendChild(this._elem2d);
    var dragPivot = this._getDragPivot();

    dragPivot.addToWorkspace(workspace);
    dragPivot.setVisibility(true);
};

mindplot.DragTopic.prototype._getDragPivot = function()
{
    return mindplot.DragTopic.__getDragPivot();
};

mindplot.DragTopic.__getDragPivot = function()
{
    var result = mindplot.DragTopic._dragPivot;
    if (!result)
    {
        result = new mindplot.DragPivot();
        mindplot.DragTopic._dragPivot = result;
    }
    return result;
};


mindplot.DragTopic.prototype.getPosition = function()
{
    return this._position;
};

mindplot.DragTopic.prototype.isDragTopic = function()
{
    return true;
};

mindplot.DragTopic.prototype.updateDraggedTopic = function(workspace)
{
    core.assert(workspace, 'workspace can not be null');

    var dragPivot = this._getDragPivot();
    var draggedTopic = this.getDraggedTopic();

    var isDragConnected = this.isConnected();
    var actionRunner = mindplot.DesignerActionRunner.getInstance();
    var topicId = draggedTopic.getId();
    var command = new mindplot.commands.DragTopicCommand(topicId);

  if (isDragConnected)
    {

        var targetTopic = this.getConnectedToTopic();
        if (targetTopic.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            // Update topic position ...
            var dragPivotPosition = dragPivot.getPosition();

            // Must positionate the dragged topic taking into account the current node size.
            var pivotSize = dragPivot.getSize();
            var draggedTopicSize = draggedTopic.getSize();
            var xOffset = draggedTopicSize.width - pivotSize.width;
            xOffset = Math.round(xOffset / 2);

            if (dragPivotPosition.x > 0)
            {
                dragPivotPosition.x = parseInt(dragPivotPosition.x) + xOffset;
            }
            else
            {
                dragPivotPosition.x = parseInt(dragPivotPosition.x) - xOffset;
            }
            // Set new position ...
            command.setPosition(dragPivotPosition);

        } else
        {
            // Main topic connections can be positioned only with the order ...
            command.setOrder(this._order);
        }

        // Set new parent topic ..
        command.setParetTopic(targetTopic);
    } else {

        // If the node is not connected, positionate based on the original drag topic position.
        var dragPosition = this.getPosition();
        command = new mindplot.commands.DragTopicCommand(topicId, dragPosition);
        command.setPosition(dragPosition);
    }
    actionRunner.execute(command)
};

mindplot.DragTopic.prototype.setBoardPosition = function(point)
{
    core.assert(point, 'point can not be null');
    var dragPivot = this._getDragPivot();
    dragPivot.setPosition(point);
};


mindplot.DragTopic.prototype.getBoardPosition = function(point)
{
    core.assert(point, 'point can not be null');
    var dragPivot = this._getDragPivot();
    return dragPivot.getPosition();
};

mindplot.DragTopic.prototype.getConnectedToTopic = function()
{
    var dragPivot = this._getDragPivot();
    return dragPivot.getTargetTopic();
};

mindplot.DragTopic.prototype.isConnected = function()
{
    return this.getConnectedToTopic() != null;
};

mindplot.DragTopic.PIVOT_SIZE = {width:50,height:10};
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.DragManager = function(workspace)
{
    this._workspace = workspace;
    this._listeners = {};
    this._processMouseMoveEvent = true;
    var dragManager = this;
    this._precitionUpdater = null;
};

mindplot.DragManager.prototype.add = function(node)
{
    // Add behaviour ...
    var workspace = this._workspace;
    var screen = workspace.getScreenManager();
    var dragManager = this;

    var mouseDownListener = function(event)
    {
        if (workspace.isWorkspaceEventsEnabled())
        {
            // Disable double drag... 
            workspace.enableWorkspaceEvents(false);

            // Set initial position.
            var dragNode = node.createDragNode();
            var mousePos = screen.getWorkspaceMousePosition(event);
            dragNode.setPosition(mousePos.x, mousePos.y);
            var periodicalFunction = function() {
                dragManager._processMouseMoveEvent = true;
            };
            // Start precision timer updater ...
            dragManager._precitionUpdater = periodicalFunction.periodical(mindplot.DragManager.DRAG_PRECISION_IN_SEG);

            // Register mouse move listener ...
            var mouseMoveListener = dragManager._buildMouseMoveListener(workspace, dragNode, dragManager);
            workspace.addEventListener('mousemove', mouseMoveListener);

            // Register mouse up listeners ...
            var mouseUpListener = dragManager._buildMouseUpListener(workspace, node, dragNode, dragManager);
            workspace.addEventListener('mouseup', mouseUpListener);

            // Execute Listeners ..
            var startDragListener = dragManager._listeners['startdragging'];
            startDragListener(event, node);

            // Change cursor.
            window.document.body.style.cursor = 'move';
        }
    };
    dragManager._mouseMoveListener = mouseDownListener;

    node.addEventListener('mousedown', mouseDownListener);
};

mindplot.DragManager.prototype.remove = function(node)
{
    var nodes = this._topics;
    var contained = false;
    var index = -1;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] == node) {
            contained = true;
            index = i;
        }
    }
    if (contained)
    {
        elem = new Array();
    }
};

mindplot.DragManager.prototype._buildMouseMoveListener = function(workspace, dragNode, dragManager)
{
    var screen = workspace.getScreenManager();
    var result = function(event) {
        if (dragManager._processMouseMoveEvent)
        {
            // Disable mouse move rendering ...
            dragManager._processMouseMoveEvent = false;
            if (!dragNode._isInTheWorkspace)
            {
                // Add shadow node to the workspace.
                workspace.appendChild(dragNode);
                dragNode._isInTheWorkspace = true;
            }

            var pos = screen.getWorkspaceMousePosition(event);
            dragNode.setPosition(pos.x, pos.y);

            // Call mouse move listeners ...
            var dragListener = dragManager._listeners['dragging'];
            if (dragListener)
            {
                dragListener(event, dragNode);
            }
        }
    };
    dragManager._mouseMoveListener = result;
    return result;
};

mindplot.DragManager.prototype._buildMouseUpListener = function(workspace, node, dragNode, dragManager)
{
    var screen = workspace.getScreenManager();
    var result = function(event) {

        core.assert(dragNode.isDragTopic, 'dragNode must be an DragTopic');

        // Remove drag node from the workspace.
        var hasBeenDragged = dragNode._isInTheWorkspace;
        if (dragNode._isInTheWorkspace)
        {
            dragNode.removeFromWorkspace(workspace);
        }

        // Remove all the events.
        workspace.removeEventListener('mousemove', dragManager._mouseMoveListener);
        workspace.removeEventListener('mouseup', dragManager._mouseUpListener);

        // Help GC
        dragManager._mouseMoveListener = null;
        dragManager._mouseUpListener = null;

        // Execute Listeners only if the node has been moved.
        var endDragListener = dragManager._listeners['enddragging'];
        endDragListener(event, dragNode);

        if (hasBeenDragged)
        {
            dragNode._isInTheWorkspace = false;
        }

        // Stop presition updater listener ...
        $clear(dragManager._precitionUpdater);
        dragManager._precitionUpdater = null;

        // Change the cursor to the default.
        window.document.body.style.cursor = 'default';

        workspace.enableWorkspaceEvents(true);

    };
    dragManager._mouseUpListener = result;
    return result;
};

/**
 * type:
 *  - startdragging.
 *  - dragging
 *  - enddragging
 */
mindplot.DragManager.prototype. addEventListener = function(type, listener)
{
    this._listeners[type] = listener;
};

mindplot.DragManager.DRAG_PRECISION_IN_SEG = 100;
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.DragPivot = function()
{
    this._position = new core.Point();
    this._size = mindplot.DragTopic.PIVOT_SIZE;
    this._line = null;

    this._straightLine = this._buildStraightLine();
    this._curvedLine = this._buildCurvedLine();
    this._dragPivot = this._buildRect();
    this._connectRect = this._buildRect();
    this._targetTopic = null;
};

mindplot.DragPivot.prototype.getTargetTopic = function()
{
    return this._targetTopic;
};

mindplot.DragPivot.prototype._buildStraightLine = function()
{
    var line = new web2d.Line();
    line.setStroke(1, 'solid', '#CC0033');
    line.setOpacity(0.4);
    line.setVisibility(false);
    return line;
};

mindplot.DragPivot.prototype._buildCurvedLine = function()
{
    var line = new web2d.PolyLine();
    line.setStroke(1, 'solid', '#CC0033');
    line.setOpacity(0.4);
    line.setVisibility(false);
    return line;
};

mindplot.DragPivot.prototype._redraw = function(pivotPosition)
{
    // Update line position.
    core.assert(this.getTargetTopic(), 'Illegal invocation. Target node can not be null');

    var pivotRect = this._getPivotRect();
    var currentPivotPositon = pivotRect.getPosition();

    // Pivot position has not changed. In this case, position change is not required.
    var targetTopic = this.getTargetTopic();
    if (currentPivotPositon.x != pivotPosition.x || currentPivotPositon.y != pivotPosition.y)
    {
        var position = this._position;
        var fromPoint = targetTopic.workoutIncomingConnectionPoint(position);

        // Calculate pivot connection point ...
        var size = this._size;
        var targetPosition = targetTopic.getPosition();
        var line = this._line;

        // Update Line position.
        var isAtRight = mindplot.util.Shape.isAtRight(targetPosition, position);
        var pivotPoint = mindplot.util.Shape.calculateRectConnectionPoint(position, size, isAtRight);
        line.setFrom(pivotPoint.x, pivotPoint.y);

        // Update rect position
        pivotRect.setPosition(pivotPosition.x, pivotPosition.y);

        // Display elements if it's requiered...
        if (!pivotRect.isVisible())
        {
            // Make line visible only when the position has been already changed.
            // This solve several strange effects ;)
            var targetPoint = targetTopic.workoutIncomingConnectionPoint(pivotPoint);
            line.setTo(targetPoint.x, targetPoint.y);

            this.setVisibility(true);
        }
    }
};

mindplot.DragPivot.prototype.setPosition = function(point)
{
    this._position = point;

    // Update visual position.
    var pivotRect = this._getPivotRect();
    var size = this.getSize();

    var cx = point.x - (parseInt(size.width) / 2);
    var cy = point.y - (parseInt(size.height) / 2);

    // Update line  ...
    if (this.getTargetTopic())
    {
        var pivotPosition = {x:cx,y:cy};
        this._redraw(pivotPosition);
    }
};

mindplot.DragPivot.prototype.getPosition = function()
{
    return this._position;
};

mindplot.DragPivot.prototype._buildRect = function()
{
    var size = this._size;
    var rectAttributes = {fillColor:'#CC0033',opacity:0.4,width:size.width,height:size.height,strokeColor:'#FF9933'};
    var rect = new web2d.Rect(0, rectAttributes);
    rect.setVisibility(false);
    return rect;
};

mindplot.DragPivot.prototype._buildConnectRect = function()
{
    var size = this._size;
    var rectAttributes = {fillColor:'#CC0033',opacity:0.4,width:size.width,height:size.height,strokeColor:'#FF9933'};
    var result = new web2d.Rect(0, rectAttributes);
    return result;
};

mindplot.DragPivot.prototype._getPivotRect = function()
{
    return this._dragPivot;
};

mindplot.DragPivot.prototype.getSize = function()
{
    var elem2d = this._getPivotRect();
    return elem2d.getSize();
};

mindplot.DragPivot.prototype.setVisibility = function(value)
{
    var pivotRect = this._getPivotRect();
    pivotRect.setVisibility(value);

    var connectRect = this._connectRect;
    connectRect.setVisibility(value);
    if (this._line)
    {
        this._line.setVisibility(value);
    }
};

mindplot.DragPivot.prototype.addToWorkspace = function(workspace)
{
    var pivotRect = this._getPivotRect();
    workspace.appendChild(pivotRect);

    var connectToRect = this._connectRect;
    workspace.appendChild(connectToRect);

    // Add a hidden straight line ...
    var straighLine = this._straightLine;
    straighLine.setVisibility(false);
    workspace.appendChild(straighLine);
    straighLine.moveToBack();

    // Add a hidden curved line ...
    var curvedLine = this._curvedLine;
    curvedLine.setVisibility(false);
    workspace.appendChild(curvedLine);
    curvedLine.moveToBack();

    // Add a connect rect ...
    var connectRect = this._connectRect;
    connectRect.setVisibility(false);
    workspace.appendChild(connectRect);
    connectRect.moveToBack();
};

mindplot.DragPivot.prototype.removeFromWorkspace = function(workspace)
{
    var shape = this._getPivotRect();
    workspace.removeChild(shape);

    var connectToRect = this._connectRect;
    workspace.removeChild(connectToRect);

    if (this._straightLine)
    {
        workspace.removeChild(this._straightLine);
    }

    if (this._curvedLine)
    {
        workspace.removeChild(this._curvedLine);
    }
};

mindplot.DragPivot.prototype.connectTo = function(targetTopic)
{
    core.assert(!this._outgoingLine, 'Could not connect an already connected node');
    core.assert(targetTopic != this, 'Cilcular connection are not allowed');
    core.assert(targetTopic, 'parent can not be null');

    this._targetTopic = targetTopic;
    if (targetTopic.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        this._line = this._straightLine;
    } else
    {
        this._line = this._curvedLine;
    }

    // Show pivot ...
    var line = this._line;

    // Connected to Rect ...
    var connectRect = this._connectRect;
    var targetSize = targetTopic.getSize();
    var width = targetSize.width + 6;
    var height = targetSize.height + 6;
    connectRect.setSize(width, height);

    var targetPosition = targetTopic.getPosition();
    var cx = Math.round(targetPosition.x - (width / 2));
    var cy = Math.round(targetPosition.y - (height / 2));
    connectRect.setPosition(cx, cy);

    // Change elements position ...
    var pivotRect = this._getPivotRect();
    pivotRect.moveToFront();

};

mindplot.DragPivot.prototype.disconnect = function(workspace)
{
    core.assert(workspace, 'workspace can not be null.');
    core.assert(this._targetTopic, 'There are not connected topic.');

    this.setVisibility(false);
    this._targetTopic = null;
    this._line = null;
};
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.TopicBoard = function()
{
    this._height = null;
};

mindplot.TopicBoard.prototype._removeEntryByOrder = function(order, position)
{
    var board = this._getBoard(position);
    var entry = board.lookupEntryByOrder(order);

    core.assert(!entry.isAvailable(), 'Entry must not be available in order to be removed.Entry Order:' + order);
    entry.removeTopic();
    board.update(entry);
};

mindplot.TopicBoard.prototype.removeTopicFromBoard = function(topic)
{
    var position = topic.getPosition();
    var order = topic.getOrder();

    this._removeEntryByOrder(order, position);
    topic.setOrder(null);
};

mindplot.TopicBoard.prototype.positionateDragTopic = function(dragTopic)
{
    throw "this method must be overrided";
};

mindplot.TopicBoard.prototype.getHeight = function()
{
    var board = this._getBoard();
    return board.getHeight();
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.CentralTopicBoard = function(centralTopic)
{
    var point = new core.Point(0, 0);
    this._rightBoard = new mindplot.VariableDistanceBoard(50, point);
    this._leftBoard = new mindplot.VariableDistanceBoard(50, point);
    this._centralTopic = centralTopic;
};

objects.extend(mindplot.CentralTopicBoard, mindplot.TopicBoard);

mindplot.CentralTopicBoard.prototype._getBoard = function(position)
{
    return (position.x >= 0) ? this._rightBoard : this._leftBoard;
};

mindplot.CentralTopicBoard.prototype._updateHeight = function()
{

};


mindplot.CentralTopicBoard.prototype.positionateDragTopic = function(dragTopic)
{
    core.assert(dragTopic != null, 'dragTopic can not be null');
    core.assert(dragTopic.isDragTopic, 'dragTopic must be DragTopic instance');

    // This node is a main topic node. Position
    var dragPos = dragTopic.getPosition();
    var board = this._getBoard(dragPos);

    // Look for entry  ...
    var entry = board.lookupEntryByPosition(dragPos);

    // Calculate 'y' position base on the entry ...
    var yCoord;
    if (!entry.isAvailable() && entry.getTopic() != dragTopic.getDraggedTopic())
    {
        yCoord = entry.getLowerLimit();
    } else
    {
        yCoord = entry.workoutEntryYCenter();
    }


    // MainTopic can not be positioned over the drag topic ...
    var centralTopic = this._centralTopic;
    var centralTopicSize = centralTopic.getSize();
    var halfWidth = (centralTopicSize.width / 2);
    if (Math.abs(dragPos.x) < halfWidth + 60)
    {
        var distance = halfWidth + 60;
        dragPos.x = (dragPos.x > 0)? distance:-distance;
    }

    // Update board position.
    var pivotPos = new core.Point(dragPos.x, yCoord);
    dragTopic.setBoardPosition(pivotPos);
};


mindplot.CentralTopicBoard.prototype.addBranch = function(topic)
{
    // Update topic position ...
    var position = topic.getPosition();

    var order = topic.getOrder();
    var board = this._getBoard(position);
    var entry = null;
    if (order != null)
    {
        entry = board.lookupEntryByOrder(order);
    } else
    {
        entry = board.lookupEntryByPosition(position);
    }

    // If the entry is not available, I must swap the the entries...
    if (!entry.isAvailable())
    {
        board.freeEntry(entry);
    }

    // Add it to the board ...
    entry.setTopic(topic);
    board.update(entry);
};

mindplot.CentralTopicBoard.prototype.updateChildrenPosition = function(topic, xOffset)
{
    var board = this._rightBoard;
    var oldReferencePosition = board.getReferencePoint();
    var newReferencePosition = new core.Point(oldReferencePosition.x + xOffset, oldReferencePosition.y);
    board.updateReferencePoint(newReferencePosition);

    board = this._leftBoard;
    oldReferencePosition = board.getReferencePoint();
    newReferencePosition = new core.Point(oldReferencePosition.x - xOffset, oldReferencePosition.y);
    board.updateReferencePoint(newReferencePosition);
};

mindplot.CentralTopicBoard.prototype.repositionate = function()
{
    //@todo: implement ..
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.MainTopicBoard = function(topic)
{
    this._topic = topic;
    this._board = null;
    this._height = 0;
};

objects.extend(mindplot.MainTopicBoard, mindplot.TopicBoard);

mindplot.MainTopicBoard.DEFAULT_MAIN_TOPIC_HEIGHT = 18;

mindplot.MainTopicBoard.prototype._getBoard = function()
{
    if (!this._board)
    {
        var topic = this._topic;
        this._board = new mindplot.FixedDistanceBoard(mindplot.MainTopicBoard.DEFAULT_MAIN_TOPIC_HEIGHT, topic);
    }
    return this._board;
};

mindplot.MainTopicBoard.prototype.updateReferencePoint = function(position)
{
    this._board.updateReferencePoint(position);
};

mindplot.MainTopicBoard.prototype.updateChildrenPosition = function(topic)
{
    var board = this._getBoard();
    board.updateReferencePoint();
};

mindplot.MainTopicBoard.prototype.positionateDragTopic = function(dragTopic)
{
    core.assert(dragTopic != null, 'dragTopic can not be null');
    core.assert(dragTopic.isDragTopic, 'dragTopic must be DragTopic instance');

    // This node is a main topic node. Position
    var dragPos = dragTopic.getPosition();
    var board = this._getBoard();

    // Look for entry  ...
    var entry = board.lookupEntryByPosition(dragPos);

    // Calculate 'y' position base on the entry ...
    var yCoord;
    if (!entry.isAvailable() && entry.getTopic() != dragTopic.getDraggedTopic())
    {
        yCoord = entry.getLowerLimit();
    } else
    {
        yCoord = entry.workoutEntryYCenter();
    }

    // Update board position.
    var targetTopic = dragTopic.getConnectedToTopic();
    var xCoord = this._workoutXBorderDistance(targetTopic);

    // Add the size of the pivot to the distance ...
    var halfPivotWidth = mindplot.DragTopic.PIVOT_SIZE.width / 2;
    xCoord = xCoord + ((dragPos.x > 0) ? halfPivotWidth : -halfPivotWidth);

    var pivotPos = new core.Point(xCoord, yCoord);
    dragTopic.setBoardPosition(pivotPos);

    var order = entry.getOrder();
    dragTopic.setOrder(order);
};

/**
 * This x distance does't take into account the size of the shape.
 */
mindplot.MainTopicBoard.prototype._workoutXBorderDistance = function(topic)
{
    core.assert(topic, 'topic can not be null');
    var board = this._getBoard();
    return board.workoutXBorderDistance(topic);
};

mindplot.MainTopicBoard.prototype.addBranch = function(topic)
{
    var order = topic.getOrder();
    core.assert(core.Utils.isDefined(order), "Order must be defined");

    // If the entry is not available, I must swap the the entries...
    var board = this._getBoard();
    var entry = board.lookupEntryByOrder(order);
    if (!entry.isAvailable())
    {
        board.freeEntry(entry);
    }

    // Add the topic to the board ...
    board.addTopic(order, topic);

    // Repositionate all the parent topics ...
    var currentTopic = this._topic;
    if (currentTopic.getOutgoingConnectedTopic())
    {
        var parentTopic = currentTopic.getOutgoingConnectedTopic();
        var parentTopicBoard = parentTopic.getTopicBoard();
        parentTopicBoard.repositionate();
    }
};

mindplot.MainTopicBoard.prototype.repositionate = function()
{
    var board = this._getBoard();
    board.repositionate();
};

mindplot.MainTopicBoard.prototype.removeTopicFromBoard = function(topic)
{
    var board = this._getBoard();
    board.removeTopic(topic);

    // Repositionate all the parent topics ...
    var parentTopic = this._topic;
    if (parentTopic.getOutgoingConnectedTopic())
    {
        var connectedTopic = parentTopic.getOutgoingConnectedTopic();
        var topicBoard = connectedTopic.getTopicBoard();
        topicBoard.repositionate();
    }
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.ConnectionLine = function(sourceNode, targetNode)
{
    core.assert(targetNode, 'parentNode node can not be null');
    core.assert(sourceNode, 'childNode node can not be null');
    core.assert(sourceNode != targetNode, 'Cilcular connection');

    this._targetTopic = targetNode;
    this._sourceTopic = sourceNode;

    var strokeColor = mindplot.ConnectionLine.getStrokeColor();
    var line;
    if (targetNode.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        line = new web2d.Line();
        line.setStroke(1, 'solid', strokeColor);
    } else
    {
        line = new web2d.PolyLine();
        line.setStroke(1, 'solid', strokeColor);
    }

    this._line2d = line;
};

mindplot.ConnectionLine.getStrokeColor = function()
{
    return '#495879';
};

mindplot.ConnectionLine.prototype.setVisibility = function(value)
{
    var line2d = this._line2d;
    line2d.setVisibility(value);
};

mindplot.ConnectionLine.prototype.redraw = function()
{
    var line2d = this._line2d;
    var sourceTopic = this._sourceTopic;
    var sourcePosition = sourceTopic.getPosition();

    var targetTopic = this._targetTopic;
    var targetPosition = targetTopic.getPosition();

    var sPos = sourceTopic.workoutOutgoingConnectionPoint(targetPosition);
    line2d.setTo(sPos.x, sPos.y);

    var tPos = targetTopic.workoutIncomingConnectionPoint(sourcePosition);
    line2d.setFrom(tPos.x, tPos.y);

    line2d.moveToBack();

    // Add connector ...
    this._positionateConnector(targetTopic);

};

mindplot.ConnectionLine.prototype._positionateConnector = function(targetTopic)
{
    var targetPosition = targetTopic.getPosition();
    var offset = mindplot.Topic.CONNECTOR_WIDTH / 2;
    var targetTopicSize = targetTopic.getSize();
    var y;
    if (targetTopic.getShapeType() == mindplot.NodeModel.SHAPE_TYPE_LINE)
    {
        y = targetTopicSize.height;
    } else
    {
        y = targetTopicSize.height / 2;
    }
    y = y - offset;

    var connector = targetTopic.getShrinkConnector();
    if (targetPosition.x >= 0)
    {
        var x = targetTopicSize.width;
        connector.setPosition(x, y);
    }
    else
    {
        var x = -mindplot.Topic.CONNECTOR_WIDTH;
        connector.setPosition(x, y);
    }
};

mindplot.ConnectionLine.prototype.setStroke = function(color, style, opacity)
{
    var line2d = this._line2d;
    this._line2d.setStroke(null, null, color, opacity);
};


mindplot.ConnectionLine.prototype.addToWorkspace = function(workspace)
{
    workspace.appendChild(this._line2d);
};

mindplot.ConnectionLine.prototype.removeFromWorkspace = function(workspace)
{
    workspace.removeChild(this._line2d);
};

mindplot.ConnectionLine.prototype.getTargetTopic = function()
{
    return this._targetTopic;
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.DragTopicPositioner = function(workspace, topics)
{
    core.assert(workspace, 'workspace can not be null');
    core.assert(topics, 'topics can not be null');

    this._workspace = workspace;
    this._topics = topics;
};

mindplot.DragTopicPositioner.prototype.positionateDragTopic = function(dragTopic)
{
    // Workout the real position of the element on the board.
    var dragTopicPosition = dragTopic.getPosition();
    var draggedTopic = dragTopic.getDraggedTopic();

    // Topic can be connected ?
    this._checkDragTopicConnection(dragTopic);

    // Position topic in the board
    if (dragTopic.isConnected())
    {
        var targetTopic = dragTopic.getConnectedToTopic();
        var topicBoard = targetTopic.getTopicBoard();
        topicBoard.positionateDragTopic(dragTopic);
    }
};

mindplot.DragTopicPositioner.CENTRAL_TO_MAINTOPIC_MAX_HORIZONTAL_DISTANCE = 300;

mindplot.DragTopicPositioner.prototype._checkDragTopicConnection = function(dragTopic)
{
    var topics = this._topics;

    // Must be disconnected from their current connection ?.
    var mainTopicToMainTopicConnection = this._lookUpForMainTopicToMainTopicConnection(dragTopic);
    var currentConnection = dragTopic.getConnectedToTopic();
    if (currentConnection)
    {
        // MainTopic->MainTopicConnection.
        if (currentConnection.getType()==mindplot.NodeModel.MAIN_TOPIC_TYPE)
        {
            if(mainTopicToMainTopicConnection != currentConnection)
            {
                dragTopic.disconnect(this._workspace);
            }
        }
        else if (currentConnection.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            // Distance if greater that the allowed.
            var dragXPosition = dragTopic.getPosition().x;
            var currentXPosition = currentConnection.getPosition().x;

            if(mainTopicToMainTopicConnection)
            {
                // I have to change the current connection to a main topic.
                dragTopic.disconnect(this._workspace);
            }else
            if (Math.abs(dragXPosition-currentXPosition) > mindplot.DragTopicPositioner.CENTRAL_TO_MAINTOPIC_MAX_HORIZONTAL_DISTANCE)
            {
                dragTopic.disconnect(this._workspace);
            }
        }
    }

    // Finally, connect nodes ...
    if (!dragTopic.isConnected())
    {
        var centalTopic = topics[0];
        if (mainTopicToMainTopicConnection)
        {
            dragTopic.connectTo(mainTopicToMainTopicConnection);
        } else if (Math.abs(dragTopic.getPosition().x - centalTopic.getPosition().x) <= mindplot.DragTopicPositioner.CENTRAL_TO_MAINTOPIC_MAX_HORIZONTAL_DISTANCE)
        {
            dragTopic.connectTo(centalTopic);
        }
    }
};

mindplot.DragTopicPositioner.prototype._lookUpForMainTopicToMainTopicConnection = function(dragTopic)
{
    var topics = this._topics;
    var result = null;
    var clouserDistance = -1;
    var draggedNode = dragTopic.getDraggedTopic();

    // Check MainTopic->MainTopic connection...
    for (var i = 0; i < topics.length; i++)
    {
        var targetTopic = topics[i];
        var position = dragTopic.getPosition();
        if (targetTopic.getType() != mindplot.NodeModel.CENTRAL_TOPIC_TYPE && targetTopic != draggedNode)
        {
            var canBeConnected = dragTopic.canBeConnectedTo(targetTopic);
            if (canBeConnected)
            {
                result = targetTopic;
                break;
            }
        }
    }
    return result;
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.Board = function(defaultHeight, referencePoint)
{
    this.initialize(defaultHeight, referencePoint);
};

mindplot.Board.prototype.initialize = function(defaultHeight, referencePoint)
{
    core.assert(referencePoint, "referencePoint can not be null");
    this._defaultWidth = defaultHeight;
    this._entries = new mindplot.BidirectionalArray();
    this._referencePoint = referencePoint;
};

mindplot.Board.prototype.getReferencePoint = function()
{
    return this._referencePoint;
};

/**
 * ---------------------------------------
 */
mindplot.BidirectionalArray = function()
{
    this._leftElem = [];
    this._rightElem = [];
};

mindplot.BidirectionalArray.prototype.get = function(index, sign)
{
    core.assert(core.Utils.isDefined(index), 'Illegal argument, index must be passed.');
    if (core.Utils.isDefined(sign))
    {
        core.assert(index >= 0, 'Illegal absIndex value');
        index = index * sign;
    }

    var result = null;
    if (index >= 0 && index < this._rightElem.length)
    {
        result = this._rightElem[index];
    } else if (index < 0 && Math.abs(index) < this._leftElem.length)
    {
        result = this._leftElem[Math.abs(index)];
    }
    return result;
};

mindplot.BidirectionalArray.prototype.set = function(index, elem)
{
    core.assert(core.Utils.isDefined(index), 'Illegal index value');

    var array = (index >= 0) ? this._rightElem : this._leftElem;
    array[Math.abs(index)] = elem;
};

mindplot.BidirectionalArray.prototype.length = function(index)
{
    core.assert(core.Utils.isDefined(index), 'Illegal index value');
    return (index >= 0) ? this._rightElem.length : this._leftElem.length;
};

mindplot.BidirectionalArray.prototype.upperLength = function()
{
    return this.length(1);
};

mindplot.BidirectionalArray.prototype.lowerLength = function()
{
    return this.length(-1);
};

mindplot.BidirectionalArray.prototype.inspect = function()
{
    var result = '{';
    var lenght = this._leftElem.length;
    for (var i = 0; i < lenght; i++)
    {
        var entry = this._leftElem[lenght - i - 1];
        if (entry != null)
        {
            if (i != 0)
            {
                result += ', ';
            }
            result += entry.inspect();
        }
    }

    lenght = this._rightElem.length;
    for (var i = 0; i < lenght; i++)
    {
        var entry = this._rightElem[i];
        if (entry != null)
        {
            if (i != 0)
            {
                result += ', ';
            }
            result += entry.inspect();
        }
    }
    result += '}';

    return result;

};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.TextEditor = function(screenManager,actionRunner)
{
    this._screenManager = screenManager;
    this._container = screenManager.getContainer();
    this._actionRunner = actionRunner;

    //Create editor ui
    this._size = {width:500, height:100};
    this._myOverlay = new Element('div').setStyles({position:"absolute", display: "none", zIndex: "8", top: 0, left:0, width:"500px", height:"100px"});
    var inputContainer = new Element('div').setStyles({border:"none", overflow:"auto"}).injectInside(this._myOverlay);
    this.inputText = new Element('input').setProperties({type:"text", tabindex:'-1', id:"inputText", value:""}).setStyles({border:"none", background:"transparent"}).injectInside(inputContainer);
    var spanContainer = new Element('div').setStyle('visibility', "hidden").injectInside(this._myOverlay);
    this._spanText = new Element('span').setProperties({id: "spanText", tabindex:"-1"}).setStyle('white-space', "nowrap").setStyle('nowrap', 'nowrap').injectInside(spanContainer);

    this._myOverlay.injectInside(this._container);

    var elem = this;
    this.applyChanges=true;
    this.inputText.onkeyup = function (evt) {
        var event = new Event(evt);
        var key = event.key;
        switch(key)
        {
            case 'esc':
                elem.applyChanges=false;
            case 'enter':        
                var executor = function(editor)
                {
                    return function()
                    {
                        elem.lostFocus(true);
                        $(document.documentElement).fireEvent('focus');
                    };
                };
                setTimeout(executor(this), 3);

                break;
            default:
                var span =$('spanText');
                var input = $('inputText');
                span.innerHTML = input.value;
                var size = input.value.length + 1;
                input.size= size;
                if (span.offsetWidth > (parseInt(elem._myOverlay.style.width) - 100))
                {
                    elem._myOverlay.style.width = (span.offsetWidth + 100) + "px";
                }
                break;
        }
    };
    //Register onLostFocus/onBlur event
    $(this.inputText).addEvent('blur', this.lostFocusEvent.bind(this));


    var elem = this;
    var onComplete = function() {
        this._myOverlay.setStyle('display', "none");
        this.inputText.setStyle('opacity', 1);

        this.setPosition(0, 0);
        if (elem._currentNode != null)
        {
            this._currentNode.getTextShape().setVisibility(true);
            if(this.applyChanges)
            {
                this._updateNode();
            }
            this.applyChanges=true;
            this._currentNode = null;
        }

       if (core.UserAgent.isSVGSupported())
        {
            setTimeout("$('ffoxWorkarroundInput').focus();", 0);
        }
    };
    this.fx = new Fx.Style(this.inputText, 'opacity', { duration: 10});
    this.fx.addEvent('onComplete', onComplete.bind(this));

};

mindplot.TextEditor.prototype.lostFocusEvent = function ()
{
    this.fx.options.duration = 10;
    this.fx.start(1, 0);
    //myAnim.animate();
};

mindplot.TextEditor.prototype._isVisible = function ()
{
    //console.log('focus event');
    //if(this._myOverlay.cfg.getProperty("visible") == true)
    if ($(this._myOverlay).getStyle('display') == "block")
    {
        return true;
    }
    else
    {
        return false;
    }
};
mindplot.TextEditor.prototype.getFocusEvent = function (node)
{
    //console.log('focus event');
    if (this._isVisible())
    {
        //        var elem = this;
        //        var executor = function(editor)
        //        {
        //            return function()
        //            {
        //                elem.getFocusEvent.attempt(node, elem);
        //            };
        //        };
        //
        //        setTimeout(executor(this), 10);
        this.getFocusEvent.delay(10, this);
    }
    else
    {
        //console.log('calling init');
        this.init(node);
    }
    //console.log('focus event done');
};

mindplot.TextEditor.prototype.setInitialText = function (text)
{
    this.initialText=text;
};

mindplot.TextEditor.prototype._updateNode = function ()
{

    if (core.Utils.isDefined(this._currentNode) && this._currentNode.getText() != this.getText())
    {
        var text = this.getText();
        var topicId = this._currentNode.getId();

        var commandFunc = function(topic,value)
        {
            var result = topic.getText();
            topic.setText(value);
            return result;
        };
        var command = new mindplot.commands.GenericFunctionCommand(commandFunc,text,[topicId]);
        this._actionRunner.execute(command);
    }
};

mindplot.TextEditor.prototype.listenEventOnNode = function(topic, eventName, stopPropagation)
{
    var elem = this;
    topic.addEventListener(eventName, function (event) {
        elem.lostFocus();
        elem.getFocusEvent.attempt(topic, elem);

        if (stopPropagation)
        {
            if (event.stopPropagation)
            {
                event.stopPropagation(true);
            } else
            {
                event.cancelBubble = true;
            }
        }
    });
};

mindplot.TextEditor.prototype.init = function (nodeGraph)
{
    //console.log('init method');
    nodeGraph.getTextShape().setVisibility(false);
    this._currentNode = nodeGraph;

    //set Editor Style
    var nodeText = nodeGraph.getTextShape();
    var text;
    var selectText=true;
    if(this.initialText && this.initialText!="")
    {
        text = this.initialText;
        this.initialText=null;
        selectText=false;
    }
    else
        text = nodeText.getText();
    
    var font = nodeText.getFont();
    font.size = nodeText.getHtmlFontSize();
    font.color = nodeText.getColor();

    this.setStyle(font);

    //set editor's initial text
    this.setText(text);

    //set editor's initial size
    var editor = this;
    var executor = function(editor)
    {
        return function()
        {
            //console.log('setting editor in init thread');
            var scale = web2d.peer.utils.TransformUtil.workoutScale(editor._currentNode.getTextShape()._peer);
            var elemSize = editor._currentNode.getSize();
            //var textSize = editor.getSize();
            var pos = editor._screenManager.getWorkspaceElementPosition(editor._currentNode);

            var textWidth = editor._currentNode.getTextShape().getWidth();
            var textHeight = editor._currentNode.getTextShape().getHeight();
            var iconGroup = editor._currentNode.getIconGroup();
            var iconGroupSize;
            if($chk(iconGroup))
            {
                iconGroupSize = editor._currentNode.getIconGroup().getSize();
            }
            else
            {
                iconGroupSize = {width:0, height:0};
            }
            var position = {x:0,y:0};
            position.x = pos.x - ((textWidth * scale.width) / 2) + ((iconGroupSize.width * scale.width)/2);
            var fixError = 0;
            if (core.UserAgent.isSVGSupported())
            {
                fixError = 4;
            }
            position.y = pos.y - ((textHeight * scale.height) / 2) - fixError;

            editor.setEditorSize(elemSize.width, elemSize.height, scale);
            //console.log('setting position:'+pos.x+';'+pos.y);
            editor.setPosition(position.x, position.y, scale);
            editor.showTextEditor(selectText);
            //console.log('setting editor done');
        };
    };

    setTimeout(executor(this), 10);
    //console.log('init done');
};

mindplot.TextEditor.prototype.setStyle = function (fontStyle)
{
    var inputField = $("inputText");
    var spanField = $("spanText");
    if (!core.Utils.isDefined(fontStyle.font))
    {
        fontStyle.font = "Arial";
    }
    if (!core.Utils.isDefined(fontStyle.style))
    {
        fontStyle.style = "normal";
    }
    if (!core.Utils.isDefined(fontStyle.weight))
    {
        fontStyle.weight = "normal";
    }
    if (!core.Utils.isDefined(fontStyle.size))
    {
        fontStyle.size = 12;
    }
    inputField.style.fontSize = fontStyle.size + "px";
    inputField.style.fontFamily = fontStyle.font;
    inputField.style.fontStyle = fontStyle.style;
    inputField.style.fontWeight = fontStyle.weight;
    inputField.style.color = fontStyle.color;
    spanField.style.fontFamily = fontStyle.font;
    spanField.style.fontStyle = fontStyle.style;
    spanField.style.fontWeight = fontStyle.weight;
    spanField.style.fontSize = fontStyle.size + "px";
};

mindplot.TextEditor.prototype.setText = function(text)
{
    var inputField = $("inputText");
    inputField.size = text.length + 1;
    //this._myOverlay.cfg.setProperty("width", (inputField.size * parseInt(inputField.style.fontSize) + 100) + "px");
    this._myOverlay.style.width = (inputField.size * parseInt(inputField.style.fontSize) + 100) + "px";
    var spanField = $("spanText");
    spanField.innerHTML = text;
    inputField.value = text;
};

mindplot.TextEditor.prototype.getText = function()
{
    return $('inputText').value;
};


mindplot.TextEditor.prototype.setEditorSize = function (width, height, scale)
{
    //var scale = web2d.peer.utils.TransformUtil.workoutScale(this._currentNode.getTextShape()._peer);
    this._size = {width:width * scale.width, height:height * scale.height};
    //this._myOverlay.cfg.setProperty("width",this._size.width*2+"px");
    this._myOverlay.style.width = this._size.width * 2 + "px";
    //this._myOverlay.cfg.setProperty("height",this._size.height+"px");
    this._myOverlay.style.height = this._size.height + "px";
};

mindplot.TextEditor.prototype.getSize = function ()
{
    return {width:$("spanText").offsetWidth,height:$("spanText").offsetHeight};
};


mindplot.TextEditor.prototype.setPosition = function (x, y, scale)
{
    $(this._myOverlay).setStyles({top : y + "px", left: x + "px"});
    //this._myOverlay.style.left = x + "px";
};

mindplot.TextEditor.prototype.showTextEditor = function(selectText)
{
    //this._myOverlay.show();
    //var myAnim = new YAHOO.util.Anim('inputText',{opacity: {to:1}}, 0.10, YAHOO.util.Easing.easeOut);
    //$('inputText').style.opacity='1';
    var elem = this;
    //myAnim.onComplete.subscribe(function(){
    //elem._myOverlay.show();
    elem._myOverlay.setStyle('display', "block");
    //elem.cfg.setProperty("visible", false);
    //elem._myOverlay.cfg.setProperty("xy", [0, 0]);
    //elem._myOverlay.cfg.setProperty("visible", true);
    //select the text in the input
    $('inputText').disabled = false;

    if ($('inputText').createTextRange) //ie
    {
        var range = $('inputText').createTextRange();
        var pos = $('inputText').value.length;
        if(selectText)
        {
            range.select();
            range.move("character", pos);
        }
        else
        {
            range.move("character", pos);
            range.select();
        }
    }
    else if(selectText)
    {
        $('inputText').setSelectionRange(0, $('inputText').value.length);
    }

    var executor = function(editor)
    {
        return function()
        {
            try {
                $('inputText').focus();
            }
            catch (e)
            {

            }
        };
    };
    setTimeout(executor(this), 0);
    //});
    //myAnim.animate();

};

mindplot.TextEditor.prototype.lostFocus = function(bothBrowsers)
{
    if (this._isVisible())
    {
        //the editor is opened in another node. lets Finish it.
        var fireOnThis = $('inputText');
        fireOnThis.fireEvent('blur');
    }
};

/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.VariableDistanceBoard = function(defaultHeight, referencePoint)
{
    mindplot.VariableDistanceBoard.superClass.initialize.call(this, defaultHeight, referencePoint);

    var zeroEntryCoordinate = referencePoint.y;
    var entry = this.createBoardEntry(zeroEntryCoordinate - (defaultHeight / 2), zeroEntryCoordinate + (defaultHeight / 2), 0);
    this._entries.set(0, entry);
};


objects.extend(mindplot.VariableDistanceBoard, mindplot.Board);

mindplot.VariableDistanceBoard.prototype.lookupEntryByOrder = function(order)
{
    var entries = this._entries;
    var index = this._orderToIndex(order);

    var result = entries.get(index);
    if (!result)
    {
        // I've not found a entry. I have to create a new one.
        var i = 1;
        var zeroEntry = entries.get(0);
        var distance = zeroEntry.getWidth() / 2;
        var indexSign = Math.sign(index);
        var absIndex = Math.abs(index);
        while (i < absIndex)
        {
            // Move to the next entry ...
            var width;
            var entry = entries.get(i, indexSign);
            if (entry != null)
            {
                distance += entry.getWidth();
            } else
            {
                distance += this._defaultWidth;
            }

            i++;
        }

        // Caculate limits ...
        var upperLimit = -1;
        var lowerLimit = -1;
        var offset = zeroEntry.workoutEntryYCenter();
        if (index >= 0)
        {
            lowerLimit = offset + distance;
            upperLimit = lowerLimit + this._defaultWidth;
        } else
        {
            upperLimit = offset - distance;
            lowerLimit = upperLimit - this._defaultWidth;
        }

        result = this.createBoardEntry(lowerLimit, upperLimit, order);
    }
    return result;
};

mindplot.VariableDistanceBoard.prototype.createBoardEntry = function(lowerLimit, upperLimit, order)
{
    return  new mindplot.BoardEntry(lowerLimit, upperLimit, order);
};

mindplot.VariableDistanceBoard.prototype.updateReferencePoint = function(position)
{
    var entries = this._entries;
    var referencePoint = this._referencePoint;

    // Update zero entry current position.
    this._referencePoint = position.clone();
    var yOffset = position.y - referencePoint.y;

    var i = -entries.lowerLength();
    for (; i <= entries.length(1); i++)
    {
        var entry = entries.get(i);
        if (entry != null)
        {
            var upperLimit = entry.getUpperLimit() + yOffset;
            var lowerLimit = entry.getLowerLimit() + yOffset;
            entry.setUpperLimit(upperLimit);
            entry.setLowerLimit(lowerLimit);

            // Update topic position ...
            if (!entry.isAvailable())
            {
                var topic = entry.getTopic();
                var topicPosition = topic.getPosition();
                topicPosition.y = topicPosition.y + yOffset;

                // MainTopicToCentral must be positioned based on the referencePoint.
                var xOffset = position.x - referencePoint.x;
                topicPosition.x = topicPosition.x + xOffset;

                topic.setPosition(topicPosition);
            }
        }
    }
};


mindplot.VariableDistanceBoard.prototype.lookupEntryByPosition = function(pos)
{
    core.assert(core.Utils.isDefined(pos), 'position can not be null');
    var entries = this._entries;
    var zeroEntry = entries.get(0);
    if (zeroEntry.isCoordinateIn(pos.y))
    {
        return zeroEntry;
    }

    // Is Upper or lower ?
    var sign = -1;
    if (pos.y >= zeroEntry.getUpperLimit())
    {
        sign = 1;
    }

    var i = 1;
    var tempEntry = this.createBoardEntry();
    var currentEntry = zeroEntry;
    while (true)
    {
        // Move to the next entry ...
        var index = i * sign;
        var entry = entries.get(index);
        if (entry)
        {
            currentEntry = entry;
        } else
        {
            // Calculate boundaries...
            var lowerLimit, upperLimit;
            if (sign > 0)
            {
                lowerLimit = currentEntry.getUpperLimit();
                upperLimit = lowerLimit + this._defaultWidth;
            }
            else
            {
                upperLimit = currentEntry.getLowerLimit();
                lowerLimit = upperLimit - this._defaultWidth;
            }

            // Update current entry.
            currentEntry = tempEntry;
            currentEntry.setLowerLimit(lowerLimit);
            currentEntry.setUpperLimit(upperLimit);

            var order = this._indexToOrder(index);
            currentEntry.setOrder(order);
        }

        // Have I found the item?
        if (currentEntry.isCoordinateIn(pos.y))
        {
            break;
        }
        i++;
    }
    return currentEntry;
};


mindplot.VariableDistanceBoard.prototype.update = function(entry)
{
    core.assert(entry, 'Entry can not be null');
    var order = entry.getOrder();
    var index = this._orderToIndex(order);

    this._entries.set(index, entry);

};


mindplot.VariableDistanceBoard.prototype.getLastNoAvailalbleEntry = function()
{
    var entries = this._entries;
    var lowerLength = entries.lowerLength();
    var upperLength = entries.upperLength();

    var result = null;
    var i = -lowerLength;
    while (i <= upperLength)
    {
        var entry = entries.get(i);
        if (entry && !entry.isAvailable())
        {
            result = entry;
            break;
        }
        i++;
    }
    return result;

};

mindplot.VariableDistanceBoard.prototype.getFirstNoAvailableEntry = function()
{
    var entries = this._entries;
    var lowerLength = -entries.lowerLength();
    var upperLength = entries.upperLength();

    var result = null;
    var i = upperLength;
    while (i >= lowerLength)
    {
        var entry = entries.get(i);
        if (entry && !entry.isAvailable())
        {
            result = entry;
            break;
        }
        i--;
    }
    return result;
};


mindplot.VariableDistanceBoard.prototype.freeEntry = function(entry)
{
    var order = entry.getOrder();
    var entries = this._entries;

    var index = this._orderToIndex(order);
    var indexSign = Math.sign(index);
    var lenght = entries.length(index);

    var currentTopic = entry.getTopic();
    var i = Math.abs(index) + 1;
    while (currentTopic)
    {
        var e = entries.get(i, indexSign);
        if (currentTopic && !e)
        {
            var entryOrder = this._indexToOrder(i * indexSign);
            e = this.lookupEntryByOrder(entryOrder);
        }

        // Move the topic to the next entry ...
        var topic = null;
        if (e)
        {
            topic = e.getTopic();
            if (currentTopic)
            {
                e.setTopic(currentTopic);
            }
            this.update(e);
        }
        currentTopic = topic;
        i++;
    }

    // Clear the entry topic ...
    entry.setTopic(null);
};

mindplot.VariableDistanceBoard.prototype._orderToIndex = function(order)
{
    var index = Math.round(order / 2);
    return ((order % 2) == 0) ? index : -index;
};
mindplot.VariableDistanceBoard.prototype._indexToOrder = function(index)
{
    var order = Math.abs(index) * 2;
    return (index >= 0)? order: order - 1;
};

mindplot.VariableDistanceBoard.prototype.inspect = function()
{
    return this._entries.inspect();
};

/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.util.Shape =
{
    isAtRight: function(sourcePoint, targetPoint)
    {
        core.assert(sourcePoint, "Source can not be null");
        core.assert(targetPoint, "Target can not be null");
        return (targetPoint.x - sourcePoint.x) > 0;
    },
    workoutDistance: function(sourceNode, targetNode)
    {
        var sPos = sourceNode.getPosition();
        var tPos = targetNode.getPosition();

        var x = tPos.x - sPos.x;
        var y = tPos.y - sPos.y;

        var hip = y * y + x * x;
        return hip;
    },
    calculateRectConnectionPoint: function(rectCenterPoint, rectSize, isAtRight)
    {
        core.assert(rectCenterPoint, 'rectCenterPoint can  not be null');
        core.assert(rectSize, 'rectSize can  not be null');
        core.assert(core.Utils.isDefined(isAtRight), 'isRight can  not be null');

        // Node is placed at the right ?
        var result = new core.Point();

        // This is used fix a minor difference ...z
        var correctionHardcode = 2;
        if (isAtRight)
        {
            result.setValue(rectCenterPoint.x - (rectSize.width / 2) + correctionHardcode, rectCenterPoint.y);
        } else
        {
            result.setValue(parseFloat(rectCenterPoint.x) + (rectSize.width / 2) - correctionHardcode, rectCenterPoint.y);
        }

        return result;
    },
    _getRectShapeOffset : function(sourceTopic, targetTopic)
    {

        var tPos = targetTopic.getPosition();
        var sPos = sourceTopic.getPosition();

        var tSize = targetTopic.getSize();

        var x = sPos.x - tPos.x;
        var y = sPos.y - tPos.y;

        var gradient = 0;
        if (x)
        {
            gradient = y / x;
        }

        var area = this._getSector(gradient, x, y);
        var xOff = -1;
        var yOff = -1;
        if (area == 1 || area == 3)
        {
            xOff = tSize.width / 2;
            yOff = xOff * gradient;

            xOff = xOff * ((x < 0) ? -1 : 1);
            yOff = yOff * ((x < 0) ? -1 : 1);


        } else
        {
            yOff = tSize.height / 2;
            xOff = yOff / gradient;

            yOff = yOff * ((y < 0) ? -1 : 1);
            xOff = xOff * ((y < 0) ? -1 : 1);
        }


        // Controll boundaries.
        if (Math.abs(xOff) > tSize.width / 2)
        {
            xOff = ((tSize.width / 2) * Math.sign(xOff));
        }

        if (Math.abs(yOff) > tSize.height / 2)
        {
            yOff = ((tSize.height / 2) * Math.sign(yOff));
        }

        return {x:xOff,y:yOff};
    },

/**
 *  Sector are numered following the clockwise direction.
 */
    _getSector : function(gradient, x, y)
    {
        var result;
        if (gradient < 0.5 && gradient > -0.5)
        {
            // Sector 1 and 3
            if (x >= 0)
            {
                result = 1;
            } else
            {
                result = 3;
            }

        } else
        {
            // Sector 2 and 4
            if (y <= 0)
            {
                result = 4;
            } else
            {
                result = 2;
            }
        }

        return result;
    }
};

/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.FixedDistanceBoard = function(defaultHeight, topic)
{
    this._topic = topic;
    var reference = topic.getPosition();
    mindplot.FixedDistanceBoard.superClass.initialize.call(this, defaultHeight, reference);
    this._height = defaultHeight;
    this._entries = [];
};

objects.extend(mindplot.FixedDistanceBoard, mindplot.Board);

mindplot.FixedDistanceBoard.prototype.getHeight = function()
{
    return this._height;
};

mindplot.FixedDistanceBoard.prototype.lookupEntryByOrder = function(order)
{
    var result = null;
    var entries = this._entries;
    if (order < entries.length)
    {
        result = entries[order];
    }

    if (result == null)
    {
        var defaultHeight = this._defaultWidth;
        var reference = this.getReferencePoint();
        if (entries.length == 0)
        {
            var yReference = reference.y;
            result = this.createBoardEntry(yReference - (defaultHeight / 2), yReference + (defaultHeight / 2), 0);
        } else
        {
            var entriesLenght = entries.length;
            var lastEntry = entries[entriesLenght - 1];
            var lowerLimit = lastEntry.getUpperLimit();
            var upperLimit = lowerLimit + defaultHeight;
            result = this.createBoardEntry(lowerLimit, upperLimit, entriesLenght + 1);
        }
    }
    return result;
};

mindplot.FixedDistanceBoard.prototype.createBoardEntry = function(lowerLimit, upperLimit, order)
{
    var result = new mindplot.BoardEntry(lowerLimit, upperLimit, order);
    var xPos = this.workoutXBorderDistance();
    result.setXPosition(xPos);
    return result;
};

mindplot.FixedDistanceBoard.prototype.updateReferencePoint = function()
{
    var entries = this._entries;
    var parentTopic = this.getTopic();
    var parentPosition = parentTopic.workoutIncomingConnectionPoint(parentTopic);
    var referencePoint = this.getReferencePoint();
    var yOffset = parentPosition.y - referencePoint.y;

    for (var i = 0; i < entries.length; i++)
    {
        var entry = entries[i];

        var upperLimit = entry.getUpperLimit() + yOffset;
        var lowerLimit = entry.getLowerLimit() + yOffset;
        entry.setUpperLimit(upperLimit);
        entry.setLowerLimit(lowerLimit);

        // Fix x position ...
        var xPos = this.workoutXBorderDistance();
        entry.setXPosition(xPos);
        entry.update();
    }
    this._referencePoint = parentPosition.clone();

};

mindplot.FixedDistanceBoard.MAIN_TOPIC_TO_MAIN_TOPIC_DISTANCE = 20;


/**
 * This x distance does't take into account the size of the shape.
 */
mindplot.FixedDistanceBoard.prototype.workoutXBorderDistance = function()
{
    var topic = this.getTopic();

    var topicPosition = topic.getPosition();
    var topicSize = topic.getSize();
    var halfTargetWidth = topicSize.width / 2;
    var result;
    if (topicPosition.x >= 0)
    {
        // It's at right.
        result = topicPosition.x + halfTargetWidth + mindplot.FixedDistanceBoard.MAIN_TOPIC_TO_MAIN_TOPIC_DISTANCE;
    } else
    {
        result = topicPosition.x - (halfTargetWidth + mindplot.FixedDistanceBoard.MAIN_TOPIC_TO_MAIN_TOPIC_DISTANCE);
    }
    return result;
};

mindplot.FixedDistanceBoard.prototype.getTopic = function()
{
    return this._topic;
};

mindplot.FixedDistanceBoard.INTER_TOPIC_DISTANCE = 6;

mindplot.FixedDistanceBoard.prototype.freeEntry = function(entry)
{
    var newEntries = [];
    var entries = this._entries;
    var order = 0;
    for (var i = 0; i < entries.length; i++)
    {
        var e = entries[i];
        if (e == entry)
        {
            order++;
        }
        newEntries[order] = e;
        order++;
    }
    this._entries = newEntries;
};

mindplot.FixedDistanceBoard.prototype.repositionate = function()
{
    // Workout width and update topic height.
    var entries = this._entries;
    var height = 0;
    var model = this._topic.getModel();
    if (entries.length >= 1 && !model.areChildrenShrinked())
    {
        for (var i = 0; i < entries.length; i++)
        {
            var e = entries[i];
            if (e && e.getTopic())
            {
                var topic = e.getTopic();
                var topicBoard = topic.getTopicBoard();
                var topicBoardHeight = topicBoard.getHeight();


                height += topicBoardHeight + mindplot.FixedDistanceBoard.INTER_TOPIC_DISTANCE;
            }
        }
    }
    else {
        var topic = this._topic;
        height = topic.getSize().height + mindplot.FixedDistanceBoard.INTER_TOPIC_DISTANCE;
    }

    var oldHeight = this._height;
    this._height = height;

    // I must update all the parent nodes first...
    if (oldHeight != this._height)
    {
        var topic = this._topic;
        var parentTopic = topic.getParent();
        if (parentTopic != null)
        {
            var board = parentTopic.getTopicBoard();
            board.repositionate();
        }
    }


    // @todo: Esto hace backtraking. Hay que cambiar la implementacion del set position de
    // forma tal que no se mande a hacer el update de todos los hijos.

    // Workout center the new topic center...
    var refence = this.getReferencePoint();
    var lowerLimit;
    if (entries.length > 0)
    {
        var topic = entries[0].getTopic();
        var firstNodeHeight = topic.getSize().height;
        lowerLimit = refence.y - (height / 2) - (firstNodeHeight / 2) + 1;
    }

    var upperLimit = null;

    // Start moving all the elements ...
    var newEntries = [];
    var order = 0;
    for (var i = 0; i < entries.length; i++)
    {
        var e = entries[i];
        if (e && e.getTopic())
        {

            var currentTopic = e.getTopic();
            e.setLowerLimit(lowerLimit);

            // Update entry ...
            var topicBoard = currentTopic.getTopicBoard();
            var topicBoardHeight = topicBoard.getHeight();

            upperLimit = lowerLimit + topicBoardHeight + mindplot.FixedDistanceBoard.INTER_TOPIC_DISTANCE;
            e.setUpperLimit(upperLimit);
            lowerLimit = upperLimit;

            e.setOrder(order);
            currentTopic.setOrder(order);

            e.update();
            newEntries[order] = e;
            order++;
        }
    }
    this._entries = newEntries;
};

mindplot.FixedDistanceBoard.prototype.removeTopic = function(topic)
{
    var order = topic.getOrder();
    var entry = this.lookupEntryByOrder(order);
    core.assert(!entry.isAvailable(), "Illegal state");

    entry.setTopic(null);
    topic.setOrder(null);
    this._entries.remove(entry);

    // Repositionate all elements ...
    this.repositionate();
};

mindplot.FixedDistanceBoard.prototype.addTopic = function(order, topic)
{

    // If the entry is not available, I must swap the the entries...
    var entry = this.lookupEntryByOrder(order);
    if (!entry.isAvailable())
    {
        this.freeEntry(entry);
        // Create a dummy entry ...
        // Puaj, do something with this...
        entry = this.createBoardEntry(-1, 0, order);
        this._entries[order] = entry;
    }
    this._entries[order] = entry;

    // Add to the board ...
    entry.setTopic(topic, false);

    // Repositionate all elements ...
    this.repositionate();
};

mindplot.FixedDistanceBoard.prototype.lookupEntryByPosition = function(pos)
{
    core.assert(core.Utils.isDefined(pos), 'position can not be null');

    var entries = this._entries;
    var result = null;
    for (var i = 0; i < entries.length; i++)
    {
        var entry = entries[i];
        if (pos.y < entry.getUpperLimit() && pos.y >= entry.getLowerLimit())
        {
            result = entry;
        }
    }

    if (result == null)
    {
        var defaultHeight = this._defaultWidth;
        if (entries.length == 0)
        {
            var reference = this.getReferencePoint();
            var yReference = reference.y;
            result = this.createBoardEntry(yReference - (defaultHeight / 2), yReference + (defaultHeight / 2), 0);
        } else
        {
            var firstEntry = entries[0];
            if (pos.y < firstEntry.getLowerLimit())
            {
                var upperLimit = firstEntry.getLowerLimit();
                var lowerLimit = upperLimit + defaultHeight;
                result = this.createBoardEntry(lowerLimit, upperLimit, -1);
            } else
            {
                var entriesLenght = entries.length;
                var lastEntry = entries[entriesLenght - 1];
                var lowerLimit = lastEntry.getUpperLimit();
                var upperLimit = lowerLimit + defaultHeight;
                result = this.createBoardEntry(lowerLimit, upperLimit, entriesLenght);
            }
        }
    }

    return result;
};
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.BoardEntry = function(lowerLimit, upperLimit, order)
{
    if (lowerLimit && upperLimit)
    {
        core.assert(lowerLimit < upperLimit, 'lowerLimit can not be greater that upperLimit');
    }
    this._upperLimit = upperLimit;
    this._lowerLimit = lowerLimit;
    this._order = order;
    this._topic = null;
    this._xPos = null;
};

mindplot.BoardEntry.prototype.getUpperLimit = function()
{
    return this._upperLimit;
};

mindplot.BoardEntry.prototype.setXPosition = function(xPosition)
{
    this._xPos = xPosition;
};

mindplot.BoardEntry.prototype.workoutEntryYCenter = function()
{
    return this._lowerLimit + ((this._upperLimit - this._lowerLimit) / 2);
};

mindplot.BoardEntry.prototype.setUpperLimit = function(value)
{
    core.assert(core.Utils.isDefined(value), "upper limit can not be null");
    core.assert(!isNaN(value), "illegal value");
    this._upperLimit = value;
};

mindplot.BoardEntry.prototype.isCoordinateIn = function(coord)
{
    return this._lowerLimit <= coord && coord < this._upperLimit;
};

mindplot.BoardEntry.prototype.getLowerLimit = function()
{
    return this._lowerLimit;
};

mindplot.BoardEntry.prototype.setLowerLimit = function(value)
{
    core.assert(core.Utils.isDefined(value), "upper limit can not be null");
    core.assert(!isNaN(value), "illegal value");
    this._lowerLimit = value;
};

mindplot.BoardEntry.prototype.setOrder = function(value)
{
    this._order = value;
};

mindplot.BoardEntry.prototype.getWidth = function()
{
    return Math.abs(this._upperLimit - this._lowerLimit);
};


mindplot.BoardEntry.prototype.getTopic = function()
{
    return this._topic;
};


mindplot.BoardEntry.prototype.removeTopic = function()
{
    core.assert(!this.isAvailable(), "Entry doesn't have a topic.");
    var topic = this.getTopic();
    this.setTopic(null);
    topic.setOrder(null);
};


mindplot.BoardEntry.prototype.update = function()
{
    var topic = this.getTopic();
    this.setTopic(topic);
};

mindplot.BoardEntry.prototype.setTopic = function(topic, updatePosition)
{
    if (!core.Utils.isDefined(updatePosition))
    {
        updatePosition = true;
    }

    this._topic = topic;
    if (topic)
    {
        // Fixed positioning. Only for main topic ...
        var position = null;
        var topicPosition = topic.getPosition();

        // Must update position base on the border limits?
        if (this._xPos)
        {
            position = new core.Point();

            // Update x position ...
            var topicSize = topic.getSize();
            var halfTopicWidh = parseInt(topicSize.width / 2);
            halfTopicWidh = (this._xPos > 0) ? halfTopicWidh:-halfTopicWidh;
            position.x = this._xPos + halfTopicWidh;
            position.y = this.workoutEntryYCenter();
        } else {

            // Central topic
            this._height = topic.getSize().height;
            var xPos = topicPosition.x;
            var yPos = this.workoutEntryYCenter();
            position = new core.Point(xPos, yPos);
        }

        // @todo: No esta de mas...
        topic.setPosition(position);
        topic.setOrder(this._order);
    }
    else
    {
        this._height = this._defaultWidth;
    }
};

mindplot.BoardEntry.prototype.isAvailable = function()
{
    return !core.Utils.isDefined(this._topic);
};

mindplot.BoardEntry.prototype.getOrder = function()
{
    return this._order;
};

mindplot.BoardEntry.prototype.inspect = function()
{
    return '(order: ' + this._order + ', lowerLimit:' + this._lowerLimit + ', upperLimit: ' + this._upperLimit + ', available:' + this.isAvailable() + ')';
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.XMLMindmapSerializer = function()
{

};

mindplot.XMLMindmapSerializer.prototype.toXML = function(mindmap)
{
    core.assert(mindmap, "Can not save a null mindmap");

    var document = core.Utils.createDocument();

    // Store map attributes ...
    var mapElem = document.createElement("map");
    var name = mindmap.getId();
    if (name)
    {
        mapElem.setAttribute('name', name);
    }
    document.appendChild(mapElem);

    // Create branches ...
    var topics = mindmap.getBranches();
    for (var i = 0; i < topics.length; i++)
    {
        var topic = topics[i];
        var topicDom = this._topicToXML(document, topic);
        mapElem.appendChild(topicDom);
    }

    return document;
};

mindplot.XMLMindmapSerializer.prototype._topicToXML = function(document, topic)
{
    var parentTopic = document.createElement("topic");

    // Set topic attributes...
    if (topic.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
    {
        parentTopic.setAttribute("central", true);
    } else
    {
        var parent = topic.getParent();
        if (parent == null || parent.getType() == mindplot.NodeModel.CENTRAL_TOPIC_TYPE)
        {
            var pos = topic.getPosition();
            parentTopic.setAttribute("position", pos.x + ',' + pos.y);
        } else
        {
            var order = topic.getOrder();
            parentTopic.setAttribute("order", order);
        }
    }

    var text = topic.getText();
    if (text) {
        parentTopic.setAttribute('text', text);
    }

    var shape = topic.getShapeType();
    if (shape) {
        parentTopic.setAttribute('shape', shape);
    }

    if(topic.areChildrenShrinked())
    {
        parentTopic.setAttribute('shrink',true);
    }

    // Font properties ...
    var font = "";

    var fontFamily = topic.getFontFamily();
    font += (fontFamily ? fontFamily : '') + ';';

    var fontSize = topic.getFontSize();
    font += (fontSize ? fontSize : '') + ';';

    var fontColor = topic.getFontColor();
    font += (fontColor ? fontColor : '') + ';';

    var fontWeight = topic.getFontWeight();
    font += (fontWeight ? fontWeight : '') + ';';

    var fontStyle = topic.getFontStyle();
    font += (fontStyle ? fontStyle : '') + ';';

    if (fontFamily || fontSize || fontColor || fontWeight || fontStyle)
    {
        parentTopic.setAttribute('fontStyle', font);
    }

    var bgColor = topic.getBackgroundColor();
    if (bgColor) {
        parentTopic.setAttribute('bgColor', bgColor);
    }

    var brColor = topic.getBorderColor();
    if (brColor) {
        parentTopic.setAttribute('brColor', brColor);
    }

    //ICONS
    var icons = topic.getIcons();
    for (var i = 0; i < icons.length; i++)
    {
        var icon = icons[i];
        var iconDom = this._iconToXML(document, icon);
        parentTopic.appendChild(iconDom);
    }

    //LINKS
    var links = topic.getLinks();
    for (var i = 0; i < links.length; i++)
    {
        var link = links[i];
        var linkDom = this._linkToXML(document, link);
        parentTopic.appendChild(linkDom);
    }

    var notes = topic.getNotes();
    for (var i = 0; i < notes.length; i++)
    {
        var note = notes[i];
        var noteDom = this._noteToXML(document, note);
        parentTopic.appendChild(noteDom);
    }

    //CHILDREN TOPICS
    var childTopics = topic.getChildren();
    for (var i = 0; i < childTopics.length; i++)
    {
        var childTopic = childTopics[i];
        var childDom = this._topicToXML(document, childTopic);
        parentTopic.appendChild(childDom);

    }

    return parentTopic;
};

mindplot.XMLMindmapSerializer.prototype._iconToXML = function(document, icon)
{
    var iconDom = document.createElement("icon");
    iconDom.setAttribute('id', icon.getIconType());
    return iconDom;
};

mindplot.XMLMindmapSerializer.prototype._linkToXML = function(document, link)
{
    var linkDom = document.createElement("link");
    linkDom.setAttribute('url', link.getUrl());
    return linkDom;
};

mindplot.XMLMindmapSerializer.prototype._noteToXML = function(document, note)
{
    var noteDom = document.createElement("note");
    noteDom.setAttribute('text', note.getText());
    return noteDom;
};

mindplot.XMLMindmapSerializer.prototype.loadFromDom = function(dom)
{
    core.assert(dom, "Dom can not be null");
    var rootElem = dom.documentElement;

    // Is a wisemap?.
    core.assert(rootElem.tagName == mindplot.XMLMindmapSerializer.MAP_ROOT_NODE, "This seem not to be a map document.");

    // Start the loading process ...
    var mindmap = new mindplot.Mindmap();

    var children = rootElem.childNodes;
    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];
        if (child.nodeType == 1)
        {
            var topic = this._deserializeNode(child, mindmap);
            mindmap.addBranch(topic);
        }
    }
    return mindmap;
};

mindplot.XMLMindmapSerializer.prototype._deserializeNode = function(domElem, mindmap)
{
    var type = (domElem.getAttribute('central') != null) ? mindplot.NodeModel.CENTRAL_TOPIC_TYPE : mindplot.NodeModel.MAIN_TOPIC_TYPE;
    var topic = mindmap.createNode(type);

    // Load attributes...
    var text = domElem.getAttribute('text');
    if (text) {
        topic.setText(text);
    }

    var order = domElem.getAttribute('order');
    if (order) {
        topic.setOrder(order);
    }

    var shape = domElem.getAttribute('shape');
    if (shape) {
        topic.setShapeType(shape);
    }

    var isShrink = domElem.getAttribute('shrink');
    if(isShrink)
    {
        topic.setChildrenShrinked(isShrink);
    }

    var fontStyle = domElem.getAttribute('fontStyle');
    if (fontStyle) {
        var font = fontStyle.split(';');

        if (font[0])
        {
            topic.setFontFamily(font[0]);
        }

        if (font[1])
        {
            topic.setFontSize(font[1]);
        }

        if (font[2])
        {
            topic.setFontColor(font[2]);
        }

        if (font[3])
        {
            topic.setFontWeight(font[3]);
        }

        if (font[4])
        {
            topic.setFontStyle(font[4]);
        }
    }

    var bgColor = domElem.getAttribute('bgColor');
    if (bgColor) {
        topic.setBackgroundColor(bgColor);
    }

    var borderColor = domElem.getAttribute('brColor');
    if (borderColor) {
        topic.setBorderColor(borderColor);
    }

    var position = domElem.getAttribute('position');
    if (position) {
        var pos = position.split(',');
        topic.setPosition(pos[0], pos[1]);
    }

    //Creating icons and children nodes
    var children = domElem.childNodes;
    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];
        if (child.nodeType == 1)
        {
            core.assert(child.tagName == "topic" || child.tagName == "icon" || child.tagName == "link" || child.tagName == "note", 'Illegal node type:' + child.tagName);
            if (child.tagName == "topic") {
                var childTopic = this._deserializeNode(child, mindmap);
                childTopic.connectTo(topic);
            } else if(child.tagName == "icon") {
                var icon = this._deserializeIcon(child, topic);
                topic.addIcon(icon);
            } else if(child.tagName == "link") {
                var link = this._deserializeLink(child, topic);
                topic.addLink(link);
            } else if(child.tagName == "note") {
                var note = this._deserializeNote(child, topic);
                topic.addNote(note);
            }
        }
    }
    ;
    return topic;
};

mindplot.XMLMindmapSerializer.prototype._deserializeIcon = function(domElem, topic)
{
    return topic.createIcon(domElem.getAttribute("id"));
};

mindplot.XMLMindmapSerializer.prototype._deserializeLink = function(domElem, topic)
{
    return topic.createLink(domElem.getAttribute("url"));
};

mindplot.XMLMindmapSerializer.prototype._deserializeNote = function(domElem, topic)
{
    return topic.createNote(domElem.getAttribute("text"));
};

mindplot.XMLMindmapSerializer.MAP_ROOT_NODE = 'map';/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.PersistanceManager = function(editorService)
{
    this._editorService = editorService;
    this._serializer = new mindplot.XMLMindmapSerializer();
};

mindplot.PersistanceManager.prototype.save = function(mindmap, chartType, xmlChart, editorProperties, onSavedHandler,saveHistory)
{
    core.assert(mindmap, "mindmap can not be null");
    core.assert(chartType, "chartType can not be null");
    core.assert(xmlChart, "xmlChart can not be null");
    core.assert(editorProperties, "editorProperties can not be null");

    var mapId = mindmap.getId();

    var xmlMap = this._serializer.toXML(mindmap);
    var xmlMapStr = core.Utils.innerXML(xmlMap);

    var pref = Json.toString(editorProperties);
    this._editorService.saveMap(mapId, xmlMapStr, chartType, xmlChart, pref,saveHistory,
    {
        callback:function(response) {

            if (response.msgCode != "OK")
            {
                monitor.logError("Save could not be completed. Please,try again in a couple of minutes.");
                wLogger.error(response.msgDetails);
            } else
            {
                // Execute on success handler ...
                if (onSavedHandler)
                {
                    onSavedHandler();
                }
            }
        },
        errorHandler:function(message) {
            var monitor = core.Monitor.getInstance();
            monitor.logError("Save could not be completed. Please,try again in a couple of minutes.");
            wLogger.error(message);
        },
        verb:"POST",
        async: false
    });

};

mindplot.PersistanceManager.prototype.load = function(mapId)
{
    core.assert(mapId, "mapId can not be null");

    var deserializer = this;
    var result = {r:null};
    var serializer = this._serializer;
    this._editorService.loadMap(mapId, {
        callback:function(response) {

            if (response.msgCode == "OK")
            {
                // Explorer Hack with local files ...
                var xmlContent = response.content;
                var domDocument = core.Utils.createDocumentFromText(xmlContent);
                var mindmap = serializer.loadFromDom(domDocument);
                mindmap.setId(mapId);

                result.r = mindmap;
            } else
            {
                // Handle error message ...
                var msg = response.msgDetails;
                var monitor = core.Monitor.getInstance();
                monitor.logFatal("We're sorry, an error has occurred and we can't load your map. Please try again in a few minutes.");
                wLogger.error(msg);
            }
        },
        verb:"GET",
        async: false,
        errorHandler:function(msg) {
            var monitor = core.Monitor.getInstance();
            monitor.logFatal("We're sorry, an error has occurred and we can't load your map. Please try again in a few minutes.");
            wLogger.error(msg);
        }
    });

    return result.r;
};


/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.EditorProperties = function()
{
    this._zoom = 0;
    this._position = 0;
};

mindplot.EditorProperties.prototype.setZoom = function(zoom)
{
    this._zoom = zoom;
};

mindplot.EditorProperties.prototype.getZoom = function()
{
    return this._zoom;
};

mindplot.EditorProperties.prototype.asProperties = function()
{
    return "zoom=" + this._zoom + "\n";
};




/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.IconGroup = function(topic) {
    var offset = topic.getOffset();
    this.options = {
        width:0,
        height:0,
        x:offset / 2,
        y:offset / 2,
        icons:[],
        topic:topic,
        nativeElem:new web2d.Group({width: 2, height:2,x: offset / 2, y:offset / 2, coordSizeWidth:1,coordSizeHeight:1})
    };
    this.registerListeners();
};

mindplot.IconGroup.prototype.setPosition = function(x, y) {
    this.options.x = x;
    this.options.y = y;
    this.options.nativeElem.setPosition(x, y);
};

mindplot.IconGroup.prototype.getPosition = function() {
    return {x:this.options.x, y:this.options.y};
};

mindplot.IconGroup.prototype.setSize = function(width, height) {
    this.options.width = width;
    this.options.height = height;
    this.options.nativeElem.setSize(width, height);
    this.options.nativeElem.setCoordSize(width, height);
};

mindplot.IconGroup.prototype.getSize = function()
{
    return {width:this.options.width, height:this.options.height};
};

mindplot.IconGroup.prototype.addIcon = function(icon) {
    icon.setGroup(this);
    var newIcon = icon.getImage();
    var nativeElem = this.options.nativeElem;
    var iconSize = newIcon.getSize();
    var size = nativeElem.getSize();
    newIcon.setPosition(size.width, 0);
    this.options.icons.extend([icon]);

    nativeElem.appendChild(newIcon);

    size.width = size.width + iconSize.width;
    if (iconSize.height > size.height)
    {
        size.height = iconSize.height;
    }

    nativeElem.setCoordSize(size.width, size.height);
    nativeElem.setSize(size.width, size.height);
    this.options.width = size.width;
    this.options.height = size.height;
};
mindplot.IconGroup.prototype.getIcons = function() {
    return this.options.icons;
};
mindplot.IconGroup.prototype.removeIcon = function(url) {
    this._removeIcon(this.getIcon(url));
};

mindplot.IconGroup.prototype.removeImageIcon = function(icon) {

    var imgIcon = this.getImageIcon(icon);
    this._removeIcon(imgIcon);
};

mindplot.IconGroup.prototype.getIcon = function(url) {
    var result = null;
    this.options.icons.each(function(el, index) {
        var nativeImage = el.getImage();
        if (nativeImage.getHref() == url)
        {
            result = el;
        }
    }, this);
    return result;
};

mindplot.IconGroup.prototype.getImageIcon=function(icon){
    var result = null;
    this.options.icons.each(function(el,index){
        if(result == null && $chk(el.getModel().isIconModel) && el.getId()==icon.getId() && el.getUiId() == icon.getUiId())
        {
            result = el;
        }
    },this);
    return result;
};

mindplot.IconGroup.prototype.findIconFromModel=function(iconModel){
    var result = null;
    this.options.icons.each(function(el,index){
        var elModel = el.getModel();
        if(result == null && $chk(elModel.isIconModel) && elModel.getId()==iconModel.getId())
        {
            result = el;
        }
    },this);

    if(result==null)
    {
        throw "Icon can no be found.";
    }

    return result;
};


mindplot.IconGroup.prototype._removeIcon = function(icon) {
    var nativeImage = icon.getImage();
    this.options.icons.remove(icon);
    var iconSize = nativeImage.getSize();
    var size = this.options.nativeElem.getSize();
    var position = nativeImage.getPosition();
    var childs = this.options.nativeElem.removeChild(nativeImage);
    this.options.icons.each(function(icon,index){
        var img = icon.getImage();
        var pos = img.getPosition();
        if(pos.x > position.x){
            img.setPosition(pos.x-iconSize.width, 0);
        }
    }.bind(this));
    size.width = size.width - iconSize.width;
    this.setSize(size.width, size.height);
};
mindplot.IconGroup.prototype.getNativeElement = function() {
    return this.options.nativeElem;
};
mindplot.IconGroup.prototype.moveToFront = function() {
    this.options.nativeElem.moveToFront();
}
mindplot.IconGroup.prototype.registerListeners = function() {
    this.options.nativeElem.addEventListener('click', function(event) {
        // Avoid node creation ...
        if (event.stopPropagation)
        {
            event.stopPropagation(true);
        } else
        {
            event.cancelBubble = true;
        }

    });
    this.options.nativeElem.addEventListener('dblclick', function(event)
    {
        // Avoid node creation ...
        if (event.stopPropagation)
        {
            event.stopPropagation(true);
        } else
        {
            event.cancelBubble = true;
        }

    });
};
mindplot.IconGroup.prototype.getTopic = function() {
    return this.options.topic;
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.BubbleTip = function(divContainer){
    this.initialize(divContainer);
    };
mindplot.BubbleTip.prototype.initialize=function(divContainer){
    this.options={
        panel:null,
        container:null,
        divContainer:divContainer,
        content:null,
        onShowComplete:Class.empty,
        onHideComplete:Class.empty,
        width:null,
        height:null,
        form:null
    };
        if($chk(this.options.form))
            this.scanElements(this.options.form);
        this.buildBubble();
        this._isMouseOver=false;
        this._open=false;
    };
mindplot.BubbleTip.prototype.scanElements=function(form){
        $$($(form).getElements('a')).each(function(el) {
            if (el.href && el.hasClass('bubble') && !el.onclick) {
                el.addEvent('mouseover',this.click.bindWithEvent(this,el));
            }
        }, this);
    };
mindplot.BubbleTip.prototype.buildBubble=function(invert){
        var opts = this.options;

        var panel = new Element('div').addClass('bubbleContainer');
        if($chk(opts.height))
            panel.setStyle('height', opts.height);
        if($chk(opts.width))
            panel.setStyle('width', opts.width);

        var topClass="";
        var bottomClass="Hint";
        if($chk(invert)){
            var tmpClass = topClass;
            topClass=bottomClass;
            bottomClass=tmpClass;
        }

        //build top part of bubble
        this.topContainer = new Element('div').addClass('bublePartContainer');
        this.topLeft = new Element('div').addClass('bubblePart').addClass('bubble'+topClass+'TopLeftBlue');
        this.top = new Element('div').addClass('bubblePart').addClass('bubble'+topClass+'TopBlue');
        this.topHint =new Element('div').addClass('bubblePart').addClass('bubbleTop'+topClass+'Blue').setStyle('width',58);
        this.top2 = new Element('div').addClass('bubblePart').addClass('bubble'+topClass+'TopBlue');
        this.topRight = new Element('div').addClass('bubblePart').addClass('bubble'+topClass+'TopRightBlue');
        this.topLeft.inject(this.topContainer);
        this.top.inject(this.topContainer);
        this.topHint.inject(this.topContainer);
        this.top2.inject(this.topContainer);
        this.topRight.inject(this.topContainer);

        //build middle part of bubble
        this.middleContainer = new Element('div').addClass('bublePartContainer');
        this.left = new Element('div').addClass('bubblePart').addClass('bubbleLeftBlue');
        this.center = new Element('div').addClass('bubblePart').addClass('bubbleCenterBlue');
        this.right = new Element('div').addClass('bubblePart').addClass('bubbleRightBlue');
        this.left.inject(this.middleContainer);
        this.center.inject(this.middleContainer);
        this.right.inject(this.middleContainer);

        //build bottom part of bubble
        this.bottomContainer = new Element('div').addClass('bublePartContainer');
        this.bottomLeft = new Element('div').addClass('bubblePart').addClass('bubble'+bottomClass+'BottomLeftBlue');
        this.bottom = new Element('div').addClass('bubblePart').addClass('bubble'+bottomClass+'BottomBlue');
        this.bottomHint =new Element('div').addClass('bubblePart').addClass('bubbleBottom'+bottomClass+'Blue').setStyle('width',58);
        this.bottom2 = new Element('div').addClass('bubblePart').addClass('bubble'+bottomClass+'BottomBlue');
        this.bottomRight = new Element('div').addClass('bubblePart').addClass('bubble'+bottomClass+'BottomRightBlue');
        this.bottomLeft.inject(this.bottomContainer);
        this.bottom.inject(this.bottomContainer);
        this.bottomHint.inject(this.bottomContainer);
        this.bottom2.inject(this.bottomContainer);
        this.bottomRight.inject(this.bottomContainer);

        this.topContainer.inject(panel);
        this.middleContainer.inject(panel);
        this.bottomContainer.inject(panel);

        if(!$chk(opts.divContainer))
        {
            opts.divContainer=document.body;
        }
        panel.injectTop(opts.divContainer);
        opts.panel = $(panel);
        opts.panel.setStyle('opacity',0);
        opts.panel.addEvent('mouseover',function(){this._isMouseOver=true;}.bind(this));
        opts.panel.addEvent('mouseleave',function(event){this.close(event);}.bindWithEvent(this));//this.close.bindWithEvent(this)

    };
mindplot.BubbleTip.prototype.click= function(event, el) {
        return this.open(event, el);
    };
mindplot.BubbleTip.prototype.open= function(event, content, source){
        this._isMouseOver=true;
        this._evt = new Event(event);
        this.doOpen.delay(500, this,[content,source]);
    };
mindplot.BubbleTip.prototype.doOpen= function(content, source){
        if($chk(this._isMouseOver) &&!$chk(this._open) && !$chk(this._opening))
        {
            this._opening=true;
            var container = new Element('div');
            $(content).inject(container);
            this.options.content=content;
            this.options.container=container;
            $(this.options.container).inject(this.center);
            this.init(this._evt,source);
            $(this.options.panel).effect('opacity',{duration:500, onComplete:function(){this._open=true; this._opening = false;}.bind(this)}).start(0,100);
        }
    };
mindplot.BubbleTip.prototype.updatePosition=function(event){
        this._evt = new Event(event);
    };
mindplot.BubbleTip.prototype.close=function(event){
        this._isMouseOver=false;
        this.doClose.delay(50,this,new Event(event));
    };
mindplot.BubbleTip.prototype.doClose=function(event){

        if(!$chk(this._isMouseOver) && $chk(this._opening))
            this.doClose.delay(500,this,this._evt);
        
        if(!$chk(this._isMouseOver) && $chk(this._open))
        {
            this.forceClose();
        }
    };
mindplot.BubbleTip.prototype.forceClose=function(){
        this.options.panel.effect('opacity',{duration:100, onComplete:function(){
            this._open=false;
            $(this.options.panel).setStyles({left:0,top:0});
            $(this.top2).setStyle('width', 3);
            $(this.bottom2).setStyle('width', 3);
            $(this.top).setStyle('width', 3);
            $(this.bottom).setStyle('width', 3);
            $(this.left).setStyle('height', 4);
            $(this.right).setStyle('height', 4);
            $(this.options.container).remove();
        }.bind(this)}).start(100,0);
    };
mindplot.BubbleTip.prototype.init=function(event,source){
        var opts = this.options;
        var coordinates = $(opts.panel).getCoordinates();
        var panelHeight = coordinates.height; //not total height, but close enough

        var offset = designer.getWorkSpace().getScreenManager().getWorkspaceIconPosition(source);

        var containerCoords = $(opts.divContainer).getCoordinates();
        var screenWidth = containerCoords.width;
        var screenHeight = containerCoords.height;

        var invert = false;
        var picoFix=20;

        var centerWidth = $(this.center).getCoordinates().width;

        if(offset.y > panelHeight){ //hint goes on the bottom
            if(!$(this.topLeft).hasClass('bubbleTopLeftBlue')){
                $(this.options.panel).remove();
                this.buildBubble(false);
                $(this.options.container).inject(this.center);
            }
        }
        else{
            invert=true;
            picoFix=0;
            if($(this.topLeft).hasClass('bubbleTopLeftBlue')){
                $(this.options.panel).remove();
                this.buildBubble(invert);
                $(this.options.container).inject(this.center);
            }
            centerWidth = centerWidth-1;
        }

        offset.y = offset.y + picoFix;
        var width = centerWidth - $(this.topHint).getCoordinates().width;

        if((screenWidth -offset.x)>coordinates.width){
            width= width-$(this.top).getCoordinates().width;
            $(this.top2).setStyle('width', width);
            $(this.bottom2).setStyle('width', width);
        }
        else{
            width= width-$(this.top2).getCoordinates().width;
            $(this.top).setStyle('width', width);
            $(this.bottom).setStyle('width', width);
        }

        width = centerWidth + $(this.topLeft).getCoordinates().width;
        //width = width + $(this.top).getCoordinates().width;
        //width = width + $(this.topHint).getCoordinates().width;
        width = width + $(this.topRight).getCoordinates().width;

        var height = $(this.center).getCoordinates().height;
        $(this.left).setStyle('height', height);
        $(this.right).setStyle('height', height);

        height = height+ $(this.topLeft).getCoordinates().height;
        height = height+ $(this.bottomLeft).getCoordinates().height;
        $(opts.panel).setStyles({width:width,height:height});

        this.moveTopic(offset, $(opts.panel).getCoordinates().height, invert);
    };
mindplot.BubbleTip.prototype.moveTopic=function(offset, panelHeight, invert){
        var f = 1;
        if($chk(invert))
            f=0;
        var opts = this.options;
        var width = $(this.bottomLeft).getCoordinates().width+$(this.bottom).getCoordinates().width-(2*(f-1));
        $(opts.panel).setStyles({left:offset.x - width, top:offset.y - (panelHeight*f)});
    };

mindplot.BubbleTip.getInstance = function(divContainer)
{
    var result = mindplot.BubbleTip.instance;
    if(!result)
    {
        mindplot.BubbleTip.instance = new mindplot.BubbleTip(divContainer);
        result = mindplot.BubbleTip.instance;
    }
    return result;
};


/*
buildAnchorContent:function(el, title){
        var imgContainer= new Element('div');
        var img = new Element('img');
        img.src='http://open.thumbshots.org/image.pxf?url='+el.href;
        img.inject(imgContainer);

        var attribution = new Element('div');
        attribution.innerHTML="<a href='http://www.thumbshots.org' target='_blank' title='About Thumbshots thumbnails'>About Thumbshots thumbnails</a>";

        var element = new Element('div');
        imgContainer.inject(element);
        attribution.inject(element);
        return element;
    }*/
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.Tip = function(divContainer){
    this.initialize(divContainer);
    };
mindplot.Tip.prototype.initialize=function(divContainer){
    this.options={
        panel:null,
        container:null,
        divContainer:divContainer,
        content:null,
        onShowComplete:Class.empty,
        onHideComplete:Class.empty,
        width:null,
        height:null,
        form:null
    };
        this.buildTip();
        this._isMouseOver=false;
        this._open=false;
    };
mindplot.Tip.prototype.buildTip=function(){
        var opts = this.options;
        var panel = new Element('div').addClass('bubbleContainer');
        if($chk(opts.height))
            panel.setStyle('height', opts.height);
        if($chk(opts.width))
            panel.setStyle('width', opts.width);
        if(!$chk(opts.divContainer))
        {
            opts.divContainer=document.body;
        }
        panel.injectTop(opts.divContainer);
        opts.panel = $(panel);
        opts.panel.setStyle('opacity',0);
        opts.panel.addEvent('mouseover',function(){this._isMouseOver=true;}.bind(this));
        opts.panel.addEvent('mouseleave',function(event){this.close(event);}.bindWithEvent(this));//this.close.bindWithEvent(this)

    };
mindplot.Tip.prototype.click= function(event, el) {
        return this.open(event, el);
    };
mindplot.Tip.prototype.open= function(event, content, source){
        this._isMouseOver=true;
        this._evt = new Event(event);
        this.doOpen.delay(500, this,[content,source]);
    };
mindplot.Tip.prototype.doOpen= function(content, source){
    if($chk(this._isMouseOver) &&!$chk(this._open) && !$chk(this._opening))
        {
            this._opening=true;
            var container = new Element('div');
            $(content).inject(container);
            this.options.content=content;
            this.options.container=container;
            $(this.options.container).inject(this.options.panel);
            this.init(this._evt,source);
            $(this.options.panel).effect('opacity',{duration:500, onComplete:function(){this._open=true; this._opening = false;}.bind(this)}).start(0,100);
        }
    };
mindplot.Tip.prototype.updatePosition=function(event){
        this._evt = new Event(event);
    };
mindplot.Tip.prototype.close=function(event){
        this._isMouseOver=false;
        this.doClose.delay(50,this,new Event(event));
    };
mindplot.Tip.prototype.doClose=function(event){

        if(!$chk(this._isMouseOver) && $chk(this._opening))
            this.doClose.delay(500,this,this._evt);

        if(!$chk(this._isMouseOver) && $chk(this._open))
        {
            this.forceClose();
        }
    };
mindplot.Tip.prototype.forceClose=function(){
        this.options.panel.effect('opacity',{duration:100, onComplete:function(){
            this._open=false;
            $(this.options.panel).setStyles({left:0,top:0});
            $(this.options.container).remove();
        }.bind(this)}).start(100,0);
    };
mindplot.Tip.prototype.init=function(event,source){
        var opts = this.options;
        var coordinates = $(opts.panel).getCoordinates();
        var width = coordinates.width;   //not total width, but close enough
        var height = coordinates.height; //not total height, but close enough

        var offset = designer.getWorkSpace().getScreenManager().getWorkspaceIconPosition(source);

        var containerCoords = $(opts.divContainer).getCoordinates();
        var screenWidth = containerCoords.width;
        var screenHeight = containerCoords.height;

        $(this.options.panel).remove();
        this.buildTip();
        $(this.options.container).inject(this.options.panel);
        this.moveTopic(offset, $(opts.panel).getCoordinates().height);
    };

mindplot.Tip.prototype.moveTopic=function(offset, panelHeight){
        var opts = this.options;
        var width = $(opts.panel).getCoordinates().width;
        $(opts.panel).setStyles({left:offset.x - (width/2), top:offset.y - (panelHeight*2)});
    };

mindplot.Tip.getInstance = function(divContainer)
{
    var result = mindplot.Tip.instance;
    if(!result)
    {
        mindplot.Tip.instance = new mindplot.Tip(divContainer);
        result = mindplot.Tip.instance;
    }
    return result;
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.Icon = function(url){
    this._image = new web2d.Image();
    this._image.setHref(url);
    this._image.setSize(12,12);
};

mindplot.Icon.prototype.getImage= function(){
    return this._image;
};

mindplot.Icon.prototype.setGroup= function(group){
    this._group=group;
};

mindplot.Icon.prototype.getGroup= function() {
    return this._group;
};

mindplot.Icon.prototype.getSize=function(){
    return this._image.getSize();
};


/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.LinkIcon = function(urlModel, topic, designer) {
    var divContainer=designer.getWorkSpace().getScreenManager().getContainer();
    var bubbleTip = mindplot.BubbleTip.getInstance(divContainer);
    mindplot.Icon.call(this, mindplot.LinkIcon.IMAGE_URL);
    this._linkModel = urlModel;
    this._topic = topic;
    this._designer = designer;
    var image = this.getImage();
    var imgContainer = new Element('div').setStyles({textAlign:'center', cursor:'pointer'});
    this._img = new Element('img');
    var url = urlModel.getUrl();
    this._img.src = 'http://open.thumbshots.org/image.pxf?url=' + url;

    if (url.indexOf('http:') == -1)
    {
        url = 'http://' + url;
    }
    this._img.alt = url;
    this._url=url;
    var openWindow = function() {
        var wOpen;
        var sOptions;

        sOptions = 'status=yes,menubar=yes,scrollbars=yes,resizable=yes,toolbar=yes';
        sOptions = sOptions + ',width=' + (screen.availWidth - 10).toString();
        sOptions = sOptions + ',height=' + (screen.availHeight - 122).toString();
        sOptions = sOptions + ',screenX=0,screenY=0,left=0,top=0';
        var url = this._img.alt;
        wOpen = window.open(url, "link", "width=100px, height=100px");
        wOpen.focus();
        wOpen.moveTo(0, 0);
        wOpen.resizeTo(screen.availWidth, screen.availHeight);
    };
    this._img.addEvent('click', openWindow.bindWithEvent(this));
    this._img.inject(imgContainer);

    var attribution = new Element('div').setStyles({fontSize:10, textAlign:"center"});
    attribution.innerHTML = "<a href='http://www.thumbshots.org' target='_blank' title='About Thumbshots thumbnails' style='color:#08468F'>About Thumbshots thumbnails</a>";

    var container = new Element('div');
    var element = new Element('div').setStyles({borderBottom:'1px solid #e5e5e5'});

    var title = new Element('div').setStyles({fontSize:12, textAlign:'center'});
    this._link = new Element('span');
    this._link.href = url;
    this._link.innerHTML = url;
    this._link.setStyle("text-decoration", "underline");
    this._link.setStyle("cursor", "pointer");
    this._link.inject(title);
    this._link.addEvent('click', openWindow.bindWithEvent(this));
    title.inject(element);

    imgContainer.inject(element);
    attribution.inject(element);
    element.inject(container);
    
    if(!designer._viewMode){
        var buttonContainer = new Element('div').setStyles({paddingTop:5, textAlign:'center'});
        var editBtn = new Element('input', {type:'button', 'class':'btn-primary', value:'Edit','class':'btn-primary'}).addClass('button').inject(buttonContainer);
        var removeBtn = new Element('input', {type:'button', value:'Remove','class':'btn-primary'}).addClass('button').inject(buttonContainer);

        editBtn.setStyle("margin-right", "3px");
        removeBtn.setStyle("margin-left", "3px");

        removeBtn.addEvent('click', function(event) {
            var command = new mindplot.commands.RemoveLinkFromTopicCommand(this._topic.getId());
            designer._actionRunner.execute(command);
            bubbleTip.forceClose();
        }.bindWithEvent(this));

        var okButtonId = 'okLinkButtonId'
        editBtn.addEvent('click', function(event) {
            var topic = this._topic;
            var designer = this._designer;
            var link = this;
            var okFunction = function(e) {
                var result = false;
                var url = urlInput.value;
                if ("" != url.trim())
                {
                    link._img.src = 'http://open.thumbshots.org/image.pxf?url=' + url;
                    link._img.alt = url;
                    link._link.href = url;
                    link._link.innerHTML = url;
                    this._linkModel.setUrl(url);
                    result = true;
                }
                return result;
            };
            var msg = new Element('div');
            var urlText = new Element('div').inject(msg);
            urlText.innerHTML = "URL:"

            var formElem = new Element('form', {'action': 'none', 'id':'linkFormId'});
            var urlInput = new Element('input', {'type': 'text', 'size':30,'value':url});
            urlInput.inject(formElem);
            formElem.inject(msg)

            formElem.addEvent('submit', function(e)
            {
                $(okButtonId).fireEvent('click', e);
                e = new Event(e);
                e.stop();
            });


            var dialog = mindplot.LinkIcon.buildDialog(designer, okFunction, okButtonId);
            dialog.adopt(msg).show();

        }.bindWithEvent(this));
        buttonContainer.inject(container);
    }


    var linkIcon = this;
    image.addEventListener('mouseover', function(event) {
        bubbleTip.open(event, container, linkIcon);
    });
    image.addEventListener('mousemove', function(event) {
        bubbleTip.updatePosition(event);
    });
    image.addEventListener('mouseout', function(event) {
        bubbleTip.close(event);
    });
};

objects.extend(mindplot.LinkIcon, mindplot.Icon);

mindplot.LinkIcon.prototype.initialize = function() {

};

mindplot.LinkIcon.prototype.getUrl=function(){
    return this._url;
};

mindplot.LinkIcon.prototype.getModel=function(){
    return this._linkModel;
};

mindplot.LinkIcon.buildDialog = function(designer, okFunction, okButtonId) {
    var windoo = new Windoo({
        title: 'Write link URL',
        theme: Windoo.Themes.wise,
        modal:true,
        buttons:{'menu':false, 'close':false, 'minimize':false, 'roll':false, 'maximize':false},
        destroyOnClose:true,
        height:130
    });

    var cancel = new Element('input', {'type': 'button', 'class':'btn-primary', 'value': 'Cancel','class':'btn-primary'}).setStyle('margin-right', "5px");
    cancel.setStyle('margin-left', "5px");
    cancel.addEvent('click', function(event) {
        $(document).addEvent('keydown', designer.keyEventHandler.bindWithEvent(designer));
        windoo.close();
    }.bindWithEvent(this));

    var ok = new Element('input', {'type': 'button', 'class':'btn-primary','value': 'Ok','class':'btn-primary','id':okButtonId}).setStyle('marginRight', 10);
    ok.addEvent('click', function(event) {
        var couldBeUpdated = okFunction.attempt();
        if (couldBeUpdated)
        {
            $(document).addEvent('keydown', designer.keyEventHandler.bindWithEvent(designer));
            windoo.close();
        }
    }.bindWithEvent(this));

    var panel = new Element('div', {'styles': {'padding-top': 10, 'text-align': 'right'}}).adopt(ok, cancel);

    windoo.addPanel(panel);
    $(document).removeEvents('keydown');
    return windoo;
};

mindplot.LinkIcon.IMAGE_URL = "../images/world_link.png";

 /*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.Note = function(textModel, topic, designer) {
    var divContainer=designer.getWorkSpace().getScreenManager().getContainer();
    var bubbleTip = mindplot.BubbleTip.getInstance(divContainer);
    mindplot.Icon.call(this, mindplot.Note.IMAGE_URL);
    this._noteModel = textModel;
    this._topic = topic;
    this._designer = designer;
    var image = this.getImage();
    var imgContainer = new Element('div').setStyles({textAlign:'center'});
    this._textElem = new Element('div').setStyles({'max-height':100,'max-width':300, 'overflow':'auto'});
    var text = unescape(textModel.getText());
    text = text.replace(/\n/ig,"<br/>");
    text = text.replace(/<script/ig, "&lt;script");
    text = text.replace(/<\/script/ig, "&lt;\/script");
    this._textElem.innerHTML = text;
    this._text=textModel.getText();

    this._textElem.inject(imgContainer);

    var container = new Element('div');

    imgContainer.inject(container);

    if(!designer._viewMode){
        var buttonContainer = new Element('div').setStyles({paddingTop:5, textAlign:'center'});
        var editBtn = new Element('input', {type:'button', value:'Edit','class':'btn-primary'}).addClass('button').inject(buttonContainer);
        var removeBtn = new Element('input', {type:'button', value:'Remove','class':'btn-primary'}).addClass('button').inject(buttonContainer);

        editBtn.setStyle("margin-right", "3px");
        removeBtn.setStyle("margin-left", "3px");

        removeBtn.addEvent('click', function(event) {
            var command = new mindplot.commands.RemoveNoteFromTopicCommand(this._topic.getId());
            designer._actionRunner.execute(command);
            bubbleTip.forceClose();
        }.bindWithEvent(this));

        var okButtonId = 'okNoteButtonId';
        editBtn.addEvent('click', function(event) {
            var topic = this._topic;
            var designer = this._designer;
            var note = this;

            var msg = new Element('div');
            var textarea = new Element('div').inject(msg);
            textarea.innerHTML = "Text"

            var formElem = new Element('form', {'action': 'none', 'id':'noteFormId'});
            var text = textModel.getText();
            text = unescape(text);
            var textInput = new Element('textarea', {'value':text}).setStyles({'width':280, 'height':50});
            textInput.inject(formElem);
            formElem.inject(msg)

            var okFunction = function(e) {
                var result = true;
                var text = textInput.value;
                text = escape(text);
                note._noteModel.setText(text);
                return result;
            };

            formElem.addEvent('submit', function(e)
            {
                $(okButtonId).fireEvent('click', e);
                e = new Event(e);
                e.stop();
            });


            var dialog = mindplot.Note.buildDialog(designer, okFunction, okButtonId);
            dialog.adopt(msg).show();

        }.bindWithEvent(this));
        buttonContainer.inject(container);
    }


    var note = this;
    image.addEventListener('mouseover', function(event) {
        var text = textModel.getText();
        text = unescape(text);
        text = text.replace(/\n/ig,"<br/>");
        text = text.replace(/<script/ig, "&lt;script");
        text = text.replace(/<\/script/ig, "&lt;\/script");
        this._textElem.innerHTML = text;

        bubbleTip.open(event, container, note);
    }.bind(this));
    image.addEventListener('mousemove', function(event) {
        bubbleTip.updatePosition(event);
    });
    image.addEventListener('mouseout', function(event) {
        bubbleTip.close(event);
    });
};

objects.extend(mindplot.Note, mindplot.Icon);

mindplot.Note.prototype.initialize = function() {

};

mindplot.Note.prototype.getText=function(){
    return this._text;
};

mindplot.Note.prototype.getModel=function(){
    return this._noteModel;
};

mindplot.Note.buildDialog = function(designer, okFunction, okButtonId) {
    var windoo = new Windoo({
        title: 'Write note',
        theme: Windoo.Themes.wise,
        modal:true,
        buttons:{'menu':false, 'close':false, 'minimize':false, 'roll':false, 'maximize':false},
        destroyOnClose:true,
        height:130
    });

    var cancel = new Element('input', {'type': 'button', 'class':'btn-primary', 'value': 'Cancel','class':'btn-primary'}).setStyle('margin-right', "5px");
    cancel.setStyle('margin-left', "5px");
    cancel.addEvent('click', function(event) {
        $(document).addEvent('keydown', designer.keyEventHandler.bindWithEvent(designer));
        windoo.close();
    }.bindWithEvent(this));

    var ok = new Element('input', {'type': 'button', 'class':'btn-primary', 'value': 'Ok','class':'btn-primary','id':okButtonId}).setStyle('marginRight', 10);
    ok.addEvent('click', function(event) {
        var couldBeUpdated = okFunction.attempt();
        if (couldBeUpdated)
        {
            $(document).addEvent('keydown', designer.keyEventHandler.bindWithEvent(designer));
            windoo.close();
        }
    }.bindWithEvent(this));

    var panel = new Element('div', {'styles': {'padding-top': 10, 'text-align': 'right'}}).adopt(ok, cancel);

    windoo.addPanel(panel);
    $(document).removeEvents('keydown');
    return windoo;
};

mindplot.Note.IMAGE_URL = "../images/note.png";

/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.ImageIcon = function(iconModel, topic, designer) {

    core.assert(iconModel, 'iconModel can not be null');
    core.assert(topic, 'topic can not be null');
    core.assert(designer, 'designer can not be null');
    this._topic = topic;
    this._iconModel = iconModel;
    this._designer = designer;

    // Build graph image representation ...
    var iconType = iconModel.getIconType();
    var imgUrl = this._getImageUrl(iconType);
    mindplot.Icon.call(this, imgUrl);

    //Remove
    var divContainer = designer.getWorkSpace().getScreenManager().getContainer();
    var tip = mindplot.Tip.getInstance(divContainer);

    var container = new Element('div');
    var removeImage = new Element('img');
    removeImage.src = "../images/bin.png";
    removeImage.inject(container);

    if (!designer._viewMode)
    {

        removeImage.addEvent('click', function(event) {
            // @Todo: actionRunner should not be exposed ...
            var actionRunner = designer._actionRunner;
            var command = new mindplot.commands.RemoveIconFromTopicCommand(this._topic.getId(), iconModel);
            actionRunner.execute(command);
            tip.forceClose();
        }.bindWithEvent(this));

        //Icon
        var image = this.getImage();
        image.addEventListener('click', function(event) {
            var iconType = iconModel.getIconType();
            var newIconType = this._getNextFamilyIconId(iconType);
            iconModel.setIconType(newIconType);

            var imgUrl = this._getImageUrl(newIconType);
            this._image.setHref(imgUrl);

            //        // @Todo: Support revert of change icon ...
            //        var actionRunner = designer._actionRunner;
            //        var command = new mindplot.commands.ChangeIconFromTopicCommand(this._topic.getId());
            //        this._actionRunner.execute(command);


        }.bindWithEvent(this));

        var imageIcon = this;
        image.addEventListener('mouseover', function(event) {
            tip.open(event, container, imageIcon);
        });
        image.addEventListener('mouseout', function(event) {
            tip.close(event);
        });
        image.addEventListener('mousemove', function(event) {
            tip.updatePosition(event);
        });

    }
};

objects.extend(mindplot.ImageIcon, mindplot.Icon);

mindplot.ImageIcon.prototype.initialize = function() {

};

mindplot.ImageIcon.prototype._getImageUrl = function(id) {
    return mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[id];
};

mindplot.ImageIcon.prototype.getModel = function() {
    return this._iconModel;
};


mindplot.ImageIcon.prototype._getNextFamilyIconId = function(id) {

    var familyIcons = this._getFamilyIcons(id);
    core.assert(familyIcons != null, "Family Icon not found!");

    var result = null;
    for (var i = 0; i < familyIcons.length && result == null; i++)
    {
        if (familyIcons[i] == id) {
            var nextIconId;
            //Is last one?
            if (i == (familyIcons.length - 1)) {
                result = familyIcons[0];
            } else {
                result = familyIcons[i + 1];
            }
            break;
        }
    }

    return result;
};

mindplot.ImageIcon.prototype._getFamilyIcons = function(id) {
    core.assert(id != null, "id must not be null");
    core.assert(id.indexOf("_") != -1, "Invalid icon id (it must contain '_')");
    var result = null;
    for (var i = 0; i < mindplot.ImageIcon.prototype.ICON_FAMILIES.length; i++)
    {
        var family = mindplot.ImageIcon.prototype.ICON_FAMILIES[i];
        var familyPrefix = id.substr(0, id.indexOf("_"));
        if (family[0].match(familyPrefix) != null) {
            result = family;
            break;
        }
    }
    return result;
};

mindplot.ImageIcon.prototype.getId = function()
{
    return this._iconType;
};

mindplot.ImageIcon.prototype.getUiId = function()
{
    return this._uiId;
};

mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX = 'flag_';
mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX = 'bullet_';
mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX = 'tag_';
mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX = 'face_';
mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX = 'facefuny_';
mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX = 'arrow_';
mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX = 'arrowc_';

mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX = 'chart_';
mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX = 'onoff_';
mindplot.ImageIcon.ICON_FAMILIY_THUMB_PREFIX = 'thumb_';
mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX = 'money_';
mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX = 'number_';
mindplot.ImageIcon.ICON_FAMILIY_TICK_PREFIX = 'tick_';
mindplot.ImageIcon.ICON_FAMILIY_CONNECT_PREFIX = 'conn_';
mindplot.ImageIcon.ICON_FAMILIY_BULB_PREFIX = 'bulb_'
mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX = 'task_';

mindplot.ImageIcon.ICON_TYPE_ARROW_UP = mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX + 'up';
mindplot.ImageIcon.ICON_TYPE_ARROW_DOWN = mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX + 'down';
mindplot.ImageIcon.ICON_TYPE_ARROW_LEFT = mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX + 'left';
mindplot.ImageIcon.ICON_TYPE_ARROW_RIGHT = mindplot.ImageIcon.ICON_FAMILIY_ARROW_PREFIX + 'right';

mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_LEFT = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'turn_left';
mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_RIGHT = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'turn_right';
mindplot.ImageIcon.ICON_TYPE_ARROWC_UNDO = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'undo';
mindplot.ImageIcon.ICON_TYPE_ARROWC_ANTICLOCKWISE = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'rotate_anticlockwise';
mindplot.ImageIcon.ICON_TYPE_ARROWC_CLOCKWISE = mindplot.ImageIcon.ICON_FAMILIY_ARROWC_PREFIX + 'rotate_clockwise';

mindplot.ImageIcon.ICON_TYPE_FACE_PLAIN = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'plain';
mindplot.ImageIcon.ICON_TYPE_FACE_SAD = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'sad';
mindplot.ImageIcon.ICON_TYPE_FACE_SMILE_BIG = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'smilebig';
mindplot.ImageIcon.ICON_TYPE_FACE_SMILE = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'smile';
mindplot.ImageIcon.ICON_TYPE_FACE_SURPRISE = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'surprise';
mindplot.ImageIcon.ICON_TYPE_FACE_WINK = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'wink';
mindplot.ImageIcon.ICON_TYPE_FACE_CRYING = mindplot.ImageIcon.ICON_FAMILIY_FACE_PREFIX + 'crying';

mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_ANGEL = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'angel';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_DEVIL = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'devilish';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_GLASSES = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'glasses';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_GRIN = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'grin';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_KISS = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'kiss';
mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_MONKEY = mindplot.ImageIcon.ICON_FAMILIY_FACE_FUNY_PREFIX + 'monkey';

mindplot.ImageIcon.ICON_TYPE_CHART_BAR = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'bar';
mindplot.ImageIcon.ICON_TYPE_CHART_LINE = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'line';
mindplot.ImageIcon.ICON_TYPE_CHART_CURVE = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'curve';
mindplot.ImageIcon.ICON_TYPE_CHART_PIE = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'pie';
mindplot.ImageIcon.ICON_TYPE_CHART_ORGANISATION = mindplot.ImageIcon.ICON_FAMILIY_CHART_PREFIX + 'organisation';

mindplot.ImageIcon.ICON_TYPE_FLAG_BLUE = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'blue';
mindplot.ImageIcon.ICON_TYPE_FLAG_GREEN = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'green';
mindplot.ImageIcon.ICON_TYPE_FLAG_ORANGE = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'orange';
mindplot.ImageIcon.ICON_TYPE_FLAG_PINK = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'pink';
mindplot.ImageIcon.ICON_TYPE_FLAG_PURPLE = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'purple';
mindplot.ImageIcon.ICON_TYPE_FLAG_YELLOW = mindplot.ImageIcon.ICON_FAMILIY_FLAG_PREFIX + 'yellow';

mindplot.ImageIcon.ICON_TYPE_BULLET_BLACK = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'black';
mindplot.ImageIcon.ICON_TYPE_BULLET_BLUE = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'blue';
mindplot.ImageIcon.ICON_TYPE_BULLET_GREEN = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'green';
mindplot.ImageIcon.ICON_TYPE_BULLET_ORANGE = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'orange';
mindplot.ImageIcon.ICON_TYPE_BULLET_RED = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'red';
mindplot.ImageIcon.ICON_TYPE_BULLET_PINK = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'pink';
mindplot.ImageIcon.ICON_TYPE_BULLET_PURPLE = mindplot.ImageIcon.ICON_FAMILIY_BULLET_PREFIX + 'purple';

mindplot.ImageIcon.ICON_TYPE_TAG_BLUE = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'blue';
mindplot.ImageIcon.ICON_TYPE_TAG_GREEN = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'green';
mindplot.ImageIcon.ICON_TYPE_TAG_ORANGE = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'orange';
mindplot.ImageIcon.ICON_TYPE_TAG_RED = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'red';
mindplot.ImageIcon.ICON_TYPE_TAG_PINK = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'pink';
mindplot.ImageIcon.ICON_TYPE_TAG_YELLOW = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'yellow';
mindplot.ImageIcon.ICON_TYPE_TAG_PURPLE = mindplot.ImageIcon.ICON_FAMILIY_TAG_PREFIX + 'purple';

mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_UP = mindplot.ImageIcon.ICON_FAMILIY_THUMB_PREFIX + 'thumb_up';
mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_DOWN = mindplot.ImageIcon.ICON_FAMILIY_THUMB_PREFIX + 'thumb_down';

mindplot.ImageIcon.ICON_TYPE_TICK_ON = mindplot.ImageIcon.ICON_FAMILIY_TICK_PREFIX + 'tick';
mindplot.ImageIcon.ICON_TYPE_TICK_OFF = mindplot.ImageIcon.ICON_FAMILIY_TICK_PREFIX + 'cross';

mindplot.ImageIcon.ICON_TYPE_BULB_ON = mindplot.ImageIcon.ICON_FAMILIY_BULB_PREFIX + 'light_on';
mindplot.ImageIcon.ICON_TYPE_BULB_OFF = mindplot.ImageIcon.ICON_FAMILIY_BULB_PREFIX + 'light_off';

mindplot.ImageIcon.ICON_TYPE_CONNECT_ON = mindplot.ImageIcon.ICON_FAMILIY_CONNECT_PREFIX + 'connect';
mindplot.ImageIcon.ICON_TYPE_CONNECT_OFF = mindplot.ImageIcon.ICON_FAMILIY_CONNECT_PREFIX + 'disconnect';

mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK = mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX + 'clock';
mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK_RED = mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX + 'clock_red';
mindplot.ImageIcon.ICON_TYPE_ONOFF_ADD = mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX + 'add';
mindplot.ImageIcon.ICON_TYPE_ONOFF_DELETE = mindplot.ImageIcon.ICON_FAMILIY_ONOFF_PREFIX + 'delete';

mindplot.ImageIcon.ICON_TYPE_MONEY_MONEY = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'money';
mindplot.ImageIcon.ICON_TYPE_MONEY_DOLLAR = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'dollar';
mindplot.ImageIcon.ICON_TYPE_MONEY_EURO = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'euro';
mindplot.ImageIcon.ICON_TYPE_MONEY_POUND = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'pound';
mindplot.ImageIcon.ICON_TYPE_MONEY_YEN = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'yen';
mindplot.ImageIcon.ICON_TYPE_MONEY_COINS = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'coins';
mindplot.ImageIcon.ICON_TYPE_MONEY_RUBY = mindplot.ImageIcon.ICON_FAMILIY_MONEY_PREFIX + 'ruby';

mindplot.ImageIcon.ICON_TYPE_NUMBER_ONE = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'one';
mindplot.ImageIcon.ICON_TYPE_NUMBER_TWO = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'two';
mindplot.ImageIcon.ICON_TYPE_NUMBER_THREE = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'three';
mindplot.ImageIcon.ICON_TYPE_NUMBER_FOUR = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'four';
mindplot.ImageIcon.ICON_TYPE_NUMBER_FIVE = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'five';
mindplot.ImageIcon.ICON_TYPE_NUMBER_SIX = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'six';
mindplot.ImageIcon.ICON_TYPE_NUMBER_SEVEN = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'seven';
mindplot.ImageIcon.ICON_TYPE_NUMBER_EIGHT = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'eight';
mindplot.ImageIcon.ICON_TYPE_NUMBER_NINE = mindplot.ImageIcon.ICON_FAMILIY_NUMBER_PREFIX + 'nine';

mindplot.ImageIcon.ICON_TYPE_TASK_ONE = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'one';
mindplot.ImageIcon.ICON_TYPE_TASK_TWO = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'two';
mindplot.ImageIcon.ICON_TYPE_TASK_THREE = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'three';
mindplot.ImageIcon.ICON_TYPE_TASK_FOUR = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'four';
mindplot.ImageIcon.ICON_TYPE_TASK_FIVE = mindplot.ImageIcon.ICON_FAMILIY_TASK_PREFIX + 'five';


mindplot.ImageIcon.prototype.ICON_IMAGE_MAP = new Object();
//FLAG
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_BLUE] = "../images/flag_blue.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_GREEN] = "../images/flag_green.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_ORANGE] = "../images/flag_orange.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_PINK] = "../images/flag_pink.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_PURPLE] = "../images/flag_purple.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FLAG_YELLOW] = "../images/flag_yellow.png";
//BULLET
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_BLACK] = "../images/bullet_black.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_BLUE] = "../images/bullet_blue.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_GREEN] = "../images/bullet_blue.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_ORANGE] = "../images/bullet_green.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_RED] = "../images/bullet_orange.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_PINK] = "../images/bullet_pink.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULLET_PURPLE] = "../images/bullet_purple.png";
//TAGS
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_BLUE] = "../images/tag_blue.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_GREEN] = "../images/tag_green.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_ORANGE] = "../images/tag_orange.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_RED] = "../images/tag_red.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_PINK] = "../images/tag_pink.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_YELLOW] = "../images/tag_yellow.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TAG_PURPLE] = "../images/tag_purple.png";
//FACES
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_ANGEL] = "../images/face-angel.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_DEVIL] = "../images/face-devilish.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_GLASSES] = "../images/face-glasses.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_KISS] = "../images/face-kiss.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_MONKEY] = "../images/face-monkey.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_PLAIN] = "../images/face-plain.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_CRYING] = "../images/face-crying.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_SAD] = "../images/face-sad.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_SMILE] = "../images/face-smile.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_SURPRISE] = "../images/face-surprise.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_FACE_WINK] = "../images/face-wink.png";

//ARROWS
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROW_UP] = "../images/arrow_up.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROW_DOWN] = "../images/arrow_down.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROW_LEFT] = "../images/arrow_left.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROW_RIGHT] = "../images/arrow_right.png";

// ARROWS COMPLEX.
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_LEFT] = "../images/arrow_turn_left.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_RIGHT] = "../images/arrow_turn_right.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_UNDO] = "../images/arrow_undo.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_ANTICLOCKWISE] = "../images/arrow_rotate_anticlockwise.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ARROWC_CLOCKWISE] = "../images/arrow_rotate_clockwise.png";

//CHARTS
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_BAR] = "../images/chart_bar.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_LINE] = "../images/chart_line.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_CURVE] = "../images/chart_curve.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_PIE] = "../images/chart_pie.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CHART_ORGANISATION] = "../images/chart_organisation.png";

// THUMB
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_UP] = "../images/thumb_up.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_DOWN] = "../images/thumb_down.png";

// ON OFF
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TICK_ON] = "../images/tick.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_TICK_OFF] = "../images/cross.png";

mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULB_ON] = "../images/lightbulb.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_BULB_OFF] = "../images/lightbulb_off.png";

mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CONNECT_ON] = "../images/connect.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_CONNECT_OFF] = "../images/disconnect.png";

mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK] = "../images/clock.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK_RED] = "../images/clock_red.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_ADD] = "../images/add.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_ONOFF_DELETE] = "../images/delete.png";
//MONEY
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_MONEY] = "../images/money.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_DOLLAR] = "../images/money_dollar.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_EURO] = "../images/money_euro.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_POUND] = "../images/money_pound.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_YEN] = "../images/money_yen.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_COINS] = "../images/coins.png";
mindplot.ImageIcon.prototype.ICON_IMAGE_MAP[mindplot.ImageIcon.ICON_TYPE_MONEY_RUBY] = "../images/ruby.png";


//FAMILIES
mindplot.ImageIcon.prototype.ICON_FLAG_FAMILY = [mindplot.ImageIcon.ICON_TYPE_FLAG_BLUE, mindplot.ImageIcon.ICON_TYPE_FLAG_GREEN,mindplot.ImageIcon.ICON_TYPE_FLAG_ORANGE,mindplot.ImageIcon.ICON_TYPE_FLAG_PINK, mindplot.ImageIcon.ICON_TYPE_FLAG_PURPLE, mindplot.ImageIcon.ICON_TYPE_FLAG_YELLOW];
mindplot.ImageIcon.prototype.ICON_TAG_FAMILY = [mindplot.ImageIcon.ICON_TYPE_TAG_BLUE, mindplot.ImageIcon.ICON_TYPE_TAG_GREEN,mindplot.ImageIcon.ICON_TYPE_TAG_ORANGE,mindplot.ImageIcon.ICON_TYPE_TAG_PINK, mindplot.ImageIcon.ICON_TYPE_TAG_PURPLE, mindplot.ImageIcon.ICON_TYPE_TAG_YELLOW];
mindplot.ImageIcon.prototype.ICON_BULLET_FAMILY = [mindplot.ImageIcon.ICON_TYPE_BULLET_BLACK, mindplot.ImageIcon.ICON_TYPE_BULLET_BLUE, mindplot.ImageIcon.ICON_TYPE_BULLET_GREEN,mindplot.ImageIcon.ICON_TYPE_BULLET_ORANGE,mindplot.ImageIcon.ICON_TYPE_BULLET_RED, mindplot.ImageIcon.ICON_TYPE_BULLET_PINK, mindplot.ImageIcon.ICON_TYPE_BULLET_PURPLE];
mindplot.ImageIcon.prototype.ICON_FUNY_FACE_FAMILY = [mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_ANGEL, mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_DEVIL, mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_GLASSES, mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_KISS, mindplot.ImageIcon.ICON_TYPE_FACE_FUNY_MONKEY];
mindplot.ImageIcon.prototype.ICON_FACE_FAMILY = [mindplot.ImageIcon.ICON_TYPE_FACE_PLAIN, mindplot.ImageIcon.ICON_TYPE_FACE_SAD, mindplot.ImageIcon.ICON_TYPE_FACE_CRYING, mindplot.ImageIcon.ICON_TYPE_FACE_SMILE, mindplot.ImageIcon.ICON_TYPE_FACE_SURPRISE, mindplot.ImageIcon.ICON_TYPE_FACE_WINK];
mindplot.ImageIcon.prototype.ICON_ARROW_FAMILY = [mindplot.ImageIcon.ICON_TYPE_ARROW_UP, mindplot.ImageIcon.ICON_TYPE_ARROW_DOWN, mindplot.ImageIcon.ICON_TYPE_ARROW_LEFT, mindplot.ImageIcon.ICON_TYPE_ARROW_RIGHT];
mindplot.ImageIcon.prototype.ICON_COMPLEX_ARROW_FAMILY = [mindplot.ImageIcon.ICON_TYPE_ARROWC_UNDO, mindplot.ImageIcon.ICON_TYPE_ARROWC_ANTICLOCKWISE, mindplot.ImageIcon.ICON_TYPE_ARROWC_CLOCKWISE,mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_LEFT, mindplot.ImageIcon.ICON_TYPE_ARROWC_TURN_RIGHT];
mindplot.ImageIcon.prototype.ICON_CHART_FAMILY = [mindplot.ImageIcon.ICON_TYPE_CHART_BAR, mindplot.ImageIcon.ICON_TYPE_CHART_LINE, mindplot.ImageIcon.ICON_TYPE_CHART_CURVE, mindplot.ImageIcon.ICON_TYPE_CHART_PIE, mindplot.ImageIcon.ICON_TYPE_CHART_ORGANISATION];
mindplot.ImageIcon.prototype.ICON_TICK_FAMILY = [ mindplot.ImageIcon.ICON_TYPE_TICK_ON, mindplot.ImageIcon.ICON_TYPE_TICK_OFF];

mindplot.ImageIcon.prototype.ICON_CONNECT_FAMILY = [ mindplot.ImageIcon.ICON_TYPE_CONNECT_ON, mindplot.ImageIcon.ICON_TYPE_CONNECT_OFF];
mindplot.ImageIcon.prototype.ICON_BULB_FAMILY = [ mindplot.ImageIcon.ICON_TYPE_BULB_ON, mindplot.ImageIcon.ICON_TYPE_BULB_OFF];
mindplot.ImageIcon.prototype.ICON_ONOFF_FAMILY = [ mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK, mindplot.ImageIcon.ICON_TYPE_ONOFF_CLOCK_RED, mindplot.ImageIcon.ICON_TYPE_ONOFF_ADD, mindplot.ImageIcon.ICON_TYPE_ONOFF_DELETE];

mindplot.ImageIcon.prototype.ICON_THUMB_FAMILY = [mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_UP, mindplot.ImageIcon.ICON_TYPE_ONOFF_THUMB_DOWN];
mindplot.ImageIcon.prototype.ICON_MONEY_FAMILY = [mindplot.ImageIcon.ICON_TYPE_MONEY_MONEY,mindplot.ImageIcon.ICON_TYPE_MONEY_DOLLAR,mindplot.ImageIcon.ICON_TYPE_MONEY_EURO,mindplot.ImageIcon.ICON_TYPE_MONEY_POUND,mindplot.ImageIcon.ICON_TYPE_MONEY_YEN,mindplot.ImageIcon.ICON_TYPE_MONEY_COINS,mindplot.ImageIcon.ICON_TYPE_MONEY_RUBY];


mindplot.ImageIcon.prototype.ICON_FAMILIES = [mindplot.ImageIcon.prototype.ICON_FACE_FAMILY, mindplot.ImageIcon.prototype.ICON_FUNY_FACE_FAMILY,mindplot.ImageIcon.prototype.ICON_ARROW_FAMILY,mindplot.ImageIcon.prototype.ICON_COMPLEX_ARROW_FAMILY,  mindplot.ImageIcon.prototype.ICON_CONNECT_FAMILY,mindplot.ImageIcon.prototype.ICON_BULB_FAMILY,mindplot.ImageIcon.prototype.ICON_THUMB_FAMILY, mindplot.ImageIcon.prototype.ICON_TICK_FAMILY,mindplot.ImageIcon.prototype.ICON_ONOFF_FAMILY, mindplot.ImageIcon.prototype.ICON_MONEY_FAMILY, mindplot.ImageIcon.prototype.ICON_CHART_FAMILY, mindplot.ImageIcon.prototype.ICON_FLAG_FAMILY, mindplot.ImageIcon.prototype.ICON_BULLET_FAMILY, mindplot.ImageIcon.prototype.ICON_TAG_FAMILY];/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.IconModel = function(iconType, topic)
{
    core.assert(iconType, 'Icon id can not be null');
    core.assert(topic, 'topic can not be null');
    this._iconType = iconType;
    this._id = mindplot.IconModel._nextUUID();
    this._topic = topic;
};

mindplot.IconModel.prototype.getId = function()
{
    return this._id;
};

mindplot.IconModel.prototype.getIconType = function()
{
    return this._iconType;
};


mindplot.IconModel.prototype.setIconType = function(iconType)
{
    this._iconType = iconType;
};

mindplot.IconModel.prototype.getTopic = function()
{
    return this._topic;
};

mindplot.IconModel.prototype.isIconModel = function()
{
    return true;
};


/**
 * @todo: This method must be implemented.
 */
mindplot.IconModel._nextUUID = function()
{
    if (!this._uuid)
    {
        this._uuid = 0;
    }

    this._uuid = this._uuid + 1;
    return this._uuid;
};

/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.LinkModel = function(url, topic)
{
    core.assert(url, 'link url can not be null');
    core.assert(topic, 'mindmap can not be null');
    this._url = url;
    this._topic = topic;
};

mindplot.LinkModel.prototype.getUrl = function()
{
    return this._url;
};

mindplot.LinkModel.prototype.setUrl = function(url){
    this._url = url;
}

mindplot.LinkModel.prototype.getTopic = function()
{
    return this._topic;
};

mindplot.LinkModel.prototype.isLinkModel = function()
{
    return true;
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.NoteModel = function(text, topic)
{
    core.assert(text, 'note text can not be null');
    core.assert(topic, 'mindmap can not be null');
    this._text = text;
    this._topic = topic;
};

mindplot.NoteModel.prototype.getText = function()
{
    return this._text;
};

mindplot.NoteModel.prototype.setText = function(text)
{
    this._text=text;
};

mindplot.NoteModel.prototype.getTopic = function()
{
    return this._topic;
};

mindplot.NoteModel.prototype.isNoteModel = function()
{
    return true;
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.Command = new Class(
{
    initialize: function()
    {
        this._id = mindplot.Command._nextUUID();
    },
    execute: function(commandContext)
    {
        throw "execute must be implemented.";
    },
    undoExecute: function(commandContext)
    {
        throw "undo must be implemented.";
    },
    getId:function()
    {
        return this._id;
    }
});

mindplot.Command._nextUUID = function()
{
    if (!mindplot.Command._uuid)
    {
        mindplot.Command._uuid = 1;
    }

    mindplot.Command._uuid = mindplot.Command._uuid + 1;
    return mindplot.Command._uuid;
};/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.DesignerActionRunner = new Class({
    execute:function(command)
    {
        core.assert(command, "command can not be null");
        // Execute action ...
        command.execute(this._context);

        // Enqueue it ...
        this._undoManager.enqueue(command);

        // Fire event
        var event = this._undoManager._buildEvent();
        this._designer._fireEvent("change", event);
    },
    initialize: function(designer)
    {
        this._designer = designer;
        this._undoManager = new mindplot.DesignerUndoManager();
        this._context = new mindplot.CommandContext(this._designer);
    },
    undo: function()
    {
        this._undoManager.execUndo(this._context);

        // Fire event
        var event = this._undoManager._buildEvent();
        this._designer._fireEvent("change", event);
    },
    redo: function()
    {
        this._undoManager.execRedo(this._context);

        // Fire event
        var event = this._undoManager._buildEvent();
        this._designer._fireEvent("change", event);

    },
    markAsChangeBase: function()
    {
        return this._undoManager.markAsChangeBase();
    },
    hasBeenChanged: function()
    {
        return this._undoManager.hasBeenChanged();
    }
});

mindplot.CommandContext = new Class({
    initialize: function(designer)
    {
        this._designer = designer;
    },
    findTopics:function(topicsIds)
    {
        var designerTopics = this._designer._topics;
        if (!(topicsIds instanceof Array))
        {
            topicsIds = [topicsIds];
        }

        var result = designerTopics.filter(function(topic) {
            var found = false;
            if (topic != null)
            {
                var topicId = topic.getId();
                found = topicsIds.contains(topicId);
            }
            return found;

        });
        return result;
    },
    deleteTopic:function(topic)
    {
        this._designer._removeNode(topic);
    },
    createTopic:function(model)
    {
        core.assert(model, "model can not be null");
        var topic = this._designer._nodeModelToNodeGraph(model);

        // @todo: Is this required ?
        var designer = this._designer;
        designer.onNodeFocusEvent.attempt(topic, designer);

        return topic;
    },
    createModel:function()
    {
        var mindmap = this._designer.getMindmap();
        var model = mindmap.createNode(mindplot.NodeModel.MAIN_TOPIC_TYPE);
        return model;
    },
    connect:function(childTopic, parentTopic)
    {
        childTopic.connectTo(parentTopic, this._designer._workspace);
    } ,
    disconnect:function(topic)
    {
        topic.disconnect(this._designer._workspace);
    }
});

mindplot.DesignerActionRunner.setInstance = function(actionRunner)
{
    mindplot.DesignerActionRunner._instance = actionRunner;
};

mindplot.DesignerActionRunner.getInstance = function()
{
    return mindplot.DesignerActionRunner._instance;
};
/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.DesignerUndoManager = new Class({
    initialize: function()
    {
        this._undoQueue = [];
        this._redoQueue = [];
        this._baseId = 0;
    },
    enqueue:function(command)
    {
        core.assert(command, "Command can  not be null");
        var length = this._undoQueue.length;
        if (command.discartDuplicated && length > 0)
        {
            // Skip duplicated events ...
            var lastItem = this._undoQueue[length - 1];
            if (lastItem.discartDuplicated != command.discartDuplicated)
            {
                this._undoQueue.push(command);
            }
        } else
        {
            this._undoQueue.push(command);
        }
        this._redoQueue = [];
    },
    execUndo: function(commandContext)
    {
        if (this._undoQueue.length > 0)
        {
            var command = this._undoQueue.pop();
            this._redoQueue.push(command);

            command.undoExecute(commandContext);
        }
    },
    execRedo: function(commandContext)
    {
        if (this._redoQueue.length > 0)
        {
            var command = this._redoQueue.pop();
            this._undoQueue.push(command);
            command.execute(commandContext);
        }
    },
    _buildEvent: function()
    {
        return {undoSteps: this._undoQueue.length, redoSteps:this._redoQueue.length};
    },
    markAsChangeBase: function()
    {
        var undoLenght = this._undoQueue.length;
        if (undoLenght > 0)
        {
            var command = this._undoQueue[undoLenght - 1];
            this._baseId = command.getId();
        } else
        {
            this._baseId = 0;
        }
    },
    hasBeenChanged: function()
    {
        var result = true;
        var undoLenght = this._undoQueue.length;
        if (undoLenght == 0 && this._baseId == 0)
        {
            result = false;
        } else if(undoLenght>0)
        {
            var command = this._undoQueue[undoLenght - 1];
            result = (this._baseId != command.getId());
        }
        return result;
    }});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.GenericFunctionCommand = mindplot.Command.extend(
{
   initialize: function(commandFunc,value,topicsIds)
    {
        core.assert(commandFunc, "commandFunc must be defined");
        core.assert(topicsIds, "topicsIds must be defined");
        this._value = value;
        this._topicId = topicsIds;
        this._commandFunc = commandFunc;
        this._oldValues = [];
        this._id = mindplot.Command._nextUUID();
    },
    execute: function(commandContext)
    {
        if (!this.applied)
        {
            var topics = commandContext.findTopics(this._topicId);
            topics.forEach(function(topic)
            {
                var oldValue = this._commandFunc(topic, this._value);
                this._oldValues.push(oldValue);
            }.bind(this));
            this.applied = true;
        } else
        {
            throw "Command can not be applied two times in a row.";
        }

    },
    undoExecute: function(commandContext)
    {
       if (this.applied)
        {
            var topics = commandContext.findTopics(this._topicId);
            topics.forEach(function(topic,index)
            {
                this._commandFunc(topic, this._oldValues[index]);

            }.bind(this));

            this.applied = false;
            this._oldValues = [];
        } else
        {
            throw "undo can not be applied.";
        }
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.DeleteTopicCommand = mindplot.Command.extend(
{
    initialize: function(topicsIds)
    {
        core.assert(topicsIds, "topicsIds must be defined");
        this._topicId = topicsIds;
        this._deletedTopicModels = [];
        this._parentTopicIds = [];
        this._id = mindplot.Command._nextUUID();
    },
    execute: function(commandContext)
    {
        var topics = commandContext.findTopics(this._topicId);
        topics.forEach(
                function(topic, index)
                {
                    var model = topic.getModel().clone();
                    this._deletedTopicModels.push(model);

                    // Is connected?.
                    var outTopic = topic.getOutgoingConnectedTopic();
                    var outTopicId = null;
                    if (outTopic != null)
                    {
                        outTopicId = outTopic.getId();
                    }
                    this._parentTopicIds.push(outTopicId);

                    // Finally, delete the topic from the workspace...
                    commandContext.deleteTopic(topic);

                }.bind(this)
                )
    },
    undoExecute: function(commandContext)
    {

        var topics = commandContext.findTopics(this._topicId);
        var parent = commandContext.findTopics(this._parentTopicIds);

        this._deletedTopicModels.forEach(
                function(model, index)
                {
                    var topic = commandContext.createTopic(model);

                    // Was the topic connected?
                    var parentTopic = parent[index];
                    if (parentTopic != null)
                    {
                        commandContext.connect(topic, parentTopic);
                    }

                }.bind(this)
                )

        this._deletedTopicModels = [];
        this._parentTopicIds = [];
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.DragTopicCommand = mindplot.Command.extend(
{
    initialize: function(topicId)
    {
        core.assert(topicId, "topicId must be defined");
        this._topicId = topicId;
        this._parentTopic = null;
        this._position = null;
        this._order = null;
        this._id = mindplot.Command._nextUUID();
    },
    execute: function(commandContext)
    {

        var topic = commandContext.findTopics([this._topicId])[0];

        // Save old position ...
        var origParentTopic = topic.getOutgoingConnectedTopic();
        var origOrder = null;
        var origPosition = null;
        if (topic.getType() == mindplot.NodeModel.MAIN_TOPIC_TYPE && origParentTopic != null && origParentTopic.getType() == mindplot.NodeModel.MAIN_TOPIC_TYPE)
        {
            // In this case, topics are positioned using order ...
            origOrder = topic.getOrder();
        } else
        {
            origPosition = topic.getPosition().clone();
        }

        // Disconnect topic ..
        if (origParentTopic)
        {
            commandContext.disconnect(topic);
        }


        // Set topic position ...
        if (this._position != null)
        {
            // Set position ...
            topic.setPosition(this._position);

        } else if (this._order != null)
        {
            topic.setOrder(this._order);
        } else
        {
            core.assert("Illegal commnad state exception.");
        }
        this._order = origOrder;
        this._position = origPosition;

        // Finally, connect topic ...
        if (this._parentId)
        {
            var parentTopic = commandContext.findTopics([this._parentId])[0];
            commandContext.connect(topic, parentTopic);
        }

        // Backup old parent id ...
        this._parentId = null;
        if (origParentTopic)
        {
            this._parentId = origParentTopic.getId();
        }

    },
    undoExecute: function(commandContext)
    {
        this.execute(commandContext);

    },
    setPosition: function(point)
    {
        this._position = point;
    },
    setParetTopic: function(topic) {
        this._parentId = topic.getId();

    },
    setOrder: function(order)
    {
        this._order = order
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.AddTopicCommand = mindplot.Command.extend(
{
    initialize: function(model, parentTopicId)
    {
        core.assert(model, 'Model can not be null');
        this._model = model;
        this._parentId = parentTopicId;
        this._id = mindplot.Command._nextUUID();
    },
    execute: function(commandContext)
    {
        // Add a new topic ...
        var topic = commandContext.createTopic(this._model);

        // Connect to topic ...
        if (this._parentId)
        {
            var parentTopic = commandContext.findTopics(this._parentId)[0];
            commandContext.connect(topic, parentTopic);
        }

        // Finally, focus ...
        topic.setOnFocus(true);
    },
    undoExecute: function(commandContext)
    {
        // Finally, delete the topic from the workspace ...
        var topicId = this._model.getId();
        var topic = commandContext.findTopics(topicId)[0];
        commandContext.deleteTopic(topic);
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.AddLinkToTopicCommand = mindplot.Command.extend(
{
    initialize: function(topicId,url)
    {
        core.assert(topicId, 'topicId can not be null');
        this._topicId = topicId;
        this._url = url;
        this._id = mindplot.Command._nextUUID();
    },
    execute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            topic.addLink(this._url,commandContext._designer);
            topic.updateNode();
        }.bind(this);
        updated.delay(0);
    },
    undoExecute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            topic.removeLink();
        }.bind(this);
        updated.delay(0);
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.RemoveLinkFromTopicCommand = mindplot.Command.extend(
{
    initialize: function(topicId)
    {
        core.assert(topicId, 'topicId can not be null');
        this._topicId = topicId;
    },
    execute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        this._url = topic._link.getUrl();
        var updated = function() {
            topic.removeLink();
        }.bind(this);
        updated.delay(0);
    },
    undoExecute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            topic.addLink(this._url,commandContext._designer);
            topic.updateNode();
        }.bind(this);
        updated.delay(0);
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.AddIconToTopicCommand = mindplot.Command.extend(
{
    initialize: function(topicId, iconType)
    {
        core.assert(topicId, 'topicId can not be null');
        core.assert(iconType, 'iconType can not be null');
        this._topicId = topicId;
        this._iconType = iconType;
    },
    execute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            var iconImg = topic.addIcon(this._iconType, commandContext._designer);
            this._iconModel = iconImg.getModel();
            topic.updateNode();
        }.bind(this);
        updated.delay(0);
    },
    undoExecute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            topic.removeIcon(this._iconModel);
            topic.updateNode();
        }.bind(this);
        updated.delay(0);
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.RemoveIconFromTopicCommand = mindplot.Command.extend(
{
    initialize: function(topicId, iconModel)
    {
        core.assert(topicId, 'topicId can not be null');
        core.assert(iconModel, 'iconId can not be null');
        this._topicId = topicId;
        this._iconModel = iconModel;
    },
    execute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            topic.removeIcon(this._iconModel);
            topic.updateNode();
        }.bind(this);
        updated.delay(0);
    },
    undoExecute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            var iconType = this._iconModel.getIconType();
            var iconImg = topic.addIcon(iconType, commandContext._designer);
            this._iconModel = iconImg.getModel();
            topic.updateNode();
        }.bind(this);
        updated.delay(0);
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.AddNoteToTopicCommand = mindplot.Command.extend(
{
    initialize: function(topicId,text)
    {
        core.assert(topicId, 'topicId can not be null');
        this._topicId = topicId;
        this._text = text;
        this._id = mindplot.Command._nextUUID();
    },
    execute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            topic.addNote(this._text,commandContext._designer);
            topic.updateNode();
        }.bind(this);
        updated.delay(0);
    },
    undoExecute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            topic.removeNote();
        }.bind(this);
        updated.delay(0);
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

mindplot.commands.RemoveNoteFromTopicCommand = mindplot.Command.extend(
{
    initialize: function(topicId)
    {
        core.assert(topicId, 'topicId can not be null');
        this._topicId = topicId;
    },
    execute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        this._text = topic._note.getText();
        var updated = function() {
            topic.removeNote();
        }.bind(this);
        updated.delay(0);
    },
    undoExecute: function(commandContext)
    {
        var topic = commandContext.findTopics(this._topicId)[0];
        var updated = function() {
            topic.addNote(this._text,commandContext._designer);
            topic.updateNode();
        }.bind(this);
        updated.delay(0);
    }
});/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

if(afterMindpotLibraryLoading)
{
    afterMindpotLibraryLoading();
}
