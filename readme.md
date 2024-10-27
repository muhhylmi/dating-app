# Typscript Dating-app API
Hello this is Restfull API repository using typescript and prisma

# Entity Relationship Diagram
![Entity Relationship Diagram](./erd.png)

# How to run this app
1. Clone the repo `git clone https://github.com/muhhylmi/dating-app.git`
2. run command `npm install`
3. run the migration `npx prisma migrate dev`
4. run command `npm run build`
5. run command `npm start`

# Project Structure
**Using layer (n tier) Architecture**

Some folder separated based on the layer, and some layer in this project are:

1. Presentation Layer => handlers folder
2. Business Layer => usecases folder
3. Persistence Layer => models folder
4. Database Layer => repositories folder