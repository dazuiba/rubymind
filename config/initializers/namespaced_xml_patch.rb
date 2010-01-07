# rails2.3.3 bug fix
# see here: 
#    https://rails.lighthouseapp.com/projects/8994/tickets/2723-to_xml-generates-invalid-xml-with-namespaced-activerecord


raise "should load this file last" unless defined? ActiveRecord::XmlSerializer 

class ActiveRecord::XmlSerializer
	
	def root
    root = (options[:root] || @record.class.to_s.demodulize.underscore).to_s
    reformat_name(root)
  end
  
  def add_associations(association, records, opts)
    if records.is_a?(Enumerable)
      tag = reformat_name(association.to_s)
      type = options[:skip_types] ? {} : {:type => "array"}
      if records.empty?
        builder.tag!(tag, type)
      else
        builder.tag!(tag, type) do
          association_name = association.to_s.singularize
          records.each do |record|
            if options[:skip_types]
              record_type = {}
            else
              record_class = (record.class.to_s.demodulize.underscore == association_name) ? nil : record.class.name
              record_type = {:type => record_class}
            end

            record.to_xml opts.merge(:root => association_name).merge(record_type)
          end
        end
      end
    else
      if record = @record.send(association)
        record.to_xml(opts.merge(:root => association))
      end
    end
  end
end

class Array
  def to_xml(options = {})
    raise "Not all elements respond to to_xml #{self.inspect}" unless all? { |e| e.respond_to? :to_xml }
    require 'builder' unless defined?(Builder)

    options[:root]     ||= all? { |e| e.is_a?(first.class) && first.class.to_s != "Hash" } ? first.class.to_s.demodulize.pluralize : "records"
    options[:children] ||= options[:root].singularize
    options[:indent]   ||= 2
    options[:builder]  ||= Builder::XmlMarkup.new(:indent => options[:indent])

    root     = options.delete(:root).to_s
    children = options.delete(:children)

    if !options.has_key?(:dasherize) || options[:dasherize]
      root = root.dasherize
    end

    options[:builder].instruct! unless options.delete(:skip_instruct)

    opts = options.merge({ :root => children })

    xml = options[:builder]
    if empty?
      xml.tag!(root, options[:skip_types] ? {} : {:type => "array"})
    else
      xml.tag!(root, options[:skip_types] ? {} : {:type => "array"}) {
        yield xml if block_given?
        each { |e| e.to_xml(opts.merge({ :skip_instruct => true })) }
      }
    end
  end
end