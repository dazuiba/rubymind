require "digest/sha1"
class User < ActiveRecord::Base
  
  USER_FORMATS = {
    :firstname_lastname => '#{firstname} #{lastname}',
    :firstname => '#{firstname}',
    :lastname_firstname => '#{lastname} #{firstname}',
    :lastname_coma_firstname => '#{lastname}, #{firstname}',
    :username => '#{login}'
  }
  
	named_scope :active, :conditions => "disabled = 0"
	
  has_many :memberships, :class_name => 'Member', :include => [ :project, :role ], :order => "#{Project.table_name}.name"
  has_many :members, :dependent => :delete_all
  has_many :projects, :through => :memberships
  
  serialize :auto_config

  
  def before_save
    # update hashed_password if password was set
    self.hashed_password = User.hash_password(self.password) if self.password
  end
      
  
  def auto_config
  	(self['auto_config']||{}).reverse_merge(:line_id => 1)
  end
  
  # Sort users by their display names
  def <=>(user)
    self.to_s.downcase <=> user.to_s.downcase
  end
  
  def name
  	nickname
  end
  
  def to_s
    login
  end
  
  def logged?
    true
  end
  
  def anonymous?
    !logged?
  end
  
  # Return user's role for project
  def role_for_project(project)
    # No role on archived projects
    return nil unless project && project.active?
    if logged?
      # Find project membership
      membership = memberships.detect {|m| m.project_id == project.id}
      if membership
        membership.role
      else
        @role_non_member ||= Role.non_member
      end
    else
      @role_anonymous ||= Role.anonymous
    end
  end
  
  # Return true if the user is a member of project
  def member_of?(project)
    role_for_project(project).member?
  end
  
  # Return true if the user is allowed to do the specified action on project
  # action can be:
  # * a parameter-like Hash (eg. :controller => 'projects', :action => 'edit')
  # * a permission Symbol (eg. :edit_project)
  def allowed_to?(action, project, options={})
  	true
  end
        
  def self.current=(user)
    @current_user = user
  end
  
  def self.current
    @current_user ||= AnonymousUser.new
  end
  
  def attach_ldap!
  	raise "attribute: login should not be empty!" if self.login.nil?
  	unless (defined? LDAP)
  		puts "ldap is not installed, so it is diabled! " 
  		return false
		end

  	conn = LDAP::Conn.new("10.1.2.1", 3268)
    conn.set_option( LDAP::LDAP_OPT_PROTOCOL_VERSION, 3 )
    conn=conn.bind('taobao-HZ\taobaoapp', '(taobao)')
    if conn.bound?
      ret=conn.search2( 'dc=taobao,dc=ali,dc=com', LDAP::LDAP_SCOPE_SUBTREE, "sAMAccountName=#{self[:login]}", ["displayName","department","mail","description"])
      self.nickname   = pick_ldap_result(ret, "displayName")
      self.department = pick_ldap_result(ret,	"department")
      self.email      = pick_ldap_result(ret,	"mail")
    end
    self
  end

  def self.find_id_by_login_or_nickname(login,nickname)
    find(:all,:select => "id", :conditions => ["login like ? or nickname like ?","%#{login}%","%#{nickname}%"] )
  end
private
  # Return password digest
  def self.hash_password(clear_password)
    Digest::SHA1.hexdigest(clear_password || "")
  end
  
  def pick_ldap_result(ret, key)
  	r = ret.first[key]
  	r&&r.first
  end
end


class AnonymousUser < User
  
  def validate_on_create
    # There should be only one AnonymousUser in the database
    errors.add_to_base 'An anonymous user already exists.' if AnonymousUser.find(:first)
  end
  
  def available_custom_fields
    []
  end
  
  # Overrides a few properties
  def logged?; false end
  def admin; false end
  def name; 'Anonymous' end
  def mail; nil end
  def time_zone; nil end
  def rss_key; nil end
end