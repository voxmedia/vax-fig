require 'rubygems'
require 'sinatra'

get '/' do
  erb :index
end

get '/more' do
  if !params.empty? && !params["enabled"].empty?
    @enabled = true
  end

  erb :more
end