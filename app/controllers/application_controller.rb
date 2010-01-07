# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details
	layout 'application'
  before_filter :set_current_user
  private
  def set_current_user  	
  	user = if(login=request.env["HTTP_LOGIN_USER"] )
  		login.sub!(/^taobao-hz\\/, "")
	  	User.find_or_initialize_by_login(login)
		else
			User.first
		end
	  
  	if user && user.new_record?
  		user.attach_ldap!
  		user.save!
  	end
  	User.current = user || User.new(:login=>'guest',:nickname=>'guest')
  end
end
