
/*javascript*/

async function fetchTodos() {
    const response = await fetch('/todos');
    const todos = await response.json();
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = todo.task;
        const button = document.createElement('button');
        button.textContent = '削除';
        button.onclick = () => deleteTask(todo.id);
        li.appendChild(span);
        li.appendChild(button);
        list.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();
    if (task === '') return;
    
    await fetch('/todos', {
        method: 'POST',
        body: JSON.stringify({ task }),
        headers: { 'Content-Type': 'application/json' }
    });
    
    taskInput.value = '';
    fetchTodos();
}

async function deleteTask(id) {
    await fetch(`/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
}

// 初回ロード時に一覧を取得
fetchTodos();
