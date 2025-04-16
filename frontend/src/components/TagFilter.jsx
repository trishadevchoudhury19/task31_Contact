import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const TagFilter = ({ onFilterChange }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tags').then(res => {
      const options = res.data.map(tag => ({ value: tag.name, label: tag.name }));
      setTags(options);
    });
  }, []);

  return (
    <div className="mb-3">
      <Select
        options={tags}
        isClearable
        onChange={option => onFilterChange(option?.value || '')}
        placeholder="Filter by tag..."
      />
    </div>
  );
};

export default TagFilter;
