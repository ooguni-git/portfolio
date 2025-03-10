require 'sinatra'
require 'sqlite3'
require 'sinatra/json'
require 'json'

set :public_folder, File.dirname(__FILE__) + '/public'  # 追加！


# データベースのパスを取得（app.rb があるフォルダに database.db を作成）
DB_PATH = File.join(File.dirname(__FILE__), "database.db")

# データベースが存在しなければ、新規作成
new_db = !File.exist?(DB_PATH)
DB = SQLite3::Database.new(DB_PATH)

# 新規作成時のみテーブルを作成
if new_db
  DB.execute <<-SQL
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL
    );
  SQL
  puts "✅ 新しいデータベースを作成しました: #{DB_PATH}"
else
  puts "✅ 既存のデータベースを使用します: #{DB_PATH}"
end

# ToDo一覧を取得
get '/todos' do
  todos = DB.execute("SELECT * FROM todos")
  json todos.map { |id, task| { id: id, task: task } }
end

# ToDoを追加
post '/todos' do
  data = JSON.parse(request.body.read)
  DB.execute("INSERT INTO todos (task) VALUES (?)", [data["task"]])
  json success: true
end

# ToDoを削除
delete '/todos/:id' do
  DB.execute("DELETE FROM todos WHERE id = ?", [params[:id].to_i])
  json success: true
end

# フロントエンドのHTMLを提供
get '/' do
  send_file 'public/index.html'
end
