const fs = require('fs');
const filePath = "carts.json";

exports.get = (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ הסלים");
    res.send(JSON.parse(data || "[]"));
  });
};

exports.getById = (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ הסלים");

    const carts = JSON.parse(data || "[]");
    const cart = carts.find(c => c.userId === id);

    if (!cart) {
      // 👇 במקום 404, מחזירים סל ריק כברירת מחדל
      return res.send({ userId: id, cart: [] });
    }

    res.send(cart);
  });
};


exports.post = (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ הסלים");

    let carts = JSON.parse(data || "[]");
    const newCart = req.body;

    // אם כבר יש סל לאותו userId – לא נוסיף שוב
    if (carts.find(c => c.userId === newCart.userId)) {
      return res.status(400).send("כבר קיים סל למשתמש הזה");
    }

    carts.push(newCart);

    fs.writeFile(filePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send("שגיאה בהוספת סל");
      res.send(newCart);
    });
  });
};

exports.addProductToCart = (req, res) => {
  const userId = parseInt(req.params.id);
  const newProduct = req.body;

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ הסלים");

    let carts = JSON.parse(data || "[]");
    let cartIndex = carts.findIndex(c => c.userId === userId);

    // אם המשתמש לא קיים – ניצור סל חדש ונוסיף אותו לרשימה
    if (cartIndex === -1) {
      const newCart = {
        userId,
        cart: [newProduct]
      };
      carts.push(newCart);
    } else {
      // אם המשתמש קיים – נטפל בעדכון המוצר בסל
      const cart = carts[cartIndex].cart;
      const existingProduct = cart.find(p => p.id === newProduct.id);

      if (existingProduct) {
        existingProduct.quantity += newProduct.quantity;
      } else {
        cart.push(newProduct);
      }
    }

    fs.writeFile(filePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send("שגיאה בהוספת מוצר לסל");
      res.send({ message: "המוצר נוסף או עודכן בהצלחה", product: newProduct });
    });
  });
};


exports.put = (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ הסלים");

    let carts = JSON.parse(data || "[]");
    const index = carts.findIndex(c => c.userId === id);

    if (index === -1) return res.status(404).send("לא נמצא סל לעדכון");

    carts[index] = { ...carts[index], ...req.body };

    fs.writeFile(filePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send("שגיאה בעדכון סל");
      res.send(carts[index]);
    });
  });
};

exports.delete = (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ הסלים");

    let carts = JSON.parse(data || "[]");
    const index = carts.findIndex(c => c.userId === id);

    if (index === -1) return res.status(404).send("לא נמצא סל למחיקה");

    const deleted = carts.splice(index, 1);

    fs.writeFile(filePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send("שגיאה במחיקת סל");
      res.send({ message: "הסל נמחק בהצלחה", deleted: deleted[0] });
    });
  });
};


exports.updateProductQuantity = (req, res) => {
  const userId = parseInt(req.params.userId);
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ הסלים");

    let carts = JSON.parse(data || "[]");
    const cartIndex = carts.findIndex(c => c.userId === userId);
    if (cartIndex === -1) return res.status(404).send("לא נמצא סל למשתמש");

    const product = carts[cartIndex].cart.find(p => p.id === productId);
    if (!product) return res.status(404).send("המוצר לא קיים בסל");

    product.quantity = quantity;

    fs.writeFile(filePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send("שגיאה בשמירת הכמות");
      res.send({ message: "כמות עודכנה בהצלחה", product });
    });
  });
};

exports.removeProductFromCart = (req, res) => {
  const userId = parseInt(req.params.userId);
  const productId = parseInt(req.params.productId);

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ הסלים");

    let carts = JSON.parse(data || "[]");
    const cartIndex = carts.findIndex(c => c.userId === userId);
    if (cartIndex === -1) return res.status(404).send("לא נמצא סל למשתמש");

    const originalLength = carts[cartIndex].cart.length;
    carts[cartIndex].cart = carts[cartIndex].cart.filter(p => p.id !== productId);

    if (carts[cartIndex].cart.length === originalLength)
      return res.status(404).send("לא נמצא מוצר למחיקה");

    fs.writeFile(filePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send("שגיאה במחיקת מוצר");
      res.send({ message: "המוצר הוסר מהסל בהצלחה" });
    });
  });
};

