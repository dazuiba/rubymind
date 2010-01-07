class Map::MindmapsController < ApplicationController
	layout "mindmap"
	before_filter :find_obj, :except => [:new,:index, :list, :mmtree, :create]	
	
	def new
		@mindmap = Map::Mindmap.new(:xml=>%[<map><topic central="true" text="ddd"/></map>])
		@mindmap.id = Map::Mindmap.last.nil? ? 1 : Map::Mindmap.last.id+1
	end
  
  def index
  	
  end
  
  def export  	
    send_data @mind_map.mm_xml, :type => "application/x-freemind;charset=gbk", 	
																:filename=>"#{Iconv.iconv('gbk','utf-8',@mind_map.title)}.mm", 
																:disposition => 'attachment'
  end
  
  def update
    @mind_map.update_attributes!(params.slice(:title))
    respond_to do |format|
      format.json { render :json => @mind_map }
    end
  end
  
  def show
  	render :layout => false
  end
  
  def save
    @mind_map.mm_xml = params[:mm_xml]
    @mind_map.save!
    render :text=>{:result=>'ok'}.to_json
  end
  
  def destroy    
    if @mind_map.destroy
      render :text => "删除成功", :layout => false
    else
      render :text => "删除失败", :layout => false
    end
  end
  
  private  
  def find_obj
    @mind_map = Map::Mindmap.find(params[:id].split("_").last.to_i)
  end
end
