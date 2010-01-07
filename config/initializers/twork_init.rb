require 'ruby_extension'
require 'redmine'

GLoc.set_config :default_language => :zh
GLoc.clear_strings
GLoc.set_kcode
GLoc.load_localized_strings
GLoc.set_config(:raise_string_not_found_errors => false)
include GLoc
include ActiveSupport
Time::DATE_FORMATS[:stamp] = '%y%m%d%H%M%S'



ActiveRecord::Base.send(:include, Acts::List)
ActiveRecord::Base.send(:include, Acts::Tree)