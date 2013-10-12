class CreateIssueUpdatesTable < ActiveRecord::Migration
  def self.up
    create_table :issue_updates, :force => true do |t|
      t.string :update
      t.timestamps
    end
    
    add_reference :issue_updates, :issues
    rename_table :status, :status_types
  end

  def self.down
    rename_table :status_types, :status
    drop_table :issue_updates
  end
end