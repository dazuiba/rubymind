class Setting < ActiveRecord::Base
  cattr_accessor :available_settings
  FILE = "#{RAILS_ROOT}/config/settings.yml"
  @@available_settings = YAML::load(File.read(FILE)).with_indifferent_access
  @@last_updated = Time.now
  # Returns the value of the setting named name
  def self.[](name)
  	update_setting_if_need
    available_settings[name]["default"]
  end
  
  def self.[]=(name, v)
  	assert false
    # setting = find_or_default(name)
    # setting.value = (v ? v : "")
    # @cached_settings[name] = nil
    # setting.save
    # setting.value
  end
  
  # Defines getter and setter for each setting
  # Then setting values can be read using: Setting.some_setting_name
  # or set using Setting.some_setting_name = "some value"
  @@available_settings.each do |name, params|
    src = <<-END_SRC
    def self.#{name}
      self[:#{name}]
    end

    def self.#{name}?
      self[:#{name}].to_i > 0
    end

    def self.#{name}=(value)
      self[:#{name}] = value
    end
    END_SRC
    class_eval src, __FILE__, __LINE__
  end
  
  
private

 def self.update_setting_if_need
 	if @@last_updated < File.mtime(FILE)
 		logger.info "reload setting.yml"
 		@@available_settings = YAML::load(File.read(FILE)).with_indifferent_access
 		@@last_updated = Time.now
 	end
 end
end
