require 'net/http'
class Map::Mindmap < ActiveRecord::Base
	belongs_to :created_by, :class_name => "User"
	belongs_to :owner, :class_name => "User"
	belongs_to :native, :class_name => "Map::MindmapNative"
	validates_presence_of :title
	
	before_create do |mm|
		if mm.xml.blank?
			mm.xml = %[<map><topic central="true" text="#{mm.title}"/></map>]
		end
	end		
	
	def update_xml!(xml, type, native_xml)
		self.xml = xml
		self.native||=self.build_native
		self.native.update_xml!(type,native_xml)
	end
	
	
	def self.mm2xml(mm)
	  Net::HTTP.post_form(URI.parse(Setting.map_ws),{'mmxml'=>mm})
	end
end

