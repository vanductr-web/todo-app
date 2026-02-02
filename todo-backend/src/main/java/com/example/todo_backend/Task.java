package com.example.todo_backend;

import jakarta.persistence.*;   // rất quan trọng: dùng jakarta cho Spring Boot 3+

@Entity
@Table(name = "tasks")          // tên bảng trong DB, Hibernate sẽ tạo nếu chưa có
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)  // NOT NULL
    private String title;

    private boolean completed;

    public Task() {}

    public Task(Long id, String title, boolean completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}

