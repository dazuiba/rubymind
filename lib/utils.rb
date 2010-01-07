require 'httpclient'
class Utils
	
	WANGWANG_URL = "http://10.13.3.28/SendWWWeb/Default.aspx"	
	##
	#旺旺消息发送
	# 1. 所有字段必须为UTF8编码
	# 2. user 可以为数组。
	##
  def self.wangwang(user,subject, message)
	  if user.is_a? Array
			user.each{|e|self.wangwang(e, subject,message)}
		else
		  params = {"nick"=>user.to_gbk,"subject"=>subject.to_gbk,"context"=>message.to_gbk}     
	    response = HTTPClient.new.get(WANGWANG_URL,params)
	    puts response.status
		  return (response.status == 200)
		end
  end
  
  def self.report_warn(callee,  message)
  	wangwang("柱石", "线上错误", message)
  end
	
  #格式化浮点数， 默认保留2位有效数字
	def self.fmt_float(time, count=2)
		"%.#{count}f" % time
	end
  
  def self.template(file, opt = {})
    opt.map {|k,v| eval "@#{k} = '#{v}'"}
    file = File.read(file)
    ERB.new(file).result(binding)
	end
	
	def self.report(cmd_hash, &block)
		ResultReport.report(cmd_hash, &block)
	end
	
	class ResultReport
		def self.report(cmds, &block)
			befores = cmds.build_hash{|e|[e.first, eval(e.last)]}
			yield
			afters = cmds.build_hash{|e|[e.first, eval(e.last)]}  		
			self.new(befores, afters).report
		end
		
		def initialize(befores, afters)
			befores.keys.each do |title|
				add title, befores[title], afters[title]
			end
		end
		
		def add(name,old, now)
			@stats||=[]
			@stats<< [name, old, now]
		end
		
		def to_s
			report
		end
		
		def report
			@stats.map{|e|
			  title = e[0]
			  old = e[1]
				now = e[2]
				"#{title}:#{now}个，#{old>now ? "减少" : "新增"}#{(now-old).abs}个}"
			}.join("<br>")
		end
		
		def inspect
			report
		end
	end
end