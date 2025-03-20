# sequelize-auto -h <host> -d <database> -u <user> -x [password] -p [port]  --dialect [dialect] -c [/path/to/config] -o [/path/to/models] -t [tableName] -l ts
# ./node_modules/.bin/sequelize-auto -h <host> -d <database> -u <user> -x [password] -p [port]  --dialect [dialect] -c [/path/to/config] -o [/path/to/models] -t [tableName] -l ts
## All models
# ./node_modules/.bin/sequelize-auto -h localhost -d mygc_v3 -u postgres -x postgres -p 5432 --dialect postgres -o ./models-development -l ts

## Single table
# ./node_modules/.bin/sequelize-auto -h localhost -d mygc_v3 -u postgres -x postgres -p 5432 --dialect postgres -o ./models-development -t config -l ts