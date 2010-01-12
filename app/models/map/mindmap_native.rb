class Map::MindmapNative < ActiveRecord::Base
	
	def update_xml!(type,xml)
		type.downcase!
		if type == "svg"
			self.svg_xml = xml
		elsif type == "vml"
			self.vml_xml = xml
		else
			assert false, "type: #{type} is not expected!"
		end
		save!
	end
end

