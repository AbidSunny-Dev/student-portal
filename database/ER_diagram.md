# Entity-Relationship (ER) Diagram

Below is the Entity-Relationship Diagram representing the database design for the **Academic Management Platform**. It details the tables, attributes, primary keys (`PK`), foreign keys (`FK`), and the relationships between the entities.

```mermaid
erDiagram
    Admin {
        VARCHAR_10 id PK
        VARCHAR_100 name
        VARCHAR_100 email
        VARCHAR_255 password
        VARCHAR_20 role
        TIMESTAMP created_at
    }

    Student {
        VARCHAR_10 id PK
        VARCHAR_100 name
        VARCHAR_100 email
        VARCHAR_255 password
        VARCHAR_20 student_id
        INT batch
        CHAR_2 section
        VARCHAR_50 dept
        VARCHAR_20 phone
        VARCHAR_20 role
        TIMESTAMP registered_at
    }

    Faculty {
        VARCHAR_10 id PK
        VARCHAR_100 name
        VARCHAR_105 designation
        VARCHAR_50 dept
        VARCHAR_100 email
        VARCHAR_20 phone
        TEXT education
        VARCHAR_100 office
        VARCHAR_255 photo
    }

    Subject {
        VARCHAR_10 code PK
        VARCHAR_150 name
        DECIMAL_3_2 credit
        VARCHAR_10 faculty_id FK
    }

    Semester {
        VARCHAR_20 id PK
        VARCHAR_50 name
        INT year
    }

    Result {
        INT id PK
        VARCHAR_10 student_id FK
        VARCHAR_20 semester_id FK
        VARCHAR_10 subject_code FK
        VARCHAR_5 grade
        DECIMAL_3_2 grade_point
    }

    Assignment {
        VARCHAR_20 id PK
        VARCHAR_150 title
        VARCHAR_10 subject_code FK
        TEXT description
        DATETIME deadline
        INT total_marks
        VARCHAR_50 submission_type
        TIMESTAMP posted_at
        VARCHAR_10 faculty_id FK
    }

    Notice {
        VARCHAR_20 id PK
        VARCHAR_250 title
        TEXT content
        VARCHAR_10 priority
        VARCHAR_50 category
        VARCHAR_100 posted_by
        TIMESTAMP posted_at
    }

    StudyMaterial {
        VARCHAR_20 id PK
        VARCHAR_250 title
        VARCHAR_10 subject_code FK
        VARCHAR_20 semester_id FK
        VARCHAR_50 type
        VARCHAR_10 file_type
        VARCHAR_255 url
        VARCHAR_255 file_name
        VARCHAR_20 size
        VARCHAR_100 uploaded_by
        TIMESTAMP uploaded_at
    }

    QuestionBank {
        VARCHAR_20 id PK
        VARCHAR_10 subject_code FK
        INT year
        VARCHAR_10 exam_type
        JSON questions
        VARCHAR_100 uploaded_by
        TIMESTAMP uploaded_at
    }

    Faculty ||--o{ Subject : teaches
    Student ||--|{ Result : obtains
    Semester ||--|{ Result : records
    Subject ||--|{ Result : graded_in
    Subject ||--|{ Assignment : has
    Faculty ||--o{ Assignment : assigns
    Subject ||--|{ StudyMaterial : features
    Semester ||--|{ StudyMaterial : used_in
    Subject ||--|{ QuestionBank : contains
```

## Description of Relationships

1. **Faculty & Subject (`1:N`)**: A Faculty member can teach multiple Subjects, but a Subject is taught by one Faculty member (can be NULL if not assigned yet).
2. **Student & Result (`1:N`)**: A Student obtains multiple Semester Results. If a Student is deleted, their results are deleted automatically (`ON DELETE CASCADE`).
3. **Semester & Result (`1:N`)**: A Semester records multiple Results.
4. **Subject & Result (`1:N`)**: A Subject can have multiple Results graded under it.
5. **Subject & Assignment (`1:N`)**: A Subject can host multiple Assignments.
6. **Faculty & Assignment (`1:N`)**: A Faculty member can assign multiple Assignments.
7. **Subject & Study Material (`1:N`)**: A Subject features multiple Study Materials.
8. **Semester & Study Material (`1:N`)**: Study Materials are categorized by Semesters.
9. **Subject & Question Bank (`1:N`)**: A Subject has multiple previous year question papers in the question bank.
