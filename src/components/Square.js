import React from 'react';
import { motion } from 'framer-motion';

const Square = ({ value, onClick }) => (
  <motion.button
    className="square"
    onClick={onClick}
    initial={{ scale: 0.9 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    {value}
  </motion.button>
);

export default Square;
