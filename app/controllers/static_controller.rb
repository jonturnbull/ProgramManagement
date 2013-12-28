class StaticController < ApplicationController
  layout "static", :except => "home" 
  layout "application", :except => "about" 
  
   
  def home
    @programs=Program.count
  end
  
  def about
    
  end
end
