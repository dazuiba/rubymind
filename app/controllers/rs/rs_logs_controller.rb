class Rs::RsLogsController < ApplicationController
  def index
  	set_current_user

    #判断显示日报的日期
    if params[:id].nil?
       #生成当天的日报记录
  	   @daily_log = RsDailyLog.find_or_initialize_by_created_on_and_user_id(Date.today, User.current.id)
       @daily_log.save
    else
       #获取指定日期的日报进行显示
       daily_log_id = params[:id]
       @daily_log = RsDailyLog.find_by_id_and_user_id(daily_log_id,User.current.id)
    end

    #@project = Member.user_active_projects(User.current)
    @project = Project.find(:all, :limit=>3)

    #调试用代码
    @qc = Array.new()
    n = 0
    for i in 0..@project.length-1
     @qc[n] = Hash.new()
     @qc[n]["id"] = @project[i].id
     @qc[n]["type"] = 1
     @qc[n]["name"]=@project[i].name
     @qc[n]["output_type"] = 1
     @qc[n]["output_type_name"]="编写TC数："
     @qc[n]["output"]="50"
     n = n+1
     @qc[n] = Hash.new()
     @qc[n]["id"] = @project[i].id
     @qc[n]["type"] = 1
     @qc[n]["name"]=@project[i].name
     @qc[n]["output_type"] = 2
     @qc[n]["output_type_name"]="执行TC数："
     @qc[n]["output"]="50"
     n = n+1
     
     @qc[n] = Hash.new()
     @qc[n]["id"] = @project[i].id
     @qc[n]["type"] = 1
     @qc[n]["name"]=@project[i].name
     @qc[n]["output_type"] = 3
     @qc[n]["output_type_name"]="验证BUG数："
     @qc[n]["output"]="50"
     n = n+1
    end

  end

  def show
    @daily_log = RsDailyLog.find(:all, :limit=>7)

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
    #
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
        @rs_log_e = RsLog.find_or_initialize_by_daily_log_id_and_item_id_and_item_type_and_output_type(params[:rs_log][:daily_log_id][0],99,3,output_type)
        @rs_log_e.comments = params[:rs_log_e][:item_name][j]
        @rs_log_e.input = params[:rs_log_e][:input][j]
        @rs_log_e.output = params[:rs_log_e][:output][j]
        @rs_log_e.stage = params[:rs_log_e][:stat][j]
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
    @daily_log.comments = params[:daily_log][:comments]
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
end
