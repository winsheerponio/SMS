# Student Information Management System (SIMS)

A full-stack web application for managing student records with a modern, beautiful UI and clean architecture.

## 🌟 Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete student records
- ✅ **Dual Validation**: Real-time client-side + server-side validation
- ✅ **Advanced Search**: Search by name, filter by gender, year, program
- ✅ **Real-time Stats**: Animated dashboard with live statistics
- ✅ **Export Data**: Download student records as CSV
- ✅ **Quick Testing**: Generate random student data
- ✅ **Modern UI**: Glass morphism, gradients, and smooth animations
- ✅ **Landing Page**: Professional landing page with features showcase
- ✅ **Responsive Design**: Fully responsive on all devices

## 🎨 UI Highlights

- **Glass Morphism Effects**: Frosted glass cards with backdrop blur
- **Gradient Backgrounds**: Beautiful blue-purple-pink gradients
- **Smooth Animations**: Fade-in, slide-up, float, and pulse effects
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Modern Typography**: Inter font family for clean readability
- **Icon System**: Font Awesome 6 icons throughout

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on **http://localhost:4000**

### Access the Application

- **Landing Page**: http://localhost:4000/
- **Main App**: http://localhost:4000/app
- **API Base**: http://localhost:4000/api/students

## 📁 Project Structure

```
student-management-system/
├── backend/
│   ├── controllers/          # Business logic
│   │   └── studentController.js
│   ├── middleware/           # Validation middleware
│   │   └── validation.js
│   ├── routes/              # API routes
│   │   └── studentRoutes.js
│   ├── services/            # File operations
│   │   └── fileService.js
│   ├── data/                # Data storage
│   │   └── students.json
│   ├── server.js           # Express server
│   ├── package.json        # Dependencies
│   └── test-api.sh        # API test script
│
└── frontend/
    ├── css/
    │   ├── styles.css      # Main app styles
    │   └── landing.css     # Landing page styles
    ├── js/
    │   ├── api.js         # API wrapper
    │   ├── dom.js         # DOM helpers
    │   ├── validation.js  # Client validation
    │   ├── utils.js       # Utility functions
    │   └── app.js         # Main app logic
    ├── index.html         # Main application
    └── landing.html       # Landing page
```

## 🔌 API Endpoints

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### Request/Response Format

**POST/PUT Request Body:**
```json
{
  "studentId": "2024001",
  "fullName": "John Doe",
  "email": "john.doe@gmail.com",
  "gender": "Male",
  "yearLevel": 2,
  "program": "Computer Science",
  "university": "Tech University"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-generated-id",
    "studentId": "2024001",
    "fullName": "John Doe",
    "email": "john.doe@gmail.com",
    "gender": "Male",
    "yearLevel": 2,
    "program": "Computer Science",
    "university": "Tech University"
  },
  "message": "Student created"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": ["Validation error messages"],
  "message": "Validation failed"
}
```

## ✅ Validation Rules

- **studentId**: Alphanumeric, 5-15 characters
- **fullName**: 2-100 characters
- **email**: Must be a valid Gmail address (@gmail.com)
- **gender**: Must be "Male", "Female", or "Other"
- **yearLevel**: Number between 1 and 5
- **program**: 2-100 characters
- **university**: 2-200 characters

## 🧪 Testing the API

Run the included test script:

```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

Or test manually with curl:

```bash
# Get all students
curl http://localhost:4000/api/students

# Create a student
curl -X POST http://localhost:4000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024001",
    "fullName": "Alice Johnson",
    "email": "alice.johnson@gmail.com",
    "gender": "Female",
    "yearLevel": 1,
    "program": "Computer Science",
    "university": "MIT"
  }'

# Update a student
curl -X PUT http://localhost:4000/api/students/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024001",
    "fullName": "Alice Johnson",
    "email": "alice.johnson@gmail.com",
    "gender": "Female",
    "yearLevel": 2,
    "program": "Computer Science",
    "university": "MIT"
  }'

# Delete a student
curl -X DELETE http://localhost:4000/api/students/{id}
```

## 🎯 Frontend Features

### Dashboard Statistics
- **Male Students**: Count of male students
- **Female Students**: Count of female students
- **Other Gender**: Count of other gender students
- **Programs**: Number of unique programs

### Student Management
- **Add Student**: Form with real-time validation
- **Edit Student**: Click edit icon to populate form
- **Delete Student**: Click delete icon with confirmation
- **Search**: Live search by name
- **Filter**: Filter by gender, year level, program

### Additional Features
- **Random Generator**: Create random test data
- **Export CSV**: Download all students as CSV
- **Refresh**: Reload data from server
- **Toast Notifications**: Success/error messages

## 🎨 Customization

### Colors
Edit CSS variables in `frontend/css/styles.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-color: #667eea;
  /* ... more variables */
}
```

### API Port
Change port in `backend/server.js`:
```javascript
const PORT = process.env.PORT || 4000;
```

## 📝 Architecture Decisions

- **File-based Storage**: Simple JSON file storage for easy setup
- **Modular Backend**: Separated concerns (routes, controllers, services)
- **ES6 Modules**: Frontend uses modern module system
- **Validation**: Dual-layer validation (client + server)
- **RESTful API**: Standard REST conventions
- **No Authentication**: Simplified for demonstration purposes

## 🚧 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication & authorization
- [ ] Pagination for large datasets
- [ ] Sorting by columns
- [ ] Bulk operations
- [ ] Dark mode toggle
- [ ] Advanced analytics
- [ ] Profile pictures
- [ ] Email notifications

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

Built with ❤️ using Node.js & Vanilla JavaScript
