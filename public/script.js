//JavaScript

// サーバーからToDoリストを取得し、HTMLリストを更新する。
async function fetchTodos() {
    // サーバーからToDoリストを取得
    const response = await fetch('/todos');
    const todos = await response.json();
    
    // HTML内のToDoリストの要素を取得
    const list = document.getElementById('todoList');
    list.innerHTML = ''; // リストをクリア
    
    // 取得したToDoリストを表示
    todos.forEach(todo => {
        const li = document.createElement('li'); // 新しいリストアイテムを作成
        const span = document.createElement('span'); // タスク名表示用の要素
        span.textContent = todo.task;
        
        const button = document.createElement('button'); // 削除ボタンを作成
        button.textContent = '削除';
        button.onclick = () => deleteTask(todo.id); // 削除ボタンにクリックイベントを設定
        
        li.appendChild(span); // タスク名をリストアイテムに追加
        li.appendChild(button); // 削除ボタンをリストアイテムに追加
        list.appendChild(li); // リストに追加
    });
}

// 入力されたタスクをサーバーに追加し、ToDoリストを更新する。
async function addTask() {
    const taskInput = document.getElementById('taskInput'); // 入力フィールドを取得
    const task = taskInput.value.trim(); // 入力値の前後の空白を削除
    if (task === '') return; // 空のタスクは追加しない
    
    // サーバーに新しいタスクを送信
    await fetch('/todos', {
        method: 'POST',
        body: JSON.stringify({ task }),
        headers: { 'Content-Type': 'application/json' }
    });
    
    taskInput.value = ''; // 入力フィールドをクリア
    fetchTodos(); // 更新後のToDoリストを再取得
}

// 指定されたIDのタスクをサーバーから削除し、ToDoリストを更新する。
async function deleteTask(id) {
    await fetch(`/todos/${id}`, { method: 'DELETE' }); // 指定IDのタスクを削除
    fetchTodos(); // 更新後のToDoリストを再取得
}

// 初回ロード時にToDoリストを取得して表示
fetchTodos();
