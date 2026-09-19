package com.taskflow.controller;

import java.net.URI;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.UpdateTaskRequest;
import com.taskflow.model.Task;
import com.taskflow.service.TaskService;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> create(@Valid @RequestBody CreateTaskRequest request) {
        Task task = taskService.create(request);
        return ResponseEntity.created(URI.create("/tasks/" + task.getId())).body(task);
    }

    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id) {
        return taskService.getById(id);
    }

    @GetMapping
    public List<Task> getAll() {
        return taskService.getAll();
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody UpdateTaskRequest request) {
        return taskService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}