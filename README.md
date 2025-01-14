# Firestore Vector Search

A Node.js application that demonstrates vector search capabilities using Firebase Firestore and OpenAI embeddings. This project allows you to generate embeddings for city names and perform semantic searches to find similar cities based on natural language queries.

## Features

- Generate embeddings for city names using OpenAI's text-embedding-ada-002 model
- Store embeddings in Firebase Firestore using vector fields
- Perform semantic similarity searches using cosine distance
- Command-line interface for easy searching
- Batch processing with error handling

## Prerequisites

- Node.js 16 or higher
- Firebase project with Firestore enabled
- OpenAI API key
- Firebase service account credentials

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd city-vector-search
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key
   - Add path to your Firebase service account JSON file

```env
OPENAI_API_KEY=your_openai_api_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=service-account.json
```

4. Set up Firebase:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `service-account.json` in your project root

5. Create a vector index in Firestore:
   - Navigate to your Firebase Console
   - Go to Firestore
   - Create a new collection called `city_embeddings`
   - Create a vector index for the `city_embedding` field with dimension 1536

## Usage

### Generate Embeddings

To generate and store embeddings for the predefined list of cities:

```bash
npm run generate
```

This will:

- Generate embeddings for each city using OpenAI
- Store the embeddings in Firestore
- Show progress and success/failure counts

### Search Cities

To search for similar cities:

```bash
npm run search "<search query>" [limit]
```

Examples:

```bash
npm run search "modern city with great technology"
npm run search "historic European city with art museums" 10
```

The search will return the most semantically similar cities along with their similarity scores.

## Environment Variables

| Variable                        | Description                           | Required |
| ------------------------------- | ------------------------------------- | -------- |
| `OPENAI_API_KEY`                | Your OpenAI API key                   | Yes      |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to Firebase service account JSON | Yes      |
