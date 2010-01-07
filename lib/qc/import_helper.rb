module QC
	module ImportHelper
		attr_accessor :project
		TworkProject = ::Project
		def	select_all(table_name, subfix="")
			sql = "SELECT * FROM #{db_name}.#{table_name} #{subfix}"
			results = AllList.connection.select_all(sql).map{|e|OpenStruct.new(e)}
			p "fected #{table_name} #{results.size} results"
			results
		end
		
		def db_name
			self.project.qc_db
		end
		
		def project_id
			self.project.id
		end
		
		
		def convert_in_sql(array)
			result = if array.empty?
				"-1"
			else
				array.join(",")
			end
			"(#{result})"
		end
		
		def convert_priority(priority)
			return nil if priority.blank?
			priority.split("-").first
		end
		
		def split_title_position(str)
			return [nil, nil] if str.nil?
			desc_splits = str.split("_", 2)
			if desc_splits.size==1
				[desc_splits[0], nil]
			else
				[desc_splits[1], desc_splits[0].to_i]
			end
		end
		
		def utf8(str)
			str.nil? ? nil : str.to_utf8
		end
		
		def add_prj_id(id)
		 TworkProject.add_project_id(id, self.project_id)
		end
		
		def twork_proj
			TworkProject.find(self.project_id)
		end
	end
end