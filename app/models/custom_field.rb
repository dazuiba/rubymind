class CustomField < ActiveRecord::Base
  COLUMN_NAME_MAX_LEN=15
  DEF_COLUMN_PREFIX="def_"
	set_inheritance_column false
  has_many :custom_field_enums
  
	def values
		if type == 'user'
			User.all.map{|e|[e.id, e.nickname]}
    elsif type == 'machines'
    	Machine.auto.publics.map{|e|[e.id, "#{e.name}(#{e.ip})"]}
    elsif type == 'product_line' 
    	ProductLine.all.map{|e|[e.id,e.name]}
  	elsif type == 'project' 
  		Project.all.map{|e|[e.id,e.name]}
		else
			custom_field_enums.map{|e|[e.value,e.value]}
		end
	end
	# alias :possible_values :values
	
	def possible_values
		values
	end
	
	def is_filter?
		return true if self.name == 'tc_priority'
		!self.name.start_with? "tc_"
	end
	
	def xtype
		if !['text','date'].include? self['type']
			'combo'
		else
			self['type']
		end		
	end
end