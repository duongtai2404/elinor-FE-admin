import React from 'react';

import './SortableItem.css';

import Box from '@mui/material/Box';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export const SortableItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });
  const style = {
    width: '80%',
    height: '50px',
    border: '1px solid #00000036',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'move',
    margin: '5px 0px',
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <Box
      className="sortable-item"
      key={item.id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      {item.name}
    </Box>
  );
};
