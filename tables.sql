USE tcms_db;

SELECT * FROM roles;
SELECT * FROM users;
SELECT * FROM teams;
SELECT * FROM user_teams;
SELECT * FROM team_requests;
SELECT * FROM join_requests;
SELECT * FROM test_suites;
SELECT * FROM test_modules;
SELECT * FROM test_cases;
SELECT * FROM test_plans;
SELECT * FROM test_plan_cases;
SELECT * FROM test_runs;
SELECT * FROM test_run_cases;

SELECT T.team_name, U.email FROM user_teams UT
JOIN users U ON UT.user_id = U.id
JOIN teams T ON UT.team_id = T.id;

SELECT T.team_name, U.email, JR.status FROM join_requests JR
JOIN users U ON JR.user_id = U.id
JOIN teams T ON JR.team_id = T.id;

SELECT U.email, TR.status FROM team_requests TR
JOIN users U ON TR.requestor = U.id;

SELECT * FROM users WHERE email = "member8@case.com"



