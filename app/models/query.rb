class QueryColumn  
  attr_accessor :name, :sortable, :default_order
  include GLoc
  
  def initialize(name, options={})
    self.name = name
    self.sortable = options[:sortable]
    self.default_order = options[:default_order]
  end
  
  def caption
    l("field_#{name}")
  end
end


class QueryCustomFieldColumn < QueryColumn

  def initialize(custom_field)
    self.name = "cf_#{custom_field.id}".to_sym
    self.sortable = false
    @cf = custom_field
  end
  
  def caption
    @cf.name
  end
  
  def custom_field
    @cf
  end
end

class Query
  include Auto
  attr_accessor :user, :filters, :hidden_filters, :column_names, :project_id
  @@operators_by_filter_type = { :list => [ "=", "!" ],
                                 :list_status => [ "o", "=", "!", "c", "*" ],
                                 :list_optional => [ "=", "!", "!*", "*" ],
                                 :list_subprojects => [ "*", "!*", "=" ],
                                 :date => [ "<t+", ">t+", "t+", "t", "w", ">t-", "<t-", "t-" ],
                                 :date_past => [ ">t-", "<t-", "t-", "t", "w" ],
                                 :string => [ "=", "~", "!", "!~" ],
                                 :text => [  "~", "!~" ],
                                 :integer => [ "=", ">=", "<=", "!*", "*" ] }
  cattr_reader :operators_by_filter_type
  
  
  @@operators = { "="   => :label_equals, 
                  "!"   => :label_not_equals,
                  "o"   => :label_open_Testcases,
                  "c"   => :label_closed_Testcases,
                  "!*"  => :label_none,
                  "*"   => :label_all,
                  ">="   => '>=',
                  "<="   => '<=',
                  "<t+" => :label_in_less_than,
                  ">t+" => :label_in_more_than,
                  "t+"  => :label_in,
                  "t"   => :label_today,
                  "w"   => :label_this_week,
                  ">t-" => :label_less_than_ago,
                  "<t-" => :label_more_than_ago,
                  "t-"  => :label_ago,
                  "~"   => :label_contains,
                  "!~"  => :label_not_contains }

  cattr_reader :operators
 	
  def self.create_by_testsuite(suite)
  	result = self.new(:user => suite.created_by, :filters=>suite.query_condition, :column_names => nil)
  	result.add_hidden_filter("project_id", "=", suite.range_id.to_s)
  	result.add_hidden_filter("script_id", ">=", "1")
  	
  	result  	
  end
  
  def initialize(hash={})
  	@user = hash[:user]
  	@filters = hash[:filters]||{}
  	@hidden_filters = hash[:hidden_filters]||{}
  	@column_names = hash[:column_names]||[]
  	@project_id = hash[:project_id]
  end
  
  
  
	def has_filter?(field)
		filters and filters[field]
	end
	
  def values_for(field)  	
    field_value_for(field, :values)
  end
  
  def operator_for(field)
    field_value_for(field,:operator)
  end
  
	
	def has_hidden_filter?(field)
		hidden_filters and hidden_filters[field]
	end
	
	def field_value_for(field, key)
		(has_hidden_filter?(field)&&hidden_filters[field][key]) || (has_filter?(field) && filters[field][key] )
	end
	
	def columns
		[create_query_column(:title, Auto::Testcase, :title),
		 create_query_column(:created_at, Auto::Testcase, :created_at, "desc")]
	end
	
  
  def add_filter(field, operator, values)
	  return unless values and values.is_a? Array # and !values.first.empty?
	  # check if field is defined as an available filter
	  if available_filters.has_key? field
	    filter_options = available_filters[field]
	   
	    filters[field] = {:operator => operator, :values => values }
	  end
	end
	
  def add_hidden_filter(field, operator, values)
	  hidden_filters[field] = {:operator => operator, :values => values }
	end

	def available_filters
		@available_filters||= begin
			 filters = 					{"created_at" => { :type => :date_past, :order => 9 }, 
                           "updated_at" => { :type => :date_past, :order => 10 }}       
       fields = CustomField.find_all_by_tbl_name(target_model.table_name)
       filters.merge(custom_filters(fields))
		end
	end
	
	def statement
    # filters clauses
    filters_clauses = []
    all_filters = filters.merge(hidden_filters)
    all_filters.each_key do |field|
    	v = values_for(field).clone		
      next unless v and !v.empty?
      
      sql = ''
      is_custom_filter = false
      
      db_table = Auto::Testcase.table_name
      db_field = field
      sql << '('
      
      # "me" value subsitution
      if %w(assigned_to_id author_id).include?(field)
        v.push(User.current.logged? ? User.current.id.to_s : "0") if v.delete("me")
      end    
      sql = sql + sql_for_field(field, v, db_table, db_field, false)
      
      sql << ')'
      filters_clauses << sql
    end if all_filters and valid?
    
    filters_clauses.join(' AND ')
  end
	
	
	private
	
	def valid?
		true
	end
	  
  # Helper method to generate the WHERE sql for a +field+ with a +value+
  def sql_for_field(field, value, db_table, db_field, is_custom_filter)
    sql = ''
    case operator_for field
    when "="
      sql = "#{db_table}.#{db_field} IN (" + value.collect{|val| "'#{connection.quote_string(val)}'"}.join(",") + ")"
    when "!"
      sql = "(#{db_table}.#{db_field} IS NULL OR #{db_table}.#{db_field} NOT IN (" + value.collect{|val| "'#{connection.quote_string(val)}'"}.join(",") + "))"
    when "!*"
      sql = "#{db_table}.#{db_field} IS NULL"
      sql << " OR #{db_table}.#{db_field} = ''" if is_custom_filter
    when "*"
      sql = "#{db_table}.#{db_field} IS NOT NULL"
      sql << " AND #{db_table}.#{db_field} <> ''" if is_custom_filter
    when ">="
      sql = "#{db_table}.#{db_field} >= #{value.first.to_i}"
    when "<="
      sql = "#{db_table}.#{db_field} <= #{value.first.to_i}"
    when "o"
      sql = "#{IssueStatus.table_name}.is_closed=#{connection.quoted_false}" if field == "status_id"
    when "c"
      sql = "#{IssueStatus.table_name}.is_closed=#{connection.quoted_true}" if field == "status_id"
    when ">t-"
      sql = date_range_clause(db_table, db_field, - value.first.to_i, 0)
    when "<t-"
      sql = date_range_clause(db_table, db_field, nil, - value.first.to_i)
    when "t-"
      sql = date_range_clause(db_table, db_field, - value.first.to_i, - value.first.to_i)
    when ">t+"
      sql = date_range_clause(db_table, db_field, value.first.to_i, nil)
    when "<t+"
      sql = date_range_clause(db_table, db_field, 0, value.first.to_i)
    when "t+"
      sql = date_range_clause(db_table, db_field, value.first.to_i, value.first.to_i)
    when "t"
      sql = date_range_clause(db_table, db_field, 0, 0)
    when "w"
      from = l(:general_first_day_of_week) == '7' ?
      # week starts on sunday
      ((Date.today.cwday == 7) ? Time.now.at_beginning_of_day : Time.now.at_beginning_of_week - 1.day) :
        # week starts on monday (Rails default)
        Time.now.at_beginning_of_week
      sql = "#{db_table}.#{db_field} BETWEEN '%s' AND '%s'" % [connection.quoted_date(from), connection.quoted_date(from + 7.days)]
    when "~"
      sql = "LOWER(#{db_table}.#{db_field}) LIKE '%#{connection.quote_string(value.first.to_s.downcase)}%'"
    when "!~"
      sql = "LOWER(#{db_table}.#{db_field}) NOT LIKE '%#{connection.quote_string(value.first.to_s.downcase)}%'"
    end
    return sql
  end
	def custom_filters(custom_fields)
		
		custom_fields.select(&:is_filter?).build_hash do |field|
      case field.type
      when "text"
        options = { :type => :text, :order => 20 }
      when "list"
        options = { :type => :list_optional, :values => field.possible_values, :order => 20}
      when "user"
      	options = { :type => :list, :values => field.possible_values, :order => 20}
      when "date"
        options = { :type => :date, :order => 20 }
      when "bool"
        options = { :type => :list, :values => [[l(:general_text_yes), "1"], [l(:general_text_no), "0"]], :order => 20 }
      else
        options = { :type => :string, :order => 20 }
      end
      [field.col_name, options.merge({ :name => field.title })]
    end
	end
		
	def target_model
		#TODO, Should not ONLY support Testcase here!
		Auto::Testcase
	end
	
	private	
	def create_query_column(name, table, column, order = nil)
		QueryColumn.new(name, :sortable => "#{table.table_name}.#{column}", :default_order => order)
	end
	  # Returns a SQL clause for a date or datetime field.
  def date_range_clause(table, field, from, to)
    s = []
    if from
      s << ("#{table}.#{field} > '%s'" % [connection.quoted_date((Date.yesterday + from).to_time.end_of_day)])
    end
    if to
      s << ("#{table}.#{field} <= '%s'" % [connection.quoted_date((Date.today + to).to_time.end_of_day)])
    end
    s.join(' AND ')
  end
  
  def connection
  	ActiveRecord::Base.connection
  end
end