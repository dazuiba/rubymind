# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
	include MindmapHelper
	def copy_text(text, options={})
		%[<object width="110" height="14" id="clippy" class="clippy" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">
      <param value="/images/clippy.swf" name="movie"/>
      <param value="always" name="allowScriptAccess"/>
      <param value="high" name="quality"/>
      <param value="noscale" name="scale"/>
      <param value="text=#{text}" name="FlashVars"/>
      <param value="opaque" name="wmode"/>
      <embed width="110" height="14" wmode="opaque" flashvars="text=#{text}" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" allowscriptaccess="always" quality="high" name="clippy" src="/images/clippy.swf"/>
      </object>]
	end
		
	def link_to_wangwang(user, options={})
		if user.is_a? User
			user = user.nickname
		end
		options.reverse_merge! :image=>true
		text = if options[:image]
			%[<img border='0' src='http://amos1.taobao.com/online.ww?v=2&uid=#{user}&site=cntaobao&s=1&charset=utf-8' alt=''/>]
		else
			user
		end		
		%[<a target='_blank' href='http://amos1.taobao.com/msg.ww?v=2&uid=#{user}&s=1&charset=utf-8'>#{text}</a>]
	end
	
	def tail_file(file, lines=50)
		file = File.expand_path(file)
		if File.exists?(file)
			`tail -n#{lines} #{file}`.chomp
		else
			"File not exists: #{file} "
		end
	end
	
	def sidebar_item(name, link)
		 current_url = request.request_uri
		 link = url_for(link)
		 
		 content_tag(:div, link_to(name, link), :class=>(link == current_url ? "current" : nil))
	end

  def nav_link(text, controller, action="index")
    link_to_unless_current text, :id => nil,
      :action => action,
      :controller => controller
  end
  
	
	def link_to_popup(name,options = {}, html_options = {})
    html_options.merge!(:rel=>"facebox")
		link_to name, options, html_options
	end
  
  
	def to_select(list)
		title_column ={Machine => "ip"}
		list.map{|e|[e[title_column[list.first.class]], e.id]}
	end
		
		
	def link_to_user(user)
		link_to_wangwang user.nickname||user.loginm, :image=>false
	end
		
	def all_product_line
		Base::ProductLine.all
	end
		
	def to_js_json(options,options_key=nil)
			'{'+options.map{|k,v| 
			"#{k.to_s.camelize(:lower)}: #{(options_key&&k==options_key) ? js_options(v) : ActiveSupport::JSON.encode(v)}"}.join(",")+'}'
	end
	##
	# usage: include_extjs_resources(:extjs, :desktop, :debug=>false) %>
	##
	def include_extjs_resources(*args)
		options = args.nil? ? {} : args.extract_options!
    args.map{|e|_include_extjs_resources(e, options)}.join("\n")	    
	end
	
	def _include_extjs_resources(_module, options)
		 extjs = %[<link rel="stylesheet" type="text/css" href="/stylesheets/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/application.css" /> 
    <script type="text/javascript"  src="/javascripts/lib/ext-base#{options[:debug] ? "-debug" : ""}.js"></script>
    <script type="text/javascript"  src="/javascripts/lib/ext-all#{options[:debug] ? "-debug" : ""}.js"></script>
    <script type="text/javascript" src="/javascripts/application.js"></script>]
    
    desktop = javascript_include_tag("lib/StartMenu", "lib/TaskBar" ,"lib/Desktop", "lib/App", "lib/Module",  "lib/perferences",  "modules")+
    					stylesheet_link_tag("desktop")
    
    auto = 	    %[<link rel="stylesheet" type="text/css" href="/javascripts/ux/css/Portal.css" />
	    <link rel="stylesheet" type="text/css" href="/javascripts/ux/css/GroupTab.css" />
	    <link rel="stylesheet" type="text/css" href="/javascripts/ux/css/ColumnNodeUI.css" />
	    <script type="text/javascript" src="/javascripts/ux/GroupTabPanel.js"></script>
	    <script type="text/javascript" src="/javascripts/ux/GroupTab.js"></script>
	    <script type="text/javascript" src="/javascripts/ux/ColumnNodeUI.js"></script>
	    <script type="text/javascript" src="/javascripts/ux/RemoteTreePanel.js"></script>
	    <script type="text/javascript" src="/javascripts/ux/TreeFilterX.js"></script>
      <script type="text/javascript" src="/javascripts/ux/RowEditor.js"></script>
      
	    <script type="text/javascript" src="/javascripts/ux/dynamic_grid_panel.js"></script>
      
	    <script type="text/javascript" src="/javascripts/auto/case_tree.js"></script>
	    <script type="text/javascript" src="/javascripts/auto/default_detail.js"></script>
	    <script type="text/javascript" src="/javascripts/auto/steps_detail.js"></script>
	    <script type="text/javascript" src="/javascripts/auto/script_panel.js"></script>
	    <script type="text/javascript" src="/javascripts/auto/case_grid_panel.js"></script>
      <script type="text/javascript" src="/javascripts/auto/log_detail.js"></script>
      <script type="text/javascript" src="/javascripts/auto/history_record.js"></script>
      <script type="text/javascript" src="/javascripts/auto/overrideHtmlEditor.js"></script>
      <script type="text/javascript" src="/javascripts/auto/proj_select_window.js"></script>
	    <script type="text/javascript" src="/javascripts/auto/auto.js"></script>	    ]
    pref = javascript_include_tag("perf/perf") 
    bank = javascript_include_tag("bank/bank")
    tdbank = %[<script type="text/javascript" src="/javascripts/tdbank/tdbank.js"></script>]
    mmap = stylesheet_link_tag("/javascripts/map/toolbar.css")+\
    			javascript_include_tag("map/YMap.js","map/YTree.js", "map/YView.js", "map/mmtree.js", "map/map.js")
	  result = if _module== :auto
	  	auto
	  elsif _module == :pref
	  	pref
  	elsif _module == :bank
  		bank
  	elsif _module== :desktop
	  	desktop
	  elsif _module == :extjs
	  	extjs
	  elsif _module == :mmap
	  	mmap
	  elsif _module == :tdbank
	  	tdbank
  	end
  	
  	" <!--#{_module} start --> \n#{result}\n <!--#{_module} end -->"
	end
	
	def downloadable?(job)
		false
	end
	
  def get_browser(bt)
    rs=false
    ua=request.env['HTTP_USER_AGENT'].downcase
    isOpera = ua.index('opera') ? true : false
    isSafari = (ua =~ /webkit|khtml/) ? true : false
    isSafari3 = (ua.index('webkit/5')) ? true : false
    isGecko = (!isSafari and ua.index('gecko')) ? true : false
    isGecko3 = (!isSafari and ua.index('rv:1.9')) ? true : false
    isIE = (!isOpera and ua.index('msie')) ? true : false
    isIE7 = (!isOpera and ua.index('msie 7')) ? true : false
    case bt
    when 0  #isKonqueror
      if ua.index('konqueror') then rs=true end
    when 1  #isOpera
      rs=isOpera
    when 2  #isSafari
      rs=isSafari
    when 3  #isSafari2
      rs=isSafari && !isSafari3
    when 4  #isSafari3
      rs=isSafari3
    when 5  #isIE
      rs=isIE
    when 6  #isIE6
      rs=isIE && !isIE7
    when 7  #isIE7
      rs=isIE7
    when 8  #isGecko
      rs=isGecko
    when 9  #isGecko2
      rs=isGecko && !isGecko3
    when 10 #isGecko3
      rs=isGecko3
    when 11 #isWindows
      if ua.index('windows') or ua.index('win32') then rs=true end
    when 12 #isMac
      if ua.index('macintosh') or ua.index('mac os x') then rs=true
      end
    when 13 #isAir
      if ua.index('adobeair') then rs=true end
    when 14 #isLinux
      if ua.index('linux') then rs=true end
    when 15 #isSecure
      s = request.env['SERVER_PROTOCOL'].downcase
      if s.index('https') then rs=true end
    end
    rs
  end

  def is_ie?
    get_browser(5) rescue false;
  end
end
