USE employees;

INSERT INTO department (id, name)
    VALUES 
    (1, 'IT'),
    (2, 'HR'),
    (3, 'Marketing'),
    (4, 'Engineering');

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
    VALUES 
    (1, 'John', 'Smith', 1, NULL),
    (2, 'Jane', 'Doe', 2, 1),
    (3, 'Jimmy', 'Tootsie', 3, 1),
    (4, 'Sal', 'Mirza', 3, 1);

INSERT INTO role (id, title, salary, department_id)
    VALUES 
    (1, 'IT Technician', 50000, 1),
    (2, 'HR Manager', 100000, 2),
    (3, 'HR Assistant', 55000, 2),
    (4, 'Marketing Manager', 100000, 3),
    (5, 'Sales Associate', 50000, 3),
    (6, 'Junior Engineer', 65000, 4),
    (7, 'Senior Engineer', 85000, 4);
 


 
