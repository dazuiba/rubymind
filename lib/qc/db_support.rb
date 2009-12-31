module QC	
	class Config
		cattr_accessor :included_models, :current_project
	end
	module DbSupport
	  def self.included(base)
	    base.extend(ClassMethods)	    
			base.send :establish_connection , :qc_user
	    base.send :include, InstanceMethods
	    
	    QC::Config.included_models||=Set.new
	    QC::Config.included_models<< base
	  end
	  	
	  module ClassMethods
	  	def attach_project(project)
	  		QC::Config.current_project = project
	  	end
	  	
	  	def table_name
	  		"#{self.db_name}.#{self.qc_table_name}"
	  	end
	  	
	  	def db_name
	  		QC::Config.current_project.qc_db
	  	end
	  	
	  	def qc_table_name
	  		@qc_table_name||self.to_s.demodulize.tableize
	  	end
	  	
	  	def set_qc_table_name(tb)
	  		@qc_table_name = tb
	  	end
	  	
	  	def project
	  		QC::Config.current_project
	  	end
	  	
	  	private
	  	def date_range_sql(date = Date.today)
	  		date = Date.today if date.nil? 
	  		date = date.localtime if date.respond_to? :localtime
	  		"between timestamp '#{date.beginning_of_day.to_s(:db)}' and timestamp '#{date.end_of_day.to_s(:db)}' "
	  	end
	  	
	  end
	
	  module InstanceMethods
	  	
	  end
	end
end