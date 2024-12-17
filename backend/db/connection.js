import mysql from 'mysql2';

export const connectDatabase = () => {
  try {
    const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DATABASE_PASS, // Correctly reference env variable
      database: 'real_estate',
    });

    db.connect((err) => {
      if (err) {
        console.error('Database connection failed:', err.message);
      } else {
        console.log('DB Connection Successful!');
      }
    });

    return db; // Return the connection object
  } catch (error) {
    console.error('Error while connecting to database:', error.message);
    throw error;
  }
};
