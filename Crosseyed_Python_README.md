# **Crosseyed Python - Original Crossword Generator**

## **📌 Project Overview**

*This is an earlier version of the Crosseyed Crossword Generator, built without the Collapsing Wave Function (CWF) algorithm.*

Crosseyed Python is a **React + Flask** application that generates **NYT-style crossword puzzles** following predefined rules. Unlike later versions that use the **CWF algorithm**, this version relies on a simpler **rule-based placement system**.

### **🔹 Key Features**

- **Generates 21x21 Crossword Grids** 🧩
- **Follows NYT Crossword Rules** ✅
- **Uses a Direct Rule-Based Word Placement System** 🏗️
- **Supports Debug Mode for Visualizing Word Placement** 🎨
- **Backend: Flask API** 🐍
- **Frontend: React UI** ⚛️

---

## **🛠 Installation & Setup**

### **🔹 Prerequisites**

Before running the project, make sure you have:

- **Python 3.9+** (for the backend)
- **Node.js 16+** (for the frontend)
- **pip** (Python package manager)
- **npm** (Node package manager)

### **🔹 Backend Setup (Flask)**

```bash
cd backend
python -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate venv (Windows: venv\Scripts\activate)
pip install -r requirements.txt  # Install dependencies
flask run  # Start the Flask server
```

Backend should now be running at: **http://127.0.0.1:5000**

### **🔹 Frontend Setup (React)**

```bash
cd frontend
npm install  # Install dependencies
npm start  # Start React dev server
```

Frontend should now be running at: **http://localhost:3000**

---

## **📏 Crossword Rules & Constraints**

This version of Crosseyed Python follows **NYT-style crossword construction rules**, including:

- **180-degree rotational symmetry** 🔄
- **16-18% black squares** ⬛
- **Proper framing of words** (black boxes at word boundaries)
- **Interlocking words** (every word must share letters)
- **Unique words** (no duplicates in the grid)
- **Rule-based placement ensures solvability**

---

## **🔍 How This Version Works (Non-CWF Approach)**

Instead of the Collapsing Wave Function algorithm, this version of the generator **places words based on predefined rules**:

1. **Pre-loads a word list sorted by length** 📖
2. **Attempts to place longer words first to maximize interconnectivity** 🏗️
3. **Ensures intersections with valid existing words** ✏️
4. **Adjusts placement based on available grid space** 📏
5. **If a word cannot be placed, backtracks and retries** 🔄

While this method works well for simpler crosswords, it does not provide the same level of entropy-based decision-making as the CWF version.

---

## **📂 Folder Structure**

```
Crosseyed_Python/
│── backend/   # Flask API
│   ├── crossword_backend.py
│   ├── requirements.txt
│── frontend/  # React UI
│   ├── App.js
│   ├── package.json
│   ├── public/
│   ├── src/
│── README.md  # Project documentation
│── .gitignore # Ignored files
```

---

## **🚀 Future Goals & Improvements**

🔹 **Compare performance of rule-based vs. CWF-based approaches** ⚖️  

🔹 **Enhance debugging visualization for placement errors** 📊  

🔹 **Optimize word selection heuristics** 🧠  

🔹 **Allow manual crossword adjustments in the UI** 🎨  


---

## **🤝 Contributing**

This version serves as a reference for earlier logic before the CWF implementation. If you'd like to contribute, feel free to submit pull requests or report issues! 🛠️

---

## **📜 License**

This project is licensed under the **GPL-3.0 License**.
