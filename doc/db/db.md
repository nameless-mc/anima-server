# Database Document

### users

| param         | type         | option                                                |
| ------------- | ------------ | ----------------------------------------------------- |
| id            | BIGINT       | pk                                                    |
| name          | VARCHAR(45)  | NOT NULL                                              |
| access_token  | VARCHAR(100) | NOT NULL                                              |
| refresh_token | VARCHAR(100) | NOT NULL                                              |
| pref          | VARCHAR(45)  |                                                       |
| updated_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                             |
