class Project < ActiveRecord::Base	
	include Acts::Customizable
	STATUS_ACTIVE     = 0
  STATUS_CLOSED   = 1
	has_many :members, :include => :user
  has_many :users, :through => :members
  has_many :testcases, :class_name => "Auto::Testcase"
  has_many :testcase_categories, :class_name => "Auto::TestcaseCategory"
  has_many :testsuites, :class_name => "Auto::Testsuite", :foreign_key => "range_id"
	validates_uniqueness_of :line_home, :scope => "line_id", :on => :create, :if => Proc.new { |project| project.line_home}
	validates_uniqueness_of :qc_name, :scope => "line_home", :on => :create, :if => Proc.new { |project| project.line_home}
	validates_uniqueness_of :qc_db
	validates_presence_of :name, :qc_name, :qc_db
  belongs_to :product_line, :class_name => "Base::ProductLine", :foreign_key => "line_id"
  
  named_scope :active, :conditions => "status = #{STATUS_ACTIVE}"
  
	serialize :qc_config	
	acts_as_customizable	
	before_create do|record|		
		record.status = STATUS_ACTIVE
	end
	
	before_save do |record|
		record.qc_name = record.qc_name.capitalize
		record.qc_db = record.qc_db.downcase
		if record.line_home?
			if !record.qc_name =~ /_home$/
				record.qc_name = record.qc_name+"_home"
			end
		end
	end
	
	def users_of_role(role)
		members.find_all_by_role_id(role).map(&:user)
	end
	
	# Commented by zhushi 2009-12-01
	# def qc_name
	# 	self.line_home? ? product_line.id_string : super
	# end
				
	def self.cut_project_id(id)
		idstring = id.to_s
		assert idstring.size>3
		return idstring[3,idstring.length]
	end
	
	def self.add_project_id(id,project_id)
		assert project_id.to_s.size == 3, "string size should be 3 but was #{project_id}"
		return "#{project_id}#{id}".to_i
	end
	
	def active?
		self.status != STATUS_ACTIVE
	end
	
	def identifier_frozen?
		true
	end

	def qc_path
		product_line.id_string+"/"+ self.qc_name
	end
	
	def tc_importer
		QC::TCImporter.new(self)
	end
end