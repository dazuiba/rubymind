class CreateRsRsLogs < ActiveRecord::Migration
  def self.up
  	#日报记录
    create_table :rs_logs do |t|
      t.integer "daily_log_id"     #记录所在日报ID
      t.string "item_type"         #记录类型  1:项目；2：日常；3：其它
      t.integer "item_id"          #项目或日常ID，其它为空.
      t.string "stage"             #项目所在阶段
      t.string "input"             #投入(时间)
      t.string "output_type"       #产出类型  1：编写TC数；2：执行TC数；3：BUG数；4：验证BUG数；5：其它
      t.integer "output"           #产出()
      t.text "trouble"             #遇到的问题  以后扩展使用
      t.text "comments"            #注释        以后扩展使用
      t.datetime "updated_at"
    end

    create_table :rs_daily_logs do |t|
      t.integer "user_id"   #用户ID
      t.text "comments"     #当日工作备注
      t.date "created_on"   #日报日期
    end

  end

  def self.down
    drop_table :rs_logs
  end
end
