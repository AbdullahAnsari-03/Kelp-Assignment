# 📂 CSV to JSON Converter API

A Node.js application that transforms CSV files into JSON, inserts the data into PostgreSQL, and automatically calculates age distribution statistics.

## Key Features

- **Handcrafted CSV Parser**: Implements CSV parsing logic from scratch without relying on third-party libraries.
- **Stream-Based Processing**: Efficient memory usage by leveraging Node.js streams and the readline module.
- **Configurable Batch Uploads**: Handles data in adjustable batch sizes (default: 1000 records) for better performance.
- **Scalable for Large Datasets**: Designed to process CSV files with over 50,000 rows without performance degradation.
- **Support for Nested Fields**: Properly handles hierarchical properties using dot notation (e.g., name.firstName, address.line1).
- **PostgreSQL Storage**: Maps CSV fields to database columns with connection pooling for efficient inserts.
- **Automatic Age Group Reporting**: Computes and prints age distribution statistics after data insertion.
- **REST API**: Built with Express.js for triggering CSV uploads and data operations.

## 📂 Project Structure

```
csvtojson/
├── data/
│ └── users.csv # Sample CSV file
├── db/
│ └── connection.js # PostgreSQL connection
├── services/
│ └── csvUploader.js # CSV processing & batch insert logic
├── utils/
│ ├── csvParser.js # CSV parsing & nested object builder
│ ├── dataMapper.js # Nested object → DB row mapper
│ └── ageDistribution.js # Age group % calculation
├── .env # Environment variables
├── index.js # Express server entry point
├── package.json
```

## Tech Stack
- Node.js – JavaScript runtime
- Express.js – Web framework
- PostgreSQL – Relational database
- dotenv – Environment variable management

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Kelp-Assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create PostgreSQL database and table:**

```bash
CREATE DATABASE csv_uploader;

CREATE TABLE public.users (
  id serial PRIMARY KEY,
  "name" varchar NOT NULL,
  age int NOT NULL,
  address jsonb,
  additional_info jsonb
);
```
4. **Create .env file with:**
```bash
PORT=3000
CSV_PATH=./data/users.csv
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/csv_uploader
BATCH_SIZE=500
```
- Replace yourpassword with your PostgreSQL password.

🔧 **Configuration**
| Variable       | Description                        |
| -------------- | ---------------------------------- |
| `PORT`         | Express server port                |
| `CSV_PATH`     | Path to CSV file                   |
| `DATABASE_URL` | PostgreSQL connection string       |
| `BATCH_SIZE`   | Number of rows to insert per batch |
 


5. **Prepare CSV file in data/users.csv with headers like:**
- Place your CSV file in the `data/` directory or update `CSV_FILE_PATH` in `.env`
```bash
name.firstName,name.lastName,age,address.line1,address.city,address.zip,department,joiningDate
Rohit,Prasad,35,A-563 Rakshak Society,New Pune Road,Pune,Maharashtra,Engineering,2022-04-10
```
Converted JSON:
```bash
{
  "name": {
    "firstName": "Rohit",
    "lastName": "Prasad"
  },
  "age": 35,
  "address": {
    "line1": "A-563 Rakshak Society, New Pune Road",
    "city": "Pune",
    "zip": "411001"
  },
  "department": "Engineering",
  "joiningDate": "2022-04-10"
}
```
🚀 Run Project
```bash
node index.js
```

Then open in browser:
```bash
http://localhost:3000/run
```

You’ll see JSON confirmation:
```bash
{ "message": "Data uploaded and distribution printed in console!" }
```

In the terminal, you’ll see:

```bash
🚀 Server running on http://localhost:3000/run
Reading CSV from: ./data/users.csv
✅ CSV data uploaded successfully in batches.

📊 Age Group Percentage Distribution:
< 20 years  : 0.00%
20 - 40 yrs : 70.00%
40 - 60 yrs : 30.00%
> 60 years  : 0.00%
------------------------------------
```
## Author
**Made with ❤️ by Abdullah Ansari for Kelp Coding Challenge**
