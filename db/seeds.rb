# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Organization.delete_all
Organization.create(name: 'FT Consulting', description: 'FT Consulting offers project and programme management, application development and outsourcing services for clients in multiple industries: Banking, Insurance, Oil & Gas, Media, Retail.')
Organization.create(name: 'Innovair', description: 'At Innovair, ideas, technology, experience and best practices come together to create ground-breaking, innovative products for the enterprise market.')
Organization.create(name: 'RedFly', description: 'Advertising and Communications agency headquartered in the Golden Square, London. We serve clients in the Media and Technology sectors across the UK. Please get in touch with us through our web page, Facebook or LinkedIn!')

