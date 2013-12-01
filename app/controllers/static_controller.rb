class StaticController < ApplicationController
  def home
    @programs=Program.count
  end
end
