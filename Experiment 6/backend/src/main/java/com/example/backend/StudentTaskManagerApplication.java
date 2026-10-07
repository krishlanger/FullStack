package com.example.backend;

import com.example.backend.entity.Comment;
import com.example.backend.entity.Task;
import com.example.backend.service.TaskService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cache.annotation.EnableCaching;

import org.springframework.context.annotation.Bean;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@SpringBootApplication
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
@EnableCaching
public class StudentTaskManagerApplication {

    private final TaskService taskService;

    public StudentTaskManagerApplication(TaskService taskService) {
        this.taskService = taskService;
    }

    public static void main(String[] args) {

        SpringApplication.run(
                StudentTaskManagerApplication.class,
                args
        );
    }

    /*
     * 1. PAGINATION + SORTING
     *
     * Example:
     *
     * /api/tasks?page=0&size=5&sort=id,desc
     */
    @GetMapping
    public Page<Task> getAllTasks(Pageable pageable) {

        return taskService.getTasksPaginated(pageable);
    }

    /*
     * 2. JOIN FETCH + CACHE
     */
    @GetMapping("/with-comments")
    public List<Task> getTasksWithComments() {

        return taskService.getAllTasksWithComments();
    }

    /*
     * 3. NATIVE SQL
     */
    @GetMapping("/top")
    public List<Task> getTopTasks() {

        return taskService.getTop5Tasks();
    }

    /*
     * 4. ADD TASK
     */
    @PostMapping
    public Task addTask(@RequestBody Task task) {

        return taskService.addTask(task);
    }

    /*
     * 5. DELETE TASK
     */
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {

        taskService.deleteTask(id);

        return "Task with ID " + id + " has been deleted!";
    }

    /*
     * 6. TOGGLE TASK
     */
    @PutMapping("/{id}/toggle")
    public Task toggleTask(@PathVariable Long id) {

        return taskService.toggleTask(id);
    }

    /*
     * SAMPLE DATA
     */
    @Bean
    CommandLineRunner loadData() {

        return args -> {

            for (int i = 1; i <= 20; i++) {

                Task task = new Task(
                        "Experiment Task " + i,
                        i % 3 == 0
                );

                task.addComment(
                        new Comment(
                                "Comment 1 for Task " + i
                        )
                );

                task.addComment(
                        new Comment(
                                "Comment 2 for Task " + i
                        )
                );

                taskService.addTask(task);
            }

            System.out.println(
                    "===================================="
            );

            System.out.println(
                    "20 SAMPLE TASKS INSERTED"
            );

            System.out.println(
                    "===================================="
            );
        };
    }
}