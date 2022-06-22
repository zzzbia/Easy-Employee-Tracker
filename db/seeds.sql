INSERT INTO department (name)
    VALUES 
    ('IT'),
    ('HR'),
    ('Marketing'),
    ('Engineering');

    INSERT INTO role (title, salary, department_id)
    VALUES 
    ('IT Technician', 50000, 1),
    ('HR Manager', 100000, 2),
    ('HR Assistant', 55000, 2),
    ('Marketing Manager', 100000, 3),
    ('Sales Associate', 50000, 3),
    ('Sr Sales Associate', 65000, 3),
    ('Senior Engineer', 85000, 4),
    ('Junior Engineer', 65000, 4),
    ('Team Lead Engineer', 85000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES 
    ('John', 'Smith', 1, NULL),
    ('Jane', 'Doe', 2, 1),
    ('Polly', 'Pocket', 2, 1),
    ('Jimmy', 'Tootsie', 3, 1),
    ('Mandy', 'Myers', 3, 1),
    ('Sal', 'Mirza', 3, 1),
    ('Bob', 'Bobert', 4, 1),
    ('Sally', 'Seashore', 4, 1),
    ('Joe', 'Shoeson', 4, 1);


