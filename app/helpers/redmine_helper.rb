module RedmineHelper
	
	def calendar_date_select_tag(name,value, options)
		text_field_tag(name, value)+calendar_for(sanitize_to_id name)
	end
	
	def calendar_for(field_id)
    include_calendar_headers_tags
    image_tag("calendar.png", {:id => "#{field_id}_trigger",:class => "calendar-trigger"}) +
    javascript_tag("Calendar.setup({inputField : '#{field_id}', ifFormat : '%Y-%m-%d', button : '#{field_id}_trigger' });")
  end	
  
  def include_calendar_headers_tags
    unless @calendar_headers_tags_included
      @calendar_headers_tags_included = true
      content_for :header_tags do
        javascript_include_tag('calendar/calendar') +
        javascript_include_tag("calendar/lang/calendar-#{current_language}.js") +
        javascript_include_tag('calendar/calendar-setup') +
        stylesheet_link_tag('calendar')
      end
    end
  end
	
	def modify_tabs!(tabs)
		tabs.each{|tab|
			if(keys=tab.keys).size==1
				key = keys.first
				tab[:name], tab[:label] = key, tab.delete(key)
			end
		}
	end
	
	def tabs_header(tabs, options={})
		modify_tabs!(tabs)
		container = if options[:container]
			"'#{options[:container]}'"
		else
			'null'
		end
		links =	tabs.map do|tab|
		
			"<li>" + link_to(l(tab[:label]), "#" ,:id => "tab-#{tab[:name]}",
			                                    :class => (tab[:name].to_s != selected_tab(tabs) ? nil : 'selected'),
			                                    :onclick => "showTab('#{tab[:name]}',#{container} ); this.blur(); return false;" ) + "</li>"
		end
		
		%[<div class="tabs">
			<ul>
			    #{links.join("\n")}
			</ul>
		</div>]
	end
	
	def tab_content(tab, tabs, options={}, &block)		 
	  options[:content] ||= capture(&block)	  		
	  
	  modify_tabs!(tabs)
  	tab = if tab.is_a?(Symbol)
		  tabs.find{|e|e[:name]==tab}		
		elsif tab.is_a? Integer			
			tabs[tab]
		else
			assert false, "cannot reach here!"
		end
		
  	result = content_tag(:div, options[:content] , 
  										{:id => "tab-content-#{tab[:name]}", :style => (tab[:name].to_s != selected_tab(tabs) ? 'display:none' : nil), 
  										:class => 'tab-content' }, block)
  	if block_given?
  		concat(result, block.binding)
  	else
  		result
  	end	
	end
	
	def selected_tab(tabs)
		r=params[:tab] ? params[:tab].to_s : tabs.first[:name].to_s 
	end
	
	def add_params(hash)
		params.except(:controller, :action).merge(hash)
	end
	
	def table(collection, headers, options = {}, &proc)
		headers = headers.split(" ") if headers.is_a? String
	  options.reverse_merge!({
	    :class        => "table"
	  })
		if collection.blank?
			concat("<p class='nodata'>#{options[:no_data]||l(:label_no_data)}</p>", proc.binding)
			return 
		end
	 	  
	 	output = %[<table #{options[:tag_option]} style="text-align:left" class="list #{options[:class]}">		
			<thead><tr>		
			#{headers.collect { |h| "\n\t" + content_tag('th', h) }.join("\n")}		
			</tr></thead>
			<tbody>]
		concat(output, proc.binding)

	 	collection.each do |row|
	 		  raise row.inspect if row.is_a? Array
	      proc.call(row, cycle('odd', 'even'))
	  end
	    
    concat("</tbody>\n</table>\n", proc.binding)
	end

	
  def current_role
    @current_role ||= User.current.role_for_project(@project)
  end

  # Return true if user is authorized for controller/action, otherwise false
  def authorize_for(controller, action)
    User.current.allowed_to?({:controller => controller, :action => action}, @project)
  end

  # Display a link if user is authorized
  def link_to_if_authorized(name, options = {}, html_options = nil, *parameters_for_method_reference)
    link_to(name, options, html_options, *parameters_for_method_reference) if authorize_for(options[:controller] || params[:controller], options[:action])
  end
  
   def button_to_if_authorized(name, options = {}, html_options = nil, *parameters_for_method_reference)
    button_to(name, options, html_options, *parameters_for_method_reference) if authorize_for(options[:controller] || params[:controller], options[:action])
  end
  

  # Display a link to remote if user is authorized
  def link_to_remote_if_authorized(name, options = {}, html_options = nil)
    url = options[:url] || {}
    link_to_remote(name, options, html_options) if authorize_for(url[:controller] || params[:controller], url[:action])
  end

  # Display a link to user's account page
  def link_to_user(user, options={})
    (user) ? link_to(user.name, :controller => 'account', :action => 'show', :id => user) : 'Anonymous'
  end

  def link_to_issue(issue, options={})
    options[:class] ||= ''
    options[:class] << ' issue'
    options[:class] << ' closed' if issue.closed?
    link_to "#{issue.tracker.name} ##{issue.id}", {:controller => "issues", :action => "show", :id => issue}, options
  end

  # Generates a link to an attachment.
  # Options:
  # * :text - Link text (default to attachment filename)
  # * :download - Force download (default: false)
  def link_to_attachment(attachment, options={})
    text = options.delete(:text) || attachment.filename
    action = options.delete(:download) ? 'download' : 'show'

    link_to(h(text), {:controller => 'attachments', :action => action, :id => attachment, :filename => attachment.filename }, options)
  end

  def toggle_link(name, id, options={})
    onclick = "Element.toggle('#{id}'); "
    onclick << (options[:focus] ? "Form.Element.focus('#{options[:focus]}'); " : "this.blur(); ")
    onclick << "return false;"
    link_to(name, "#", :onclick => onclick)
  end

  def image_to_function(name, function, html_options = {})
    html_options.symbolize_keys!
    tag(:input, html_options.merge({
        :type => "image", :src => image_path(name),
        :onclick => (html_options[:onclick] ? "#{html_options[:onclick]}; " : "") + "#{function};"
        }))
  end

  def prompt_to_remote(name, text, param, url, html_options = {})
    html_options[:onclick] = "promptToRemote('#{text}', '#{param}', '#{url_for(url)}'); return false;"
    link_to name, {}, html_options
  end

  def format_date(date)
  	return time_ago_in_words(date)+"前" if true
    return nil unless date
    # "Setting.date_format.size < 2" is a temporary fix (content of date_format setting changed)
    @date_format ||= (Setting.date_format.blank? || Setting.date_format.size < 2 ? l(:general_fmt_date) : Setting.date_format)
    date.strftime(@date_format)
  end

  def format_time(time, include_date = true, options={})
    return nil unless time 
    if options[:format] == :ago
  		time_ago_in_words(time)+"前"
  	else
  		time.to_s(options[:format]||:db)
		end    
  end
  
  def format_activity_title(text)
    h(truncate_single_line(text, 100))
  end
  
  def format_activity_day(date)
    date == Date.today ? l(:label_today).titleize : format_date(date)
  end
  
  def format_activity_description(text)
    h(truncate(text.to_s, 250).gsub(%r{<(pre|code)>.*$}m, '...'))
  end

  def distance_of_date_in_words(from_date, to_date = 0)
    from_date = from_date.to_date if from_date.respond_to?(:to_date)
    to_date = to_date.to_date if to_date.respond_to?(:to_date)
    distance_in_days = (to_date - from_date).abs
    lwr(:actionview_datehelper_time_in_words_day, distance_in_days)
  end

  def due_date_distance_in_words(date)
    if date
      l((date < Date.today ? :label_roadmap_overdue : :label_roadmap_due_in), distance_of_date_in_words(Date.today, date))
    end
  end

  def render_page_hierarchy(pages, node=nil)
    content = ''
    if pages[node]
      content << "<ul class=\"pages-hierarchy\">\n"
      pages[node].each do |page|
        content << "<li>"
        content << link_to(h(page.pretty_title), {:controller => 'wiki', :action => 'index', :id => page.project, :page => page.title},
                           :title => (page.respond_to?(:updated_on) ? l(:label_updated_time, distance_of_time_in_words(Time.now, page.updated_on)) : nil))
        content << "\n" + render_page_hierarchy(pages, page.id) if pages[page.id]
        content << "</li>\n"
      end
      content << "</ul>\n"
    end
    content
  end
  
  # Renders flash messages
  def render_flash_messages
    s = ''
    flash.each do |k,v|
      s << content_tag('div', v, :class => "flash #{k}")
    end
    s
  end

  # Truncates and returns the string as a single line
  def truncate_single_line(string, *args)
    truncate(string, *args).gsub(%r{[\r\n]+}m, ' ')
  end

  def html_hours(text)
    text.gsub(%r{(\d+)\.(\d+)}, '<span class="hours hours-int">\1</span><span class="hours hours-dec">.\2</span>')
  end

  def authoring(created, author, options={})
    time_tag = @project.nil? ? content_tag('acronym', distance_of_time_in_words(Time.now, created), :title => format_time(created)) :
                               link_to(distance_of_time_in_words(Time.now, created), 
                                       {:controller => 'projects', :action => 'activity', :id => @project, :from => created.to_date},
                                       :title => format_time(created))
    author_tag = (author.is_a?(User) && !author.anonymous?) ? link_to(h(author), :controller => 'account', :action => 'show', :id => author) : h(author || 'Anonymous')
    l(options[:label] || :label_added_time_by, author_tag, time_tag)
  end

  def l_or_humanize(s, options={})
    k = "#{options[:prefix]}#{s}".to_sym
    l_has_string?(k) ? l(k) : s.to_s.humanize
  end

  def day_name(day)
    l(:general_day_names).split(',')[day-1]
  end

  def month_name(month)
    l(:actionview_datehelper_select_month_names).split(',')[month-1]
  end

  def syntax_highlight(name, content)
    type = CodeRay::FileType[name]
    type ? CodeRay.scan(content, type).html : h(content)
  end

  def to_path_param(path)
    path.to_s.split(%r{[/\\]}).select {|p| !p.blank?}
  end

  def per_page_links(selected=nil)
    url_param = params.dup
    url_param.clear if url_param.has_key?(:set_filter)

    links = Setting.per_page_options_array.collect do |n|
      n == selected ? n : link_to_remote(n, {:update => "content", :url => params.dup.merge(:per_page => n)},
                                            {:href => url_for(url_param.merge(:per_page => n))})
    end
    links.size > 1 ? l(:label_display_per_page, links.join(', ')) : nil
  end

  def breadcrumb(*args)
    elements = args.flatten
    elements.any? ? content_tag('p', args.join(' &#187; ') + ' &#187; ', :class => 'breadcrumb') : nil
  end

  def html_title(*args)
    if args.empty?
      title = []
      title << @project.name if @project
      title += @html_title if @html_title
      title << Setting.app_title
      title.compact.join(' - ')
    else
      @html_title ||= []
      @html_title += args
    end
  end

  def accesskey(s)
    s
  end

  # Same as Rails' simple_format helper without using paragraphs
  def simple_format_without_paragraph(text)
    text.to_s.
      gsub(/\r\n?/, "\n").                    # \r\n and \r -> \n
      gsub(/\n\n+/, "<br /><br />").          # 2+ newline  -> 2 br
      gsub(/([^\n]\n)(?=[^\n])/, '\1<br />')  # 1 newline   -> br
  end

  def error_messages_for(object_name, options = {})
    options = options.symbolize_keys
    object = instance_variable_get("@#{object_name}")
    if object && !object.errors.empty?
      # build full_messages here with controller current language
      full_messages = []
      object.errors.each do |attr, msg|
        next if msg.nil?
        msg = [msg] unless msg.is_a?(Array)
        if attr == "base"
          full_messages << l(*msg)
        else
          full_messages << "&#171; " + (l_has_string?("field_" + attr) ? l("field_" + attr) : object.class.human_attribute_name(attr)) + " &#187; " + l(*msg) unless attr == "custom_values"
        end
      end
      # retrieve custom values error messages
      if object.errors[:custom_values]
        object.custom_values.each do |v|
          v.errors.each do |attr, msg|
            next if msg.nil?
            msg = [msg] unless msg.is_a?(Array)
            full_messages << "&#171; " + v.custom_field.name + " &#187; " + l(*msg)
          end
        end
      end
      content_tag("div",
        content_tag(
          options[:header_tag] || "span", lwr(:gui_validation_error, full_messages.length) + ":"
        ) +
        content_tag("ul", full_messages.collect { |msg| content_tag("li", msg) }),
        "id" => options[:id] || "errorExplanation", "class" => options[:class] || "errorExplanation"
      )
    else
      ""
    end
  end

  def lang_options_for_select(blank=true)
    (blank ? [["(auto)", ""]] : []) +
      GLoc.valid_languages.collect{|lang| [ ll(lang.to_s, :general_lang_name), lang.to_s]}.sort{|x,y| x.last <=> y.last }
  end

  def label_tag_for(name, option_tags = nil, options = {})
    label_text = l(("field_"+field.to_s.gsub(/\_id$/, "")).to_sym) + (options.delete(:required) ? @template.content_tag("span", " *", :class => "required"): "")
    content_tag("label", label_text)
  end

  def labelled_tabular_form_for(record_or_name_or_array, *args, &proc)
  	options = args.extract_options!
    options[:html] ||= {}
    options[:html][:class] = 'tabular' unless options[:html].has_key?(:class)
    form_for(record_or_name_or_array, *(args << options.merge(:builder => TabularFormBuilder)), &proc)
  end

  def back_url_hidden_field_tag
    back_url = params[:back_url] || request.env['HTTP_REFERER']
    back_url = CGI.unescape(back_url.to_s)
    hidden_field_tag('back_url', CGI.escape(back_url)) unless back_url.blank?
  end

  def check_all_links(form_name)
    link_to_function(l(:button_check_all), "checkAll('#{form_name}', true)") +
    " | " +
    link_to_function(l(:button_uncheck_all), "checkAll('#{form_name}', false)")
  end

  def progress_bar(pcts, options={})
    pcts = [pcts, pcts] unless pcts.is_a?(Array)
    pcts[1] = pcts[1] - pcts[0]
    pcts << (100 - pcts[1] - pcts[0])
    width = options[:width] || '100px;'
    legend = options[:legend] || ''
    content_tag('table',
      content_tag('tr',
        (pcts[0] > 0 ? content_tag('td', '', :style => "width: #{pcts[0].floor}%;", :class => 'closed') : '') +
        (pcts[1] > 0 ? content_tag('td', '', :style => "width: #{pcts[1].floor}%;", :class => 'done') : '') +
        (pcts[2] > 0 ? content_tag('td', '', :style => "width: #{pcts[2].floor}%;", :class => 'todo') : '')
      ), :class => 'progress', :style => "width: #{width};") +
      content_tag('p', legend, :class => 'pourcent')
  end

  def context_menu_link(name, url, options={})
    options[:class] ||= ''
    if options.delete(:selected)
      options[:class] << ' icon-checked disabled'
      options[:disabled] = true
    end
    if options.delete(:disabled)
      options.delete(:method)
      options.delete(:confirm)
      options.delete(:onclick)
      options[:class] << ' disabled'
      url = '#'
    end
    link_to name, url, options
  end

  def content_for(name, content = nil, &block)
    @has_content ||= {}
    @has_content[name] = true
    super(name, content, &block)
  end

  def has_content?(name)
    (@has_content && @has_content[name]) || false
  end

  # Returns the avatar image tag for the given +user+ if avatars are enabled
  # +user+ can be a User or a string that will be scanned for an email address (eg. 'joe <joe@foo.bar>')
  def avatar(user, options = { })
    if Setting.gravatar_enabled?
      email = nil
      if user.respond_to?(:mail)
        email = user.mail
      elsif user.to_s =~ %r{<(.+?)>}
        email = $1
      end
      return gravatar(email.to_s.downcase, options) unless email.blank? rescue nil
    end
  end
	
	def wikitoolbar_for(field_id)
			help_link = l(:setting_text_formatting) + ': ' +
			link_to(l(:label_help), compute_public_path('wiki_syntax', 'help', 'html'),
			        :onclick => "window.open(\"#{ compute_public_path('wiki_syntax', 'help', 'html') }\", \"\", \"resizable=yes, location=no, width=300, height=640, menubar=no, status=no, scrollbars=yes\"); return false;")
			
			javascript_include_tag('redmine/jstoolbar/jstoolbar') +
			javascript_include_tag('redmine/jstoolbar/textile') +
			javascript_include_tag("redmine/jstoolbar/lang/jstoolbar-#{current_language}") +
			javascript_tag("var toolbar = new jsToolBar($('#{field_id}')); toolbar.setHelpLink('#{help_link}'); toolbar.draw();")
   end
end
