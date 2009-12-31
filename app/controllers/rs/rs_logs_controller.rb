require 'net/http'

class Rs::RsLogsController < ApplicationController
  def index
  	set_current_user
    #判断显示日报的日期
    if params[:id].nil?
       #生成当天的日报记录
  	   @daily_log = RsDailyLog.find_or_initialize_by_created_on_and_user_id(Date.today, User.current.id)
       @daily_log.save
       @date = Date.today
    else
       #获取指定日期的日报进行显示
       daily_log_id = params[:id]
       @daily_log = RsDailyLog.find_by_id_and_user_id(daily_log_id,User.current.id)
       #查看历史日报，不可编辑
       @disable = 1
       @date = @daily_log.created_on
    end

    #@project = Member.user_active_projects(User.current)
    @project = Project.find_all_by_id(341)
    @daywork = getdayworkinfo(User.current.nickname,@date)
    #调试用代码
    @qc = Array.new()
    n = 0

    #处理项目数据
    @project.each do | project |
     #判断QC数据是否为空
     tempnum = project.qc_model("Test").create_count(:login=>"youwenjuan", :date=>@date)
     unless tempnum==0
     #
        @qc[n] = Hash.new()
        @qc[n]["id"] = project.id
        @qc[n]["type"] = 1
        @qc[n]["type_name"] = "项目"
        @qc[n]["name"]=project.name
        @qc[n]["output_type"] = 1
        @qc[n]["output_type_name"]="编写TC数："
        @qc[n]["output"] = tempnum
        n = n+1
     end

     tempnum = project.qc_model("Test").execute_count(:login=>"youwenjuan", :date=>@date)
     unless tempnum==0
        @qc[n] = Hash.new()
        @qc[n]["id"] = project.id
        @qc[n]["type"] = 1
        @qc[n]["type_name"] = "项目"
        @qc[n]["name"]=project.name
        @qc[n]["output_type"] = 2
        @qc[n]["output_type_name"]="执行TC数："
        @qc[n]["output"]=tempnum
        n = n+1
     end

     tempnum = project.qc_model("Bug").confirmed_count(:login=>"youwenjuan", :date=>@date)
     unless tempnum==0
        @qc[n] = Hash.new()
        @qc[n]["id"] = project.id
        @qc[n]["type"] = 1
        @qc[n]["type_name"] = "项目"
        @qc[n]["name"]=project.name
        @qc[n]["output_type"] = 3
        @qc[n]["output_type_name"]="验证BUG数："
        @qc[n]["output"]=tempnum
        n = n+1
     end

      #新增一条记录填写其它工作信息
        @qc[n] = Hash.new()
        @qc[n]["id"] = project.id
        @qc[n]["type"] = 1
        @qc[n]["type_name"] = "项目"
        @qc[n]["name"]=project.name
        @qc[n]["output_type"] = 4
        #@qc[n]["output_type_name"]=""
        rs_log_project_out = RsLog.find_or_initialize_by_item_type_and_item_id_and_daily_log_id_and_output_type(1,project.id,@daily_log.id,4)
        @qc[n]["output"]=rs_log_project_out.output
        n = n+1

    end
#日常处理
#    @daywork.each do |work|
#
#     @qc[n] = Hash.new()
#     @qc[n]["id"] = @project[i].id
#     @qc[n]["type"] = 2
#     @qc[n]["name"]=@project[i].name
#     @qc[n]["output_type"] = 1
#     @qc[n]["output_type_name"]="编写TC数："
#     @qc[n]["output"]="50"
#     n = n+1
#
#     @qc[n] = Hash.new()
#     @qc[n]["id"] = @project[i].id
#     @qc[n]["type"] = 2
#     @qc[n]["name"]=@project[i].name
#     @qc[n]["output_type"] = 2
#     @qc[n]["output_type_name"]="执行TC数："
#     @qc[n]["output"]="50"
#     n = n+1
#
#     @qc[n] = Hash.new()
#     @qc[n]["id"] = @project[i].id
#     @qc[n]["type"] = 2
#     @qc[n]["name"]=@project[i].name
#     @qc[n]["output_type"] = 3
#     @qc[n]["output_type_name"]="验证BUG数："
#     @qc[n]["output"]="50"
#     n = n+1
#    end

     #处理其他类型数据
     rs_log_other = RsLog.find_all_by_item_type_and_item_id_and_daily_log_id_and_output_type(3,99,@daily_log.id,4)
     rs_log_other.each do |other|
        @qc[n] = Hash.new()
        @qc[n]["id"] = 99
        @qc[n]["type"] = 3
        @qc[n]["type_name"] = "其它"
        @qc[n]["name"]=other.comments
        @qc[n]["output_type"] = 4
        #@qc[n]["output_type_name"]="验证BUG数："
        @qc[n]["output"]=other.output
        n = n+1
     end

  end

  def show
    
    daybefor = Date.today-7;
    @daily_log = RsDailyLog.find_by_sql("select * from rs_daily_logs where created_on <='"+Date.today.to_s+"' and created_on >'"+daybefor.to_s+"'")

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @daily_log }
    end 
  end

  # GET /rs/rs_logs/new
  # GET /rs/rs_logs/new.xml
  def new
    @rs_log = RsLog.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @rs_log }
    end
  end

  # GET /rs/rs_logs/1/edit
  def edit
    @rs_log = RsLog.find(params[:id])
  end

  # POST /rs/rs_logs
  # POST /rs/rs_logs.xml
  def create
    @rs_log = Array.new()
    check = 0                              #数据保存是否成功标志

    #获取提交记录条数
    rs_log_num = Array.new()
    rs_log_num = params[:rs_log][:item_id]
    for i in 0..rs_log_num.length-1
    #获取提交数据
        #转换产出数据类型
        case params[:rs_log][:output_type][i]
        when "1"
          output_type = 1
        when "2"
          output_type = 2
        when "3"
          output_type = 3
        else
          output_type = 4
        end
        @rs_log[i] = RsLog.find_or_initialize_by_daily_log_id_and_item_type_and_item_id_and_output_type(params[:rs_log][:daily_log_id][i],params[:rs_log][:item_type][i],params[:rs_log][:item_id][i],output_type)
        @rs_log[i].input =params[:rs_log][:input][i]
        @rs_log[i].output =params[:rs_log][:output][i]


    #数据入库
       #投入时间为空，则认为该记录不入库
       if @rs_log[i].input
          if !@rs_log[i].save!
             check = 1
          end
       end
    end

    #判断有无增加“其它”类型信息
    unless params[:rs_log_e].nil?
    rs_log_e_num = Array.new()
    rs_log_e_num = params[:rs_log_e][:item_type]
    output_type = 4
    j = 0

    #增加的“其它”类型信息进行保存
    rs_log_e_num.each do |rs_other|
        @rs_log_e = RsLog.find_or_initialize_by_daily_log_id_and_item_id_and_item_type_and_output_type_and_comments(params[:rs_log][:daily_log_id][0],99,3,output_type,params[:rs_log_e][:item_name][j])
        #@rs_log_e.comments = params[:rs_log_e][:item_name][j]
        @rs_log_e.input = params[:rs_log_e][:input][j]
        @rs_log_e.output = params[:rs_log_e][:output][j]
        j = j+1

        if @rs_log_e.input
          unless @rs_log_e.save!
             check = 1
          end
       end
    end
    end

    #备注信息进行保存
    @daily_log = RsDailyLog.find(params[:rs_log][:daily_log_id][0])
    #params[:daily_log][:comments].chop!
    @daily_log.comments = params[:daily_log][:comments].chop!
    logger.info("=========================")
    logger.info(@daily_log.comments)
    @daily_log.save!

    #返回view文件处理
    respond_to do |format|
      if check != 1
        flash[:notice] = 'RsLog was successfully created.'
        format.html { redirect_to("/rs/rs_logs") }
        format.xml  { render :xml => @rs_log, :status => :created, :location => @rs_log }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @rs_log.errors, :status => :unprocessable_entity }
      end
    end

  end

  # PUT /rs/rs_logs/1
  # PUT /rs/rs_logs/1.xml
  def update
    @rs_log = RsLog.find(params[:id])

    respond_to do |format|
      if @rs_log.update_attributes(params[:rs_log])
        flash[:notice] = 'RsLog was successfully updated.'
        format.html { redirect_to(@rs_log) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @rs_log.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /rs/rs_logs/1
  # DELETE /rs/rs_logs/1.xml
  def destroy
    @rs_log = RsLog.find(params[:id])
    @rs_log.destroy

    respond_to do |format|
      format.html { redirect_to(rs_rs_logs_url) }
      format.xml  { head :ok }
    end
  end

  #获取项目和日常的name
  def getdayworkinfo(nickname,date)      
      daystr = get_wf "/dailymanage/getdailyinfo.aspx?username=#{nickname}&time=#{date.to_date.to_s(:db)}"
      daystr.split(",").map do |e|
         get_wf "/dailymanage/getdailyinfo.aspx?id=#{e}"
      end
  end
  
  private  
  def get_wf(uri)  	
		curl(uri, "zhushi", "1")
  end
  
  def curl(uri, username, password)
		`curl 'http://wf.taobao.org/#{uri}' -u '#{username}:#{password}' --ntlm`
  end

end
