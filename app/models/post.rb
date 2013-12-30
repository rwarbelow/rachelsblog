class Post < ActiveRecord::Base
	has_many :post_tags
	has_many :photo_urls
end
