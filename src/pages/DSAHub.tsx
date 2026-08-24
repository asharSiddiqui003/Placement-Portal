import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, FileQuestion, ChevronDown, ChevronUp,
  ExternalLink, Flame, CheckCircle2, Circle, Trophy,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Problem {
  slug: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link: string;
}
interface Topic {
  name: string;
  emoji: string;
  problems: Problem[];
}
interface DSAHubProps {
  onNavigate: (page: string) => void;
}

// ─── Striver's SDE Sheet Data ─────────────────────────────────────────────────
const SHEET_DATA: Topic[] = [
  {
    name: 'Arrays',
    emoji: '📊',
    problems: [
      { slug: 'set-matrix-zeroes', name: 'Set Matrix Zeroes', difficulty: 'Medium', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { slug: 'pascals-triangle', name: "Pascal's Triangle", difficulty: 'Easy', link: 'https://leetcode.com/problems/pascals-triangle/' },
      { slug: 'next-permutation', name: 'Next Permutation', difficulty: 'Medium', link: 'https://leetcode.com/problems/next-permutation/' },
      { slug: 'kadane-maximum-subarray', name: "Maximum Subarray (Kadane's)", difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { slug: 'sort-colors', name: 'Sort Colors (Dutch National Flag)', difficulty: 'Medium', link: 'https://leetcode.com/problems/sort-colors/' },
      { slug: 'buy-sell-stock', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { slug: 'rotate-image', name: 'Rotate Image', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotate-image/' },
      { slug: 'merge-intervals', name: 'Merge Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/merge-intervals/' },
      { slug: 'merge-sorted-array', name: 'Merge Sorted Array', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-sorted-array/' },
      { slug: 'find-duplicate-number', name: 'Find the Duplicate Number', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { slug: 'count-inversions', name: 'Count Inversions', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1' },
      { slug: 'search-2d-matrix', name: 'Search a 2D Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { slug: 'pow-x-n', name: 'Pow(x, n)', difficulty: 'Medium', link: 'https://leetcode.com/problems/powx-n/' },
      { slug: 'majority-element', name: 'Majority Element', difficulty: 'Easy', link: 'https://leetcode.com/problems/majority-element/' },
      { slug: 'majority-element-ii', name: 'Majority Element II', difficulty: 'Medium', link: 'https://leetcode.com/problems/majority-element-ii/' },
      { slug: 'unique-paths', name: 'Unique Paths', difficulty: 'Medium', link: 'https://leetcode.com/problems/unique-paths/' },
      { slug: 'reverse-pairs', name: 'Reverse Pairs', difficulty: 'Hard', link: 'https://leetcode.com/problems/reverse-pairs/' },
    ],
  },
  {
    name: 'Linked List',
    emoji: '🔗',
    problems: [
      { slug: 'middle-linked-list', name: 'Middle of the Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
      { slug: 'reverse-linked-list', name: 'Reverse Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { slug: 'merge-two-sorted-lists', name: 'Merge Two Sorted Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { slug: 'remove-nth-node', name: 'Remove Nth Node From End of List', difficulty: 'Medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { slug: 'delete-node-ll', name: 'Delete Node in a Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/delete-node-in-a-linked-list/' },
      { slug: 'add-two-numbers', name: 'Add Two Numbers', difficulty: 'Medium', link: 'https://leetcode.com/problems/add-two-numbers/' },
      { slug: 'intersection-linked-lists', name: 'Intersection of Two Linked Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
      { slug: 'linked-list-cycle', name: 'Linked List Cycle', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { slug: 'reverse-linked-list-ii', name: 'Reverse Linked List II', difficulty: 'Medium', link: 'https://leetcode.com/problems/reverse-linked-list-ii/' },
      { slug: 'flatten-multilevel-dll', name: 'Flatten a Multilevel Doubly Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/' },
      { slug: 'rotate-list', name: 'Rotate List', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotate-list/' },
      { slug: 'copy-list-random-pointer', name: 'Copy List with Random Pointer', difficulty: 'Medium', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { slug: 'lru-cache', name: 'LRU Cache', difficulty: 'Medium', link: 'https://leetcode.com/problems/lru-cache/' },
      { slug: 'flattening-linked-list', name: 'Flattening a Linked List', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1' },
    ],
  },
  {
    name: 'Two Pointers & Sliding Window',
    emoji: '🪟',
    problems: [
      { slug: '3sum', name: '3Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum/' },
      { slug: 'trapping-rain-water', name: 'Trapping Rain Water', difficulty: 'Hard', link: 'https://leetcode.com/problems/trapping-rain-water/' },
      { slug: 'remove-duplicates-sorted', name: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { slug: 'max-consecutive-ones', name: 'Max Consecutive Ones', difficulty: 'Easy', link: 'https://leetcode.com/problems/max-consecutive-ones/' },
      { slug: 'linked-list-cycle-ii', name: 'Linked List Cycle II', difficulty: 'Medium', link: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { slug: 'longest-substring-no-repeat', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { slug: 'subarray-sum-equals-k', name: 'Subarray Sum Equals K', difficulty: 'Medium', link: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { slug: 'minimum-window-substring', name: 'Minimum Window Substring', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-window-substring/' },
    ],
  },
  {
    name: 'Greedy',
    emoji: '💰',
    problems: [
      { slug: 'n-meetings-one-room', name: 'N Meetings in One Room', difficulty: 'Easy', link: 'https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1' },
      { slug: 'minimum-platforms', name: 'Minimum Number of Platforms', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1' },
      { slug: 'job-sequencing', name: 'Job Sequencing Problem', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1' },
      { slug: 'fractional-knapsack', name: 'Fractional Knapsack', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115621/1' },
      { slug: 'minimum-coins', name: 'Minimum Number of Coins', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/number-of-coins1824/1' },
      { slug: 'non-overlapping-intervals', name: 'Non-overlapping Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { slug: 'jump-game-ii', name: 'Jump Game II', difficulty: 'Medium', link: 'https://leetcode.com/problems/jump-game-ii/' },
    ],
  },
  {
    name: 'Recursion & Backtracking',
    emoji: '🔄',
    problems: [
      { slug: 'subsets', name: 'Subsets', difficulty: 'Medium', link: 'https://leetcode.com/problems/subsets/' },
      { slug: 'subsets-ii', name: 'Subsets II', difficulty: 'Medium', link: 'https://leetcode.com/problems/subsets-ii/' },
      { slug: 'combination-sum', name: 'Combination Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum/' },
      { slug: 'combination-sum-ii', name: 'Combination Sum II', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum-ii/' },
      { slug: 'palindrome-partitioning', name: 'Palindrome Partitioning', difficulty: 'Medium', link: 'https://leetcode.com/problems/palindrome-partitioning/' },
      { slug: 'permutation-sequence', name: 'Permutation Sequence', difficulty: 'Hard', link: 'https://leetcode.com/problems/permutation-sequence/' },
      { slug: 'm-coloring', name: 'M Coloring Problem', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1' },
      { slug: 'rat-in-maze', name: 'Rat in a Maze', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1' },
      { slug: 'word-break', name: 'Word Break', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-break/' },
      { slug: 'sudoku-solver', name: 'Sudoku Solver', difficulty: 'Hard', link: 'https://leetcode.com/problems/sudoku-solver/' },
      { slug: 'expression-add-operators', name: 'Expression Add Operators', difficulty: 'Hard', link: 'https://leetcode.com/problems/expression-add-operators/' },
      { slug: 'n-queens', name: 'N-Queens', difficulty: 'Hard', link: 'https://leetcode.com/problems/n-queens/' },
    ],
  },
  {
    name: 'Binary Search',
    emoji: '🔍',
    problems: [
      { slug: 'binary-search', name: 'Binary Search', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-search/' },
      { slug: 'nth-root', name: 'Nth Root of a Number', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/find-nth-root-of-m5843/1' },
      { slug: 'matrix-median', name: 'Matrix Median', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1' },
      { slug: 'single-element-sorted', name: 'Single Element in a Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/single-element-in-a-sorted-array/' },
      { slug: 'search-rotated-sorted', name: 'Search in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { slug: 'median-two-sorted-arrays', name: 'Median of Two Sorted Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      { slug: 'kth-element-two-sorted', name: 'K-th Element of Two Sorted Arrays', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1' },
      { slug: 'allocate-minimum-pages', name: 'Allocate Minimum Pages', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1' },
      { slug: 'aggressive-cows', name: 'Aggressive Cows', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/aggressive-cows/1' },
    ],
  },
  {
    name: 'Heaps',
    emoji: '🏔️',
    problems: [
      { slug: 'kth-largest-element', name: 'Kth Largest Element in an Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { slug: 'maximum-sum-combination', name: 'Maximum Sum Combination', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/maximum-sum-combination3850/1' },
      { slug: 'find-median-data-stream', name: 'Find Median from Data Stream', difficulty: 'Hard', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { slug: 'merge-k-sorted-lists', name: 'Merge K Sorted Lists', difficulty: 'Hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { slug: 'k-most-frequent-elements', name: 'Top K Frequent Elements', difficulty: 'Medium', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { slug: 'task-scheduler', name: 'Task Scheduler', difficulty: 'Medium', link: 'https://leetcode.com/problems/task-scheduler/' },
      { slug: 'top-k-frequent-words', name: 'Top K Frequent Words', difficulty: 'Medium', link: 'https://leetcode.com/problems/top-k-frequent-words/' },
      { slug: 'connect-ropes', name: 'Connect Ropes to Minimize Cost', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1' },
      { slug: 'check-heap', name: 'Is Binary Tree a Heap?', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/is-binary-tree-heap/1' },
    ],
  },
  {
    name: 'Stack & Queues',
    emoji: '📚',
    problems: [
      { slug: 'implement-stack-using-queue', name: 'Implement Stack Using Queues', difficulty: 'Easy', link: 'https://leetcode.com/problems/implement-stack-using-queues/' },
      { slug: 'implement-queue-using-stack', name: 'Implement Queue Using Stacks', difficulty: 'Easy', link: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
      { slug: 'valid-parentheses', name: 'Valid Parentheses', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/' },
      { slug: 'next-greater-element', name: 'Next Greater Element I', difficulty: 'Medium', link: 'https://leetcode.com/problems/next-greater-element-i/' },
      { slug: 'sort-a-stack', name: 'Sort a Stack', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/sort-a-stack/1' },
      { slug: 'next-smaller-element', name: 'Next Smaller Element', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/next-smaller-element1903/1' },
      { slug: 'largest-rectangle-histogram', name: 'Largest Rectangle in Histogram', difficulty: 'Hard', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      { slug: 'sliding-window-maximum', name: 'Sliding Window Maximum', difficulty: 'Hard', link: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { slug: 'min-stack', name: 'Min Stack', difficulty: 'Medium', link: 'https://leetcode.com/problems/min-stack/' },
      { slug: 'rotten-oranges', name: 'Rotting Oranges', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotting-oranges/' },
      { slug: 'online-stock-span', name: 'Online Stock Span', difficulty: 'Medium', link: 'https://leetcode.com/problems/online-stock-span/' },
      { slug: 'celebrity-problem', name: 'The Celebrity Problem', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/the-celebrity-problem/1' },
      { slug: 'sum-subarray-minimums', name: 'Sum of Subarray Minimums', difficulty: 'Medium', link: 'https://leetcode.com/problems/sum-of-subarray-minimums/' },
      { slug: 'lfu-cache', name: 'LFU Cache', difficulty: 'Hard', link: 'https://leetcode.com/problems/lfu-cache/' },
    ],
  },
  {
    name: 'Strings',
    emoji: '📝',
    problems: [
      { slug: 'reverse-words-string', name: 'Reverse Words in a String', difficulty: 'Medium', link: 'https://leetcode.com/problems/reverse-words-in-a-string/' },
      { slug: 'longest-palindromic-substring', name: 'Longest Palindromic Substring', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { slug: 'roman-to-integer', name: 'Roman to Integer', difficulty: 'Easy', link: 'https://leetcode.com/problems/roman-to-integer/' },
      { slug: 'integer-to-roman', name: 'Integer to Roman', difficulty: 'Medium', link: 'https://leetcode.com/problems/integer-to-roman/' },
      { slug: 'string-to-integer-atoi', name: 'String to Integer (atoi)', difficulty: 'Medium', link: 'https://leetcode.com/problems/string-to-integer-atoi/' },
      { slug: 'count-and-say', name: 'Count and Say', difficulty: 'Medium', link: 'https://leetcode.com/problems/count-and-say/' },
      { slug: 'longest-common-prefix', name: 'Longest Common Prefix', difficulty: 'Easy', link: 'https://leetcode.com/problems/longest-common-prefix/' },
      { slug: 'check-anagram', name: 'Valid Anagram', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/' },
      { slug: 'compare-version-numbers', name: 'Compare Version Numbers', difficulty: 'Medium', link: 'https://leetcode.com/problems/compare-version-numbers/' },
      { slug: 'implement-strstr', name: 'Find the Index of First Occurrence (strStr)', difficulty: 'Easy', link: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/' },
      { slug: 'minimum-chars-front', name: 'Minimum Characters to Add at Front to Make Palindrome', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/minimum-characters-to-be-added-at-front-to-make-string-palindrome/1' },
      { slug: 'rabin-karp', name: 'Rabin Karp Algorithm', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/31/1' },
      { slug: 'kmp-algorithm', name: 'KMP Algorithm / Longest Prefix Suffix', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/longest-prefix-suffix2527/1' },
    ],
  },
  {
    name: 'Binary Trees',
    emoji: '🌳',
    problems: [
      { slug: 'inorder-traversal', name: 'Binary Tree Inorder Traversal', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
      { slug: 'preorder-traversal', name: 'Binary Tree Preorder Traversal', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-tree-preorder-traversal/' },
      { slug: 'postorder-traversal', name: 'Binary Tree Postorder Traversal', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-tree-postorder-traversal/' },
      { slug: 'left-view-binary-tree', name: 'Left View of Binary Tree', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/left-view-of-binary-tree/1' },
      { slug: 'bottom-view-binary-tree', name: 'Bottom View of Binary Tree', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1' },
      { slug: 'top-view-binary-tree', name: 'Top View of Binary Tree', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1' },
      { slug: 'level-order-traversal', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { slug: 'height-binary-tree', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { slug: 'diameter-binary-tree', name: 'Diameter of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { slug: 'balanced-binary-tree', name: 'Balanced Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/balanced-binary-tree/' },
      { slug: 'lca-binary-tree', name: 'Lowest Common Ancestor of Binary Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      { slug: 'same-tree', name: 'Same Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/same-tree/' },
      { slug: 'zigzag-level-order', name: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
      { slug: 'boundary-traversal', name: 'Boundary Traversal of Binary Tree', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1' },
      { slug: 'construct-bt-inorder-preorder', name: 'Construct BT from Inorder and Preorder', difficulty: 'Medium', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
      { slug: 'symmetric-tree', name: 'Symmetric Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/symmetric-tree/' },
      { slug: 'flatten-bt-linked-list', name: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/' },
    ],
  },
  {
    name: 'Binary Search Trees',
    emoji: '🌲',
    problems: [
      { slug: 'populate-next-right', name: 'Populating Next Right Pointers in Each Node', difficulty: 'Medium', link: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/' },
      { slug: 'search-in-bst', name: 'Search in a Binary Search Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/search-in-a-binary-search-tree/' },
      { slug: 'construct-bst-preorder', name: 'Construct BST from Preorder Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/' },
      { slug: 'validate-bst', name: 'Validate Binary Search Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { slug: 'lca-bst', name: 'Lowest Common Ancestor of BST', difficulty: 'Easy', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { slug: 'kth-smallest-bst', name: 'Kth Smallest Element in a BST', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { slug: 'serialize-deserialize-bt', name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
    ],
  },
  {
    name: 'Graphs',
    emoji: '🕸️',
    problems: [
      { slug: 'clone-graph', name: 'Clone Graph', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/' },
      { slug: 'dfs-graph', name: 'DFS of Graph', difficulty: 'Easy', link: 'https://practice.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1' },
      { slug: 'bfs-graph', name: 'BFS of Graph', difficulty: 'Easy', link: 'https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1' },
      { slug: 'detect-cycle-undirected', name: 'Detect Cycle in Undirected Graph', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1' },
      { slug: 'detect-cycle-directed', name: 'Detect Cycle in Directed Graph', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1' },
      { slug: 'topo-sort-bfs', name: "Topological Sort — BFS (Kahn's Algorithm)", difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/topological-sort/1' },
      { slug: 'topo-sort-dfs', name: 'Topological Sort — DFS', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/topological-sort/1' },
      { slug: 'number-of-islands', name: 'Number of Islands', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/' },
      { slug: 'bipartite-check', name: 'Is Graph Bipartite?', difficulty: 'Medium', link: 'https://leetcode.com/problems/is-graph-bipartite/' },
      { slug: 'scc-kosaraju', name: "Strongly Connected Components — Kosaraju's", difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1' },
      { slug: 'dijkstra', name: "Dijkstra's Algorithm", difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1' },
      { slug: 'bellman-ford', name: 'Bellman Ford Algorithm', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1' },
      { slug: 'floyd-warshall', name: 'Floyd Warshall Algorithm', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1' },
      { slug: 'prims-mst', name: "Prim's Minimum Spanning Tree", difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1' },
      { slug: 'kruskals-mst', name: "Kruskal's Minimum Spanning Tree", difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1' },
      { slug: 'accounts-merge', name: 'Accounts Merge', difficulty: 'Medium', link: 'https://leetcode.com/problems/accounts-merge/' },
      { slug: 'number-of-provinces', name: 'Number of Provinces', difficulty: 'Easy', link: 'https://leetcode.com/problems/number-of-provinces/' },
      { slug: 'word-ladder', name: 'Word Ladder', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-ladder/' },
    ],
  },
  {
    name: 'Dynamic Programming',
    emoji: '⚡',
    problems: [
      { slug: 'max-product-subarray', name: 'Maximum Product Subarray', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { slug: 'lis', name: 'Longest Increasing Subsequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { slug: 'lcs', name: 'Longest Common Subsequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { slug: '0-1-knapsack', name: '0/1 Knapsack Problem', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1' },
      { slug: 'edit-distance', name: 'Edit Distance', difficulty: 'Hard', link: 'https://leetcode.com/problems/edit-distance/' },
      { slug: 'max-sum-rectangle', name: 'Maximum Sum Rectangle in a 2D Matrix', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/maximum-sum-rectangle2948/1' },
      { slug: 'max-profit-job-scheduling', name: 'Maximum Profit in Job Scheduling', difficulty: 'Hard', link: 'https://leetcode.com/problems/maximum-profit-in-job-scheduling/' },
      { slug: 'coin-change', name: 'Coin Change', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change/' },
      { slug: 'minimum-path-sum', name: 'Minimum Path Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/minimum-path-sum/' },
      { slug: 'triangle', name: 'Triangle', difficulty: 'Medium', link: 'https://leetcode.com/problems/triangle/' },
      { slug: 'egg-drop', name: 'Super Egg Drop', difficulty: 'Hard', link: 'https://leetcode.com/problems/super-egg-drop/' },
      { slug: 'matrix-chain-multiplication', name: 'Matrix Chain Multiplication', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1' },
      { slug: 'palindrome-partitioning-ii', name: 'Palindrome Partitioning II', difficulty: 'Hard', link: 'https://leetcode.com/problems/palindrome-partitioning-ii/' },
      { slug: 'rod-cutting', name: 'Rod Cutting', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/rod-cutting0840/1' },
      { slug: 'subset-sum', name: 'Subset Sum Problem', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1' },
      { slug: 'buy-sell-stock-iii', name: 'Best Time to Buy and Sell Stock III', difficulty: 'Hard', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/' },
      { slug: 'buy-sell-stock-iv', name: 'Best Time to Buy and Sell Stock IV', difficulty: 'Hard', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/' },
      { slug: 'burst-balloons', name: 'Burst Balloons', difficulty: 'Hard', link: 'https://leetcode.com/problems/burst-balloons/' },
      { slug: 'count-subsets-sum', name: 'Count of Subsets with Given Sum', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/perfect-sum-problem5633/1' },
      { slug: 'minimum-cost-cut-stick', name: 'Minimum Cost to Cut a Stick', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-cost-to-cut-a-stick/' },
    ],
  },
  {
    name: 'Tries',
    emoji: '🔤',
    problems: [
      { slug: 'implement-trie', name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { slug: 'implement-trie-ii', name: 'Implement Trie II (Count Prefix & Words)', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/trie-insert-and-search0651/1' },
      { slug: 'longest-string-all-prefixes', name: 'Longest String with All Prefixes', difficulty: 'Medium', link: 'https://practice.geeksforgeeks.org/problems/longest-string-with-all-prefixes/0' },
      { slug: 'distinct-substrings', name: 'Number of Distinct Substrings in a String', difficulty: 'Hard', link: 'https://practice.geeksforgeeks.org/problems/number-of-distinct-substrings-in-a-string/1' },
      { slug: 'max-xor-two-numbers', name: 'Maximum XOR of Two Numbers in an Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/' },
    ],
  },
  {
    name: 'Bit Manipulation',
    emoji: '⚙️',
    problems: [
      { slug: 'single-number', name: 'Single Number', difficulty: 'Easy', link: 'https://leetcode.com/problems/single-number/' },
      { slug: 'number-of-1-bits', name: 'Number of 1 Bits (Hamming Weight)', difficulty: 'Easy', link: 'https://leetcode.com/problems/number-of-1-bits/' },
      { slug: 'counting-bits', name: 'Counting Bits', difficulty: 'Easy', link: 'https://leetcode.com/problems/counting-bits/' },
      { slug: 'reverse-bits', name: 'Reverse Bits', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-bits/' },
      { slug: 'missing-number', name: 'Missing Number', difficulty: 'Easy', link: 'https://leetcode.com/problems/missing-number/' },
      { slug: 'power-of-two', name: 'Power of Two', difficulty: 'Easy', link: 'https://leetcode.com/problems/power-of-two/' },
      { slug: 'divide-two-integers', name: 'Divide Two Integers (Bit Manipulation)', difficulty: 'Medium', link: 'https://leetcode.com/problems/divide-two-integers/' },
      { slug: 'xor-queries-subarray', name: 'XOR Queries of a Subarray', difficulty: 'Medium', link: 'https://leetcode.com/problems/xor-queries-of-a-subarray/' },
    ],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'striver_sde_completed_v1';

const DIFFICULTY_CONFIG = {
  Easy: {
    badge: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50',
  },
  Medium: {
    badge: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50',
  },
  Hard: {
    badge: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50',
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────
export const DSAHub = ({ onNavigate }: DSAHubProps) => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set([SHEET_DATA[0].name])
  );

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCompleted(new Set(JSON.parse(saved)));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const toggleProblem = (slug: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const toggleTopic = (name: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const totalProblems = SHEET_DATA.reduce((s, t) => s + t.problems.length, 0);
  const totalCompleted = SHEET_DATA.reduce(
    (s, t) => s + t.problems.filter((p) => completed.has(p.slug)).length,
    0
  );
  const overallPct =
    totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors duration-200">
      {/* ── Sticky Header (Mobile & Desktop Responsive) ──────────────────── */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 px-3 sm:px-6 lg:px-8 py-3.5 sm:py-4 transition-colors">
        {/* Row 1: Back + Quick Nav */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">Dashboard</span>
          </button>

          {/* Quick nav pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {/* active: Striver's Sheet */}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-semibold shrink-0">
              <Flame className="w-3.5 h-3.5" />
              <span>Striver's Sheet</span>
            </span>

            <button
              onClick={() => onNavigate('questions')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800/50 text-xs sm:text-sm font-medium transition-colors shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Question Bank</span>
            </button>

            <button
              onClick={() => onNavigate('mock-tests')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800/50 text-xs sm:text-sm font-medium transition-colors shrink-0"
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Mock Tests</span>
            </button>
          </div>
        </div>

        {/* Row 2: Overall Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <Trophy className="w-4 h-4 text-orange-600 dark:text-orange-500" />
            <span className="text-gray-900 dark:text-white font-bold text-sm sm:text-base">
              {totalCompleted}
            </span>
            <span className="text-gray-500 dark:text-zinc-400 text-xs sm:text-sm">
              / {totalProblems} <span className="hidden sm:inline">done</span>
            </span>
          </div>

          <div className="flex-1 bg-gray-200 dark:bg-zinc-800 rounded-full h-2 sm:h-2.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>

          <span className="text-orange-600 dark:text-orange-400 font-bold text-sm sm:text-base shrink-0 w-11 sm:w-12 text-right">
            {overallPct}%
          </span>
        </div>
      </div>

      {/* ── Page Title ──────────────────────────────────────────────────── */}
      <div className="px-3 sm:px-6 pt-5 sm:pt-6 pb-2 max-w-[98%] mx-auto">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="bg-orange-100 dark:bg-orange-950/50 p-2 rounded-lg text-orange-600 dark:text-orange-400">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Striver's SDE Sheet
          </h1>
        </div>
        <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base mt-1">
          {totalProblems} handpicked problems • Click the circle to mark done • Links open on LeetCode / GFG
        </p>
      </div>

      {/* ── Topic Accordion List ─────────────────────────────────────────── */}
      <div className="px-3 sm:px-6 pb-12 pt-3 sm:pt-4 max-w-[98%] mx-auto space-y-2.5">
        {SHEET_DATA.map((topic, topicIdx) => {
          const topicDone = topic.problems.filter((p) =>
            completed.has(p.slug)
          ).length;
          const topicPct = Math.round(
            (topicDone / topic.problems.length) * 100
          );
          const isOpen = expandedTopics.has(topic.name);
          const allDone = topicDone === topic.problems.length;

          return (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: topicIdx * 0.02 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden transition-colors"
            >
              {/* Topic Header Button */}
              <button
                onClick={() => toggleTopic(topic.name)}
                className="w-full flex items-center gap-3 px-3.5 sm:px-5 py-3.5 sm:py-4 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors text-left"
              >
                <span className="text-lg sm:text-xl shrink-0">{topic.emoji}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-900 dark:text-zinc-100 font-semibold text-sm sm:text-base">
                      {topic.name}
                    </span>
                    <span className="text-gray-500 dark:text-zinc-400 text-xs sm:text-sm">
                      {topicDone}/{topic.problems.length}
                    </span>
                    {allDone && (
                      <span className="text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                        ✓ Complete
                      </span>
                    )}
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="mt-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 w-36 sm:w-48 max-w-full">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                </div>

                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0" />
                )}
              </button>

              {/* Problems list */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 dark:border-zinc-800 divide-y divide-gray-50 dark:divide-zinc-800/70">
                      {topic.problems.map((problem) => {
                        const isDone = completed.has(problem.slug);
                        const dc = DIFFICULTY_CONFIG[problem.difficulty];

                        return (
                          <div
                            key={problem.slug}
                            className={`flex items-center gap-2.5 sm:gap-3.5 px-3.5 sm:px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors ${
                              isDone ? 'opacity-55' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleProblem(problem.slug)}
                              className="shrink-0 p-0.5 hover:scale-110 transition-transform"
                              aria-label={
                                isDone ? 'Mark incomplete' : 'Mark complete'
                              }
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-300 dark:text-zinc-600 hover:text-gray-500 dark:hover:text-zinc-400 transition-colors" />
                              )}
                            </button>

                            {/* Problem Name */}
                            <span
                              className={`flex-1 text-sm sm:text-base break-words min-w-0 ${
                                isDone
                                  ? 'line-through text-gray-400 dark:text-zinc-500'
                                  : 'text-gray-800 dark:text-zinc-200'
                              }`}
                            >
                              {problem.name}
                            </span>

                            {/* Difficulty badge */}
                            <span
                              className={`shrink-0 text-xs sm:text-sm font-medium sm:font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border ${dc.badge}`}
                            >
                              {problem.difficulty}
                            </span>

                            {/* External link */}
                            <a
                              href={problem.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="shrink-0 p-1 text-gray-400 dark:text-zinc-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                              aria-label="Open problem"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
