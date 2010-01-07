##
# 日报中的每条记录
##
class RsLog < ActiveRecord::Base
	belongs_to :daily_log, :class_name => "RsDailyLog"
end
