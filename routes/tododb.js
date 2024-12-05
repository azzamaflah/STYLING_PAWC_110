const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Pastikan path ini benar

// Mendapatkan semua todos
router.get("/", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).json({ message: "Internal Server Error" });
    res.json(todos);
  });
});

// Menambahkan todo baru
router.post("/", (req, res) => {
  const newTodo = {
    task: req.body.task,
    completed: false,
  };
  db.query(
    "INSERT INTO todos (task, completed) VALUES (?, ?)",
    [newTodo.task, newTodo.completed],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Internal Server Error" });
      newTodo.id = result.insertId; // Mendapatkan ID yang baru ditambahkan
      res.status(201).json(newTodo);
    }
  );
});

// Menghapus todo berdasarkan ID
router.delete("/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  db.query("DELETE FROM todos WHERE id = ?", [todoId], (err, result) => {
    if (err) return res.status(500).json({ message: "Internal Server Error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Tugas tidak ditemukan" });
    res
      .status(200)
      .json({ message: `Tugas dengan ID ${todoId} telah dihapus` });
  });
});

// Memperbarui todo berdasarkan ID
router.put("/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const updatedTask = req.body.task;
  const completed = req.body.completed;

  db.query(
    "UPDATE todos SET task = ?, completed = ? WHERE id = ?",
    [updatedTask, completed, todoId],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Internal Server Error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Tugas tidak ditemukan" });
      res
        .status(200)
        .json({ message: `Tugas dengan ID ${todoId} telah diperbarui` });
    }
  );
});

module.exports = router;
