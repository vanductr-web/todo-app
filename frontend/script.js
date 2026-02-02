// const API = 'http://localhost:8080/api/tasks'; // đổi port nếu bạn đổi server.port

const API_BASE = "https://todo-app-1p61.onrender.com"; // URL Render của backend
const API = `${API_BASE}/api/tasks`;

const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

// ----- CALL BACKEND -----
async function fetchTasks() {
  const res = await fetch(API);
  if (!res.ok) throw new Error('Fetch tasks failed');
  return await res.json(); // [{id, title, completed}, ...]
}

async function createTask(title) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Create failed');
  return await res.json();
}

async function updateTask(id, patch) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error('Update failed');
  return await res.json();
}

async function deleteTask(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
}

// ----- UI -----
function render(tasks) {
  list.innerHTML = '';
  tasks.sort((a,b)=>a.id-b.id).forEach(t => {
    const li = document.createElement('li');
    li.dataset.id = t.id;

    const label = document.createElement('label');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!t.completed;
    checkbox.addEventListener('change', async () => {
      try {
        await updateTask(t.id, { completed: checkbox.checked });
        // không cần refetch toàn bộ; chỉ đổi class
        span.classList.toggle('done', checkbox.checked);
      } catch (e) {
        checkbox.checked = !checkbox.checked; // revert nếu lỗi
        alert(e.message);
      }
    });

    const span = document.createElement('span');
    span.textContent = t.title;
    if (t.completed) span.classList.add('done');

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', async () => {
      try {
        await deleteTask(t.id);
        li.remove();
      } catch (e) {
        alert(e.message);
      }
    });

    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function refresh() {
  try {
    const data = await fetchTasks();
    render(data);
  } catch (e) {
    alert(e.message);
  }
}

async function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  addBtn.disabled = true;
  try {
    await createTask(text);
    input.value = '';
    await refresh();
  } catch (e) {
    alert(e.message);
  } finally {
    addBtn.disabled = false;
  }
}

// ----- WIRE EVENTS -----
addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTodo();
});

// ----- FIRST LOAD -----
document.addEventListener('DOMContentLoaded', refresh);
