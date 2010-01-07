module QC
  class AllList< ActiveRecord::Base  	
		establish_connection :qc_user
		acts_as_tree :foreign_key => "AL_FATHER_ID"
		extend ImportHelper
		
		def self.do_import(project, qc_tests)
			self.project = project
			all_lists =find_all_list(qc_tests.map{|e|e.ts_subject}.uniq)
			Auto::TestcaseCategory.import(ALL_LIST_COLUMN,all_lists.map{|e|convert_all_lists(e)}, OPTIONS)
		end		   
	 	
		def self.project= (project)
			super(project)
			self.set_table_name "#{db_name}.all_lists"
		end
		
	 	def self.primary_key
	 		"al_item_id"
	 	end
	 	
	 	def parent
	 		self.class.find(self.al_father_id) rescue nil
	 	end
	 	
	 	def children
	 		self.class.find_all_by_al_father_id(self.id, :order=> self.class.primary_key)
	 	end
	 	
	 	def ancestors_and_self
	 		ancestors+[self]
	 	end
	 	
		private
		
		def self.find_all_list(ids)			
			root = find(:first, :conditions => {"al_father_id"=> 0, "al_description" => 'Subject'})
			assert root
			first_item = root.children.first
			
			result = self.find(:all, :conditions => {primary_key => ids}).map(&:ancestors_and_self).flatten.uniq.select{|e|e.id>=root.id}
			if result.size!=ids.size
				Utils.report_warn(self, "Size(#{ids.size} vs #{result.size})\
													is not same in #find_all_list, ids:#{ids.inspect}, result: #{result.map{|e|e.send(self.primary_key)}.inspect}")
			end
			puts "#{result.size} testcategory will be imported"
			result
		end
		
		ALL_LIST_COLUMN = ['id', 'title', 'position', 'parent_id', 'project_id']
		def self.convert_all_lists(e)
			is_root = e.al_description=='Subject' 
			title, position =  if is_root
													[twork_proj.qc_name, 0]
											 	 else											 	 														
													split_title_position(utf8(e.al_description))
												 end			
			[add_prj_id(e.al_item_id),
			 title,
			 position,			 
			 is_root ? nil : add_prj_id(e.al_father_id), self.project_id]
		end
		
  end
end