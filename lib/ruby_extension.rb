require 'twork/ext/string'
class Integer
  Max=(0x3fffffff)
end

ActiveSupport::OrderedHash.class_eval do
	def fetch(key)
		v=self[key]
		raise IndexError,"key #{key.inspect} not found" if v.nil?
		v
	end
end


module Assert
	class AssertionError < Exception
		
	end
	
	def silence_require(file)
		begin
 		 require file
		rescue LoadError		  
		end
	end
	
	def assert(cond, message = "Asserion Failed")
		raise AssertionError.new(message) unless cond
	end
	
	def assert_equal(a,b)
		raise AssertionError.new("#{a.inspect} and #{b.inspect} not equal") unless a!=b
	end
end


class Object
	include Assert
	extend Assert
end

class Array

  def as_json(options={})
    map{|e| e.as_json(options)}
  end
  
  def hash_map_with_index(&block)
    Hash[*self.map_with_index(&block)]
  end
	
  def map_with_index
  	
  end
  
  def hash_map(&block)
    Hash[*self.map(&block)]
  end
end

if $0==__FILE__
  require 'test/unit'
  require 'active_support'
  class RubyExtensionTest< Test::Unit::TestCase
  	
    def setup
      Extensions::RubyExtension.extent!
    end
    
    def test_extend_hash
      assert_equal({2=>3}, {1=>2}.hash_map{|k,v|[k+1,v+1]})       
      assert_equal({2=>3}, {1=>2}.hash_map{|e|[e[0]+1,e[1]+1]})       
    end

    def test_extend_integer
      assert_equal(0x3fffffff,Integer::Max) 
    end
		
    def test_extend_array
      assert_equal({2=>3,3=>4}, [1,2].hash_map{|e|[e+1,e+2]}) 
    end

    def test_extend_ordered_hash
      result=ordered_hash([1,2]).hash_map{|k,v|[k+1,v+1]}
      assert_equal(ActiveSupport::OrderedHash,result.class)
      assert_equal([[2,3]], result)
      assert_equal([[3,4],[2,3]], ordered_hash([2,3],[1,2]).hash_map{|e|[e[0]+1,e[1]+1]})       
    end
    private
    def ordered_hash(*v)
      ActiveSupport::OrderedHash.new(v)
    end
  end
end
