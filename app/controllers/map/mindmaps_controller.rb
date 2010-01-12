class Map::MindmapsController < ApplicationController
	layout "mindmap"
	before_filter :find_obj, :only => [:update, :save, :destroy, :show]	
	before_filter :set_my_menu, :except => [:index]
	def new
		map = Map::Mindmap.create(:owner => User.current,
																	 :created_by => User.current,
																	 :title  => params[:title]||"Subject")
		redirect_to :action => "show", :id => map
	end
  
  def index
  	
  end
  
  def import
  		
  end
  
  def my
  	
  end
  
  def export  	
    send_data @mindmap.mm_xml, :type => "application/x-freemind;charset=gbk", 	
															 :filename=>"#{Iconv.iconv('gbk','utf-8',@mind_map.title)}.mm", 
															 :disposition => 'attachment'
  end
  
  def update
    @mindmap.update_attributes!(params.slice(:title))
    respond_to do |format|
      format.json { render :json => @mindmap }
    end
  end
  
  
  def save
    @mindmap.update_xml!(params[:map_xml], params[:type], params[:native_xm] )
    render :text=>{:result=>'ok'}.to_json
  end
  
  def destroy    
    if @mindmap.destroy
      render :text => "删除成功", :layout => false
    else
      render :text => "删除失败", :layout => false
    end
  end
  
  private  
  def find_obj
    @mindmap = Map::Mindmap.find(params[:id].split("_").last.to_i)
  end
  
  def set_my_menu
  	@current_menu = :my_mmap
  end
end
