class StaticController < ApplicationController
  layout "static", :only => "about" 
  layout "application", :only => "home" 
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
