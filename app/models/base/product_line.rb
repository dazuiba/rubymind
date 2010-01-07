class Base::ProductLine < ActiveRecord::Base	
	has_many :projects, :foreign_key => "line_id", :dependent=>:delete_all
	validates_presence_of :name, :id_string
	validates_uniqueness_of :name
	validates_uniqueness_of :id_string
	has_many :products
	has_many :knowleges
	
  #产品线中总的用例数
	def testcase_count
		Auto::Testcase.count(:conditions=>{:project_id  => product_home_line_project})
  end

  
  #未完成的自动化用例
  def unauto_testcase_count
      Auto::Testcase.count(:conditions=>["project_id in (?) and script_id is null",product_home_line_project])#{:project_id  => product_home_line_project,:script_id => "is null"})
  end
  
  
  #已经完成自动化用例
  def auto_testcase_count
       Auto::Testcase.count(:conditions=>["project_id in (?) and script_id is not null",product_home_line_project])
  end
  
  def unexec_testcase_count
      Auto::Testcase.count(:conditions=>["project_id in (?) and auto_exec_result is null",product_home_line_project])
  end
  
  def exec_testcases
      Auto::Testcase.find(:all,:conditions=>["project_id in (?) and auto_exec_result  is not null",product_home_line_project])
  end
  
  # 产品线自动化测试用例详情

  def detail_testcases auto_state,page
    sql_auto_state = ""
    if auto_state == "0"
      sql_auto_state = "and script_id is not null "
    elsif auto_state == "1"
      sql_auto_state = "and script_id is null "
    end
    testcases = Auto::Testcase.find(:all,:conditions=>
                                         ["project_id in (?) #{sql_auto_state} ",product_home_line_project],
                                         :order => "id desc").paginate(:page => page, :per_page => 25)
    return testcases
  end
  
  
  
  
  #产品线基线项目
  def product_home_line_project
      arr_project_ids=Array.new
      projects.each{|project|
      arr_project_ids << project.id if project.line_home
    }
    arr_project_ids << -1 if arr_project_ids.size==0
    return arr_project_ids
  end
	
end
ProductLine = Base::ProductLine
