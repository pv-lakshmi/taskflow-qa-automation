package com.taskflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.UpdateTaskRequest;
import com.taskflow.exception.TaskNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task create(CreateTaskRequest request) {
        return taskRepository.save(new Task(request.title(), request.description()));
    }

    public Task getById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public Task update(Long id, UpdateTaskRequest request) {
        Task task = getById(id);
        task.setTitle(request.title());
        task.setDescription(request.description());
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        Task task = getById(id);
        taskRepository.delete(task);
    }
}