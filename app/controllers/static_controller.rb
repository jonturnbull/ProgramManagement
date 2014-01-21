class StaticController < ApplicationController
  layout "static", :only => "about" 
  layout "dashboard", :only => "dashboard" 
  layout "landing", :only => "landing"
   
  def dashboard
    @programs=Program.count
  end
  
  def about
    
  end
  
  def whatwedo
    
  end
  
  def landing 
  
  end
end
