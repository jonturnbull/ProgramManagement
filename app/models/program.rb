class Program < ActiveRecord::Base
  belongs_to :organization
  has_many :issues
  
  validates :name, presence: true, uniqueness: true
end
