class CreatePhotoUrls < ActiveRecord::Migration
  def change
    create_table :photo_urls do |t|
    	t.string :url
    	t.references :post

    	t.timestamps
    end
  end
end
