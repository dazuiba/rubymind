require 'win32ole'
require 'Spreadsheet'

def creat_csv(filename,sheetname,path,data_source)
  book = Spreadsheet::Workbook.new     
  sheet = book.create_worksheet :name =>sheetname
  @csv_date = data_source
  for i in (0..@csv_date.length-1)
    for j in (0..@csv_date[i].length-1)
      sheet[i,j]=@csv_date[i][j]
    end
  end
  
  sheet.row(0).height = 18    #首行格式
  format = Spreadsheet::Format.new :color => :blue,
    :weight => :bold,
    :size => 18
  sheet.row(0).default_format = format
 
  bold = Spreadsheet::Format.new :weight => :bold   #�������
  @csv_date.length.times do |x| sheet.row(x + 1).set_format(0, bold) end
   
  book.write path + filename      #导出文件
  puts '导出成功'+path + filename
end

datess = [["nihao de a",'ni hao' ],"haha",['ni hao'],['43'],'fsdf',['werew']]
creat_csv("ni.csv",'tang1','c:\\',datess)