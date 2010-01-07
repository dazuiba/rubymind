class Base::Product < ActiveRecord::Base
  belongs_to :product_line, :class_name => "Base::ProductLine"
  has_many :projects  
end
