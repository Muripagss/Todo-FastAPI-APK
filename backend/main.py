from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Task Model
class Task(BaseModel):
    id: Optional[int] = None
    title: str
    completed: bool

# In-memory "database"
tasks: List[Task] = []
next_id = 1  # Start auto-incrementing from 1

# Get all tasks
@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks

# Create a new task
@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    global next_id
    task.id = next_id
    next_id += 1
    tasks.append(task)
    return task

# Update an existing task
@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: Task):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            updated_task.id = task_id  # Preserve original ID
            tasks[index] = updated_task
            return updated_task
    raise HTTPException(status_code=404, detail="Task not found")

# Delete a task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            del tasks[index]
            return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")
