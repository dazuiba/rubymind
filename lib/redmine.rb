# require 'redmine/access_control'
require 'redmine/menu_manager'
# require 'redmine/activity'
# require 'redmine/mime_type'
# require 'redmine/core_ext'
# require 'redmine/themes'
# require 'redmine/hook'
# require 'redmine/plugin'
# require 'redmine/wiki_formatting'

Redmine::MenuManager.map :top_menu do |menu|
#  menu.push :home, :home_path
end

Redmine::MenuManager.map :account_menu do |menu|
  menu.push :register, { :controller => 'account', :action => 'register' }, :if => Proc.new { !User.current.logged? && Setting.self_registration? }
  menu.push :my_account, { :controller => 'my', :action => 'account' }, :if => Proc.new { User.current.logged? }
end

Redmine::MenuManager.map :application_menu do |menu|
  # Empty
end

Redmine::MenuManager.map :iface_menu do |menu|	
  menu.push :iface, '/home/iface'
  menu.push :iface_weekly, '/home/iface_weekly'
end


Redmine::MenuManager.map :product_line_menu do |menu|	
  menu.push :projects, {:controller => "product_lines", :action => "show"}
  menu.push :knowleges, {:controller => "knowleges"}, :param=>:line
end

Redmine::MenuManager.map :admin_menu do |menu|
  # Empty
end

Redmine::MenuManager.map :project_menu do |menu|
  menu.push :overview, { :controller => 'projects', :action => 'show' }
  menu.push :settings, { :controller => 'projects', :action => 'settings' }, :last => true
end