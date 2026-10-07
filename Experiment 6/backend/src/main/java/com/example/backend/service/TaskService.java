package com.example.backend.service;

import com.example.backend.entity.Task;
import com.example.backend.repository.TaskRepository;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /*
     * PAGINATION + SORTING
     */
    public Page<Task> getTasksPaginated(Pageable pageable) {

        return taskRepository.findAll(pageable);
    }

    /*
     * CACHING + JOIN FETCH
     *
     * First request:
     * Database → result → cache
     *
     * Second request:
     * Cache → result
     */
    @Cacheable("tasks")
    public List<Task> getAllTasksWithComments() {

        System.out.println("DATABASE QUERY EXECUTED");

        // Artificial delay to clearly demonstrate caching
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        return taskRepository.findAllWithComments();
    }

    /*
     * NATIVE SQL
     */
    public List<Task> getTop5Tasks() {

        return taskRepository.findTop5TasksNative();
    }

    /*
     * ADD TASK
     *
     * Clear cache after modification.
     */
    @CacheEvict(value = "tasks", allEntries = true)
    public Task addTask(Task task) {

        return taskRepository.save(task);
    }

    /*
     * DELETE TASK
     */
    @CacheEvict(value = "tasks", allEntries = true)
    public void deleteTask(Long id) {

        taskRepository.deleteById(id);
    }

    /*
     * TOGGLE COMPLETION
     */
    @CacheEvict(value = "tasks", allEntries = true)
    public Task toggleTask(Long id) {

        Optional<Task> taskOptional =
                taskRepository.findById(id);

        if (taskOptional.isPresent()) {

            Task task = taskOptional.get();

            task.setCompleted(!task.isCompleted());

            return taskRepository.save(task);
        }

        return null;
    }
}