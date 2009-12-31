class Map::MindMap < ActiveRecord::Base
	belongs_to :product, :class_name => "::Base::Product"
	
  def product_line
  	self.product.product_line
  end
end

