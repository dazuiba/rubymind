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
		mm.owner = User.current
		mm.created_by = User.current
	end		
	
	def update_xml!(xml, type, native_xml)
		self.xml = xml
		self.native||=self.build_native
		self.native.update_xml!(type,native_xml)
		save!
	end
	
	def import!(mm_xml)
		self.xml = self.class.mm2xml(mm_xml)
		self.save!
	end
	
	def self.mm2xml(mm)
	  resp = Net::HTTP.post_form(URI.parse(Setting.map_ws+"mm2xml"),{'mmxml'=>mm})
	  if resp.code.to_i >= 400
	  	raise  RuntimeError.new("Error(code: #{resp.code}) when request map webserver : #{Setting.map_ws}", resp.inspect)
  	else
  		resp.body
		end
	  
	end
end

