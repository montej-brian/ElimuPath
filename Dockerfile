FROM node:18-alpine

WORKDIR /app

# 1. Copy everything first so we can access the subfolders
COPY . .

# 2. Go into the backend folder and install the actual dependencies
# This is where 'dotenv' lives!
RUN cd backend && npm install

# 3. Expose the port your backend uses
EXPOSE 3000

# 4. Start the app from the root
CMD ["npm", "start"]
