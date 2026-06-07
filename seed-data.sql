-- Seed data for Placement Portal

-- Insert Mock Tests
INSERT INTO mock_tests (id, title, company, duration, questions) VALUES
  (
    gen_random_uuid(),
    'DSA Fundamentals Test',
    'General',
    60,
    '[
      {
        "id": "q1",
        "question": "What is the time complexity of binary search?",
        "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        "correctAnswer": 1
      },
      {
        "id": "q2",
        "question": "Which data structure uses LIFO principle?",
        "options": ["Queue", "Stack", "Array", "Tree"],
        "correctAnswer": 1
      },
      {
        "id": "q3",
        "question": "What is the worst-case time complexity of quicksort?",
        "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        "correctAnswer": 2
      },
      {
        "id": "q4",
        "question": "Which traversal method is used in BFS?",
        "options": ["Stack", "Queue", "Array", "Linked List"],
        "correctAnswer": 1
      },
      {
        "id": "q5",
        "question": "What is the space complexity of merge sort?",
        "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        "correctAnswer": 2
      }
    ]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Quantitative Aptitude',
    'General',
    45,
    '[
      {
        "id": "q1",
        "question": "If a = 5 and b = 3, what is (a² - b²)?",
        "options": ["16", "8", "25", "15"],
        "correctAnswer": 0
      },
      {
        "id": "q2",
        "question": "What is 15% of 200?",
        "options": ["20", "25", "30", "35"],
        "correctAnswer": 2
      },
      {
        "id": "q3",
        "question": "If speed is 60 km/h, how far in 30 minutes?",
        "options": ["20 km", "25 km", "30 km", "35 km"],
        "correctAnswer": 2
      },
      {
        "id": "q4",
        "question": "What is the next number: 2, 6, 12, 20, ?",
        "options": ["28", "30", "32", "36"],
        "correctAnswer": 1
      },
      {
        "id": "q5",
        "question": "Simple interest on $1000 at 5% for 2 years?",
        "options": ["$50", "$100", "$150", "$200"],
        "correctAnswer": 1
      }
    ]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Amazon Coding Challenge',
    'Amazon',
    90,
    '[
      {
        "id": "q1",
        "question": "How do you reverse a linked list?",
        "options": ["Iterative approach", "Recursive approach", "Both A and B", "Cannot be reversed"],
        "correctAnswer": 2
      },
      {
        "id": "q2",
        "question": "What is the best approach for finding duplicates in an array?",
        "options": ["Nested loops", "HashSet", "Sorting", "Binary search"],
        "correctAnswer": 1
      },
      {
        "id": "q3",
        "question": "Which algorithm is best for finding shortest path?",
        "options": ["BFS", "DFS", "Dijkstra", "Binary Search"],
        "correctAnswer": 2
      }
    ]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Google Front-End Engineer Assessment',
    'Google',
    45,
    '[
      {
        "id": "g1",
        "question": "Which HTML5 tag is used to specify a footer for a document or section?",
        "options": ["<footer>", "<bottom>", "<section>", "<aside>"],
        "correctAnswer": 0
      },
      {
        "id": "g2",
        "question": "What is the purpose of the useEffect clean-up function in React?",
        "options": ["To run code before component unmounts", "To update component state", "To optimize component rendering", "To fetch API data"],
        "correctAnswer": 0
      },
      {
        "id": "g3",
        "question": "Which CSS property is used to change the text color of an element?",
        "options": ["font-color", "text-color", "color", "background-color"],
        "correctAnswer": 2
      },
      {
        "id": "g4",
        "question": "What is the behavior of Promise.all()?",
        "options": ["Runs all promises in sequence", "Rejects immediately if any input promise rejects", "Resolves only if all promises reject", "None of the above"],
        "correctAnswer": 1
      },
      {
        "id": "g5",
        "question": "Which of the following is NOT a JavaScript primitive data type?",
        "options": ["Undefined", "Boolean", "Float", "Symbol"],
        "correctAnswer": 2
      }
    ]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Microsoft Software Engineering Test',
    'Microsoft',
    60,
    '[
      {
        "id": "ms1",
        "question": "What is a deadlock in operating systems?",
        "options": ["A bug in code", "A state where processes are blocked waiting for each other", "A thread crash", "Memory corruption"],
        "correctAnswer": 1
      },
      {
        "id": "ms2",
        "question": "Which SQL join returns all records when there is a match in either left or right table?",
        "options": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
        "correctAnswer": 3
      },
      {
        "id": "ms3",
        "question": "What is the primary purpose of an index in a database?",
        "options": ["To encrypt data", "To speed up data retrieval", "To save space", "To prevent duplicate records"],
        "correctAnswer": 1
      },
      {
        "id": "ms4",
        "question": "In cryptography, what is the role of a private key?",
        "options": ["To encrypt data publicly", "To decrypt data encrypted with public key", "To share with anyone", "To verify server IP"],
        "correctAnswer": 1
      },
      {
        "id": "ms5",
        "question": "Which protocol is used to resolve IP addresses to MAC addresses?",
        "options": ["DNS", "DHCP", "ARP", "NAT"],
        "correctAnswer": 2
      }
    ]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Meta Coding Assessment',
    'Meta',
    60,
    '[
      {
        "id": "fb1",
        "question": "Given an array, how can we find if it contains any duplicate in O(N) time and O(N) space?",
        "options": ["Nested loops", "Sorting", "HashSet", "Binary search"],
        "correctAnswer": 2
      },
      {
        "id": "fb2",
        "question": "What is the time complexity of looking up a key in a Hash Map (average case)?",
        "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        "correctAnswer": 0
      },
      {
        "id": "fb3",
        "question": "Which traversal of a Binary Search Tree (BST) outputs elements in sorted order?",
        "options": ["Pre-order", "In-order", "Post-order", "Level-order"],
        "correctAnswer": 1
      },
      {
        "id": "fb4",
        "question": "What is the space complexity of recursive depth-first search (DFS) on a tree of height H?",
        "options": ["O(1)", "O(H)", "O(N)", "O(2^H)"],
        "correctAnswer": 1
      },
      {
        "id": "fb5",
        "question": "Which design pattern ensures a class has only one instance and provides a global point of access?",
        "options": ["Factory", "Observer", "Singleton", "Adapter"],
        "correctAnswer": 2
      }
    ]'::jsonb
  ),
  (
    gen_random_uuid(),
    'TCS NQT Prep Test',
    'General',
    45,
    '[
      {
        "id": "tcs1",
        "question": "Find the odd one out from the following prime-like series: 3, 5, 7, 9, 11, 13",
        "options": ["3", "9", "11", "13"],
        "correctAnswer": 1
      },
      {
        "id": "tcs2",
        "question": "A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?",
        "options": ["10%", "12.5%", "15%", "20%"],
        "correctAnswer": 1
      },
      {
        "id": "tcs3",
        "question": "If WATER is coded as YCVGT, how is H2O coded in the same scheme?",
        "options": ["J4Q", "I3P", "J3Q", "K4R"],
        "correctAnswer": 0
      },
      {
        "id": "tcs4",
        "question": "A train 150m long passes a telegraph post in 12 seconds. What is the speed of the train in km/h?",
        "options": ["36 km/h", "45 km/h", "54 km/h", "60 km/h"],
        "correctAnswer": 1
      },
      {
        "id": "tcs5",
        "question": "The average of 5 consecutive numbers is 20. What is the largest of these numbers?",
        "options": ["20", "21", "22", "23"],
        "correctAnswer": 2
      }
    ]'::jsonb
  ),
  (
    gen_random_uuid(),
    'SQL & Database Systems Test',
    'General',
    30,
    '[
      {
        "id": "db1",
        "question": "Which normal form deals with removing transitive dependencies?",
        "options": ["1NF", "2NF", "3NF", "BCNF"],
        "correctAnswer": 2
      },
      {
        "id": "db2",
        "question": "What does the I (Isolation) in ACID transaction properties ensure?",
        "options": ["Database is secure", "Transactions execute independently without interference", "Changes are permanent", "Only authorized users access data"],
        "correctAnswer": 1
      },
      {
        "id": "db3",
        "question": "Which is a major difference between TRUNCATE and DELETE in SQL?",
        "options": ["DELETE is DML and can be rolled back; TRUNCATE is DDL and cannot", "TRUNCATE resets identity counters; DELETE does not", "TRUNCATE is faster as it does not log individual row deletions", "All of the above"],
        "correctAnswer": 3
      },
      {
        "id": "db4",
        "question": "Which SQL clause is used to filter records after applying aggregation and grouping?",
        "options": ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        "correctAnswer": 1
      },
      {
        "id": "db5",
        "question": "What type of relationship is represented using a junction/associative table?",
        "options": ["One-to-One", "One-to-Many", "Many-to-Many", "None"],
        "correctAnswer": 2
      }
    ]'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Insert Question Bank Items
INSERT INTO question_bank (company, topic, difficulty, question, options, answer, explanation) VALUES
  ('Amazon', 'Arrays', 'Easy', 'How do you find the maximum element in an array?', '["Linear search", "Binary search", "Quick select", "Merge sort"]', 'Linear search', 'Iterate through the array and keep track of the maximum element found.'),
  ('Amazon', 'Arrays', 'Medium', 'Find the longest consecutive sequence in an unsorted array', '["Use sorting O(n log n)", "Use HashSet O(n)", "Use nested loops O(n²)", "Not possible"]', 'Use HashSet O(n)', 'Using a HashSet allows us to check for consecutive elements in constant time.'),
  ('Amazon', 'DP', 'Hard', 'Solve the 0/1 Knapsack problem', NULL, 'Use dynamic programming with a 2D array to store subproblem solutions', 'Create a table dp[i][w] representing maximum value using first i items with weight limit w.'),
  ('Google', 'Graphs', 'Medium', 'Detect cycle in a directed graph', '["DFS", "BFS", "Union-Find", "Topological Sort"]', 'DFS', 'Use DFS with recursion stack to detect back edges which indicate cycles.'),
  ('Google', 'Trees', 'Easy', 'Find height of a binary tree', '["BFS", "DFS", "Recursion", "All of the above"]', 'All of the above', 'Height can be calculated using BFS, DFS, or simple recursion.'),
  ('Microsoft', 'Strings', 'Medium', 'Check if two strings are anagrams', NULL, 'Sort both strings and compare, or use character frequency count', 'Two strings are anagrams if they contain the same characters with same frequencies.'),
  ('Microsoft', 'Arrays', 'Easy', 'Find two numbers that sum to a target', '["Nested loops", "HashMap", "Two pointers", "Binary search"]', 'HashMap', 'Use HashMap to store complements and check in O(n) time.'),
  ('Meta', 'DP', 'Medium', 'Longest increasing subsequence', NULL, 'Use DP array where dp[i] represents LIS ending at index i', 'For each element, check all previous elements and update if current forms longer sequence.'),
  ('Meta', 'Arrays', 'Hard', 'Median of two sorted arrays', NULL, 'Use binary search on smaller array', 'Partition arrays such that left half elements are smaller than right half.'),
  ('Apple', 'Trees', 'Medium', 'Lowest common ancestor in BST', NULL, 'Compare node values with both target nodes', 'If one target is smaller and other is larger, current node is LCA.'),
  ('Apple', 'Graphs', 'Easy', 'Number of islands problem', '["DFS", "BFS", "Union-Find", "All work"]', 'All work', 'Can be solved using DFS, BFS, or Union-Find data structure.'),
  ('Netflix', 'System Design', 'Hard', 'Design a video streaming service', NULL, 'Use CDN, adaptive bitrate streaming, caching layers', 'Distribute content globally, encode videos in multiple qualities, cache popular content.'),
  ('Netflix', 'Arrays', 'Medium', 'Product of array except self', NULL, 'Use prefix and suffix products', 'Calculate products of all elements before and after each index.'),
  ('General', 'Aptitude', 'Easy', 'If train travels 60 km/h for 2 hours, distance covered?', '["100 km", "120 km", "140 km", "160 km"]', '120 km', 'Distance = Speed × Time = 60 × 2 = 120 km'),
  ('General', 'Aptitude', 'Easy', 'What is 25% of 80?', '["15", "20", "25", "30"]', '20', '25% = 1/4, so 80/4 = 20'),
  ('General', 'Logical Reasoning', 'Medium', 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?', '["Yes", "No", "Cannot determine", "Sometimes"]', 'Yes', 'This follows the transitive property of logical statements.'),
  ('Amazon', 'System Design', 'Hard', 'Design Amazon shopping cart', NULL, 'Use session management, database for persistence, caching for performance', 'Store cart items in session/cookies, sync with database, use Redis for fast access.'),
  ('Google', 'Algorithms', 'Medium', 'Implement LRU Cache', NULL, 'Use HashMap + Doubly Linked List', 'HashMap for O(1) access, DLL for O(1) removal and insertion at ends.'),
  ('Microsoft', 'Concurrency', 'Hard', 'Implement thread-safe singleton', NULL, 'Use double-checked locking or static initialization', 'Ensure only one instance is created even with multiple threads.'),
  ('Meta', 'Strings', 'Easy', 'Reverse a string', '["Two pointers", "Stack", "Recursion", "All methods work"]', 'All methods work', 'Can be reversed using two pointers, stack, or recursion.');

-- Insert Announcements
INSERT INTO announcements (title, content, link, is_important) VALUES
  ('Amazon Placement Drive - Registration Open', 'Amazon is conducting campus placements for SDE roles. Eligible candidates: CPI > 7.0, All branches. Register by Dec 15.', 'https://amazon.jobs', true),
  ('Google STEP Internship Applications', 'Google STEP internship applications are now open for 2nd year students. Apply before December 20.', 'https://careers.google.com', false),
  ('Mock Interview Sessions', 'Free mock interview sessions will be conducted every Saturday. Sign up on the placement portal.', NULL, false),
  ('Resume Review Workshop', 'Join us for a comprehensive resume review workshop this Friday at 4 PM in the auditorium.', NULL, false),
  ('Microsoft Off-Campus Drive', 'Microsoft is hiring freshers for SDE positions. Apply through the link. Last date: Dec 18.', 'https://careers.microsoft.com', true);
