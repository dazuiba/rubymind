require 'singleton'
class Twork::Sa
	include CommandLine
	include Singleton 
	def dbbak(file = Time.now.strftime("%Y-%m-%d_%H")+".gz" )
		dir = Setting.db_bak_dir
		FileUtils.mkdir_p dir
		file = File.join(dir,file)
		config = ActiveRecord::Base.configurations[RAILS_ENV]
		execute %[mysqldump -h#{config["host"]} -u#{config["username"]} -p#{config['password']} #{config["database"]} | gzip > #{file}]
		logger.info "remove old bak files"
		#exec "find #{dir} -ctime +7 -exec rm -f{}\;"
		return file
	end
	
	def logger
		RAILS_DEFAULT_LOGGER
	end
end
