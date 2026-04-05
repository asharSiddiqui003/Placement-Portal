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
