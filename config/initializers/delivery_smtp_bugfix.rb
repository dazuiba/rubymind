require 'actionmailer'
module ActionMailer
	class Base
		 def perform_delivery_smtp(mail)
        destinations = mail.destinations
        mail.ready_to_send
        sender = (mail['return-path'] && mail['return-path'].spec) || mail['from']
        smtp = Net::SMTP.new(smtp_settings[:address], smtp_settings[:port]) do |smtp|
          smtp.sendmail(mail.encoded, sender, destinations)
        end
      end
	end
end
     