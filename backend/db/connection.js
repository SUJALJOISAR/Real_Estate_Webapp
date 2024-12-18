import mysql from 'mysql2';

let db; //To hold the single database connection instance

export const connectDatabase = () => {
  try {
    const db = mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS, 
      database: process.env.DATABASE_NAME,
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
