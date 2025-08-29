const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Your personal information
const fullName = "akshita_saxena";
const dob = "11042004";
const email = "akshita6501@gmail.com";
const rollNumber = "22BCE10798";

// Process data function
function processData(data) {
  const evenNumbers = [];
  const oddNumbers = [];
  const alphabets = [];
  const specialCharacters = [];
  let sum = 0;
  const alphaChars = [];
  
  data.forEach(item => {
    // Check if it's a number
    if (!isNaN(item) && !isNaN(parseFloat(item))) {
      const num = parseInt(item);
      sum += num;
      
      if (num % 2 === 0) {
        evenNumbers.push(item.toString());
      } else {
        oddNumbers.push(item.toString());
      }
    } 
    // Check if it's alphabetic
    else if (/^[a-zA-Z]+$/.test(item)) {
      const upperCase = item.toUpperCase();
      alphabets.push(upperCase);
      
      // Split into characters for concatenation
      item.split('').forEach(char => {
        alphaChars.push(char);
      });
    } 
    // Otherwise it's a special character
    else {
      specialCharacters.push(item);
    }
  });
  
  // Create concatenated string in reverse order with alternating caps
  const reversedAlpha = alphaChars.reverse();
  let concatString = '';
  reversedAlpha.forEach((char, index) => {
    if (index % 2 === 0) {
      concatString += char.toUpperCase();
    } else {
      concatString += char.toLowerCase();
    }
  });
  
  return {
    even_numbers: evenNumbers,
    odd_numbers: oddNumbers,
    alphabets: alphabets,
    special_characters: specialCharacters,
    sum: sum.toString(),
    concat_string: concatString
  };
}

// POST endpoint
app.post('/api/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: 'Invalid input. "data" must be an array.'
      });
    }
    
    const processedData = processData(data);
    
    res.json({
      is_success: true,
      user_id: `${fullName}_${dob}`.toLowerCase(),
      email: email,
      roll_number: rollNumber,
      ...processedData
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error: 'Internal server error'
    });
  }
});

// GET endpoint for testing
app.get('/api/bfhl', (req, res) => {
  res.json({
    operation_code: 1,
    message: 'API is working. Use POST method with data array.',
    example_request: {
      data: ['a', '1', '334', '4', 'R', '$']
    },
    example_response: {
      is_success: true,
      user_id: 'akshita_saxena_11042004',
      email: 'akshita6501@gmail.com',
      roll_number: '22BCE10798',
      even_numbers: ['334', '4'],
      odd_numbers: ['1'],
      alphabets: ['A', 'R'],
      special_characters: ['$'],
      sum: '339',
      concat_string: 'Ra'
    }
  });
});

// Export the app for Vercel
module.exports = app;
