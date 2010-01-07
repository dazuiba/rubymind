module QC
	Error =  Class.new(RuntimeError)
  OPTIONS = {:validate => false, :timestamps => false}  
	class TCImporter    
		TC_STATES = "'待完成','已完成','待完成自动化','已完成自动化'"
		include ImportHelper
		include ActiveSupport::Callbacks
		
		def auto_flat_field
			@project.auto_field_in_qc.blank? ? "TS_USER_02" : @project.auto_field_in_qc
		end
		
		attr_reader :now, :project
		def initialize(project)
			@project = project
		end
		
		
		def import!(logger=STDOUT)
			@now = Time.now
			Utils.report("用例"=>"Auto::Testcase.count(:conditions=>{:project_id=>#{self.project.id}})",
        "用例树条目"=>"Auto::TestcaseCategory.count(:conditions=>{:project_id=>#{self.project.id}})") do
				#0. prepare data
				qc_test = select_all("test", "where #{auto_flat_field} in (#{TC_STATES.to_gbk})")#  AND ROWNUM < 10
				raise(Error, "项目还没有的自动化用例，不能导入，请确认此项目在QC中是否已经设置 #{TC_STATES}字段") if qc_test.empty?
				
				
				logger.puts "1.delete exsiting datas of project #{project_id}"			
				testcase_ids = Auto::Testcase.find_all_by_project_id(project_id)
				Auto::TestcaseStep.delete_all(:testcase_id => testcase_ids)				
				[Auto::Testcase, Auto::TestcaseCategory].each{|e|e.delete_all("project_id = #{project_id}")}
				
				logger.puts "2. import testcases"			
				Auto::Testcase.import(TEST_COLUMN,qc_test.map{|e|convert_test(e)}, OPTIONS)
				
				logger.puts "3. import testcase_category"			
				AllList.do_import self.project, qc_test
				
				logger.puts "4. import testcase_steps"
				steps = select_all("dessteps", "where ds_test_id in #{convert_in_sql(qc_test.map{|e|e.ts_test_id})}").map{|e|convert_step(e)}

				if steps.empty?
					logger.puts "empty"
				else
					logger.puts "#{steps.size} steps"
					Auto::TestcaseStep.import(STEP_COLUMN, steps, OPTIONS)
				end
				@project.auto = true
				@project.save!
			end
		end
		
		private
		
	  STEP_COLUMN = ['id','title', 'content', 'content_expect', 'position', 'testcase_id']
		def convert_step(e)
			[add_prj_id(e.ds_id),
        utf8(e.ds_step_name),
        utf8(e.ds_description),
        utf8(e.ds_expected),
        e.ds_step_order,
        add_prj_id(e.ds_test_id)]
		end
		
	  TEST_COLUMN = ['id', 'title', 'position', 'content', 'category_id', 'project_id', 'designer', 'priority', 'tc_vts', 'created_at', 'updated_at']
		def convert_test(e)			
			title, position =  split_title_position(utf8(e.ts_name))
			[add_prj_id(e.ts_test_id),
        title,
        position,
        utf8(e.ts_description),
        add_prj_id(e.ts_subject),
        self.project_id,
        e.ts_responsible,
        convert_priority(utf8(e.ts_user_01)),#priority
        e.ts_vts,
        e.ts_creation_date,
        e.ts_vts]
		end		
		
	end
end
