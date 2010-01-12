module MindmapHelper
	P_TABS = [
		[:all, "浏览所有"],
		[:my,  "我的知识沉淀", "/map/mindmaps/my"]
	]
	TABS = [
		[:all_mmap, "浏览所有", "/map/mindmaps"],
		[:all_kn  , "思维导图", "/map/knowledge"],
		[:my_mmap , "mm图","/map/mindmaps/my"],
		[:my_kn   , "知识沉淀","/map/knowledge/my"]
	]
	def html_top_menu
		child_tabs = TABS.select{|e|e.first.to_s.start_with? current_parent_menu.to_s}
		%[<div class="tab">
			<ul class="parent">
				#{html_tabs P_TABS}
			</ul>
			<ul class="child">
				#{html_tabs(child_tabs, :crt_text=>true)}
			</ul>
		</div>]
	end
	
	def html_tabs(tabs, options={})
		tabs.map{|key,text,link|
			%[<li #{current_menu?(key) ? "class='current'" : "" } > #{options[:crt_text]&&current_menu?(key) ? text : link_to(text,link, :name=>key)} </li>]
	 	}*""
	end
	
	def current_menu=(key)
		@current_menu = key
	end
	
	def current_parent_menu
		parent_menu_of current_menu
	end
	
	def current_menu
		@current_menu||=TABS.first.first
	end
	
	def current_menu?(key)
		current_menu.to_s.start_with? key.to_s
	end
	
	def parent_menu_of(key)
		key.to_s.split("_").first.to_sym
	end
	
end