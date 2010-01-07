##
# 日报
##
class RsDailyLog < ActiveRecord::Base
	has_many :rs_logs, :foreign_key => "daily_log_id"
	belongs_to :user
end