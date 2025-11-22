import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

export const useTestSelection = (testList, testRows, handleTestAdd) => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTestList, setShowTestList] = useState(false); // Start with dropdown closed
  const [lastEnterTime, setLastEnterTime] = useState(0);
  const searchInputRef = useRef(null);
  const testListRef = useRef(null);

  // Filter available tests
  const availableTests = (Array.isArray(testList) ? testList : [])
    .filter((test) => !testRows.some((row) => row.testId === test._id))
    .filter((test) => 
      test.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handle test selection with auto-clear and refocus
  const handleTestSelection = useCallback((testId) => {
    setSelectedTests(prev => {
      const newSelectedTests = prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId];
      
      // Auto-clear search and refocus after selection
      if (newSelectedTests.length > 0) {
        setTimeout(() => {
          setSearchTerm('');
          searchInputRef.current?.focus();
        }, 100);
      }
      
      return newSelectedTests;
    });
  }, []);

  // Handle select all/none
  const handleSelectAll = useCallback(() => {
    if (selectedTests.length === availableTests.length) {
      setSelectedTests([]);
    } else {
      setSelectedTests(availableTests.map(test => test._id));
      // Auto-clear search and refocus after select all
      setTimeout(() => {
        setSearchTerm('');
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [selectedTests.length, availableTests]);

  // Add selected tests and clear search
  const handleAddSelectedTests = useCallback(() => {
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test');
      return;
    }

    try {
      selectedTests.forEach(testId => {
        if (!testRows.some(row => row.testId === testId)) {
          handleTestAdd(testId);
        }
      });
      
      // Clear selection and search term
      setSelectedTests([]);
      setSearchTerm('');
      setShowTestList(false);
      
      // Focus back to search input for next entry
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      
      toast.success(`${selectedTests.length} test(s) added`);
    } catch (error) {
      toast.error('Failed to add tests');
    }
  }, [selectedTests, testRows, handleTestAdd]);

  // Handle single test addition
  const handleAddSingleTest = useCallback((testId) => {
    if (!testId) return;
    
    if (testRows.some((row) => row.testId === testId)) {
      toast.error('This test is already added');
      return;
    }

    try {
      handleTestAdd(testId);
      setSearchTerm(''); // Clear search term after adding
      setShowTestList(false);
      
      // Focus back to search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      
      toast.success('Test added');
    } catch (error) {
      toast.error('Failed to add test');
    }
  }, [testRows, handleTestAdd]);

  // Enhanced keyboard handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastEnterTime;
      
      // Double Enter detection (within 500ms)
      if (timeDiff < 500 && selectedTests.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        handleAddSelectedTests();
      } else {
        // Single Enter - just update the time
        setLastEnterTime(currentTime);
      }
    } else if (e.key === 'Escape') {
      setShowTestList(false);
      searchInputRef.current?.focus();
    } else if (e.key === ' ' && e.target === searchInputRef.current) {
      // Prevent space from adding a space in search input when dropdown is open
      if (showTestList) {
        e.preventDefault();
      }
    }
  }, [lastEnterTime, selectedTests.length, handleAddSelectedTests, showTestList]);

  // Handle search term change with auto-show list
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    // Only show dropdown when there's search text
    if (value.trim()) {
      setShowTestList(true);
    } else {
      setShowTestList(false);
    }
  }, []);

  // Auto-focus search input when component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (testListRef.current && !testListRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowTestList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset lastEnterTime when component loses focus
  useEffect(() => {
    const handleBlur = () => setLastEnterTime(0);
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return {
    selectedTests,
    searchTerm,
    showTestList,
    availableTests,
    searchInputRef,
    testListRef,
    setSearchTerm: handleSearchChange,
    setShowTestList,
    handleTestSelection,
    handleSelectAll,
    handleAddSelectedTests,
    handleAddSingleTest,
    handleKeyDown,
  };
};